import React, { useState } from 'react';
import { Heart, User, Edit, Trash2 } from 'lucide-react';
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
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-56 bg-gray-200">
        {product.fotos && product.fotos.length > 0 && !imageError ? (
          <img
            src={product.fotos[0]}
            alt={product.titulo}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
            <div className="text-gray-400 text-6xl">📱</div>
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-[#205781] text-white px-3 py-1 rounded-full shadow-lg">
          <span className="font-bold">${product.precio?.toFixed(2)}</span>
        </div>

        {/* Favorite Button */}
        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {product.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.descripcion}
        </p>

        {/* Owner Info and Actions */}
        <div className="flex items-center justify-between">
          {product.ownerName && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/profile/${product.ownerId}`;
              }}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-1 transition-colors"
            >
              <div className="w-8 h-8 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#205781]" />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {product.ownerName}
              </span>
            </button>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.uuid);
                }}
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;