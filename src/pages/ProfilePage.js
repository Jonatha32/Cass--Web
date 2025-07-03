import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { articlesService } from '../services/articlesService';
import { favoritesService } from '../services/favoritesService';
import ProductCard from '../components/ProductCard';
import { fakeProducts } from '../data/fakeData';
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  Package, 
  Heart,
  Edit,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [userStats, setUserStats] = useState({
    totalProducts: 0,
    totalFavorites: 0,
    totalSales: 0,
    rating: 5.0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [favorites, setFavorites] = useState(new Set());

  // Datos fake de usuarios
  const fakeUsers = {
    'user1': {
      id: 'user1',
      name: 'Carlos Tech',
      email: 'carlos@example.com',
      phone: '+1 (555) 123-4567',
      location: 'Madrid, España',
      joinDate: new Date('2023-01-15'),
      rating: 4.8,
      totalSales: 23,
      bio: 'Apasionado por la tecnología. Vendo dispositivos en excelente estado.',
      avatar: null
    },
    'user2': {
      id: 'user2',
      name: 'Lucía Gamer',
      email: 'lucia@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Barcelona, España',
      joinDate: new Date('2023-03-20'),
      rating: 4.9,
      totalSales: 15,
      bio: 'Gaming enthusiast. Siempre tengo los mejores equipos gaming.',
      avatar: null
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId, currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Si no hay userId, mostrar perfil del usuario actual
      const targetUserId = userId || currentUser?.uid;
      
      if (targetUserId === currentUser?.uid) {
        // Perfil propio - usar datos de Firebase Auth
        const userData = {
          id: currentUser.uid,
          name: currentUser.displayName || 'Usuario',
          email: currentUser.email,
          phone: currentUser.phoneNumber,
          location: 'No especificada',
          joinDate: new Date(currentUser.metadata?.creationTime),
          bio: 'Miembro de Cassé',
          avatar: currentUser.photoURL
        };
        
        // Intentar obtener datos adicionales de Firestore
        try {
          const firestoreUser = await userService.getUserById(currentUser.uid);
          if (firestoreUser) {
            Object.assign(userData, firestoreUser);
          }
        } catch (error) {
          console.warn('No additional user data in Firestore');
        }
        
        setProfileUser(userData);
      } else {
        // Perfil de otro usuario - intentar Firebase primero
        try {
          const userData = await userService.getUserById(targetUserId);
          if (userData) {
            setProfileUser({
              ...userData,
              joinDate: userData.createdAt?.toDate() || new Date()
            });
          } else {
            // Fallback a datos fake
            const fakeUserData = fakeUsers[targetUserId];
            if (fakeUserData) {
              setProfileUser(fakeUserData);
            } else {
              toast.error('Usuario no encontrado');
              return;
            }
          }
        } catch (error) {
          // Fallback a datos fake
          const fakeUserData = fakeUsers[targetUserId];
          if (fakeUserData) {
            setProfileUser(fakeUserData);
          } else {
            toast.error('Usuario no encontrado');
            return;
          }
        }
      }

      // Cargar productos del usuario
      try {
        const products = await articlesService.getAllArticles();
        const userProducts = products.filter(p => p.ownerId === targetUserId);
        
        if (userProducts.length === 0) {
          // Fallback a productos fake
          const fakeUserProducts = fakeProducts.filter(p => p.ownerId === targetUserId);
          setUserProducts(fakeUserProducts);
        } else {
          setUserProducts(userProducts);
        }
      } catch (error) {
        // Fallback a productos fake
        const fakeUserProducts = fakeProducts.filter(p => p.ownerId === targetUserId);
        setUserProducts(fakeUserProducts);
      }
      
      // Cargar estadísticas del usuario
      try {
        const stats = await userService.getUserStats(targetUserId);
        if (stats) {
          setUserStats({
            totalProducts: stats.totalProducts || 0,
            totalFavorites: stats.totalFavorites || 0,
            totalSales: stats.totalSales || 0,
            rating: typeof stats.rating === 'number' ? stats.rating : 5.0
          });
        }
      } catch (error) {
        console.warn('Error loading user stats:', error);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (productId) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      const newStatus = await favoritesService.toggleFavorite(currentUser.uid, productId);
      
      if (newStatus) {
        setFavorites(prev => new Set([...prev, productId]));
      } else {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
      
      toast.success(newStatus ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleEdit = (product) => {
    toast.success('Funcionalidad de edición próximamente');
  };

  const handleDelete = (productId) => {
    toast.success('Funcionalidad de eliminación próximamente');
  };

  const isOwnProfile = profileUser?.id === currentUser?.uid;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#205781]"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Usuario no encontrado
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {profileUser.avatar ? (
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-white text-[#205781] p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profileUser.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profileUser.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {profileUser.joinDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-300" />
                  <span>{(profileUser?.rating || 5.0).toFixed(1)}</span>
                </div>
              </div>
              
              {profileUser.bio && (
                <p className="text-blue-100 mb-4 max-w-2xl">{profileUser.bio}</p>
              )}

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats?.totalProducts || userProducts?.length || 0}</div>
                  <div className="text-sm text-blue-100">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats?.totalSales || 0}</div>
                  <div className="text-sm text-blue-100">Ventas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{(userStats?.rating || 5.0).toFixed(1)}</div>
                  <div className="text-sm text-blue-100">Rating</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isOwnProfile && currentUser && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => toast.success('Chat próximamente')}
                  className="bg-white text-[#205781] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar mensaje</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contact Info */}
        {(profileUser.email || profileUser.phone) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileUser.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#205781]" />
                  <span className="text-gray-600">{profileUser.email}</span>
                </div>
              )}
              {profileUser.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#205781]" />
                  <span className="text-gray-600">{profileUser.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'products'
                    ? 'border-[#205781] text-[#205781]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Productos ({userProducts.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                {userProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {isOwnProfile ? 'No has publicado productos aún' : 'No tiene productos publicados'}
                    </h3>
                    <p className="text-gray-500">
                      {isOwnProfile ? 'Comienza publicando tu primer producto' : 'Este usuario no ha publicado nada todavía'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userProducts.map((product) => (
                      <ProductCard
                        key={product.uuid}
                        product={product}
                        onFavorite={handleFavorite}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isFavorite={favorites.has(product.uuid)}
                        onClick={() => window.location.href = `/product/${product.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;