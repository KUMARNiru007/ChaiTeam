import React, { useState } from 'react';

const GroupPage = () => {
  const [message, setMessage] = useState('');
  
  // Sample group data
  const groupData = {
    id: 1,
    name: "React Masters",
    description: "Focused on advanced React patterns and state management",
    members: [
      { id: 1, name: "John Smith", role: "Leader", avatar: "JS" },
      { id: 2, name: "Alice Johnson", role: "Member", avatar: "AJ" },
      { id: 3, name: "Bob Chen", role: "Member", avatar: "BC" }
    ],
    batchName: "Full Stack Web Development"
  };

  // Sample messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Smith",
      senderAvatar: "JS",
      content: "Welcome everyone to React Masters! Let's start by discussing our project goals.",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "Alice Johnson", 
      senderAvatar: "AJ",
      content: "Thanks John! I'm excited to work on advanced React patterns. Should we start with custom hooks?",
      timestamp: "10:32 AM",
      isOwn: false
    },
    {
      id: 3,
      sender: "You",
      senderAvatar: "YU",
      content: "Great idea! I've been working with useReducer lately and would love to share some patterns.",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: 4,
      sender: "Bob Chen",
      senderAvatar: "BC", 
      content: "Perfect! I have some questions about context optimization too.",
      timestamp: "10:37 AM",
      isOwn: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        senderAvatar: "YU",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #404040',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '1.25rem',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#404040'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0,
              color: '#ffffff'
            }}>
              {groupData.name}
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#b3b3b3',
              margin: '0.25rem 0 0 0'
            }}>
              {groupData.batchName} • {groupData.members.length} members
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Group Info Button */}
          <button style={{
            backgroundColor: 'transparent',
            border: '1px solid #404040',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#525252';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#404040';
            e.currentTarget.style.color = '#b3b3b3';
          }}
          >
            <i className="ri-information-line"></i>
            Group Info
          </button>

          {/* Members Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
            {groupData.members.slice(0, 3).map((member, index) => (
              <div key={member.id} style={{
                width: '32px',
                height: '32px',
                backgroundColor: member.role === 'Leader' ? '#ffa116' : '#525252',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500',
                marginLeft: index > 0 ? '-0.5rem' : '0',
                border: '2px solid #2d2d2d',
                position: 'relative',
                zIndex: groupData.members.length - index
              }}>
                {member.avatar}
              </div>
            ))}
            {groupData.members.length > 3 && (
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#404040',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                marginLeft: '-0.5rem',
                border: '2px solid #2d2d2d'
              }}>
                +{groupData.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        padding: '1rem 2rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            {!msg.isOwn && (
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: msg.sender === 'John Smith' ? '#ffa116' : '#525252',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                flexShrink: 0
              }}>
                {msg.senderAvatar}
              </div>
            )}
            
            <div style={{
              maxWidth: '70%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.isOwn ? 'flex-end' : 'flex-start'
            }}>
              {!msg.isOwn && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#b3b3b3',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>{msg.sender}</span>
                  {msg.sender === 'John Smith' && (
                    <span style={{
                      backgroundColor: '#ffa116',
                      color: '#ffffff',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      Leader
                    </span>
                  )}
                </div>
              )}
              
              <div style={{
                backgroundColor: msg.isOwn ? '#ffa116' : '#2d2d2d',
                color: msg.isOwn ? '#ffffff' : '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                border: msg.isOwn ? 'none' : '1px solid #404040'
              }}>
                {msg.content}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: '#8c8c8c',
                marginTop: '0.25rem'
              }}>
                {msg.timestamp}
              </div>
            </div>

            {msg.isOwn && (
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ffa116',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                flexShrink: 0
              }}>
                {msg.senderAvatar}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div style={{
        backgroundColor: '#2d2d2d',
        borderTop: '1px solid #404040',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Attachment Button */}
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#b3b3b3',
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: '0.5rem',
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#404040';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#b3b3b3';
        }}
        >
          <i className="ri-attachment-line"></i>
        </button>

        {/* Message Input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #404040',
              borderRadius: '1.5rem',
              color: '#ffffff',
              fontSize: '0.875rem',
              padding: '0.75rem 3rem 0.75rem 1rem',
              width: '100%',
              minHeight: '40px',
              maxHeight: '120px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
            rows={1}
          />
          
          {/* Emoji Button */}
          <button style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '1.125rem',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}
          >
            <i className="ri-emotion-line"></i>
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          style={{
            backgroundColor: message.trim() ? '#ffa116' : '#404040',
            border: 'none',
            color: '#ffffff',
            cursor: message.trim() ? 'pointer' : 'not-allowed',
            fontSize: '1.125rem',
            padding: '0.75rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            width: '44px',
            height: '44px'
          }}
          onMouseEnter={(e) => {
            if (message.trim()) {
              e.currentTarget.style.backgroundColor = '#e6940f';
            }
          }}
          onMouseLeave={(e) => {
            if (message.trim()) {
              e.currentTarget.style.backgroundColor = '#ffa116';
            }
          }}
        >
          <i className="ri-send-plane-line"></i>
        </button>
      </div>
    </div>
  );
};

export default GroupPage;