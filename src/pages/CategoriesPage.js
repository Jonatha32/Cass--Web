import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { fakeProducts } from '../data/fakeData';
import { Smartphone, Gamepad2, Laptop, Headphones, Camera, Watch } from 'lucide-react';

const CategoriesPage = () => {
  const { category } = useParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const categoryConfig = {
    smartphones: { name: 'Smartphones', icon: Smartphone, tags: ['iphone', 'samsung', 'smartphone', 'celular'] },
    gaming: { name: 'Gaming', icon: Gamepad2, tags: ['gaming', 'playstation', 'xbox', 'nintendo'] },
    laptops: { name: 'Laptops', icon: Laptop, tags: ['laptop', 'macbook', 'notebook', 'computadora'] },
    audio: { name: 'Audio', icon: Headphones, tags: ['audio', 'auriculares', 'airpods', 'sony'] },
    cameras: { name: 'Cámaras', icon: Camera, tags: ['camara', 'canon', 'fotografia'] },
    wearables: { name: 'Wearables', icon: Watch, tags: ['watch', 'smartwatch', 'fitness'] }
  };

  useEffect(() => {
    const categoryTags = categoryConfig[category]?.tags || [];
    const filtered = fakeProducts.filter(product => 
      product.categoria === category || 
      product.tags.some(tag => categoryTags.includes(tag.toLowerCase()))
    );
    setProducts(filtered);
  }, [category]);

  const currentCategory = categoryConfig[category];
  const IconComponent = currentCategory?.icon || Smartphone;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#205781] to-[#71BBB2] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            {currentCategory?.name || 'Categoría'}
          </h1>
          <p className="text-xl text-center text-blue-100">
            {products.length} productos disponibles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay productos en esta categoría
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavorite={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
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

export default CategoriesPage;