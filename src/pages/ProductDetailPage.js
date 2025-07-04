import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { articlesService } from '../services/articlesService';
import { fakeProducts } from '../data/fakeData';
import { Heart, MessageCircle, Share2, MapPin, Calendar, Star, User, Edit, Trash2, Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showMessageBox, setShowMessageBox] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      // Primero intentar cargar desde Firebase
      const allProducts = await articlesService.getAllArticles();
      let foundProduct = allProducts.find(p => p.id === id || p.uuid === id);
      
      if (!foundProduct) {
        // Si no se encuentra en Firebase, buscar en datos fake
        foundProduct = fakeProducts.find(p => p.id === id || p.uuid === id);
      }
      
      if (foundProduct) {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      // Fallback a datos fake
      const foundProduct = fakeProducts.find(p => p.id === id || p.uuid === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  };

  const isOwner = user && product && user.uid === product.ownerId;

  const handleSendMessage = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para enviar mensajes');
      return;
    }
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: user.displayName || user.email,
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    toast.success('Mensaje enviado');
  };

  const handleEdit = () => {
    navigate(`/edit/${product.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      toast.success('Publicación eliminada');
      navigate('/');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <Link to="/" className="text-[#205781] hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.fotos[0]}
                alt={product.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzYgMjAwTDIyNCAyNDhIMTI4TDE3NiAyMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                }}
              />
            </div>
            {product.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.fotos.slice(1, 5).map((foto, index) => (
                  <div key={index} className="aspect-square bg-white rounded-lg shadow overflow-hidden">
                    <img src={foto} alt={`${product.titulo} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-[#205781] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.estado || 'Excelente'}
                </span>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.titulo}</h1>
              <div className="text-4xl font-bold text-[#205781] mb-4">${product.precio}</div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {product.ubicacion && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.ubicacion}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Publicado hace 2 días</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
            </div>

            {/* Tags */}
            {product.tags && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendedor</h3>
              <div className="flex items-center justify-between">
                <Link 
                  to={`/profile/${product.ownerId}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#205781]" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{product.ownerName}</div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.8 (127 reseñas)</span>
                    </div>
                  </div>
                </Link>
                {!isOwner && user && (
                  <button
                    onClick={() => setShowMessageBox(!showMessageBox)}
                    className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contactar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Message Box */}
            {showMessageBox && !isOwner && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Enviar mensaje</h3>
                <div className="space-y-4">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-3 rounded-lg ${msg.isOwn ? 'bg-[#205781] text-white ml-8' : 'bg-gray-100 text-gray-800 mr-8'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#205781]"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-[#205781] text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;