import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  getDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export const articlesService = {
  // Crear artículo
  async createArticle(articleData, images = []) {
    try {
      const imageUrls = [];
      
      // Subir imágenes
      for (const image of images) {
        const imageRef = ref(storage, `articles/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      const docRef = await addDoc(collection(db, 'articulos'), {
        ...articleData,
        fotos: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Obtener todos los artículos
  async getAllArticles() {
    try {
      const q = query(collection(db, 'articulos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        uuid: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting articles:', error);
      throw error;
    }
  },

  // Obtener artículo por ID
  async getArticleById(id) {
    try {
      const docRef = doc(db, 'articulos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          uuid: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting article:', error);
      throw error;
    }
  },

  // Actualizar artículo
  async updateArticle(id, articleData, newImages = [], removedImages = []) {
    try {
      // Eliminar imágenes removidas
      for (const imageUrl of removedImages) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Error deleting image:', error);
        }
      }

      // Subir nuevas imágenes
      const newImageUrls = [];
      for (const image of newImages) {
        const imageRef = ref(storage, `articles/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        newImageUrls.push(url);
      }

      const docRef = doc(db, 'articulos', id);
      await updateDoc(docRef, {
        ...articleData,
        fotos: [...(articleData.fotos || []), ...newImageUrls],
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  // Eliminar artículo
  async deleteArticle(id) {
    try {
      // Obtener el artículo para eliminar sus imágenes
      const article = await this.getArticleById(id);
      
      if (article && article.fotos) {
        // Eliminar imágenes del storage
        for (const imageUrl of article.fotos) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.warn('Error deleting image:', error);
          }
        }
      }

      // Eliminar documento
      await deleteDoc(doc(db, 'articulos', id));
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  // Buscar artículos
  async searchArticles(searchTerm) {
    try {
      const q = query(collection(db, 'articulos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const articles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        uuid: doc.id,
        ...doc.data()
      }));

      // Filtrar en el cliente
      return articles.filter(article => 
        article.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }
};