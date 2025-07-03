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
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const messagesService = {
  // Crear nueva conversación
  async createConversation(participants, productId, productTitle) {
    try {
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants,
        productId,
        productTitle,
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return conversationRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
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

  // Enviar mensaje
  async sendMessage(conversationId, senderId, senderName, message) {
    try {
      // Agregar mensaje
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId,
        senderName,
        message,
        timestamp: serverTimestamp(),
        read: false
      });

      // Actualizar última actividad de la conversación
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: message,
        lastMessageTime: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
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

  // Marcar mensajes como leídos
  async markAsRead(conversationId, userId) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('read', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const batch = [];
      
      querySnapshot.docs.forEach(doc => {
        batch.push(updateDoc(doc.ref, { read: true }));
      });
      
      await Promise.all(batch);
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
};