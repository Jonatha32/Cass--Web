import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import { fakeProducts } from '../data/fakeData';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    if (user) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const loadProducts = async () => {
    try {
      // Intentar cargar desde Firebase, si falla usar datos fake
      const productsData = await articlesService.getAllArticles();
      if (productsData.length > 0) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        // Si no hay datos en Firebase, usar fake data
        setProducts(fakeProducts);
        setFilteredProducts(fakeProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // En caso de error, usar datos fake
      setProducts(fakeProducts);
      setFilteredProducts(fakeProducts);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const userFavorites = await favoritesService.getUserFavorites(user.uid);
      const favoriteIds = new Set(userFavorites.map(fav => fav.articleId));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // En caso de error, usar favoritos vacíos
      setFavorites(new Set());
    }
  };

  const handleFavorite = async (productId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return;
    }

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
      }
      
      toast.success(newStatus ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleEdit = (product) => {
    window.location.href = `/edit/${product.id}`;
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await articlesService.deleteArticle(productId);
      setProducts(prev => prev.filter(p => p.uuid !== productId));
      setFilteredProducts(prev => prev.filter(p => p.uuid !== productId));
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#205781]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      {user && (
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Descubre productos únicos
                </h1>
                <p className="text-gray-600 mt-1">
                  Encuentra lo que buscas en nuestra comunidad
                </p>
              </div>
              <Link
                to="/create"
                className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Publicación</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-600">
              Sé el primero en publicar algo increíble
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavorite={handleFavorite}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isFavorite={favorites.has(product.uuid)}
                onClick={() => window.location.href = `/product/${product.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;