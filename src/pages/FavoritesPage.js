import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { favoritesService } from '../services/favoritesService';
import { articlesService } from '../services/articlesService';
import ProductCard from '../components/ProductCard';
import { fakeProducts } from '../data/fakeData';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      // Obtener favoritos del usuario
      const userFavorites = await favoritesService.getUserFavorites(user.uid);
      const favoriteIds = userFavorites.map(fav => fav.articleId);
      
      // Obtener los productos favoritos
      const favoriteProducts = [];
      for (const articleId of favoriteIds) {
        try {
          const product = await articlesService.getArticleById(articleId);
          if (product) {
            favoriteProducts.push(product);
          }
        } catch (error) {
          console.warn(`Error loading product ${articleId}:`, error);
        }
      }
      
      // Si no hay productos en Firebase, usar fake data como fallback
      if (favoriteProducts.length === 0 && favoriteIds.length === 0) {
        const fakeFavoriteIds = ['1', '3'];
        const fakeFavoriteProducts = fakeProducts.filter(p => fakeFavoriteIds.includes(p.id));
        setProducts(fakeFavoriteProducts);
        setFavorites(new Set(fakeFavoriteIds));
      } else {
        setProducts(favoriteProducts);
        setFavorites(new Set(favoriteIds));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback a datos fake
      const fakeFavoriteIds = ['1', '3'];
      const fakeFavoriteProducts = fakeProducts.filter(p => fakeFavoriteIds.includes(p.id));
      setProducts(fakeFavoriteProducts);
      setFavorites(new Set(fakeFavoriteIds));
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (productId) => {
    try {
      const newStatus = await favoritesService.toggleFavorite(user.uid, productId);
      
      if (newStatus) {
        setFavorites(prev => new Set([...prev, productId]));
      } else {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        
        // Remover de la lista de productos mostrados
        setProducts(prev => prev.filter(p => p.uuid !== productId));
      }
      
      toast.success(newStatus ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleEdit = (product) => {
    toast.success('Funcionalidad de edición próximamente');
  };

  const handleDelete = (productId) => {
    toast.success('Funcionalidad de eliminación próximamente');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Debes iniciar sesión
          </h2>
          <p className="text-gray-600 mb-6">
            Inicia sesión para ver tus productos favoritos
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#205781]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mis Favoritos
              </h1>
              <p className="text-gray-600 mt-1">
                {products.length} {products.length === 1 ? 'producto favorito' : 'productos favoritos'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explora productos y agrega los que más te gusten a tu lista de favoritos
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-[#205781] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.uuid}
                product={product}
                onFavorite={handleFavorite}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isFavorite={favorites.has(product.uuid)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;