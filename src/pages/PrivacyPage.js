import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail, Download, FileText, Globe, Phone, MapPin, Calendar, CheckCircle, AlertTriangle, Info, User } from 'lucide-react';

const PrivacyPage = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'introduction', title: 'Introducción', icon: Info },
    { id: 'collection', title: 'Recopilación de Datos', icon: Database },
    { id: 'usage', title: 'Uso de Información', icon: Eye },
    { id: 'protection', title: 'Protección de Datos', icon: Lock },
    { id: 'sharing', title: 'Compartir Información', icon: Users },
    { id: 'rights', title: 'Tus Derechos', icon: Shield },
    { id: 'contact', title: 'Contacto', icon: Mail }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border sticky top-28 p-6`}>
              <div className="flex items-center mb-4">
                <img src={`${process.env.PUBLIC_URL}/Casse.png`} alt="Cassé" className="w-6 h-6 mr-2" />
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Política de Privacidad
                </h3>
              </div>
              <nav className="space-y-2">
                {sections.map(({ id, title, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === id
                        ? 'bg-[#205781] text-white'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{title}</span>
                  </a>
                ))}
              </nav>
              
              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Acciones Rápidas
                </h4>
                <div className="space-y-2">
                  <button className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    <Download className="w-4 h-4" />
                    <span>Descargar PDF</span>
                  </button>
                  <button className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                    <FileText className="w-4 h-4" />
                    <span>Imprimir</span>
                  </button>
                </div>
              </div>
              
              {/* Last Updated */}
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Actualizado: Diciembre 2024</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-[#205781] hover:text-[#1a4a6b] mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al inicio
              </Link>
              
              {/* Hero Section */}
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-8 text-center`}>
                <div className="w-20 h-20 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <img src={`${process.env.PUBLIC_URL}/Casse.png`} alt="Cassé" className="w-12 h-12" />
                </div>
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Política de Privacidad
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 max-w-2xl mx-auto`}>
                  Tu privacidad es nuestra prioridad. Conoce cómo protegemos y utilizamos tu información personal.
                </p>
                
                {/* Trust Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>GDPR Compliant</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Cumplimiento europeo</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <Lock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Datos Encriptados</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Seguridad máxima</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <Globe className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Transparencia Total</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sin letra pequeña</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-8 space-y-12`}>
              {/* Introduction */}
              <section id="introduction">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Introducción
                  </h2>
                </div>
                <div className={`${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6`}>
                  <p className={`${isDark ? 'text-blue-100' : 'text-blue-900'} leading-relaxed text-lg`}>
                    En Cassé, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, 
                    usamos, almacenamos y protegemos tu información personal cuando utilizas nuestra plataforma de intercambio 
                    de dispositivos electrónicos.
                  </p>
                  <div className="mt-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      Política actualizada y verificada por expertos legales
                    </span>
                  </div>
                </div>
              </section>

              {/* Information Collection */}
              <section id="collection">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Información que Recopilamos
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                    <div className="flex items-center mb-4">
                      <User className="w-6 h-6 text-[#205781] mr-3" />
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Información Personal
                      </h3>
                    </div>
                    <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Nombre completo y información de contacto</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Dirección de correo electrónico</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Número de teléfono</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Dirección física para envíos</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Información de pago y facturación</span>
                      </li>
                    </ul>
                  </div>
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                    <div className="flex items-center mb-4">
                      <Eye className="w-6 h-6 text-[#205781] mr-3" />
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Información de Uso
                      </h3>
                    </div>
                    <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Historial de navegación en la plataforma</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Productos visualizados y búsquedas realizadas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Interacciones con otros usuarios</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Información del dispositivo y navegador</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section id="usage">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Cómo Usamos tu Información
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Users, title: 'Facilitar transacciones', desc: 'Conectamos compradores y vendedores de forma segura' },
                    { icon: Shield, title: 'Verificar identidad', desc: 'Validamos usuarios para mayor seguridad' },
                    { icon: Globe, title: 'Mejorar servicios', desc: 'Optimizamos la experiencia de usuario' },
                    { icon: Mail, title: 'Notificaciones', desc: 'Enviamos actualizaciones importantes' },
                    { icon: AlertTriangle, title: 'Prevenir fraudes', desc: 'Detectamos actividades sospechosas' },
                    { icon: FileText, title: 'Cumplir leyes', desc: 'Respetamos obligaciones legales' }
                  ].map(({ icon: Icon, title, desc }, index) => (
                    <div key={index} className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 hover:shadow-lg transition-all duration-200`}>
                      <Icon className="w-8 h-8 text-[#205781] mb-3" />
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{title}</h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Data Protection */}
              <section id="protection">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Protección de Datos
                  </h2>
                </div>
                <div className={`${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-6 mb-6`}>
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-red-200' : 'text-red-900'}`}>
                      Seguridad de Nivel Empresarial
                    </h3>
                  </div>
                  <p className={`${isDark ? 'text-red-100' : 'text-red-800'} leading-relaxed mb-4`}>
                    Implementamos medidas de seguridad técnicas y organizativas de última generación para proteger tu información:
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: Lock, title: 'Encriptación AES-256', desc: 'Datos protegidos en tránsito y en reposo con encriptación militar' },
                    { icon: Shield, title: 'Acceso Restringido', desc: 'Control de acceso basado en roles con autenticación multifactor' },
                    { icon: Eye, title: 'Monitoreo 24/7', desc: 'Supervisión continua con detección de amenazas en tiempo real' },
                    { icon: CheckCircle, title: 'Auditorías Regulares', desc: 'Evaluaciones de seguridad trimestrales por terceros certificados' },
                    { icon: Globe, title: 'Estándares ISO', desc: 'Cumplimiento con ISO 27001, SOC 2 y GDPR' },
                    { icon: AlertTriangle, title: 'Respuesta a Incidentes', desc: 'Plan de respuesta rápida ante cualquier amenaza de seguridad' }
                  ].map(({ icon: Icon, title, desc }, index) => (
                    <div key={index} className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
                      <div className="flex items-center mb-3">
                        <Icon className="w-6 h-6 text-[#205781] mr-3" />
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

          {/* Data Sharing */}
          <section id="sharing">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Compartir Información
              </h2>
            </div>
            <div className={`${isDark ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'} border rounded-xl p-6 mb-6`}>
              <p className={`${isDark ? 'text-orange-100' : 'text-orange-900'} leading-relaxed text-lg mb-4`}>
                No vendemos tu información personal. Solo compartimos datos en las siguientes circunstancias:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Con tu consentimiento explícito',
                  'Para completar transacciones (información de envío)',
                  'Con proveedores de servicios de confianza',
                  'Cuando sea requerido por ley',
                  'Para proteger nuestros derechos legales'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className={`text-sm ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id="rights">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Tus Derechos
              </h2>
            </div>
            <div className={`${isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-6`}>
              <p className={`${isDark ? 'text-yellow-100' : 'text-yellow-900'} leading-relaxed text-lg mb-6`}>
                Como usuario de Cassé, tienes derechos fundamentales sobre tu información personal:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Eye, title: 'Acceso', desc: 'Ver toda tu información personal' },
                  { icon: CheckCircle, title: 'Corrección', desc: 'Corregir datos inexactos' },
                  { icon: AlertTriangle, title: 'Eliminación', desc: 'Solicitar borrado de datos' },
                  { icon: Lock, title: 'Limitación', desc: 'Restringir el procesamiento' },
                  { icon: Database, title: 'Portabilidad', desc: 'Exportar tus datos' },
                  { icon: Shield, title: 'Consentimiento', desc: 'Retirar autorización' }
                ].map(({ icon: Icon, title, desc }, index) => (
                  <div key={index} className={`${isDark ? 'bg-gray-800/50' : 'bg-white/50'} rounded-lg p-4`}>
                    <div className="flex items-center mb-2">
                      <Icon className="w-5 h-5 text-[#205781] mr-2" />
                      <h4 className={`font-semibold ${isDark ? 'text-yellow-200' : 'text-yellow-900'}`}>{title}</h4>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

              {/* Contact */}
              <section id="contact" className={`${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} border rounded-2xl p-8`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Contacto y Soporte
                  </h2>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-8 text-lg`}>
                  Si tienes preguntas sobre esta Política de Privacidad o quieres ejercer tus derechos, nuestro equipo especializado está aquí para ayudarte:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200`}>
                    <Mail className="w-8 h-8 text-[#205781] mx-auto mb-4" />
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Email Especializado</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Respuesta en 24 horas</p>
                    <a href="mailto:privacidad@casse.com" className="text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors">
                      privacidad@casse.com
                    </a>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200`}>
                    <Phone className="w-8 h-8 text-[#205781] mx-auto mb-4" />
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Línea Directa</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Lun-Vie 9:00-18:00</p>
                    <a href="tel:+541112345678" className="text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors">
                      +54 11 1234-5678
                    </a>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200`}>
                    <MapPin className="w-8 h-8 text-[#205781] mx-auto mb-4" />
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Oficina Legal</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Consultas presenciales</p>
                    <p className="text-[#205781] font-medium">
                      Buenos Aires, Argentina
                    </p>
                  </div>
                </div>
                
                {/* Response Time Guarantee */}
                <div className={`mt-8 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <p className={`text-sm font-medium ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                      Garantizamos respuesta en menos de 24 horas para consultas sobre privacidad
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        
        {/* Cookie Consent Banner */}
        {showCookieConsent && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className={`max-w-4xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl p-6`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Respetamos tu Privacidad
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para mejorar tu experiencia.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowCookieConsent(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Solo Esenciales
                  </button>
                  <button 
                    onClick={() => setShowCookieConsent(false)}
                    className="px-4 py-2 text-sm font-medium bg-[#205781] text-white rounded-lg hover:bg-[#1a4a6b] transition-colors"
                  >
                    Aceptar Todas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;