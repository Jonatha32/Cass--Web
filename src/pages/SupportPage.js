import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Send, Book, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío
    setTimeout(() => {
      toast.success('Mensaje enviado. Te responderemos pronto.');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setLoading(false);
    }, 1000);
  };

  const faqs = [
    {
      question: "¿Cómo publico un producto en Cassé?",
      answer: "Ve a 'Crear Publicación', completa los detalles del producto, agrega fotos de calidad y establece un precio justo. Asegúrate de describir honestamente el estado del dispositivo."
    },
    {
      question: "¿Es seguro intercambiar productos?",
      answer: "Recomendamos reunirse en lugares públicos, verificar el producto antes del intercambio y usar métodos de pago seguros. Nunca compartas información personal sensible."
    },
    {
      question: "¿Qué hago si tengo un problema con otro usuario?",
      answer: "Primero intenta resolver directamente con el usuario. Si no es posible, contacta a nuestro equipo de soporte con evidencia de la situación."
    },
    {
      question: "¿Puedo cancelar un intercambio acordado?",
      answer: "Sí, pero recomendamos comunicarlo lo antes posible al otro usuario. Los intercambios cancelados frecuentemente pueden afectar tu reputación."
    },
    {
      question: "¿Cómo elimino mi cuenta?",
      answer: "Ve a Configuración > Cuenta y selecciona 'Eliminar cuenta'. Ten en cuenta que esta acción es irreversible y se eliminarán todos tus datos."
    },
    {
      question: "¿Cassé cobra comisiones?",
      answer: "Actualmente Cassé es gratuito. No cobramos comisiones por publicar productos o realizar intercambios entre usuarios."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">Centro de Ayuda</h1>
            <p className="text-xl text-blue-100">
              Estamos aquí para ayudarte en todo momento
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contacto rápido */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información de contacto */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#205781] mb-4">Contacto Directo</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#205781]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">soporte@casse.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#205781]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Teléfono</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#205781]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Horario</p>
                    <p className="text-sm text-gray-600">Lun-Vie 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recursos útiles */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#205781] mb-4">Recursos Útiles</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Book className="w-5 h-5 text-[#205781]" />
                  <span className="text-gray-700">Guía de Usuario</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Shield className="w-5 h-5 text-[#205781]" />
                  <span className="text-gray-700">Consejos de Seguridad</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-[#205781]" />
                  <span className="text-gray-700">Comunidad</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preguntas frecuentes */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#205781] mb-6">Preguntas Frecuentes</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      <HelpCircle className="w-5 h-5 text-[#205781] group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="mt-2 p-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <MessageCircle className="w-8 h-8 text-[#205781] mr-3" />
                <h2 className="text-2xl font-bold text-[#205781]">Envíanos un Mensaje</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205781] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205781] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="category"
                    value={contactForm.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205781] focus:border-transparent"
                  >
                    <option value="general">Consulta General</option>
                    <option value="technical">Problema Técnico</option>
                    <option value="account">Problema de Cuenta</option>
                    <option value="transaction">Problema de Transacción</option>
                    <option value="report">Reportar Usuario</option>
                    <option value="suggestion">Sugerencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205781] focus:border-transparent"
                    placeholder="Describe brevemente tu consulta"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205781] focus:border-transparent resize-none"
                    placeholder="Describe tu consulta o problema en detalle..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Tiempo de respuesta */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-[#205781]" />
                <div>
                  <h3 className="text-lg font-semibold text-[#205781]">Tiempo de Respuesta</h3>
                  <p className="text-gray-700">
                    Respondemos a todas las consultas dentro de <strong>24-48 horas</strong> en días hábiles.
                    Para emergencias, contáctanos por teléfono.
                  </p>
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