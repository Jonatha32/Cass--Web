import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';

export const userService = {
  // Obtener usuario por ID
  async getUserById(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return {
          id: userDoc.id,
          ...userDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Crear o actualizar perfil de usuario
  async updateUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Buscar usuarios por nombre
  async searchUsers(searchTerm) {
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
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Obtener estadísticas del usuario
  async getUserStats(userId) {
    try {
      // Obtener productos del usuario
      const productsQuery = query(
        collection(db, 'articulos'),
        where('ownerId', '==', userId)
      );
      const productsSnapshot = await getDocs(productsQuery);
      
      // Obtener favoritos del usuario
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);

      return {
        totalProducts: productsSnapshot.size,
        totalFavorites: favoritesSnapshot.size,
        totalSales: 0, // Implementar cuando tengamos sistema de ventas
        rating: 5.0 // Implementar cuando tengamos sistema de ratings
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalProducts: 0,
        totalFavorites: 0,
        totalSales: 0,
        rating: 5.0
      };
    }
  }
};