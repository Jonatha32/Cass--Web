import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Search, User, Heart, MessageCircle, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../services/firebase');
      await signOut(auth);
      toast.success('Sesión cerrada');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-[#205781] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white bg-opacity-10 px-3 py-1 rounded-lg">
              <span className="text-xl font-bold">CASSÉ</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-70 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/favorites" className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors" title="Favoritos">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/messages" className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors" title="Mensajes">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Link to="/profile" className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors" title="Perfil">
                  <User className="w-5 h-5" />
                </Link>
                <Link to="/settings" className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors" title="Configuración">
                  <Settings className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#71BBB2] text-black hover:bg-opacity-90 rounded-lg transition-colors"
                >
                  Registrarse
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