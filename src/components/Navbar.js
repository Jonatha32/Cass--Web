import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Menu, X, User, Heart, MessageCircle, Settings, LogOut, 
  Plus, Bell, Sun, Moon, ShoppingBag, Star, Shield, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Demo notifications
  const demoNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'Nuevo mensaje',
      description: 'Alejandro Martínez te envió un mensaje',
      time: '5 min',
      read: false,
      icon: MessageCircle,
      color: 'blue'
    },
    {
      id: 2,
      type: 'sale',
      title: '¡Venta realizada!',
      description: 'Tu iPhone 14 Pro Max se vendió',
      time: '1 hora',
      read: false,
      icon: Star,
      color: 'green'
    },
    {
      id: 3,
      type: 'favorite',
      title: 'Producto favorito',
      description: 'Alguien agregó tu MacBook a favoritos',
      time: '2 horas',
      read: true,
      icon: Heart,
      color: 'red'
    }
  ];

  useEffect(() => {
    setNotifications(demoNotifications);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      window.dispatchEvent(new CustomEvent('search', { detail: searchTerm }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente', {
        duration: 3000,
        style: { borderRadius: '12px', background: '#DCFCE7', color: '#166534' }
      });
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Inicio', path: '/', icon: null },
    { name: 'Categorías', path: '/categories', icon: null },
    { name: 'Favoritos', path: '/favorites', icon: Heart },
    { name: 'Mensajes', path: '/messages', icon: MessageCircle }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${
      isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
    } backdrop-blur-sm border-b transition-all duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={`${process.env.PUBLIC_URL}/casse.png`} alt="Cassé" className="w-10 h-10 object-contain"/>
            <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Cassé</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar iPhone, MacBook, PlayStation..."
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-xl leading-5 transition-all duration-200 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
                } focus:ring-4 focus:outline-none`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Create Product Button */}
                <Link
                  to="/create"
                  className="bg-[#205781] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline">Vender</span>
                </Link>

                {/* Navigation Links */}
                {navLinks.slice(2).map(({ name, path, icon: Icon }) => (
                  <Link
                    key={name}
                    to={path}
                    className={`p-2 rounded-lg transition-colors relative ${
                      location.pathname === path
                        ? isDark ? 'bg-gray-800 text-[#71BBB2]' : 'bg-gray-100 text-[#205781]'
                        : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title={name}
                  >
                    <Icon className="w-5 h-5" />
                    {name === 'Mensajes' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                ))}

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-lg transition-colors relative ${
                      isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className={`absolute right-0 mt-2 w-80 ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border rounded-xl shadow-lg z-50`}>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Notificaciones
                          </h3>
                          {unreadCount > 0 && (
                            <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                              {unreadCount} nuevas
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => {
                          const IconComponent = notification.icon;
                          return (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer transition-colors ${
                                !notification.read 
                                  ? isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-blue-50 hover:bg-blue-100'
                                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  notification.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                  notification.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                                  'bg-red-100 dark:bg-red-900/20'
                                }`}>
                                  <IconComponent className={`w-5 h-5 ${
                                    notification.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                    notification.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                      {notification.title}
                                    </p>
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {notification.time}
                                    </span>
                                  </div>
                                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                                    {notification.description}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full text-center text-[#205781] hover:text-[#1a4a6b] font-medium text-sm transition-colors">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-full flex items-center justify-center">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`hidden lg:block font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.displayName?.split(' ')[0] || 'Usuario'}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className={`absolute right-0 mt-2 w-64 ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border rounded-xl shadow-lg z-50`}>
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-full flex items-center justify-center">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                              {user.displayName || 'Usuario'}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Shield className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-500 font-medium">Verificado</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                            isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <User className="w-5 h-5" />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          to="/favorites"
                          className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                            isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                          <span>Favoritos</span>
                        </Link>
                        <Link
                          to="/messages"
                          className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                            isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <div className="flex items-center justify-between flex-1">
                            <span>Mensajes</span>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </Link>
                        <Link
                          to="/settings"
                          className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                            isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Settings className="w-5 h-5" />
                          <span>Configuración</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 w-full text-left transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-[#205781] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              className={`block w-full pl-10 pr-4 py-2.5 border rounded-xl leading-5 transition-all duration-200 ${
                isDark 
                  ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
              } focus:ring-4 focus:outline-none`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <div className="px-4 py-4 space-y-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>

            {user ? (
              <>
                {/* User Info Mobile */}
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-full flex items-center justify-center">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.displayName || 'Usuario'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Navigation Links Mobile */}
                {navLinks.map(({ name, path, icon: Icon }) => (
                  <Link
                    key={name}
                    to={path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === path
                        ? isDark ? 'bg-gray-800 text-[#71BBB2]' : 'bg-gray-100 text-[#205781]'
                        : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{name}</span>
                    {name === 'Mensajes' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-auto">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                ))}

                <Link
                  to="/create"
                  className="flex items-center space-x-3 px-4 py-3 bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Vender Producto</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  to="/settings"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors text-center font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;