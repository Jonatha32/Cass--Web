import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import { Heart, User, MessageCircle, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkFavoriteStatus();
    }
  }, [user, product]);

  const loadProduct = async () => {
    try {
      const productData = await articlesService.getArticleById(id);
      if (productData) {
        setProduct(productData);
      } else {
        toast.error('Producto no encontrado');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Error al cargar el producto');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !product) return;
    
    try {
      const favorite = await favoritesService.isFavorite(user.uid, product.uuid);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      const newStatus = await favoritesService.toggleFavorite(user.uid, product.uuid);
      setIsFavorite(newStatus);
      toast.success(newStatus ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await articlesService.deleteArticle(product.id);
      toast.success('Producto eliminado exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const isOwner = user && product && user.uid === product.ownerId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#205781]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Producto no encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#205781] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            
            <h1 className="text-xl font-semibold truncate max-w-md">
              {product.titulo}
            </h1>
            
            <div className="flex items-center space-x-2">
              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? 'text-red-400 fill-current' : 'text-white'}`}
                  />
                </button>
              )}
              
              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/edit/${product.id}`)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square">
                {product.fotos && product.fotos.length > 0 ? (
                  <img
                    src={product.fotos[currentImageIndex]}
                    alt={product.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-gray-400 text-8xl">📱</div>
                  </div>
                )}
              </div>
              
              {/* Price Overlay */}
              <div className="absolute top-4 right-4 bg-[#205781] text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-xl font-bold">${product.precio?.toFixed(2)}</span>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.fotos && product.fotos.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-[#205781]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={foto}
                      alt={`${product.titulo} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.titulo}
              </h1>
              
              <div className="text-4xl font-bold text-[#205781] mb-6">
                ${product.precio?.toFixed(2)}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.descripcion}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#205781] bg-opacity-10 text-[#205781] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Información del vendedor
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#205781]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {product.ownerName || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500">Vendedor</p>
                  </div>
                </div>

                {user && !isOwner && (
                  <button
                    onClick={() => toast.success('Chat próximamente')}
                    className="flex items-center space-x-2 bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Enviar mensaje</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;