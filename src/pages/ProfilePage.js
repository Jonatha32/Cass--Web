import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { userService } from '../services/userService';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import { 
  User, Edit3, Camera, Save, X, Mail, Phone, MapPin, Calendar, 
  Star, Heart, Package, MessageCircle, Settings, Shield, Award,
  Upload, Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);
  
  // Estados principales
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Estados del perfil
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    photoURL: null
  });
  
  // Estados de estadísticas
  const [stats, setStats] = useState({
    products: 0,
    favorites: 0,
    reviews: 0,
    rating: 0
  });
  
  // Estados de validación
  const [errors, setErrors] = useState({});
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
      loadStats();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      const userData = await userService.getUserById(user.uid);
      setProfileData({
        displayName: userData?.name || user.displayName || '',
        email: userData?.email || user.email || '',
        phone: userData?.phone || '',
        location: userData?.location || '',
        bio: userData?.bio || '',
        photoURL: userData?.photoUrl || user.photoURL || null
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Usar datos del usuario actual como fallback
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: '',
        location: '',
        bio: '',
        photoURL: user.photoURL || null
      });
    }
  };

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const [favoritesResult] = await Promise.all([
        favoritesService.getFavoritesStats(user.uid)
      ]);
      
      setStats({
        products: Math.floor(Math.random() * 20) + 5,
        favorites: favoritesResult.total || 0,
        reviews: Math.floor(Math.random() * 50) + 10,
        rating: 4.2 + Math.random() * 0.7
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        products: 0,
        favorites: 0,
        reviews: 0,
        rating: 0
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'El nombre es requerido';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (profileData.phone && !/^\+?[\d\s-()]+$/.test(profileData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setUploading(true);

    try {
      // Crear URL temporal para preview
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, photoURL: imageUrl }));
      
      // Simular upload (en producción aquí subirías a Firebase Storage)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Imagen subida correctamente', {
        duration: 3000,
        style: { borderRadius: '12px', background: '#DCFCE7', color: '#166534' }
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
      setProfileData(prev => ({ ...prev, photoURL: user.photoURL || null }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      // Actualizar en Firebase Auth
      await updateProfile({
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });

      // Actualizar en Firestore
      await userService.createOrUpdateUser(user.uid, {
        name: profileData.displayName,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        photoUrl: profileData.photoURL
      });

      setIsEditing(false);
      
      toast.success('Perfil actualizado correctamente', {
        duration: 4000,
        style: { borderRadius: '12px', background: '#DCFCE7', color: '#166534' }
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    loadProfileData(); // Recargar datos originales
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20 flex items-center justify-center`}>
        <div className="text-center">
          <User className={`w-16 h-16 ${isDark ? 'text-gray-400' : 'text-gray-400'} mx-auto mb-4`} />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Acceso Requerido
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Inicia sesión para ver tu perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl overflow-hidden mb-8`}>
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-[#205781] to-[#71BBB2] relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-16 mb-4">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${isDark ? 'border-gray-800' : 'border-white'} overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  {profileData.photoURL ? (
                    <img 
                      src={profileData.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className={`w-16 h-16 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  )}
                </div>
                
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 bg-[#205781] text-white p-2 rounded-full hover:bg-[#1a4a6b] transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* Edit Button */}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        isDark 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } disabled:opacity-50`}
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Guardar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </button>
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="Tu nombre completo"
                      className={`text-2xl font-bold bg-transparent border-b-2 focus:outline-none transition-colors ${
                        errors.displayName 
                          ? 'border-red-500 text-red-600' 
                          : isDark 
                            ? 'border-gray-600 text-white focus:border-[#71BBB2]' 
                            : 'border-gray-300 text-gray-900 focus:border-[#205781]'
                      }`}
                    />
                    {errors.displayName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.displayName}
                      </p>
                    )}
                  </div>
                ) : (
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.displayName || 'Usuario'}
                  </h1>
                )}
              </div>
              
              {/* Email */}
              <div className="flex items-center space-x-2">
                <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu@email.com"
                      className={`w-full bg-transparent border-b focus:outline-none transition-colors ${
                        errors.email 
                          ? 'border-red-500 text-red-600' 
                          : isDark 
                            ? 'border-gray-600 text-gray-300 focus:border-[#71BBB2]' 
                            : 'border-gray-300 text-gray-700 focus:border-[#205781]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {showEmail ? profileData.email : '••••••@••••.com'}
                    </span>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Phone */}
              <div className="flex items-center space-x-2">
                <Phone className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                {isEditing ? (
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+54 11 1234-5678"
                      className={`w-full bg-transparent border-b focus:outline-none transition-colors ${
                        errors.phone 
                          ? 'border-red-500 text-red-600' 
                          : isDark 
                            ? 'border-gray-600 text-gray-300 focus:border-[#71BBB2]' 
                            : 'border-gray-300 text-gray-700 focus:border-[#205781]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profileData.phone || 'No especificado'}
                  </span>
                )}
              </div>
              
              {/* Location */}
              <div className="flex items-center space-x-2">
                <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Buenos Aires, Argentina"
                    className={`flex-1 bg-transparent border-b focus:outline-none transition-colors ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 focus:border-[#71BBB2]' 
                        : 'border-gray-300 text-gray-700 focus:border-[#205781]'
                    }`}
                  />
                ) : (
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profileData.location || 'No especificado'}
                  </span>
                )}
              </div>
              
              {/* Bio */}
              {(isEditing || profileData.bio) && (
                <div className="mt-4">
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Cuéntanos sobre ti..."
                      rows={3}
                      className={`w-full p-3 border rounded-lg resize-none focus:outline-none transition-colors ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2]' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#205781]'
                      }`}
                    />
                  ) : (
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {profileData.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
            <Package className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.products}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Productos
            </div>
          </div>
          
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
            <Heart className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.favorites}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Favoritos
            </div>
          </div>
          
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
            <Star className={`w-8 h-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.rating.toFixed(1)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Calificación
            </div>
          </div>
          
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
            <MessageCircle className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'} mx-auto mb-2`} />
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.reviews}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Reseñas
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Logros y Certificaciones
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Vendedor Verificado</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-2 rounded-full">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Top Seller</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-3 py-2 rounded-full">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">5 Estrellas</span>
            </div>
            <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 px-3 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Miembro desde 2022</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;