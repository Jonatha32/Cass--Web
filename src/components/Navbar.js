import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Heart, MessageCircle, Settings, LogOut, Recycle } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (!confirmed) return;
    
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../services/firebase');
      await signOut(auth);
      toast.success('Sesión cerrada exitosamente');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#1a4a6b] via-[#205781] to-[#2d6fa3] text-white shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#71BBB2] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#71BBB2] to-[#5aa89f] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <img src="/casse.png" alt="Cassé" className="w-8 h-8 rounded-lg" onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }} />
                <Recycle className="w-6 h-6 text-white" style={{display: 'none'}} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Cassé
              </span>
              <span className="text-xs text-blue-200 -mt-1">Intercambio Inteligente</span>
            </div>
          </Link>

          {/* Center Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#71BBB2] transition-colors duration-300 font-medium flex items-center space-x-2">
              <span>🏠</span>
              <span>Inicio</span>
            </Link>
            <Link to="/category/smartphones" className="text-white hover:text-[#71BBB2] transition-colors duration-300 font-medium flex items-center space-x-2">
              <span>📱</span>
              <span>Smartphones</span>
            </Link>
            <Link to="/category/gaming" className="text-white hover:text-[#71BBB2] transition-colors duration-300 font-medium flex items-center space-x-2">
              <span>🎮</span>
              <span>Gaming</span>
            </Link>
            <Link to="/category/laptops" className="text-white hover:text-[#71BBB2] transition-colors duration-300 font-medium flex items-center space-x-2">
              <span>💻</span>
              <span>Laptops</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white bg-opacity-10 rounded-xl p-1 backdrop-blur-sm">
                  <Link to="/favorites" className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-300 transform hover:scale-110 relative group" title="Favoritos">
                    <Heart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">3</span>
                  </Link>
                  <Link to="/messages" className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-300 transform hover:scale-110 relative group" title="Mensajes">
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </Link>
                  <Link to="/profile" className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-300 transform hover:scale-110" title="Perfil">
                    <User className="w-5 h-5" />
                  </Link>
                  <Link to="/settings" className="p-3 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-300 transform hover:scale-110" title="Configuración">
                    <Settings className="w-5 h-5" />
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 hover:bg-red-500 hover:bg-opacity-30 rounded-xl transition-all duration-300 transform hover:scale-110 border border-white border-opacity-20 hover:border-red-300 backdrop-blur-sm"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white border-opacity-20 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-[#71BBB2] to-[#5aa89f] text-white hover:shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Registrarse</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;