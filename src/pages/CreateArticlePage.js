import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { articlesService } from '../services/articlesService';
import { Upload, X, DollarSign, Tag, FileText, Image, Package, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateArticlePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    precio: '',
    descripcion: '',
    tags: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Crear previews
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          file,
          url: e.target.result
        });
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Agrega al menos una imagen');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        titulo: formData.titulo,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        tags: tagsArray,
        ownerId: user.uid,
        ownerName: user.displayName || user.email
      };

      await articlesService.createArticle(articleData, selectedImages);
      toast.success('Artículo creado exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Error al crear el artículo');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Debes iniciar sesión
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Crear Nueva Publicación
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Comparte tu producto con nuestra comunidad y encuentra el comprador perfecto
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Package className="w-6 h-6 mr-3" />
                Información del Producto
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Proporciona detalles precisos para atraer a los compradores correctos
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Título del producto *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-[#205781] transition-all text-lg"
                    placeholder="Ej: iPhone 13 Pro Max en excelente estado"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Un título claro y descriptivo atrae más compradores
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Precio (USD) *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#205781] text-white px-2 py-1 rounded text-sm font-bold">
                        $
                      </div>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-[#205781] transition-all text-lg font-semibold"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Precio competitivo = venta más rápida
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Categorías y Tags
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#205781] w-5 h-5" />
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-[#205781] transition-all"
                        placeholder="electrónica, móvil, Apple, smartphone"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Separa con comas para mejor visibilidad
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Descripción detallada *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-[#205781] transition-all resize-none"
                    placeholder="Describe el estado, características, accesorios incluidos, razón de venta, etc. Mientras más detalles, mejor..."
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Una descripción completa genera más confianza
                    </p>
                    <span className="text-sm text-gray-400">
                      {formData.descripcion.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Image className="w-6 h-6 mr-3" />
                    Galería de Imágenes
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Las primeras imágenes son las más importantes
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">
                    {selectedImages.length}/5
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* Upload Area */}
              <div className={`border-3 border-dashed rounded-2xl p-12 text-center mb-6 transition-all ${
                selectedImages.length >= 5 
                  ? 'border-gray-300 bg-gray-50' 
                  : 'border-[#205781] border-opacity-30 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-opacity-50'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={selectedImages.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer block ${
                    selectedImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
                  }`}
                >
                  <div className="w-20 h-20 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-[#205781]" />
                  </div>
                  <p className="text-2xl font-bold text-[#205781] mb-2">
                    {selectedImages.length === 0 ? 'Agregar Imágenes' : 'Agregar Más'}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Arrastra y suelta o haz clic para seleccionar
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>• Máximo 5 imágenes</span>
                    <span>• JPG, PNG, WebP</span>
                    <span>• Máx 10MB cada una</span>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  ¿Todo listo para publicar?
                </h3>
                <p className="text-gray-600 text-sm">
                  Revisa que toda la información sea correcta antes de continuar
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || selectedImages.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Publicar Ahora</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticlePage;