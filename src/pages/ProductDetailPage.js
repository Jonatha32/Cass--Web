import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import { messagesService } from '../services/messagesService';
import { fakeProducts } from '../data/fakeData';
import { 
  Heart, MessageCircle, Share2, MapPin, Calendar, Star, User, Edit, Trash2, 
  Send, ArrowLeft, Phone, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight,
  Zap, Award, Clock, CheckCircle, AlertTriangle, Info, Plus, Minus, Eye,
  ThumbsUp, ThumbsDown, Flag, Bookmark, ExternalLink, Copy, Facebook, Twitter
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const imageRef = useRef(null);
  
  // Estados principales
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  // Estados de interacción
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Estados de reviews y preguntas
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  
  // Datos demo mejorados
  const demoReviews = [
    {
      id: 1,
      userName: 'Carlos M.',
      rating: 5,
      comment: 'Excelente producto, tal como se describe. Envío rápido y vendedor muy confiable.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      userName: 'Ana L.',
      rating: 4,
      comment: 'Muy buen estado, solo algunos rayones menores que no afectan el funcionamiento.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      verified: true,
      helpful: 8
    }
  ];

  const demoQuestions = [
    {
      id: 1,
      userName: 'Miguel R.',
      question: '¿Incluye cargador original?',
      answer: 'Sí, incluye cargador original y cable USB.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      answered: true
    },
    {
      id: 2,
      userName: 'Sofia P.',
      question: '¿Cuánto tiempo de uso tiene?',
      answer: 'Aproximadamente 8 meses de uso cuidadoso.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      answered: true
    }
  ];

  useEffect(() => {
    loadProduct();
    setReviews(demoReviews);
    setQuestions(demoQuestions);
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkIfFavorite();
    }
  }, [user, product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // Intentar cargar desde Firebase
      const allProducts = await articlesService.getAllArticles();
      let foundProduct = allProducts.find(p => p.id === id || p.uuid === id);
      
      if (!foundProduct) {
        // Buscar en datos fake
        foundProduct = fakeProducts.find(p => p.id === id || p.uuid === id);
      }
      
      if (foundProduct) {
        // Enriquecer producto con datos adicionales
        const enrichedProduct = {
          ...foundProduct,
          views: Math.floor(Math.random() * 1000) + 100,
          favorites: Math.floor(Math.random() * 50) + 10,
          rating: 4.2 + Math.random() * 0.7,
          reviewCount: Math.floor(Math.random() * 50) + 5,
          seller: {
            name: foundProduct.ownerName || 'Vendedor Verificado',
            rating: 4.8,
            reviewCount: 127,
            responseTime: '< 2 horas',
            verified: true,
            memberSince: '2022'
          }
        };
        setProduct(enrichedProduct);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      const foundProduct = fakeProducts.find(p => p.id === id || p.uuid === id);
      if (foundProduct) {
        setProduct({
          ...foundProduct,
          views: Math.floor(Math.random() * 1000) + 100,
          favorites: Math.floor(Math.random() * 50) + 10,
          rating: 4.2 + Math.random() * 0.7,
          reviewCount: Math.floor(Math.random() * 50) + 5
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user || !product) return;
    
    try {
      const isFav = await favoritesService.isFavorite(user.uid, product.uuid || product.id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Inicia sesión para guardar favoritos', {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#FEF3C7', color: '#92400E' }
      });
      return;
    }

    try {
      const result = await favoritesService.toggleFavorite(user.uid, product.uuid || product.id);
      setIsFavorite(result.isFavorite);
      
      toast.success(result.message, {
        icon: result.isFavorite ? '❤️' : '📄',
        style: { borderRadius: '12px' }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast.error('Inicia sesión para contactar al vendedor');
      return;
    }

    if (!contactMessage.trim()) {
      toast.error('Escribe un mensaje');
      return;
    }

    setSendingMessage(true);

    try {
      // Crear conversación
      const conversationId = await messagesService.createConversation(
        [user.uid, product.ownerId || 'demo_seller'],
        product.id || product.uuid,
        product.titulo
      );

      // Enviar mensaje inicial
      await messagesService.sendMessage(
        conversationId,
        user.uid,
        user.displayName || user.email,
        contactMessage
      );

      toast.success('Mensaje enviado correctamente', {
        duration: 2000,
        style: { borderRadius: '12px', background: '#DCFCE7', color: '#166534' }
      });
      
      setContactMessage('');
      setShowContactForm(false);
      
      // Redirigir a mensajes con parámetros
      setTimeout(() => {
        navigate(`/messages?user=${product.ownerId || 'demo_seller'}&name=${encodeURIComponent(product.ownerName || 'Vendedor')}&product=${product.id}`);
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Mira este ${product.titulo} en Cassé`;
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success('Enlace copiado');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const isOwner = user && product && user.uid === product.ownerId;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#205781] mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20 flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">📱</div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Producto no encontrado
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            El producto que buscas no existe o ha sido eliminado
          </p>
          <Link 
            to="/" 
            className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      {/* Breadcrumb */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-20 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              Inicio
            </Link>
            <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
            <Link to={`/category/${product.categoria}`} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
              {product.categoria}
            </Link>
            <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium truncate`}>
              {product.titulo}
            </span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{product.views?.toLocaleString()} vistas</span>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                {showShareMenu && (
                  <div className={`absolute right-0 mt-2 w-48 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-20`}>
                    <div className="py-2">
                      <button onClick={() => handleShare('copy')} className={`w-full px-4 py-2 text-left ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors flex items-center space-x-2`}>
                        <Copy className="w-4 h-4" />
                        <span>Copiar enlace</span>
                      </button>
                      <button onClick={() => handleShare('whatsapp')} className={`w-full px-4 py-2 text-left ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors flex items-center space-x-2`}>
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button onClick={() => handleShare('facebook')} className={`w-full px-4 py-2 text-left ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors flex items-center space-x-2`}>
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                      </button>
                      <button onClick={() => handleShare('twitter')} className={`w-full px-4 py-2 text-left ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors flex items-center space-x-2`}>
                        <Twitter className="w-4 h-4" />
                        <span>Twitter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isFavorite 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border overflow-hidden`}>
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 dark:bg-gray-700 relative group">
                <img
                  ref={imageRef}
                  src={product.fotos[selectedImageIndex]}
                  alt={product.titulo}
                  className="w-full h-full object-contain p-8 cursor-zoom-in"
                  onClick={() => setShowFullscreen(true)}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzYgMjAwTDIyNCAyNDhIMTI4TDE3NiAyMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                  }}
                />
                
                {/* Navigation Arrows */}
                {product.fotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === 0 ? product.fotos.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === product.fotos.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click para ampliar
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.fotos.length > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-[#205781]' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <img 
                          src={foto} 
                          alt={`${product.titulo} ${index + 1}`} 
                          className="w-full h-full object-contain bg-gray-50 dark:bg-gray-700 p-1"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Sidebar */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 leading-tight`}>
                {product.titulo}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {product.rating?.toFixed(1)} ({product.reviewCount} reseñas)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-[#205781]">
                    ${product.precio?.toLocaleString()}
                  </span>
                  <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ${Math.floor(product.precio * 1.3).toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    -{Math.floor(((product.precio * 1.3 - product.precio) / (product.precio * 1.3)) * 100)}%
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Precio competitivo en el mercado
                </p>
              </div>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {product.estado || 'Excelente estado'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  <Truck className="w-4 h-4 mr-1" />
                  Envío gratis
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  30 días devolución
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6">
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Cantidad:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-10 h-10 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} flex items-center justify-center transition-colors`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`w-12 text-center font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-10 h-10 rounded-lg border ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} flex items-center justify-center transition-colors`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {!isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        if (!user) {
                          toast.error('Inicia sesión para contactar al vendedor');
                          return;
                        }
                        setShowContactForm(true);
                      }}
                      className="w-full bg-[#205781] text-white py-4 px-6 rounded-xl hover:bg-[#1a4a6b] transition-all duration-200 font-semibold text-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Contactar Vendedor</span>
                    </button>
                    <button
                      onClick={handleFavorite}
                      className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        isFavorite
                          ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      <span>{isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/edit/${product.id}`)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Editar Publicación</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
                          toast.success('Publicación eliminada');
                          navigate('/');
                        }
                      }}
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Eliminar Publicación</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Compra Segura</p>
                  </div>
                  <div>
                    <Truck className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Envío Gratis</p>
                  </div>
                  <div>
                    <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Garantía</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Información del Vendedor
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${isDark ? 'bg-gray-700' : 'bg-[#205781]/10'} rounded-full flex items-center justify-center`}>
                    <User className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-[#205781]'}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {product.seller?.name || product.ownerName}
                      </h4>
                      {product.seller?.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.seller?.rating || '4.8'} ({product.seller?.reviewCount || '127'} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Responde en:</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {product.seller?.responseTime || '< 2 horas'}
                  </p>
                </div>
                <div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Miembro desde:</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {product.seller?.memberSince || '2022'}
                  </p>
                </div>
              </div>
              
              <Link
                to={`/profile/${product.ownerId}`}
                className={`block w-full text-center py-2 px-4 border rounded-lg transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Ver perfil completo
              </Link>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Descripción del Producto
              </h3>
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-wrap mb-8`}>
                {product.descripcion}
              </div>
              
              {/* Specifications */}
              {product.tags && (
                <div className="mb-8">
                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Características
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-2 rounded-full text-sm font-medium border ${
                          isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.ubicacion && (
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-[#205781]" />
                      <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ubicación</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {product.ubicacion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[#205781]" />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Publicado</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Hace 3 días
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Información de Entrega
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Envío Gratis</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>A todo el país</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Entrega Rápida</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2-5 días hábiles</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Devolución</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>30 días garantía</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Info */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Compra Segura
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Protección al comprador</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Pago seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Vendedor verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>
            Productos Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fakeProducts.slice(0, 4).map((recommendedProduct) => (
              <Link 
                key={recommendedProduct.id} 
                to={`/product/${recommendedProduct.id}`} 
                className={`${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:shadow-lg'} border rounded-2xl overflow-hidden transition-all duration-200 group`}
              >
                <div className="aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                  <img
                    src={recommendedProduct.fotos[0]}
                    alt={recommendedProduct.titulo}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04OCA5NkwxMTIgMTIwSDY0TDg4IDk2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>
                    {recommendedProduct.titulo}
                  </h3>
                  <div className="text-xl font-bold text-[#205781] mb-2">
                    ${recommendedProduct.precio?.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                      (4.{Math.floor(Math.random() * 9 + 1)})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl max-w-md w-full p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Contactar Vendedor
              </h3>
              <button
                onClick={() => setShowContactForm(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Tu mensaje
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder={`Hola, me interesa tu ${product.titulo}. ¿Podrías darme más información?`}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl resize-none transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
                  } focus:ring-4 focus:outline-none`}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactForm(false)}
                  className={`flex-1 py-3 px-4 border rounded-xl font-medium transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleContactSeller}
                  disabled={!contactMessage.trim() || sendingMessage}
                  className="flex-1 bg-[#205781] text-white py-3 px-4 rounded-xl hover:bg-[#1a4a6b] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {sendingMessage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={product.fotos[selectedImageIndex]}
              alt={product.titulo}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;