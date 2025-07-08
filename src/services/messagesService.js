import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  limit,
  startAfter,
  getDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

// Cache para conversaciones y mensajes
const conversationsCache = new Map();
const messagesCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

// Rate limiting para prevenir spam
const rateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_MESSAGES_PER_MINUTE = 10;

// Utilidades
const getCacheKey = (userId, conversationId = null) => 
  conversationId ? `${userId}:${conversationId}` : userId;

const isCacheValid = (timestamp) => 
  Date.now() - timestamp < CACHE_DURATION;

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userLimit.count >= MAX_MESSAGES_PER_MINUTE) {
    throw new Error('Demasiados mensajes. Espera un momento.');
  }
  
  userLimit.count++;
  rateLimiter.set(userId, userLimit);
};

export const messagesService = {
  // Crear nueva conversación con validaciones
  async createConversation(participants, productId = null, productTitle = null, metadata = {}) {
    if (!participants || participants.length < 2) {
      throw new Error('Se requieren al menos 2 participantes');
    }

    try {
      // Verificar si ya existe una conversación entre estos usuarios
      const existingConv = await this.findExistingConversation(participants, productId);
      if (existingConv) {
        return existingConv.id;
      }

      const conversationData = {
        participants: participants.sort(), // Ordenar para consistencia
        productId,
        productTitle,
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp(),
        messageCount: 0,
        unreadCount: {},
        isActive: true,
        metadata: {
          ...metadata,
          createdBy: participants[0],
          version: '1.0'
        }
      };

      // Inicializar contadores de no leídos
      participants.forEach(userId => {
        conversationData.unreadCount[userId] = 0;
      });

      const conversationRef = await addDoc(collection(db, 'conversations'), conversationData);
      
      // Limpiar cache
      participants.forEach(userId => {
        conversationsCache.delete(getCacheKey(userId));
      });
      
      return conversationRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error(`Error al crear conversación: ${error.message}`);
    }
  },

  // Buscar conversación existente
  async findExistingConversation(participants, productId = null) {
    try {
      const sortedParticipants = participants.sort();
      let q = query(
        collection(db, 'conversations'),
        where('participants', '==', sortedParticipants)
      );

      if (productId) {
        q = query(q, where('productId', '==', productId));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    } catch (error) {
      console.error('Error finding existing conversation:', error);
      return null;
    }
  },

  // Obtener conversaciones del usuario
  async getUserConversations(userId) {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  // Escuchar conversaciones en tiempo real
  subscribeToConversations(userId, callback) {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(conversations);
    });
  },

  // Enviar mensaje con validaciones y rate limiting
  async sendMessage(conversationId, senderId, senderName, message, attachments = []) {
    if (!conversationId || !senderId || !message?.trim()) {
      throw new Error('Datos de mensaje incompletos');
    }

    // Verificar rate limiting
    checkRateLimit(senderId);

    // Validar longitud del mensaje
    if (message.length > 1000) {
      throw new Error('El mensaje es demasiado largo (máximo 1000 caracteres)');
    }

    try {
      const batch = writeBatch(db);
      const now = serverTimestamp();
      
      // Verificar que la conversación existe y el usuario es participante
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        throw new Error('Conversación no encontrada');
      }
      
      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(senderId)) {
        throw new Error('No tienes permisos para enviar mensajes en esta conversación');
      }

      // Crear mensaje
      const messageRef = doc(collection(db, 'messages'));
      const messageData = {
        conversationId,
        senderId,
        senderName,
        message: message.trim(),
        timestamp: now,
        read: false,
        edited: false,
        attachments,
        metadata: {
          userAgent: navigator.userAgent,
          ipHash: 'hashed', // En producción, hashear la IP
          messageType: 'text'
        }
      };
      
      batch.set(messageRef, messageData);

      // Actualizar conversación
      const updateData = {
        lastMessage: message.length > 50 ? message.substring(0, 50) + '...' : message,
        lastMessageTime: now,
        messageCount: increment(1)
      };

      // Actualizar contadores de no leídos para otros participantes
      conversationData.participants.forEach(participantId => {
        if (participantId !== senderId) {
          updateData[`unreadCount.${participantId}`] = increment(1);
        }
      });

      batch.update(conversationRef, updateData);
      
      await batch.commit();

      // Limpiar cache
      conversationData.participants.forEach(userId => {
        conversationsCache.delete(getCacheKey(userId));
        messagesCache.delete(getCacheKey(userId, conversationId));
      });

      return {
        success: true,
        messageId: messageRef.id,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    }
  },

  // Obtener mensajes de una conversación
  async getMessages(conversationId) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Escuchar mensajes en tiempo real
  subscribeToMessages(conversationId, callback) {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  },

  // Marcar mensajes como leídos con batch operations
  async markAsRead(conversationId, userId) {
    if (!conversationId || !userId) {
      throw new Error('conversationId y userId son requeridos');
    }

    try {
      const batch = writeBatch(db);
      
      // Marcar mensajes como leídos
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('read', '==', false)
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      
      messagesSnapshot.docs.forEach(messageDoc => {
        batch.update(messageDoc.ref, { 
          read: true,
          readAt: serverTimestamp()
        });
      });
      
      // Resetear contador de no leídos en la conversación
      const conversationRef = doc(db, 'conversations', conversationId);
      batch.update(conversationRef, {
        [`unreadCount.${userId}`]: 0
      });
      
      await batch.commit();
      
      // Limpiar cache
      conversationsCache.delete(getCacheKey(userId));
      messagesCache.delete(getCacheKey(userId, conversationId));
      
      return {
        success: true,
        markedCount: messagesSnapshot.size
      };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error(`Error al marcar mensajes como leídos: ${error.message}`);
    }
  },

  // Obtener estadísticas de mensajes
  async getMessageStats(userId) {
    if (!userId) return { totalConversations: 0, unreadMessages: 0 };

    try {
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId)
      );
      
      const conversationsSnapshot = await getDocs(conversationsQuery);
      let totalUnread = 0;
      
      conversationsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        totalUnread += data.unreadCount?.[userId] || 0;
      });
      
      return {
        totalConversations: conversationsSnapshot.size,
        unreadMessages: totalUnread
      };
    } catch (error) {
      console.error('Error getting message stats:', error);
      return { totalConversations: 0, unreadMessages: 0 };
    }
  },

  // Buscar mensajes
  async searchMessages(userId, searchTerm, conversationId = null) {
    if (!userId || !searchTerm?.trim()) {
      return [];
    }

    try {
      let q = query(
        collection(db, 'messages'),
        where('message', '>=', searchTerm),
        where('message', '<=', searchTerm + '\uf8ff'),
        orderBy('message'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      if (conversationId) {
        q = query(q, where('conversationId', '==', conversationId));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  },

  // Eliminar conversación
  async deleteConversation(conversationId, userId) {
    if (!conversationId || !userId) {
      throw new Error('conversationId y userId son requeridos');
    }

    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        throw new Error('Conversación no encontrada');
      }
      
      const conversationData = conversationDoc.data();
      if (!conversationData.participants.includes(userId)) {
        throw new Error('No tienes permisos para eliminar esta conversación');
      }

      const batch = writeBatch(db);
      
      // Marcar conversación como eliminada para el usuario
      batch.update(conversationRef, {
        [`deletedFor.${userId}`]: serverTimestamp()
      });
      
      await batch.commit();
      
      // Limpiar cache
      conversationData.participants.forEach(participantId => {
        conversationsCache.delete(getCacheKey(participantId));
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error(`Error al eliminar conversación: ${error.message}`);
    }
  },

  // Limpiar cache
  clearCache(userId = null) {
    if (userId) {
      const keysToDelete = [];
      for (const key of conversationsCache.keys()) {
        if (key.startsWith(userId)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => {
        conversationsCache.delete(key);
        messagesCache.delete(key);
      });
    } else {
      conversationsCache.clear();
      messagesCache.clear();
    }
  }
};