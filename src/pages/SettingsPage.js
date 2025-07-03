import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  LogOut,
  Moon,
  Sun,
  Mail,
  Phone,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../services/firebase');
      await signOut(auth);
      toast.success('Sesión cerrada');
      window.location.href = '/';
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`Modo ${!darkMode ? 'oscuro' : 'claro'} activado`);
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notificaciones ${!notifications ? 'activadas' : 'desactivadas'}`);
  };

  const showPrivacyPolicy = () => {
    toast.success('Política de privacidad - Próximamente');
  };

  const showTermsAndConditions = () => {
    toast.success('Términos y condiciones - Próximamente');
  };

  const showSupport = () => {
    toast.success('Ayuda y soporte - Próximamente');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Debes iniciar sesión
          </h2>
          <p className="text-gray-600">
            Inicia sesión para acceder a la configuración
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#205781] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Configuración</h1>
              <p className="text-blue-100 mt-1">
                Personaliza tu experiencia en Cassé
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-[#205781] rounded-full flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.displayName || 'Usuario'}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Miembro desde {new Date(user.metadata?.creationTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#205781] flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Preferencias
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Dark Mode Toggle */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800">Modo oscuro</h4>
                    <p className="text-sm text-gray-500">Cambiar apariencia de la app</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-[#205781]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications Toggle */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-800">Notificaciones</h4>
                    <p className="text-sm text-gray-500">Recibir alertas de la aplicación</p>
                  </div>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-[#205781]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-colors ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#205781] flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Cuenta
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              <button
                onClick={() => window.location.href = '/privacy'}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Política de Privacidad</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => window.location.href = '/terms'}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Términos y Condiciones</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              <button
                onClick={() => window.location.href = '/support'}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Ayuda y Soporte</span>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-[#205781] mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Información de Contacto
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#205781]" />
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-600">soporte@casse.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#205781]" />
                <div>
                  <p className="font-medium text-gray-800">Teléfono</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#205781]" />
                <div>
                  <p className="font-medium text-gray-800">Horario</p>
                  <p className="text-sm text-gray-600">Lun-Vie 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-[#205781] mb-2">CASSÉ</h2>
            <p className="text-gray-600 mb-4">Versión 1.0.0</p>
            <p className="text-sm text-gray-500">
              Dando nueva vida a la tecnología rota
            </p>
          </div>

          {/* Logout Button */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-4 flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;