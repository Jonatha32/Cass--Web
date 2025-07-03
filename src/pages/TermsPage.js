import React from 'react';
import { FileText, Scale, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Scale className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">Términos y Condiciones</h1>
            <p className="text-xl text-blue-100">
              Reglas claras para una comunidad segura
            </p>
            <p className="text-sm text-blue-200 mt-2">
              Última actualización: Diciembre 2024
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Aceptación */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#205781] mb-4">Aceptación de Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar Cassé, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.
            </p>
          </div>

          {/* Descripción del servicio */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Descripción del Servicio</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Cassé es una plataforma digital que facilita el intercambio y venta de dispositivos 
                electrónicos entre usuarios, promoviendo la economía circular y la reutilización tecnológica.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Permitido</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Dispositivos electrónicos funcionales</li>
                    <li>• Accesorios tecnológicos</li>
                    <li>• Componentes de computadora</li>
                    <li>• Gadgets y wearables</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-red-800">Prohibido</h3>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Productos robados o ilegales</li>
                    <li>• Dispositivos con datos personales</li>
                    <li>• Artículos peligrosos o dañados</li>
                    <li>• Falsificaciones o réplicas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Responsabilidades del usuario */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-[#205781] mr-3" />
              <h2 className="text-2xl font-bold text-[#205781]">Responsabilidades del Usuario</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cuenta y Perfil</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>Mantener la confidencialidad de tu cuenta</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado</li>
                  <li>Ser responsable de todas las actividades en tu cuenta</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Publicaciones</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Describir productos de manera precisa y honesta</li>
                  <li>Usar solo fotos reales del producto</li>
                  <li>Establecer precios justos y razonables</li>
                  <li>Cumplir con los acuerdos de intercambio</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Comunicación</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Mantener un tono respetuoso y profesional</li>
                  <li>Responder a mensajes de manera oportuna</li>
                  <li>No compartir información personal sensible</li>
                  <li>Reportar comportamientos inapropiados</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transacciones */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#205781] mb-6">Transacciones e Intercambios</h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-800">Importante</h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  Cassé facilita el contacto entre usuarios, pero no participa directamente en las transacciones. 
                  Los usuarios son responsables de sus propios intercambios.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recomendaciones de Seguridad</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Reunirse en lugares públicos y seguros</li>
                    <li>Verificar el estado del producto antes del intercambio</li>
                    <li>Usar métodos de pago seguros</li>
                    <li>Documentar el intercambio con fotos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Resolución de Disputas</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Intentar resolver directamente con el otro usuario</li>
                    <li>Contactar a soporte si es necesario</li>
                    <li>Proporcionar evidencia de la disputa</li>
                    <li>Cooperar en el proceso de mediación</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Propiedad intelectual */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#205781] mb-4">Propiedad Intelectual</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Todo el contenido de la plataforma Cassé, incluyendo diseño, logotipos, textos y código, 
                está protegido por derechos de autor y otras leyes de propiedad intelectual.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Contenido del Usuario</h3>
                <p className="text-gray-700 text-sm">
                  Al publicar contenido en Cassé, otorgas una licencia no exclusiva para usar, 
                  mostrar y distribuir ese contenido en relación con el servicio.
                </p>
              </div>
            </div>
          </div>

          {/* Limitaciones */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#205781] mb-4">Limitaciones de Responsabilidad</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Cassé se proporciona "tal como está" sin garantías de ningún tipo. No somos responsables por:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Pérdidas o daños resultantes del uso de la plataforma</li>
                <li>Disputas entre usuarios</li>
                <li>Calidad, seguridad o legalidad de los productos listados</li>
                <li>Interrupciones del servicio o errores técnicos</li>
              </ul>
            </div>
          </div>

          {/* Terminación */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#205781] mb-4">Terminación del Servicio</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nos reservamos el derecho de suspender o terminar tu cuenta si:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Violas estos términos y condiciones</li>
                <li>Participas en actividades fraudulentas o ilegales</li>
                <li>Recibes múltiples reportes de otros usuarios</li>
                <li>No respondes a nuestras comunicaciones importantes</li>
              </ul>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-gradient-to-r from-[#205781] to-[#2E7D9A] text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">¿Preguntas sobre los Términos?</h2>
            <p className="text-blue-100 mb-6">
              Si tienes dudas sobre estos términos y condiciones, no dudes en contactarnos:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email Legal</h3>
                <p className="text-blue-100">legal@casse.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Soporte</h3>
                <p className="text-blue-100">soporte@casse.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Tiempo de Respuesta</h3>
                <p className="text-blue-100">2-5 días hábiles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;