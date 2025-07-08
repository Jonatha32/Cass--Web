import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, Search, ChevronDown, ChevronUp, Clock, Star, CheckCircle, AlertCircle, Zap, Shield, Users, Globe, Send, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'all', name: 'Todas', icon: Globe, count: 24 },
    { id: 'account', name: 'Cuenta', icon: Users, count: 8 },
    { id: 'buying', name: 'Compras', icon: CheckCircle, count: 6 },
    { id: 'selling', name: 'Ventas', icon: Star, count: 5 },
    { id: 'payments', name: 'Pagos', icon: Shield, count: 3 },
    { id: 'technical', name: 'Técnico', icon: Zap, count: 2 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: "¿Cómo puedo crear una cuenta en Cassé?",
      answer: "Para crear una cuenta, haz clic en 'Registrarse' en la esquina superior derecha. Necesitarás proporcionar tu nombre, email y crear una contraseña segura. También puedes registrarte usando tu cuenta de Google o Facebook para mayor comodidad.",
      helpful: 156,
      tags: ['registro', 'cuenta', 'nuevo usuario']
    },
    {
      id: 2,
      category: 'account',
      question: "¿Cómo verifico mi identidad?",
      answer: "La verificación de identidad es opcional pero recomendada. Ve a Configuración > Verificación y sube una foto de tu documento de identidad. El proceso toma 24-48 horas y aumenta la confianza de otros usuarios.",
      helpful: 134,
      tags: ['verificación', 'identidad', 'seguridad']
    },
    {
      id: 3,
      category: 'selling',
      question: "¿Cómo puedo vender mi dispositivo en Cassé?",
      answer: "Para vender, crea una cuenta, haz clic en 'Vender producto', completa la información del producto con fotos de alta calidad y descripción detallada, establece tu precio competitivo y publica. Los compradores interesados te contactarán directamente a través de nuestro sistema de mensajería.",
      helpful: 289,
      tags: ['vender', 'producto', 'publicar']
    },
    {
      id: 4,
      category: 'selling',
      question: "¿Qué fotos debo subir de mi producto?",
      answer: "Sube al menos 5 fotos de alta calidad: vista frontal, trasera, laterales, pantalla encendida y cualquier defecto. Usa buena iluminación natural y fondos neutros. Las fotos de calidad aumentan las posibilidades de venta hasta un 70%.",
      helpful: 198,
      tags: ['fotos', 'imágenes', 'calidad']
    },
    {
      id: 5,
      category: 'buying',
      question: "¿Es seguro comprar en Cassé?",
      answer: "Sí, implementamos múltiples medidas de seguridad: verificación de usuarios, sistema de calificaciones, protección de pagos con MercadoPago, y un equipo de soporte que media en disputas. Siempre revisa el perfil y calificaciones del vendedor antes de comprar.",
      helpful: 445,
      tags: ['seguridad', 'compra', 'protección']
    },
    {
      id: 6,
      category: 'buying',
      question: "¿Cómo puedo estar seguro de la calidad del producto?",
      answer: "Revisa las fotos detalladas, lee la descripción completa, verifica las calificaciones del vendedor, y haz todas las preguntas necesarias antes de comprar. Puedes solicitar fotos adicionales o videollamada para productos de alto valor.",
      helpful: 167,
      tags: ['calidad', 'verificación', 'producto']
    },
    {
      id: 7,
      category: 'payments',
      question: "¿Qué comisiones cobra Cassé?",
      answer: "Cobramos una comisión del 5% sobre el precio final de venta más 2.9% + $0.30 por procesamiento de pagos con MercadoPago. No hay costo por publicar productos ni por navegar la plataforma. Los compradores no pagan comisiones adicionales.",
      helpful: 234,
      tags: ['comisiones', 'precios', 'costos']
    },
    {
      id: 8,
      category: 'payments',
      question: "¿Cuándo recibo el dinero de mi venta?",
      answer: "El dinero se libera automáticamente 24 horas después de que el comprador confirme la recepción del producto, o 7 días después del envío si no hay confirmación. Puedes retirar tus fondos inmediatamente a tu cuenta bancaria o billetera digital.",
      helpful: 178,
      tags: ['pago', 'dinero', 'retiro']
    },
    {
      id: 9,
      category: 'buying',
      question: "¿Cómo funciona el envío de productos?",
      answer: "El envío se coordina entre comprador y vendedor. Recomendamos usar servicios con tracking como Correo Argentino, OCA o Andreani. Para productos de alto valor, considera envío con seguro. Cassé puede mediar en caso de problemas con el envío.",
      helpful: 156,
      tags: ['envío', 'correo', 'entrega']
    },
    {
      id: 10,
      category: 'buying',
      question: "¿Qué hago si tengo un problema con mi compra?",
      answer: "Contacta primero al vendedor para resolver el problema amigablemente. Si no hay solución, reporta el caso a nuestro equipo de soporte dentro de 48 horas usando el botón 'Reportar problema'. Investigaremos y mediaremos para encontrar una solución justa.",
      helpful: 267,
      tags: ['problema', 'disputa', 'soporte']
    },
    {
      id: 11,
      category: 'buying',
      question: "¿Puedo devolver un producto?",
      answer: "Las devoluciones dependen de la política del vendedor individual, que debe estar claramente especificada en la publicación. Para productos defectuosos o significativamente diferentes a la descripción, nuestro equipo puede intervenir y facilitar la devolución.",
      helpful: 189,
      tags: ['devolución', 'garantía', 'reembolso']
    },
    {
      id: 12,
      category: 'selling',
      question: "¿Cómo verifico la autenticidad de un producto?",
      answer: "Para productos Apple, verifica el IMEI en la web oficial. Para otros dispositivos, revisa números de serie, certificados de autenticidad, y compara con especificaciones oficiales. Siempre declara si un producto es réplica o tiene modificaciones.",
      helpful: 145,
      tags: ['autenticidad', 'verificación', 'original']
    },
    {
      id: 13,
      category: 'payments',
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todos los métodos disponibles en MercadoPago: tarjetas de crédito/débito, transferencias bancarias, Rapipago, Pago Fácil, y billeteras digitales como Ualá y Brubank. Todos los pagos son procesados de forma segura.",
      helpful: 198,
      tags: ['pago', 'métodos', 'mercadopago']
    },
    {
      id: 14,
      category: 'account',
      question: "¿Cómo cambio mi contraseña?",
      answer: "Ve a Configuración > Seguridad > Cambiar contraseña. Ingresa tu contraseña actual y la nueva (mínimo 8 caracteres con mayúsculas, minúsculas y números). También puedes usar 'Olvidé mi contraseña' en el login para restablecerla por email.",
      helpful: 123,
      tags: ['contraseña', 'seguridad', 'cambiar']
    },
    {
      id: 15,
      category: 'account',
      question: "¿Cómo elimino mi cuenta?",
      answer: "Para eliminar tu cuenta, ve a Configuración > Privacidad > Eliminar cuenta. Ten en cuenta que esta acción es irreversible y perderás todo tu historial, calificaciones y mensajes. Asegúrate de completar todas las transacciones pendientes.",
      helpful: 89,
      tags: ['eliminar', 'cuenta', 'borrar']
    },
    {
      id: 16,
      category: 'technical',
      question: "La aplicación no carga correctamente",
      answer: "Primero, verifica tu conexión a internet. Luego, cierra y vuelve a abrir la aplicación. Si el problema persiste, borra el caché de la app o reinstálala. Para la versión web, prueba en modo incógnito o borra las cookies del navegador.",
      helpful: 167,
      tags: ['técnico', 'app', 'problemas']
    },
    {
      id: 17,
      category: 'technical',
      question: "No recibo notificaciones",
      answer: "Verifica que las notificaciones estén habilitadas en Configuración > Notificaciones dentro de la app, y también en la configuración de tu dispositivo. Para notificaciones por email, revisa tu carpeta de spam y agrega noreply@casse.com a tus contactos.",
      helpful: 134,
      tags: ['notificaciones', 'email', 'configuración']
    },
    {
      id: 18,
      category: 'selling',
      question: "¿Cómo mejoro mis ventas?",
      answer: "Usa fotos profesionales con buena iluminación, escribe descripciones detalladas y honestas, responde rápido a los mensajes, mantén precios competitivos, y construye una buena reputación cumpliendo con los acuerdos. Los vendedores verificados venden 3x más rápido.",
      helpful: 234,
      tags: ['ventas', 'consejos', 'mejorar']
    },
    {
      id: 19,
      category: 'selling',
      question: "¿Puedo editar mi publicación después de publicarla?",
      answer: "Sí, puedes editar el precio, descripción y agregar más fotos en cualquier momento. Sin embargo, no puedes cambiar la categoría principal del producto. Para cambios mayores, es mejor crear una nueva publicación.",
      helpful: 156,
      tags: ['editar', 'publicación', 'modificar']
    },
    {
      id: 20,
      category: 'account',
      question: "¿Cómo reporto un usuario sospechoso?",
      answer: "En el perfil del usuario, haz clic en los tres puntos y selecciona 'Reportar usuario'. Proporciona detalles específicos del comportamiento sospechoso. Nuestro equipo investigará en 24 horas y tomará las medidas apropiadas.",
      helpful: 178,
      tags: ['reportar', 'usuario', 'seguridad']
    },
    {
      id: 21,
      category: 'buying',
      question: "¿Cómo funciona el sistema de calificaciones?",
      answer: "Después de cada transacción, tanto comprador como vendedor pueden calificarse mutuamente del 1 al 5 estrellas y dejar comentarios. Las calificaciones son públicas y ayudan a otros usuarios a tomar decisiones informadas. No se pueden modificar una vez enviadas.",
      helpful: 145,
      tags: ['calificaciones', 'reseñas', 'feedback']
    },
    {
      id: 22,
      category: 'account',
      question: "¿Puedo tener múltiples cuentas?",
      answer: "No, cada persona puede tener solo una cuenta en Cassé. Tener múltiples cuentas viola nuestros términos de servicio y puede resultar en la suspensión de todas las cuentas asociadas. Si necesitas una cuenta comercial, contáctanos.",
      helpful: 98,
      tags: ['múltiples', 'cuentas', 'reglas']
    },
    {
      id: 23,
      category: 'account',
      question: "¿Cómo contacto al soporte de Cassé?",
      answer: "Puedes contactarnos por email a soporte@casse.com, por teléfono al +54 11 1234-5678 (Lun-Vie 9-18hs), o usando el chat en vivo disponible en la app. Para problemas urgentes, usa el teléfono. Respondemos emails en menos de 24 horas.",
      helpful: 267,
      tags: ['contacto', 'soporte', 'ayuda']
    },
    {
      id: 24,
      category: 'account',
      question: "¿Cassé tiene aplicación móvil?",
      answer: "Sí, tenemos aplicaciones nativas para iOS y Android disponibles en App Store y Google Play. También puedes usar nuestra versión web optimizada para móviles. Las apps ofrecen notificaciones push y mejor experiencia de usuario.",
      helpful: 189,
      tags: ['app', 'móvil', 'descargar']
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Mensaje enviado correctamente. Te responderemos pronto.', {
      duration: 4000,
      style: { borderRadius: '12px', background: '#DCFCE7', color: '#166534' }
    });
    
    setContactForm({ name: '', email: '', subject: '', message: '', priority: 'medium' });
    setSubmitting(false);
  };

  const handleFaqVote = (faqId, helpful) => {
    toast.success(helpful ? '¡Gracias por tu feedback!' : 'Gracias, trabajaremos en mejorar esta respuesta', {
      duration: 2000,
      style: { borderRadius: '12px' }
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Centro de Ayuda Cassé
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
              Encuentra respuestas rápidas, contacta a nuestro equipo especializado o explora nuestras guías completas
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="text-2xl font-bold text-[#205781]">24h</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tiempo respuesta</div>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="text-2xl font-bold text-[#205781]">98%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Satisfacción</div>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="text-2xl font-bold text-[#205781]">24/7</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Disponibilidad</div>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="text-2xl font-bold text-[#205781]">15k+</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Consultas resueltas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Preguntas Frecuentes
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {filteredFaqs.length} resultados
                </div>
              </div>
              
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar en preguntas frecuentes..."
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
                  } focus:ring-4 focus:outline-none`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(({ id, name, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeCategory === id
                        ? 'bg-[#205781] text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeCategory === id ? 'bg-white/20' : 'bg-gray-500/20'
                    }`}>
                      {id === 'all' ? faqs.length : count}
                    </span>
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className={`border rounded-xl transition-all duration-200 ${
                    isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <button
                      className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    >
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {faq.question}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {categories.find(c => c.id === faq.category)?.name}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3" />
                            <span>{faq.helpful} útiles</span>
                          </div>
                        </div>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className={`px-6 pb-6 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="pt-4">
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                            {faq.answer}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {faq.tags.map((tag, index) => (
                              <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                                isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                              }`}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Helpful buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                ¿Te fue útil esta respuesta?
                              </span>
                              <button
                                onClick={() => handleFaqVote(faq.id, true)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                }`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleFaqVote(faq.id, false)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                }`}
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            </div>
                            <button className={`text-sm text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors`}>
                              Compartir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    No encontramos resultados
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                    Intenta con otros términos o contacta directamente a nuestro equipo
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                    }}
                    className="text-[#205781] hover:text-[#1a4a6b] font-medium transition-colors"
                  >
                    Ver todas las preguntas
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-6`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Contacto Directo
              </h3>
              <div className="space-y-4">
                <a
                  href="tel:+541112345678"
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                    isDark ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30' : 'bg-green-50 border-green-200 hover:bg-green-100'
                  } border`}
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-green-200' : 'text-green-800'}`}>Línea Directa</p>
                    <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>+54 11 1234-5678</p>
                    <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-500'}`}>Lun-Vie 9:00-18:00</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-green-500" />
                </a>
                
                <a
                  href="mailto:soporte@casse.com"
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                    isDark ? 'bg-blue-900/20 border-blue-800 hover:bg-blue-900/30' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  } border`}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>Email Soporte</p>
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>soporte@casse.com</p>
                    <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>Respuesta en 24h</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                </a>

                <div className={`flex items-center p-4 rounded-xl ${
                  isDark ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
                } border`}>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>Chat en Vivo</p>
                    <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Disponible en la app</p>
                    <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-500'}`}>Respuesta inmediata</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-6`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Envíanos un Mensaje
              </h3>
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2]' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#205781]'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        isDark 
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2]' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-[#205781]'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Asunto *
                  </label>
                  <select
                    required
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2]' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-[#205781]'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  >
                    <option value="">Selecciona un tema</option>
                    <option value="problema-compra">Problema con compra</option>
                    <option value="problema-venta">Problema con venta</option>
                    <option value="problema-pago">Problema de pago</option>
                    <option value="cuenta">Problema de cuenta</option>
                    <option value="tecnico">Problema técnico</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Prioridad
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'low', label: 'Baja', color: 'green' },
                      { value: 'medium', label: 'Media', color: 'yellow' },
                      { value: 'high', label: 'Alta', color: 'red' }
                    ].map(({ value, label, color }) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value={value}
                          checked={contactForm.priority === value}
                          onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                          className={`w-4 h-4 text-${color}-600 border-gray-300 focus:ring-${color}-500`}
                        />
                        <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors resize-none ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-[#71BBB2]' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-[#205781]'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Describe tu consulta o problema con el mayor detalle posible..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#205781] text-white py-3 px-4 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Response Time Guarantee */}
            <div className={`${isDark ? 'bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-800' : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'} border rounded-2xl p-6`}>
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-green-500 mr-3" />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Garantía de Respuesta
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">15min</div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Chat en vivo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">2h</div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Teléfono</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">24h</div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;