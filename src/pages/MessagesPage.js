import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { messagesService } from '../services/messagesService';
import { userService } from '../services/userService';
import { MessageCircle, Send, Search, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [unsubscribeConversations, setUnsubscribeConversations] = useState(null);
  const [unsubscribeMessages, setUnsubscribeMessages] = useState(null);

  // Datos fake para demostración
  const fakeConversations = [
    {
      id: '1',
      participantName: 'Carlos Tech',
      participantId: 'user1',
      lastMessage: '¿Sigue disponible el iPhone?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 2,
      productTitle: 'iPhone 13 Pro Max',
      avatar: null
    },
    {
      id: '2',
      participantName: 'Ana Mobile',
      participantId: 'user3',
      lastMessage: 'Perfecto, nos vemos mañana',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      productTitle: 'Samsung Galaxy S23',
      avatar: null
    },
    {
      id: '3',
      participantName: 'Gaming Pro',
      participantId: 'user5',
      lastMessage: '¿Incluye los juegos?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 1,
      productTitle: 'PlayStation 5',
      avatar: null
    }
  ];

  const fakeMessages = {
    '1': [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'Carlos Tech',
        message: 'Hola, ¿sigue disponible el iPhone?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isMe: false
      },
      {
        id: '2',
        senderId: user?.uid,
        senderName: user?.displayName || 'Tú',
        message: 'Sí, está disponible. ¿Te interesa?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isMe: true
      },
      {
        id: '3',
        senderId: 'user1',
        senderName: 'Carlos Tech',
        message: '¿Podríamos vernos para revisarlo?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isMe: false
      }
    ]
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
    
    return () => {
      if (unsubscribeConversations) unsubscribeConversations();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Suscribirse a conversaciones en tiempo real
      const unsubscribe = messagesService.subscribeToConversations(
        user.uid,
        async (conversations) => {
          // Enriquecer conversaciones con datos de usuarios
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
                    avatar: otherUser?.photoUrl
                  };
                } catch (error) {
                  return {
                    ...conv,
                    participantName: 'Usuario',
                    participantId: otherUserId,
                    avatar: null
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
      
      // Si no hay conversaciones, usar datos fake como fallback
      setTimeout(() => {
        if (conversations.length === 0) {
          setConversations(fakeConversations);
          setLoading(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations(fakeConversations);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await messagesService.sendMessage(
        selectedChat.id,
        user.uid,
        user.displayName || user.email,
        newMessage
      );
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    }
  };

  const selectChat = async (conversation) => {
    setSelectedChat(conversation);
    
    // Limpiar suscripción anterior
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
    
    try {
      // Suscribirse a mensajes en tiempo real
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
      
      // Marcar mensajes como leídos
      await messagesService.markAsRead(conversation.id, user.uid);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      // Usar mensajes fake como fallback
      setMessages(fakeMessages[conversation.id] || []);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))}m`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Debes iniciar sesión
          </h2>
          <p className="text-gray-600">
            Inicia sesión para ver tus mensajes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#205781] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Mensajes</h1>
              <p className="text-blue-100 mt-1">
                {conversations.length} conversaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '70vh' }}>
          <div className="flex h-full">
            {/* Sidebar - Lista de conversaciones */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205781] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay conversaciones</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => selectChat(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-[#205781]' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-[#205781]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                              {conversation.participantName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessageTime)}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {conversation.productTitle}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
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
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#205781] bg-opacity-10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#205781]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {selectedChat.participantName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedChat.productTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.isMe
                              ? 'bg-[#205781] text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-end mt-1 space-x-1">
                            <Clock className="w-3 h-3 opacity-70" />
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#205781] focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-[#205781] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Selecciona una conversación
                    </h3>
                    <p className="text-gray-500">
                      Elige una conversación para comenzar a chatear
                    </p>
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