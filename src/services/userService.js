import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Cache para usuarios
const userCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const isCacheValid = (timestamp) => 
  Date.now() - timestamp < CACHE_DURATION;

export const userService = {
  // Obtener usuario por ID
  async getUserById(userId) {
    if (!userId) return null;

    // Verificar cache
    const cached = userCache.get(userId);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = {
          id: userDoc.id,
          ...userDoc.data()
        };
        
        // Guardar en cache
        userCache.set(userId, {
          data: userData,
          timestamp: Date.now()
        });
        
        return userData;
      } else {
        // Usuario no encontrado, crear perfil básico
        const basicUser = {
          id: userId,
          name: 'Usuario',
          email: '',
          photoUrl: null,
          isOnline: false,
          lastSeen: new Date(),
          createdAt: new Date()
        };
        
        userCache.set(userId, {
          data: basicUser,
          timestamp: Date.now()
        });
        
        return basicUser;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      
      // Retornar usuario básico en caso de error
      return {
        id: userId,
        name: 'Usuario',
        email: '',
        photoUrl: null,
        isOnline: false,
        lastSeen: new Date()
      };
    }
  },

  // Crear o actualizar perfil de usuario
  async createOrUpdateUser(userId, userData) {
    if (!userId) throw new Error('userId es requerido');

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      const now = serverTimestamp();
      
      if (userDoc.exists()) {
        // Actualizar usuario existente
        await updateDoc(userRef, {
          ...userData,
          lastSeen: now,
          updatedAt: now
        });
      } else {
        // Crear nuevo usuario
        await setDoc(userRef, {
          ...userData,
          createdAt: now,
          lastSeen: now,
          isOnline: true,
          verified: false,
          settings: {
            notifications: true,
            emailUpdates: true,
            privacy: 'public'
          }
        });
      }
      
      // Limpiar cache
      userCache.delete(userId);
      
      return true;
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  },

  // Actualizar estado online
  async updateOnlineStatus(userId, isOnline) {
    if (!userId) return;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isOnline,
        lastSeen: serverTimestamp()
      });
      
      // Limpiar cache
      userCache.delete(userId);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  },

  // Buscar usuarios
  async searchUsers(searchTerm, limit = 10) {
    if (!searchTerm?.trim()) return [];

    try {
      const q = query(
        collection(db, 'users'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, limit);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  // Limpiar cache
  clearCache(userId = null) {
    if (userId) {
      userCache.delete(userId);
    } else {
      userCache.clear();
    }
  }
};