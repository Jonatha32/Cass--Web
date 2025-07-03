import React from 'react';
import { Shield, Eye, Lock, Users, Database, Globe } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
            <p className="text-xl text-blue-100">
              Tu privacidad es nuestra prioridad
            </p>
            <p className="text-sm text-blue-200 mt-2">
              Última actualización: Diciembre 2024
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Introducción */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#205781] mb-4">Introducción</h2>
            <p className="text-gray-700 leading-relaxed">
              En Cassé, nos comprometemos a proteger tu privacidad y datos personales. Esta política 
              explica cómo recopilamos, usamos, compartimos y protegemos tu información cuando utilizas 
              nuestra plataforma de intercambio de dispositivos electrónicos.
            </p>
          </div>

          {/* Información que recopilamos */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Información que Recopilamos</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Personal</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Nombre completo y dirección de correo electrónico</li>
                  <li>Número de teléfono (opcional)</li>
                  <li>Ubicación geográfica (ciudad/región)</li>
                  <li>Foto de perfil (opcional)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de Productos</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Descripciones y fotos de productos publicados</li>
                  <li>Precios y condiciones de intercambio</li>
                  <li>Historial de transacciones</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Técnica</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Dirección IP y datos de navegación</li>
                  <li>Tipo de dispositivo y sistema operativo</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cómo usamos tu información */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Cómo Usamos tu Información</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Servicios Principales</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Facilitar intercambios entre usuarios</li>
                  <li>Verificar identidad y prevenir fraudes</li>
                  <li>Proporcionar soporte al cliente</li>
                  <li>Mejorar la experiencia del usuario</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Comunicaciones</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Notificaciones sobre transacciones</li>
                  <li>Actualizaciones de productos</li>
                  <li>Mensajes de seguridad importantes</li>
                  <li>Newsletter (con tu consentimiento)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compartir información */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Compartir Información</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>No vendemos</strong> tu información personal a terceros. Solo compartimos datos en estas situaciones:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Con otros usuarios:</strong> Información necesaria para completar transacciones</li>
                <li><strong>Proveedores de servicios:</strong> Para procesamiento de pagos y hosting</li>
                <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley</li>
                <li><strong>Protección:</strong> Para prevenir fraudes o actividades ilegales</li>
              </ul>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Seguridad de Datos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Medidas Técnicas</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Encriptación SSL/TLS</li>
                  <li>Autenticación de dos factores</li>
                  <li>Monitoreo de seguridad 24/7</li>
                  <li>Copias de seguridad regulares</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Medidas Organizacionales</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Acceso limitado a datos personales</li>
                  <li>Capacitación en privacidad</li>
                  <li>Auditorías de seguridad regulares</li>
                  <li>Políticas de retención de datos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tus derechos */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Tus Derechos</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Tienes derecho a:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Acceso</h4>
                  <p className="text-sm text-gray-600">Solicitar una copia de tus datos personales</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Rectificación</h4>
                  <p className="text-sm text-gray-600">Corregir información inexacta o incompleta</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Eliminación</h4>
                  <p className="text-sm text-gray-600">Solicitar la eliminación de tus datos</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Portabilidad</h4>
                  <p className="text-sm text-gray-600">Transferir tus datos a otro servicio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">¿Preguntas sobre Privacidad?</h2>
            <p className="text-blue-100 mb-6">
              Si tienes dudas sobre esta política o quieres ejercer tus derechos, contáctanos:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-blue-100">privacidad@casse.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Respuesta</h3>
                <p className="text-blue-100">Dentro de 30 días hábiles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;