import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import { fakeProducts } from '../data/fakeData';
import { Plus, Search, ChevronDown, Smartphone, Recycle, Users, Shield, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
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

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_PAGE));
    setShowMore(filteredProducts.length > PRODUCTS_PER_PAGE);
  }, [filteredProducts]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const loadProducts = async () => {
    try {
      // Intentar cargar desde Firebase
      const productsData = await articlesService.getAllArticles();
      
      // Combinar productos de Firebase con datos fake
      const allProducts = [...productsData, ...fakeProducts];
      
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // En caso de error, usar solo datos fake
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

  const handleLoadMore = () => {
    setDisplayedProducts(filteredProducts);
    setShowMore(false);
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
      {/* Hero Section */}
      <div id="hero" className="bg-gradient-to-br from-[#205781] via-[#2d6fa3] to-[#71BBB2] text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Descubre, Intercambia, Renueva
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              La plataforma líder para intercambiar dispositivos electrónicos de forma segura y sostenible
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/create"
                  className="bg-[#71BBB2] text-[#205781] px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Plus className="w-6 h-6" />
                  <span>Publicar Producto</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-[#71BBB2] text-[#205781] px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Comenzar Ahora
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white bg-opacity-10 text-white px-8 py-4 rounded-xl hover:bg-opacity-20 transition-all duration-300 font-semibold text-lg backdrop-blur-sm border border-white border-opacity-20"
                  >
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#205781]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">+10,000</h3>
              <p className="text-gray-600">Usuarios activos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#71BBB2] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-[#71BBB2]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">+5,000</h3>
              <p className="text-gray-600">Productos intercambiados</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Recycle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">98%</h3>
              <p className="text-gray-600">Satisfacción del usuario</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Explora por Categorías</h2>
            <p className="text-gray-600 text-lg">Encuentra exactamente lo que buscas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Smartphones', icon: '📱', count: '2.5k+', slug: 'smartphones' },
              { name: 'Laptops', icon: '💻', count: '1.8k+', slug: 'laptops' },
              { name: 'Gaming', icon: '🎮', count: '1.2k+', slug: 'gaming' },
              { name: 'Audio', icon: '🎧', count: '950+', slug: 'audio' },
              { name: 'Wearables', icon: '⌚', count: '680+', slug: 'wearables' },
              { name: 'Cámaras', icon: '📷', count: '420+', slug: 'cameras' }
            ].map((category, index) => (
              <Link key={index} to={`/category/${category.slug}`} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Products Section - Condicional */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchTerm ? (
            /* Sección de publicar cuando hay búsqueda */
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  ¿No encontraste lo que buscas?
                </h3>
                <p className="text-gray-600 mb-6">
                  Publica tu producto "{searchTerm}" y conecta con miles de usuarios interesados
                </p>
                {user ? (
                  <Link
                    to="/create"
                    className="bg-gradient-to-r from-[#205781] to-[#2d6fa3] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3 font-semibold transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Publicar "{searchTerm}"</span>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Inicia sesión para publicar productos</p>
                    <div className="flex gap-3 justify-center">
                      <Link to="/login" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                        Iniciar Sesión
                      </Link>
                      <Link to="/register" className="bg-[#71BBB2] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                        Registrarse
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Slide de productos destacados cuando no hay búsqueda */
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ofertas Destacadas</h2>
                <p className="text-gray-600 text-lg">Los mejores productos con descuentos especiales</p>
              </div>
              
              {/* Carousel de productos destacados */}
              <div className="relative overflow-hidden">
                <div className="flex space-x-6 animate-scroll">
                  {[...fakeProducts.slice(0, 6), ...fakeProducts.slice(0, 6)].map((product, index) => (
                    <div key={index} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48">
                        <img
                          src={product.fotos[0]}
                          alt={product.titulo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgOTZMMTc2IDEyOEgxMTJMMTQ0IDk2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{Math.floor(Math.random() * 30 + 10)}%
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{product.titulo}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-[#205781]">${product.precio}</span>
                            <span className="text-sm text-gray-500 line-through">${Math.floor(product.precio * 1.3)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.{Math.floor(Math.random() * 9 + 1)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/product/${product.id}`}
                          className="block w-full bg-gradient-to-r from-[#205781] to-[#2d6fa3] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-center"
                        >
                          Ver Oferta
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Search Section */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#205781] to-[#71BBB2] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white border-2 border-gray-100 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center p-2">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#205781] to-[#2d6fa3] rounded-xl flex items-center justify-center ml-2">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar iPhone, MacBook, PlayStation, Samsung..."
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 px-4 py-3 focus:outline-none text-lg font-medium"
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    value={searchTerm}
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mr-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-300 text-sm font-medium"
                  >
                    Limpiar
                  </button>
                )}
                <div className="mr-2">
                  <kbd className="px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg border border-gray-200">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Counter */}
        {searchTerm && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#205781] to-[#2d6fa3] rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800">
                    "{searchTerm}"
                  </span>
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-white text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium border border-gray-200"
              >
                Limpiar búsqueda
              </button>
            </div>
          </div>
        )}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
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
            
            {showMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-[#205781] to-[#2d6fa3] text-white px-10 py-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto group transform hover:scale-105"
                >
                  <span className="font-semibold">Ver todos los productos ({filteredProducts.length})</span>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
                <p className="text-gray-500 text-sm mt-3">
                  Mostrando {displayedProducts.length} de {filteredProducts.length} productos
                </p>
              </div>
            )}
          </>
        )}
      </div>
      

      
      {/* Footer - Siempre visible */}
      <div className="mt-16">
        {/* Spacer para separar del contenido */}
        <footer className="bg-gradient-to-br from-[#1a4a6b] via-[#205781] to-[#2d6fa3] text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#71BBB2] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#71BBB2] rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl opacity-5"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            {/* Top section with logo and main info */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#71BBB2] to-[#5aa89f] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Recycle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Cassé
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Revolucionando el intercambio de tecnología para un futuro más sostenible
              </p>
              
              {/* App Download Section */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto border border-white border-opacity-20">
                <h3 className="text-2xl font-bold text-white mb-4">Descarga nuestra app</h3>
                <p className="text-blue-100 mb-6">Lleva Cassé contigo y nunca te pierdas una oportunidad de intercambio</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="#" className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-sm"></span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300">Descargar en</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">▶</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300">Disponible en</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-8 h-8 text-[#71BBB2]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">+15K</div>
                <div className="text-blue-200 text-sm">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Smartphone className="w-8 h-8 text-[#71BBB2]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">+8K</div>
                <div className="text-blue-200 text-sm">Productos Intercambiados</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Recycle className="w-8 h-8 text-[#71BBB2]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">2.5M</div>
                <div className="text-blue-200 text-sm">Kg CO2 Ahorrados</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-[#71BBB2]" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">99.8%</div>
                <div className="text-blue-200 text-sm">Transacciones Seguras</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Navegación */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Navegación</h3>
                <ul className="space-y-3">
                  <li><Link to="/" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>→</span><span>Inicio</span></Link></li>
                  <li><Link to="/create" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>→</span><span>Publicar</span></Link></li>
                  <li><Link to="/favorites" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>→</span><span>Favoritos</span></Link></li>
                  <li><Link to="/messages" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>→</span><span>Mensajes</span></Link></li>
                </ul>
              </div>
              
              {/* Categorías */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Categorías</h3>
                <ul className="space-y-3">
                  <li><Link to="/category/smartphones" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>📱</span><span>Smartphones</span></Link></li>
                  <li><Link to="/category/laptops" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>💻</span><span>Laptops</span></Link></li>
                  <li><Link to="/category/gaming" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>🎮</span><span>Gaming</span></Link></li>
                  <li><Link to="/category/audio" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>🎧</span><span>Audio</span></Link></li>
                </ul>
              </div>
              
              {/* Soporte */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Soporte</h3>
                <ul className="space-y-3">
                  <li><Link to="/support" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>📞</span><span>Ayuda</span></Link></li>
                  <li><Link to="/terms" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>📄</span><span>Términos</span></Link></li>
                  <li><Link to="/privacy" className="text-blue-200 hover:text-[#71BBB2] transition-colors duration-300 flex items-center space-x-2"><span>🔒</span><span>Privacidad</span></Link></li>
                  <li><div className="text-blue-200 flex items-center space-x-2"><Shield className="w-4 h-4 text-[#71BBB2]" /><span>Compra 100% Segura</span></div></li>
                </ul>
              </div>
              
              {/* Comunidad */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-white">Comunidad</h3>
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-[#71BBB2] mb-1">4.9/5</div>
                    <div className="text-blue-200 text-sm">Calificación promedio</div>
                  </div>
                  <div className="text-blue-200 text-sm">
                    Únete a miles de usuarios que ya confían en Cassé para sus intercambios tecnológicos.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Separador */}
            <div className="border-t border-blue-400 border-opacity-30 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-blue-100 text-sm">
                  © 2024 Cassé. Todos los derechos reservados.
                </p>
                <p className="text-blue-100 text-sm mt-2 md:mt-0">
                  Hecho con ❤️ para un futuro sostenible
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;