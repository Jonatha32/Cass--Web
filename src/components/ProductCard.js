import React, { useState } from 'react';
import { Heart, User, Edit, Trash2, MapPin, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onFavorite, onEdit, onDelete, isFavorite, onClick }) => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const isOwner = user && user.uid === product.ownerId;

  const handleFavorite = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return;
    }
    onFavorite(product.uuid);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 bg-gray-50 flex items-center justify-center">
        {product.fotos && product.fotos.length > 0 && !imageError ? (
          <img
            src={product.fotos[0]}
            alt={product.titulo}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-gray-300 text-4xl sm:text-5xl">📱</div>
          </div>
        )}
        
        {/* Favorite Button */}
        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className="absolute top-2 right-2 bg-white bg-opacity-90 p-1.5 rounded-full shadow-sm hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
        )}
        
        {/* Estado Badge */}
        {product.estado && (
          <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
            {product.estado}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        {/* Price */}
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          ${product.precio?.toLocaleString()}
        </div>
        
        {/* Title */}
        <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-2 line-clamp-2 leading-tight">
          {product.titulo}
        </h3>
        
        {/* Rating and Reviews */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.{Math.floor(Math.random() * 9 + 1)})</span>
        </div>
        
        {/* Location */}
        {product.ubicacion && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{product.ubicacion}</span>
          </div>
        )}
        
        {/* Shipping Info */}
        <div className="text-xs text-green-600 mb-2">
          ✓ Envío gratis
        </div>
        
        {/* Owner Info */}
        {product.ownerName && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Link
              to={`/profile/${product.ownerId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 text-xs text-gray-600 hover:text-[#205781] transition-colors"
            >
              <User className="w-3 h-3" />
              <span className="truncate">{product.ownerName}</span>
            </Link>
            
            {/* Owner Actions */}
            {isOwner && (
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Editar"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('¿Eliminar producto?')) {
                      onDelete(product.uuid);
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;