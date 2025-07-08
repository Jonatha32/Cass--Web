import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductSlider from '../components/ProductSlider';
import { useAuth } from '../hooks/useAuth';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import { fakeProducts } from '../data/fakeData';
import { Plus, Search, ChevronDown, Smartphone, Recycle, Users, Shield, Star, User, Filter, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    loadProducts();
    if (user) {
      loadFavorites();
    }
    
    const handleSearch = (e) => {
      setSearchTerm(e.detail);
    };
    
    window.addEventListener('search', handleSearch);
    return () => window.removeEventListener('search', handleSearch);
  }, [user]);

  useEffect(() => {
    let filtered = products;
    
    // Aplicar filtro de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = products.filter(product => 
        product.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar ordenamiento
    switch (sortBy) {
      case 'price_low':
        filtered = [...filtered].sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'price_high':
        filtered = [...filtered].sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default: // relevance
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_PAGE));
    setShowMore(filteredProducts.length > PRODUCTS_PER_PAGE);
  }, [filteredProducts]);

  const loadProducts = async () => {
    try {
      const productsData = await articlesService.getAllArticles();
      const allProducts = [...productsData, ...fakeProducts];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(fakeProducts);
      setFilteredProducts(fakeProducts);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const result = await favoritesService.getUserFavorites(user.uid, { 
        pageSize: 50, // Cargar más favoritos inicialmente
        useCache: true 
      });
      
      const favoriteIds = new Set(
        result.favorites ? 
          result.favorites.map(fav => fav.articleId) : 
          result.map(fav => fav.articleId) // Compatibilidad con versión anterior
      );
      
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // No mostrar error al usuario para favoritos, es funcionalidad secundaria
      setFavorites(new Set());
    }
  };

  const handleFavorite = async (productId) => {
    if (!user) {
      toast.error('Inicia sesión para guardar favoritos', {
        duration: 4000,
        icon: '🔒',
        style: {
          borderRadius: '12px',
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B'
        }
      });
      return;
    }

    // Optimistic update para mejor UX
    const isCurrentlyFavorite = favorites.has(productId);
    
    if (isCurrentlyFavorite) {
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } else {
      setFavorites(prev => new Set([...prev, productId]));
    }

    try {
      const result = await favoritesService.toggleFavorite(user.uid, productId);
      
      // Verificar que el estado optimista coincida con el resultado
      if (result.isFavorite !== !isCurrentlyFavorite) {
        // Revertir si hay inconsistencia
        if (result.isFavorite) {
          setFavorites(prev => new Set([...prev, productId]));
        } else {
          setFavorites(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }
      }
      
      toast.success(result.message, {
        duration: 3000,
        icon: result.isFavorite ? '❤️' : '📄',
        style: {
          borderRadius: '12px',
          background: result.isFavorite ? '#DCFCE7' : '#F3F4F6',
          color: result.isFavorite ? '#166534' : '#374151',
          border: `1px solid ${result.isFavorite ? '#22C55E' : '#D1D5DB'}`
        }
      });
    } catch (error) {
      // Revertir optimistic update en caso de error
      if (isCurrentlyFavorite) {
        setFavorites(prev => new Set([...prev, productId]));
      } else {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
      
      console.error('Error toggling favorite:', error);
      toast.error('No se pudo actualizar favoritos. Inténtalo de nuevo.', {
        duration: 5000,
        icon: '⚠️',
        style: {
          borderRadius: '12px',
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444'
        }
      });
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit/${product.id}`);
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

  const handleLoadMore = () => {
    setDisplayedProducts(filteredProducts);
    setShowMore(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#205781] mx-auto mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <div id="hero" className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <img src={`${process.env.PUBLIC_URL}/casse.png`} alt="Cassé" className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Encuentra los mejores dispositivos electrónicos
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed px-4">
              Miles de productos verificados con envío gratis y garantía
            </p>
            

            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
              {user ? (
                <Link
                  to="/create"
                  className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-5 h-5" />
                  <span>Vender producto</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium w-full sm:w-auto text-center"
                  >
                    Crear cuenta
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto text-center"
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Indicators */}
      <div className="bg-white dark:bg-gray-800 py-12 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Compra 100% Segura</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Protección total del comprador</p>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">✓ Garantía de devolución</div>
            </div>
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Envío Express</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Gratis en +5M productos</p>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">✓ Entrega en 24-48h</div>
            </div>
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Calidad Premium</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Productos verificados</p>
              <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">✓ Inspección técnica</div>
            </div>
            <div className="group text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">+15M Usuarios</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Comunidad global activa</p>
              <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">✓ 4.9★ satisfacción</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explora por Categoría</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Descubre miles de productos organizados para que encuentres exactamente lo que buscas</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Smartphones', icon: '📱', count: '2,847', slug: 'smartphones', color: 'from-blue-500 to-blue-600' },
              { name: 'Laptops', icon: '💻', count: '1,923', slug: 'laptops', color: 'from-purple-500 to-purple-600' },
              { name: 'Gaming', icon: '🎮', count: '1,456', slug: 'gaming', color: 'from-red-500 to-red-600' },
              { name: 'Audio', icon: '🎧', count: '987', slug: 'audio', color: 'from-green-500 to-green-600' },
              { name: 'Wearables', icon: '⌚', count: '743', slug: 'wearables', color: 'from-orange-500 to-orange-600' },
              { name: 'Cámaras', icon: '📷', count: '521', slug: 'cameras', color: 'from-pink-500 to-pink-600' }
            ].map((category, index) => (
              <Link key={index} to={`/category/${category.slug}`} className="group relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-transparent">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{category.count} productos</p>
                  <div className="text-xs text-[#205781] dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver todos →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar iPhone, MacBook, PlayStation, Samsung, Xiaomi..."
                className={`block w-full pl-12 pr-12 py-4 border rounded-2xl leading-5 transition-all duration-200 text-lg ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
                } focus:ring-4 focus:outline-none shadow-lg`}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['iPhone', 'Samsung', 'PlayStation', 'MacBook', 'Gaming', 'Audio'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSearchTerm(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchTerm.toLowerCase().includes(filter.toLowerCase())
                      ? 'bg-[#205781] text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products Slider */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSlider 
            products={fakeProducts.slice(0, 8)} 
            title="🔥 Productos Destacados" 
            autoPlay={true}
          />
        </div>
      </div>
      
      {/* Products Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {searchTerm ? (
                  <>
                    Resultados para <span className="text-[#205781] dark:text-blue-400">"{searchTerm}"</span>
                  </>
                ) : (
                  'Productos Destacados'
                )}
              </h2>
              <div className="flex items-center space-x-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {searchTerm ? 
                    `${filteredProducts.length.toLocaleString()} ${filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}` :
                    'Descubre las mejores ofertas seleccionadas para ti'
                  }
                </p>
                {!searchTerm && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">4.9 promedio</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  ✕ Limpiar filtros
                </button>
              )}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`text-sm border-0 bg-transparent focus:ring-0 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <option value="relevance">Más relevantes</option>
                  <option value="price_low">Menor precio</option>
                  <option value="price_high">Mayor precio</option>
                  <option value="newest">Más recientes</option>
                  <option value="popular">Más populares</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-4xl opacity-50">🔍</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchTerm ? 'No encontramos productos' : 'Aún no hay productos'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                {searchTerm ? 
                  'Intenta con otros términos de búsqueda o explora nuestras categorías' : 
                  'Sé el primero en publicar algo increíble en nuestra plataforma'
                }
              </p>
              {searchTerm ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium"
                  >
                    Ver todos los productos
                  </button>
                  <Link
                    to="#categories"
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Explorar categorías
                  </Link>
                </div>
              ) : (
                <Link
                  to="/create"
                  className="inline-flex items-center px-6 py-3 bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Publicar primer producto
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onFavorite={handleFavorite}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isFavorite={favorites.has(product.uuid)}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
              
              {showMore && (
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Hay más productos esperando!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Descubre {(filteredProducts.length - displayedProducts.length).toLocaleString()} productos adicionales
                    </p>
                    <button
                      onClick={handleLoadMore}
                      className="bg-gradient-to-r from-[#205781] to-[#2d6fa3] text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 inline-flex items-center space-x-2"
                    >
                      <span>Cargar todos los productos</span>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#205781]/10 to-[#71BBB2]/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <img src={`${process.env.PUBLIC_URL}/casse.png`} alt="Cassé" className="w-10 h-10 mr-3" />
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Cassé</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                La plataforma de comercio electrónico más confiable de Latinoamérica. Conectamos compradores y vendedores de forma segura.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-[#71BBB2]">15M+</div>
                  <div className="text-xs text-gray-400">Usuarios Activos</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-[#71BBB2]">99.9%</div>
                  <div className="text-xs text-gray-400">Satisfacción</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Categorías Populares</h3>
              <ul className="space-y-3">
                <li><Link to="/category/smartphones" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">📱</span>Smartphones</Link></li>
                <li><Link to="/category/laptops" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">💻</span>Laptops</Link></li>
                <li><Link to="/category/gaming" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">🎮</span>Gaming</Link></li>
                <li><Link to="/category/audio" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">🎧</span>Audio</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Soporte 24/7</h3>
              <ul className="space-y-3">
                <li><Link to="/support" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">📞</span>Centro de ayuda</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">📄</span>Términos legales</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">🔒</span>Privacidad</Link></li>
                <li><div className="flex items-center text-green-400 font-medium"><span className="mr-2">✓</span>Garantía total</div></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Tu Cuenta</h3>
              <ul className="space-y-3">
                <li><Link to="/profile" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">👤</span>Mi perfil</Link></li>
                <li><Link to="/favorites" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">❤️</span>Favoritos</Link></li>
                <li><Link to="/messages" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">💬</span>Mensajes</Link></li>
                <li><Link to="/create" className="text-gray-300 hover:text-[#71BBB2] transition-colors duration-300 flex items-center group"><span className="mr-2 group-hover:translate-x-1 transition-transform">💰</span>Vender ahora</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-gray-400 text-sm">
                  © 2024 Cassé. Todos los derechos reservados.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>ISO 27001 Certificado</span>
                  <span>•</span>
                  <span>SSL Seguro</span>
                  <span>•</span>
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Hecho con</span>
                  <span className="text-red-500 animate-pulse">❤️</span>
                  <span>en Montevideo, Uruguay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;