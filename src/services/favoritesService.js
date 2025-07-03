import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

export const favoritesService = {
  // Agregar a favoritos
  async addToFavorites(userId, articleId) {
    try {
      await addDoc(collection(db, 'favorites'), {
        userId,
        articleId,
        createdAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  // Remover de favoritos
  async removeFromFavorites(userId, articleId) {
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('articleId', '==', articleId)
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(doc(db, 'favorites', docSnapshot.id));
      }
      
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Toggle favorito
  async toggleFavorite(userId, articleId) {
    try {
      const isFavorite = await this.isFavorite(userId, articleId);
      
      if (isFavorite) {
        await this.removeFromFavorites(userId, articleId);
        return false;
      } else {
        await this.addToFavorites(userId, articleId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Verificar si es favorito
  async isFavorite(userId, articleId) {
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('articleId', '==', articleId)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Obtener favoritos del usuario
  async getUserFavorites(userId) {
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw error;
    }
  }
};