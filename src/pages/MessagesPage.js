import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { messagesService } from '../services/messagesService';
import { userService } from '../services/userService';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MessageCircle, Send, Search, User, Clock, Plus, MoreVertical, 
  Phone, Video, Info, Smile, Paperclip, Image, X, Check, CheckCheck,
  Archive, Trash2, Star, Volume2, VolumeX, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const MessagesPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Estados principales
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  // Estados de UI
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(!isMobileView);
  
  // Suscripciones
  const [unsubscribeConversations, setUnsubscribeConversations] = useState(null);
  const [unsubscribeMessages, setUnsubscribeMessages] = useState(null);

  // Datos demo mejorados con nombres realistas
  const demoConversations = [
    {
      id: 'demo_1',
      participantName: 'Alejandro Martínez',
      participantId: 'user1',
      lastMessage: '¿El iPhone incluye cargador original y está libre de iCloud?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
      unreadCount: 2,
      productTitle: 'iPhone 14 Pro Max 256GB Space Black',
      avatar: null,
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: 'demo_2', 
      participantName: 'María Elena Rodríguez',
      participantId: 'user2',
      lastMessage: 'Perfecto, confirmo la compra. ¿Cuándo podemos coordinar la entrega? 👍',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 1),
      unreadCount: 0,
      productTitle: 'Samsung Galaxy S23 Ultra 512GB',
      avatar: null,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 'demo_3',
      participantName: 'Diego Fernández',
      participantId: 'user3', 
      lastMessage: '¿Incluye todos los cables, controles y juegos? ¿Funciona perfecto?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 8),
      unreadCount: 1,
      productTitle: 'PlayStation 5 + 2 Controles DualSense',
      avatar: null,
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: 'demo_4',
      participantName: 'Sofía Herrera',
      participantId: 'user4',
      lastMessage: 'Hola! Me interesa la MacBook. ¿Tiene algún detalle estético?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 12),
      unreadCount: 3,
      productTitle: 'MacBook Air M2 13" 256GB',
      avatar: null,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: 'demo_5',
      participantName: 'Roberto Silva',
      participantId: 'user5',
      lastMessage: '¿Aceptas intercambio por otro dispositivo más efectivo?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 0,
      productTitle: 'iPad Pro 12.9" M2 128GB',
      avatar: null,
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: 'demo_6',
      participantName: 'Valentina López',
      participantId: 'user6',
      lastMessage: 'Muchas gracias por la venta! Todo perfecto 😊',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
      unreadCount: 0,
      productTitle: 'AirPods Pro 2da Generación',
      avatar: null,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 6)
    }
  ];

  const demoMessages = {
    'demo_1': [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'Alejandro Martínez',
        message: 'Hola! Me interesa mucho el iPhone 14 Pro Max. ¿Está en perfectas condiciones? ¿Tiene algún rayón o golpe?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isMe: false,
        read: true
      },
      {
        id: '2',
        senderId: user?.uid,
        senderName: user?.displayName || 'Tú',
        message: '¡Hola Alejandro! El iPhone está impecable, solo 3 meses de uso muy cuidadoso. Viene con caja original, cargador, cable y todos los accesorios. Sin rayones ni golpes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        isMe: true,
        read: true
      },
      {
        id: '3',
        senderId: 'user1',
        senderName: 'Alejandro Martínez',
        message: 'Perfecto! ¿El cargador es el original de Apple? ¿Y está libre de iCloud?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isMe: false,
        read: true
      },
      {
        id: '4',
        senderId: user?.uid,
        senderName: user?.displayName || 'Tú',
        message: 'Sí, cargador original de Apple y completamente libre de iCloud. La batería está al 94% de salud.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        isMe: true,
        read: true
      },
      {
        id: '5',
        senderId: 'user1',
        senderName: 'Alejandro Martínez',
        message: '¿El iPhone incluye cargador original y está libre de iCloud?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isMe: false,
        read: false
      }
    ],
    'demo_2': [
      {
        id: '1',
        senderId: 'user2',
        senderName: 'María Elena Rodríguez',
        message: 'Buenas tardes! Me interesa el Samsung Galaxy S23 Ultra. ¿Cuál es el estado real del dispositivo?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        isMe: false,
        read: true
      },
      {
        id: '2',
        senderId: user?.uid,
        senderName: user?.displayName || 'Tú',
        message: 'Hola María Elena! El Galaxy está en excelente estado, 9/10. Solo tiene micro rayones normales de uso en la pantalla, pero nada que afecte la funcionalidad.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isMe: true,
        read: true
      },
      {
        id: '3',
        senderId: 'user2',
        senderName: 'María Elena Rodríguez',
        message: 'Perfecto, confirmo la compra. ¿Cuándo podemos coordinar la entrega? 👍',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
        isMe: false,
        read: false
      }
    ],
    'demo_3': [
      {
        id: '1',
        senderId: 'user3',
        senderName: 'Diego Fernández',
        message: 'Hola! Estoy interesado en la PlayStation 5. ¿Incluye todos los accesorios originales?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
        isMe: false,
        read: true
      },
      {
        id: '2',
        senderId: user?.uid,
        senderName: user?.displayName || 'Tú',
        message: 'Hola Diego! Sí, incluye todo: consola, 2 controles DualSense, cables HDMI y de poder, base, y 3 juegos físicos de regalo.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
        isMe: true,
        read: true
      },
      {
        id: '3',
        senderId: 'user3',
        senderName: 'Diego Fernández',
        message: '¿Incluye todos los cables, controles y juegos? ¿Funciona perfecto?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        isMe: false,
        read: false
      }
    ]
  };

  // Efectos
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
      handleUrlParams();
    }
    
    return () => {
      if (unsubscribeConversations) unsubscribeConversations();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [user, location]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Funciones principales
  const loadConversations = async () => {
    try {
      setLoading(true);
      
      const unsubscribe = messagesService.subscribeToConversations(
        user.uid,
        async (conversations) => {
          const enrichedConversations = await Promise.all(
            conversations.map(async (conv) => {
              const otherUserId = conv.participants.find(p => p !== user.uid);
              if (otherUserId) {
                try {
                  const otherUser = await userService.getUserById(otherUserId);
                  return {
                    ...conv,
                    participantName: otherUser?.name || 'Usuario',
                    participantId: otherUserId,
                    avatar: otherUser?.photoUrl,
                    isOnline: otherUser?.isOnline || false,
                    lastSeen: otherUser?.lastSeen || new Date()
                  };
                } catch (error) {
                  return {
                    ...conv,
                    participantName: 'Usuario',
                    participantId: otherUserId,
                    avatar: null,
                    isOnline: false,
                    lastSeen: new Date()
                  };
                }
              }
              return conv;
            })
          );
          
          setConversations(enrichedConversations);
          setLoading(false);
        }
      );
      
      setUnsubscribeConversations(() => unsubscribe);
      
      // Fallback a datos demo
      setTimeout(() => {
        if (conversations.length === 0) {
          setConversations(demoConversations);
          setLoading(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations(demoConversations);
      setLoading(false);
    }
  };

  const handleUrlParams = () => {
    const urlParams = new URLSearchParams(location.search);
    const targetUserId = urlParams.get('user');
    const targetUserName = urlParams.get('name');
    const productId = urlParams.get('product');
    const conversationId = urlParams.get('conversation');
    
    if (targetUserId && targetUserName) {
      const newConversation = {
        id: conversationId || `new_${targetUserId}`,
        participantName: decodeURIComponent(targetUserName),
        participantId: targetUserId,
        lastMessage: 'Iniciar conversación',
        lastMessageTime: new Date(),
        unreadCount: 0,
        productTitle: productId ? 'Consulta sobre producto' : 'Conversación directa',
        avatar: null,
        isOnline: false,
        lastSeen: new Date()
      };
      
      setSelectedChat(newConversation);
      setMessages([]);
      if (isMobileView) setShowSidebar(false);
      
      // Auto-abrir el formulario de contacto si es una nueva conversación
      if (!conversationId) {
        setNewMessage(`Hola, me interesa tu producto. ¿Podrías darme más información?`);
      }
    }
  };

  const selectChat = async (conversation) => {
    setSelectedChat(conversation);
    if (isMobileView) setShowSidebar(false);
    
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
    
    try {
      const unsubscribe = messagesService.subscribeToMessages(
        conversation.id,
        (messages) => {
          const processedMessages = messages.map(msg => ({
            ...msg,
            isMe: msg.senderId === user.uid,
            timestamp: msg.timestamp?.toDate() || new Date()
          }));
          setMessages(processedMessages);
        }
      );
      
      setUnsubscribeMessages(() => unsubscribe);
      await messagesService.markAsRead(conversation.id, user.uid);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages(demoMessages[conversation.id] || []);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    // Optimistic update
    const tempMessage = {
      id: `temp_${Date.now()}`,
      senderId: user.uid,
      senderName: user.displayName || user.email,
      message: messageText,
      timestamp: new Date(),
      isMe: true,
      read: false,
      sending: true
    };
    
    setMessages(prev => [...prev, tempMessage]);

    try {
      let conversationId = selectedChat.id;
      
      if (selectedChat.id.startsWith('new_')) {
        // Crear nueva conversación
        conversationId = await messagesService.createConversation(
          [user.uid, selectedChat.participantId],
          null,
          selectedChat.productTitle
        );
        
        setSelectedChat(prev => ({ ...prev, id: conversationId }));
        
        // Actualizar URL para reflejar la conversación real
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('conversation', conversationId);
        window.history.replaceState({}, '', newUrl);
      }
      
      await messagesService.sendMessage(conversationId, user.uid, user.displayName || user.email, messageText);
      
      // Remover mensaje temporal
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      
      toast.success('Mensaje enviado', {
        duration: 2000,
        style: { borderRadius: '12px', background: '#DCFCE7', color: '#166534' }
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remover mensaje temporal y mostrar error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      
      toast.error(error.message || 'Error al enviar mensaje', {
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444'
        }
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 1000 * 60) return 'Ahora';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h`;
    if (diff < 1000 * 60 * 60 * 24 * 7) return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.productTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center pt-20`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className={`w-24 h-24 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <MessageCircle className={`w-12 h-12 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Accede a tus mensajes
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Inicia sesión para ver y gestionar todas tus conversaciones
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#205781] text-white px-8 py-3 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-20 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMobileView && selectedChat && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${isDark ? 'bg-gray-700' : 'bg-[#205781]/10'} rounded-full flex items-center justify-center`}>
                  <img src={`${process.env.PUBLIC_URL}/Casse.png`} alt="Cassé" className="w-6 h-6" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Mensajes
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {conversations.length} conversaciones
                  </p>
                </div>
              </div>
            </div>
            
            {selectedChat && (
              <div className="flex items-center space-x-2">
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                  <Phone className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                  <Video className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowChatInfo(!showChatInfo)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl overflow-hidden border`} style={{ height: '75vh' }}>
          <div className="flex h-full">
            {/* Sidebar - Lista de conversaciones */}
            <div className={`${showSidebar ? 'block' : 'hidden'} ${isMobileView ? 'absolute inset-0 z-20' : 'relative'} w-full md:w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
              {isMobileView && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Conversaciones</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {/* Search */}
              <div className={`p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
                    } focus:ring-4 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#205781] mx-auto mb-4"></div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Cargando conversaciones...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => selectChat(conversation)}
                      className={`p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-all duration-200 ${
                        selectedChat?.id === conversation.id 
                          ? `${isDark ? 'bg-gray-700 border-l-4 border-l-[#71BBB2]' : 'bg-blue-50 border-l-4 border-l-[#205781]'}` 
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 ${isDark ? 'bg-gray-600' : 'bg-[#205781]/10'} rounded-full flex items-center justify-center`}>
                            {conversation.avatar ? (
                              <img src={conversation.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <User className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-[#205781]'}`} />
                            )}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                              {conversation.participantName}
                            </h3>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatTime(conversation.lastMessageTime)}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-[#205781] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1 truncate`}>
                            {conversation.productTitle}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!showSidebar || !isMobileView ? 'block' : 'hidden md:flex'}`}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-10 h-10 ${isDark ? 'bg-gray-600' : 'bg-[#205781]/10'} rounded-full flex items-center justify-center`}>
                            <User className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-[#205781]'}`} />
                          </div>
                          {selectedChat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {selectedChat.participantName}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {selectedChat.productTitle}
                            </p>
                            {selectedChat.isOnline ? (
                              <span className="text-xs text-green-500 font-medium">En línea</span>
                            ) : (
                              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Visto {formatTime(selectedChat.lastSeen)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => {
                      const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                      const showTime = index === messages.length - 1 || 
                        messages[index + 1].senderId !== message.senderId ||
                        (messages[index + 1].timestamp - message.timestamp) > 300000; // 5 minutos
                      
                      return (
                        <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {!message.isMe && showAvatar && (
                              <div className={`w-8 h-8 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <User className="w-4 h-4" />
                              </div>
                            )}
                            {!message.isMe && !showAvatar && (
                              <div className="w-8 h-8 flex-shrink-0"></div>
                            )}
                            
                            <div className={`px-4 py-2 rounded-2xl ${
                              message.isMe
                                ? 'bg-[#205781] text-white'
                                : isDark 
                                  ? 'bg-gray-700 text-gray-100'
                                  : 'bg-gray-200 text-gray-800'
                            } ${message.sending ? 'opacity-70' : ''}`}>
                              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                              {showTime && (
                                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                  message.isMe ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs">
                                    {formatMessageTime(message.timestamp)}
                                  </span>
                                  {message.isMe && (
                                    message.read ? (
                                      <CheckCheck className="w-3 h-3 text-blue-200" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {typingUsers.size > 0 && (
                      <div className="flex justify-start">
                        <div className={`px-4 py-2 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div className="flex space-x-1">
                            <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}></div>
                            <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce delay-100`}></div>
                            <div className={`w-2 h-2 ${isDark ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce delay-200`}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className={`p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} border-t`}>
                    <div className="flex items-end space-x-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                        >
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Escribe un mensaje..."
                          rows={1}
                          className={`w-full px-4 py-3 border rounded-2xl resize-none transition-all duration-200 ${
                            isDark 
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-[#71BBB2] focus:ring-[#71BBB2]/20' 
                              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-[#205781] focus:ring-[#205781]/20'
                          } focus:ring-4 focus:outline-none`}
                          style={{ minHeight: '48px', maxHeight: '120px' }}
                        />
                      </div>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="bg-[#205781] text-white p-3 rounded-full hover:bg-[#1a4a6b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                      >
                        {sendingMessage ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        // Manejar archivos adjuntos
                        console.log('File selected:', e.target.files[0]);
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className={`w-24 h-24 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <MessageCircle className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Selecciona una conversación
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                      Elige una conversación para comenzar a chatear o inicia una nueva
                    </p>
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="bg-[#205781] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a6b] transition-colors font-medium"
                    >
                      Ver conversaciones
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;