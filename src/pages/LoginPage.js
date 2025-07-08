import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, Smartphone, Users, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Auto-focus en email al cargar
  useEffect(() => {
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }, []);

  // Validación en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Formato de email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 6) {
          newErrors.password = 'Mínimo 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación final
    const finalErrors = {};
    if (!formData.email) finalErrors.email = 'El email es requerido';
    if (!formData.password) finalErrors.password = 'La contraseña es requerida';
    
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setLoading(true);

    try {
      const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } = await import('firebase/auth');
      const { auth } = await import('../services/firebase');
      
      // Configurar persistencia según "Recordarme"
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast.success('¡Bienvenido de vuelta! 🎉', {
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #22C55E'
        }
      });
      
      // Pequeño delay para mejor UX
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email';
          setErrors({ email: 'Usuario no encontrado' });
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          setErrors({ password: 'Contraseña incorrecta' });
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          setErrors({ email: 'Email inválido' });
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          errorMessage = 'Error de conexión. Verifica tu internet';
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          borderRadius: '12px',
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@casse.com',
      password: 'demo123'
    });
    
    toast.success('Datos de demo cargados', {
      duration: 2000,
      icon: '🎯'
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#205781] via-[#2d6fa3] to-[#71BBB2]'} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#71BBB2]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <img src="/casse.png" alt="Cassé" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Cassé</h1>
                <p className="text-white/80">Tecnología que renace</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">100% Seguro</h3>
                  <p className="text-white/70">Transacciones protegidas y verificadas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">+15M Usuarios</h3>
                  <p className="text-white/70">Comunidad activa en toda Latinoamérica</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">4.9★ Calificación</h3>
                  <p className="text-white/70">La confianza de millones de usuarios</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">2.8M</div>
                <div className="text-white/70 text-sm">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/70 text-sm">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/70 text-sm">Soporte</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Back Button */}
            <Link 
              to="/" 
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm mb-4">
                <img src="/casse.png" alt="Cassé" className="w-8 h-8 mr-3" />
                <h1 className="text-2xl font-bold text-white">Cassé</h1>
              </div>
              <p className="text-white/80">Tecnología que renace</p>
            </div>

            {/* Login Form */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/20`}>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  ¡Bienvenido de vuelta!
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Inicia sesión para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-400' : isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                            : 'border-gray-300 focus:border-[#205781] focus:ring-[#205781]/20'
                      } focus:ring-4 focus:outline-none`}
                      placeholder="tu@email.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-400' : isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl transition-all duration-200 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : isDark 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                            : 'border-gray-300 focus:border-[#205781] focus:ring-[#205781]/20'
                      } focus:ring-4 focus:outline-none`}
                      placeholder="Tu contraseña"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#205781] border-gray-300 rounded focus:ring-[#205781] focus:ring-2"
                    />
                    <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Recordarme
                    </span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  className="w-full bg-gradient-to-r from-[#205781] to-[#2d6fa3] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </button>

                {/* Demo Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className={`w-full ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Probar con cuenta demo</span>
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  ¿No tienes cuenta?{' '}
                  <Link 
                    to="/register" 
                    className="text-[#205781] hover:text-[#1a4a6b] font-semibold transition-colors"
                  >
                    Regístrate gratis
                  </Link>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  SSL Seguro
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verificado
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  4.9★ Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;