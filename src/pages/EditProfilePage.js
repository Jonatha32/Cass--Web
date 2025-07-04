import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Camera, MapPin, Phone, Mail, Save, ArrowLeft, Star, Shield, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: null
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        location: 'No especificada',
        bio: 'Miembro de Cassé',
        avatar: user.photoURL
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica para guardar en Firebase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Perfil actualizado exitosamente');
      navigate('/profile');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#205781] via-[#2d6fa3] to-[#71BBB2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Editar Perfil</h1>
                <p className="text-blue-100 mt-1">Personaliza tu información</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#71BBB2]" />
              <span className="text-sm">Perfil Verificado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-full flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#71BBB2] text-white p-3 rounded-full cursor-pointer hover:bg-opacity-90 transition-colors shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {profileData.name || 'Tu nombre'}
                </h3>
                <p className="text-gray-600 mb-4">{profileData.bio}</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>4.9 • 127 reseñas</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-[#205781]" />
                    <span className="font-semibold text-[#205781]">Vendedor Premium</span>
                  </div>
                  <p className="text-xs text-gray-600">Miembro verificado desde 2023</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#205781] to-[#2d6fa3] p-6">
                <h2 className="text-2xl font-bold text-white">Información Personal</h2>
                <p className="text-blue-100 mt-1">Actualiza tus datos para mejorar tu perfil</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Información Básica */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <User className="w-5 h-5 text-[#205781]" />
                    <span>Información Básica</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-transparent transition-all"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-transparent transition-all"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacto */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-[#205781]" />
                    <span>Contacto</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-transparent transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-transparent transition-all"
                          placeholder="Ciudad, País"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biografía */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#205781] focus:border-transparent transition-all resize-none"
                    placeholder="Cuéntanos sobre ti, tus intereses en tecnología..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {profileData.bio.length}/200 caracteres
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#205781] to-[#2d6fa3] text-white py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;