import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/api';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import Header from '../common/Header';
import "./ChatBot.css";


export default function ChatbotComponent() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const conversationIdRef = useRef(null)


  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, conversationIdRef.current);
      conversationIdRef.current = response.conversationId;

      const allResources = [
        ...(response.internalResources ?? []).map(r => ({ label: r.title, url: r.url, description: r.description })),
        ...(response.resources ?? []),
      ];

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.reply,
        resources: allResources.length > 0 ? allResources : undefined,
      }]);

    } catch (err) {
      if (err.message === "NOT_LOGGED_IN") {
        setMessages(prev => [...prev, { role: "assistant", content: "You need to be logged in to send messages." }]);
      } else if (err.message === "UNAUTHORIZED") {
        setMessages(prev => [...prev, { role: "assistant", content: "Your session has expired. Please log in again." }]);
        navigate("/login");
      } else {
        // Show the server's own error message directly (rate limit, misconfiguration, etc.)
        setMessages(prev => [...prev, { role: "assistant", content: err.message }]);
      }

    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-blob-1" />
      <div className="chat-blob-2" />

      <Header />

      <div className="chat-container">
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 1 && (
            <div className="empty-state">
              <h2>How are you feeling today?</h2>
              <p>You can ask about support resources, coping strategies, or just talk.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                <p>{message.content}</p>
                {message.resources && message.resources.length > 0 && (
                  <div className="resource-list">
                    {message.resources.map((r, i) => (
                      <div key={i} className="resource-card">
                        <strong>{r.label}</strong>
                        <p>{r.description}</p>
                        {r.url && <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>}
                        {r.phone && <span>{r.phone}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}