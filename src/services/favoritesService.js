import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  doc,
  orderBy,
  limit,
  startAfter,
  getDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Cache para optimizar consultas frecuentes
const favoritesCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Utilidades de cache
const getCacheKey = (userId, articleId = null) => 
  articleId ? `${userId}:${articleId}` : userId;

const isCacheValid = (timestamp) => 
  Date.now() - timestamp < CACHE_DURATION;

const clearUserCache = (userId) => {
  const keysToDelete = [];
  for (const key of favoritesCache.keys()) {
    if (key.startsWith(userId)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => favoritesCache.delete(key));
};

export const favoritesService = {
  // Agregar a favoritos con validación y optimización
  async addToFavorites(userId, articleId) {
    if (!userId || !articleId) {
      throw new Error('userId y articleId son requeridos');
    }

    try {
      // Verificar si ya existe para evitar duplicados
      const exists = await this.isFavorite(userId, articleId);
      if (exists) {
        return { success: true, message: 'Ya está en favoritos' };
      }

      const docRef = await addDoc(collection(db, 'favorites'), {
        userId,
        articleId,
        createdAt: serverTimestamp(),
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        }
      });

      // Limpiar cache del usuario
      clearUserCache(userId);
      
      return { success: true, id: docRef.id, message: 'Agregado a favoritos' };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error(`Error al agregar a favoritos: ${error.message}`);
    }
  },

  // Remover de favoritos con batch operations
  async removeFromFavorites(userId, articleId) {
    if (!userId || !articleId) {
      throw new Error('userId y articleId son requeridos');
    }

    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('articleId', '==', articleId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: true, message: 'No estaba en favoritos' };
      }

      // Usar batch para operaciones múltiples
      const batch = writeBatch(db);
      querySnapshot.docs.forEach(docSnapshot => {
        batch.delete(doc(db, 'favorites', docSnapshot.id));
      });
      
      await batch.commit();
      
      // Limpiar cache del usuario
      clearUserCache(userId);
      
      return { success: true, message: 'Eliminado de favoritos' };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error(`Error al eliminar de favoritos: ${error.message}`);
    }
  },

  // Toggle favorito optimizado
  async toggleFavorite(userId, articleId) {
    if (!userId || !articleId) {
      throw new Error('userId y articleId son requeridos');
    }

    try {
      const isFavorite = await this.isFavorite(userId, articleId);
      
      if (isFavorite) {
        const result = await this.removeFromFavorites(userId, articleId);
        return { 
          isFavorite: false, 
          action: 'removed',
          message: result.message,
          timestamp: Date.now()
        };
      } else {
        const result = await this.addToFavorites(userId, articleId);
        return { 
          isFavorite: true, 
          action: 'added',
          message: result.message,
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error(`Error al cambiar favorito: ${error.message}`);
    }
  },

  // Verificar si es favorito con cache
  async isFavorite(userId, articleId) {
    if (!userId || !articleId) return false;

    const cacheKey = getCacheKey(userId, articleId);
    const cached = favoritesCache.get(cacheKey);
    
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.value;
    }

    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('articleId', '==', articleId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      const result = !querySnapshot.empty;
      
      // Guardar en cache
      favoritesCache.set(cacheKey, {
        value: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  // Obtener favoritos del usuario con paginación y cache
  async getUserFavorites(userId, options = {}) {
    if (!userId) {
      throw new Error('userId es requerido');
    }

    const { 
      pageSize = 20, 
      lastDoc = null, 
      useCache = true 
    } = options;

    const cacheKey = getCacheKey(userId);
    const cached = favoritesCache.get(cacheKey);
    
    if (useCache && cached && isCacheValid(cached.timestamp) && !lastDoc) {
      return cached.value;
    }

    try {
      let q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const favorites = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        _doc: doc // Para paginación
      }));

      // Guardar en cache solo la primera página
      if (!lastDoc && useCache) {
        favoritesCache.set(cacheKey, {
          value: favorites,
          timestamp: Date.now()
        });
      }
      
      return {
        favorites,
        hasMore: querySnapshot.docs.length === pageSize,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
      };
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw new Error(`Error al obtener favoritos: ${error.message}`);
    }
  },

  // Obtener estadísticas de favoritos
  async getFavoritesStats(userId) {
    if (!userId) return { total: 0, thisMonth: 0 };

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalQuery, monthQuery] = await Promise.all([
        getDocs(query(
          collection(db, 'favorites'),
          where('userId', '==', userId)
        )),
        getDocs(query(
          collection(db, 'favorites'),
          where('userId', '==', userId),
          where('createdAt', '>=', startOfMonth)
        ))
      ]);

      return {
        total: totalQuery.size,
        thisMonth: monthQuery.size
      };
    } catch (error) {
      console.error('Error getting favorites stats:', error);
      return { total: 0, thisMonth: 0 };
    }
  },

  // Limpiar cache manualmente
  clearCache(userId = null) {
    if (userId) {
      clearUserCache(userId);
    } else {
      favoritesCache.clear();
    }
  }
};