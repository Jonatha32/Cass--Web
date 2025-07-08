import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Heart, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { favoritesService } from '../services/favoritesService';
import toast from 'react-hot-toast';

const ProductSlider = ({ products, title = "Productos Destacados", autoPlay = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, maxIndex]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const result = await favoritesService.getUserFavorites(user.uid, { 
        pageSize: 50,
        useCache: true 
      });
      
      const favoriteIds = new Set(
        result.favorites ? 
          result.favorites.map(fav => fav.articleId) : 
          result.map(fav => fav.articleId)
      );
      
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Inicia sesión para guardar favoritos', {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#FEF3C7', color: '#92400E' }
      });
      return;
    }

    const isCurrentlyFavorite = favorites.has(productId);
    
    // Optimistic update
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
      
      toast.success(result.message, {
        duration: 2000,
        icon: result.isFavorite ? '❤️' : '📄',
        style: { borderRadius: '12px' }
      });
    } catch (error) {
      // Revertir optimistic update
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
      toast.error('Error al actualizar favoritos');
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              isPlaying 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {isPlaying ? 'Auto ▶' : 'Manual ⏸'}
          </button>
          <div className="flex space-x-1">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden">
        <div 
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(products.length / itemsPerView) * 100}%`
          }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id || product.uuid || index}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / products.length}%` }}
            >
              <Link
                to={`/product/${product.id || product.uuid}`}
                className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={product.fotos?.[0] || product.imagen}
                    alt={product.titulo}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04OCA5NkwxMTIgMTIwSDY0TDg4IDk2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleFavorite(e, product.uuid || product.id)}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          favorites.has(product.uuid || product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(product.uuid || product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/product/${product.id || product.uuid}`);
                        }}
                        className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Destacado
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
                    {product.titulo}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-[#205781]">
                      ${product.precio?.toLocaleString()}
                    </span>
                    {product.precio && (
                      <span className="text-sm line-through text-gray-400">
                        ${Math.floor(product.precio * 1.2).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        (4.{Math.floor(Math.random() * 9 + 1)})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.floor(Math.random() * 100 + 20)} vendidos
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-[#205781] w-6' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;