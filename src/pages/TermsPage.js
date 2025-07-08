import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, XCircle, Shield, Users, Globe, Calendar, Download, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

const TermsPage = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('');

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
    { id: 'acceptance', title: 'Aceptación', icon: CheckCircle },
    { id: 'service', title: 'Servicio', icon: Globe },
    { id: 'responsibilities', title: 'Responsabilidades', icon: Users },
    { id: 'prohibited', title: 'Prohibiciones', icon: XCircle },
    { id: 'payments', title: 'Pagos', icon: Scale },
    { id: 'disputes', title: 'Disputas', icon: AlertTriangle },
    { id: 'liability', title: 'Responsabilidad', icon: Shield }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border sticky top-28 p-6`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#205781] to-[#71BBB2] rounded-xl flex items-center justify-center mr-3">
                  <img src="/casse.png" alt="Cassé" className="w-8 h-8" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Términos Legales
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Navegación rápida
                  </p>
                </div>
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
                  Acciones
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
                    <ExternalLink className="w-4 h-4" />
                    <span>Compartir</span>
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
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Términos y Condiciones
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 max-w-2xl mx-auto`}>
                  Condiciones legales que rigen el uso de la plataforma Cassé. Lee cuidadosamente antes de usar nuestros servicios.
                </p>
                
                {/* Trust Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Legalmente Válido</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Revisado por abogados</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Protección Legal</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Derechos garantizados</p>
                  </div>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <Globe className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Jurisdicción Argentina</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ley aplicable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-8 space-y-12`}>
              {/* Acceptance */}
              <section id="acceptance">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Aceptación de los Términos
                  </h2>
                </div>
                <div className={`${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-6`}>
                  <p className={`${isDark ? 'text-green-100' : 'text-green-900'} leading-relaxed text-lg mb-4`}>
                    Al acceder y utilizar la plataforma Cassé, usted acepta automáticamente estar sujeto a estos Términos y Condiciones de Uso. 
                    Si no está de acuerdo con alguna parte de estos términos, debe abstenerse de usar nuestros servicios.
                  </p>
                  <div className="mt-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      Términos actualizados y revisados por especialistas legales
                    </span>
                  </div>
                </div>
              </section>

              {/* Service Description */}
              <section id="service">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Descripción del Servicio
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    Cassé es una plataforma digital que facilita el intercambio, compra y venta de dispositivos electrónicos 
                    entre usuarios particulares y comerciales. Actuamos como intermediario tecnológico para conectar compradores y vendedores.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Lo que Ofrecemos
                      </h3>
                      <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Plataforma segura de intercambio</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Sistema de verificación de usuarios</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Herramientas de comunicación</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Sistema de calificaciones</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Limitaciones
                      </h3>
                      <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>No somos propietarios de los productos</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>No participamos en transacciones directas</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>No garantizamos la calidad de productos</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span>Actuamos como facilitador únicamente</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* User Responsibilities */}
              <section id="responsibilities">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Responsabilidades del Usuario
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                    <div className="flex items-center mb-4">
                      <Scale className="w-6 h-6 text-[#205781] mr-3" />
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Como Vendedor
                      </h3>
                    </div>
                    <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Proporcionar descripciones precisas y honestas de los productos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Usar fotografías reales y actuales del producto</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Establecer precios justos y competitivos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Responder a consultas de manera oportuna y profesional</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Cumplir con los términos de venta acordados</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Entregar productos en las condiciones descritas</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                    <div className="flex items-center mb-4">
                      <Users className="w-6 h-6 text-[#205781] mr-3" />
                      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Como Comprador
                      </h3>
                    </div>
                    <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Realizar pagos según los términos acordados</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Comunicarse de manera respetuosa con los vendedores</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Inspeccionar los productos al recibirlos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Reportar cualquier problema dentro del plazo establecido</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Proporcionar calificaciones honestas y constructivas</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>Respetar las políticas de devolución acordadas</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Prohibited Activities */}
              <section id="prohibited">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Actividades Prohibidas
                  </h2>
                </div>
                <div className={`${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-6 mb-6`}>
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-red-200' : 'text-red-900'}`}>
                      Conductas Sancionables
                    </h3>
                  </div>
                  <p className={`${isDark ? 'text-red-100' : 'text-red-800'} leading-relaxed mb-4`}>
                    Las siguientes actividades están estrictamente prohibidas y pueden resultar en la suspensión o eliminación permanente de su cuenta:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                      Productos y Servicios
                    </h4>
                    <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Vender productos falsificados, robados o ilegales</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Ofrecer productos dañados sin declararlo</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Publicar contenido pornográfico o violento</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Vender armas, drogas o sustancias controladas</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                      Comportamiento
                    </h4>
                    <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Acosar, amenazar o intimidar a otros usuarios</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Realizar actividades fraudulentas o estafas</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Crear múltiples cuentas para evadir restricciones</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>Intentar hackear o comprometer la seguridad</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Payment and Fees */}
              <section id="payments">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Pagos y Comisiones
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    Cassé cobra comisiones por facilitar transacciones exitosas en la plataforma. Nuestro modelo de negocio se basa en el éxito de nuestros usuarios.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">5%</span>
                      </div>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Comisión de Venta
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Del precio final de venta
                      </p>
                    </div>
                    
                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg font-bold text-white">2.9%</span>
                      </div>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Procesamiento
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        + $0.30 por transacción
                      </p>
                    </div>
                    
                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg font-bold text-white">$0</span>
                      </div>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Publicación
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Gratis para todos
                      </p>
                    </div>
                  </div>
                  
                  <div className={`${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-blue-200' : 'text-blue-900'} mb-3`}>
                      Política de Reembolsos
                    </h4>
                    <ul className={`space-y-2 ${isDark ? 'text-blue-100' : 'text-blue-800'}`}>
                      <li>• Las comisiones no son reembolsables una vez completada la transacción</li>
                      <li>• Los retiros tienen un mínimo de $10 USD</li>
                      <li>• Procesamiento de retiros en 1-3 días hábiles</li>
                      <li>• Sin cargos adicionales por retiros estándar</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Dispute Resolution */}
              <section id="disputes">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Resolución de Disputas
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    En caso de disputas entre usuarios, Cassé actuará como mediador imparcial siguiendo un proceso estructurado y justo para todas las partes involucradas.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { step: 1, title: 'Reporte', desc: 'Usuario reporta problema dentro de 48 horas', icon: '📝' },
                      { step: 2, title: 'Investigación', desc: 'Nuestro equipo revisa evidencia y testimonios', icon: '🔍' },
                      { step: 3, title: 'Mediación', desc: 'Facilitamos comunicación entre las partes', icon: '🤝' },
                      { step: 4, title: 'Decisión', desc: 'Resolución basada en evidencia y políticas', icon: '⚖️' },
                      { step: 5, title: 'Implementación', desc: 'Aplicación de la solución acordada', icon: '✅' }
                    ].map(({ step, title, desc, icon }) => (
                      <div key={step} className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-4 text-center`}>
                        <div className="text-3xl mb-2">{icon}</div>
                        <div className="text-sm font-bold text-[#205781] mb-1">Paso {step}</div>
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{title}</h4>
                        <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`${isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-6`}>
                    <h4 className={`text-lg font-semibold ${isDark ? 'text-yellow-200' : 'text-yellow-900'} mb-3`}>
                      Tiempos de Respuesta Garantizados
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">24h</div>
                        <div className={`text-sm ${isDark ? 'text-yellow-100' : 'text-yellow-800'}`}>Respuesta inicial</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">72h</div>
                        <div className={`text-sm ${isDark ? 'text-yellow-100' : 'text-yellow-800'}`}>Investigación completa</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">7d</div>
                        <div className={`text-sm ${isDark ? 'text-yellow-100' : 'text-yellow-800'}`}>Resolución final</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section id="liability">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                      Limitación de Responsabilidad
                    </h2>
                    <div className={`${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6`}>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed mb-4`}>
                        <strong>IMPORTANTE:</strong> Cassé actúa únicamente como plataforma intermediaria. Los usuarios asumen la responsabilidad 
                        completa de sus transacciones, incluyendo la verificación de productos, términos de venta y cumplimiento de acuerdos.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>No nos responsabilizamos por:</h5>
                          <ul className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                            <li>• Calidad o autenticidad de productos</li>
                            <li>• Incumplimiento de acuerdos entre usuarios</li>
                            <li>• Daños directos o indirectos</li>
                            <li>• Pérdidas económicas por transacciones</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Sí garantizamos:</h5>
                          <ul className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                            <li>• Funcionamiento de la plataforma</li>
                            <li>• Seguridad de datos personales</li>
                            <li>• Mediación imparcial en disputas</li>
                            <li>• Soporte técnico especializado</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className={`${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} border rounded-2xl p-8`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Contacto Legal
                  </h2>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-8 text-lg`}>
                  Para consultas legales, disputas o interpretación de estos términos, nuestro equipo jurídico especializado está disponible:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200`}>
                    <Mail className="w-8 h-8 text-[#205781] mx-auto mb-4" />
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Departamento Legal</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Consultas especializadas</p>
                    <a href="mailto:legal@casse.com" className="text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors">
                      legal@casse.com
                    </a>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200`}>
                    <Phone className="w-8 h-8 text-[#205781] mx-auto mb-4" />
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Línea Jurídica</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Lun-Vie 9:00-18:00</p>
                    <a href="tel:+541143216789" className="text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors">
                      +54 11 4321-6789
                    </a>
                  </div>
                  <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200`}>
                    <MapPin className="w-8 h-8 text-[#205781] mx-auto mb-4" />
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Oficina Principal</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>Consultas presenciales</p>
                    <p className="text-[#205781] font-medium">
                      Buenos Aires, Argentina
                    </p>
                  </div>
                </div>
                
                {/* Legal Notice */}
                <div className={`mt-8 ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4`}>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-500 mr-3" />
                    <p className={`text-sm font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                      Estos términos están sujetos a la legislación argentina y cualquier disputa será resuelta en los tribunales de Buenos Aires.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;