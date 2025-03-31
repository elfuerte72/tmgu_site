'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBox from './ChatBox';
import useChat from '@/hooks/useChat';

const ChatWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, isLoading, sendMessage, resetChat } = useChat();

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    // Сбрасываем чат, если закрываем окно
    if (isChatOpen) {
      resetChat();
    }
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="mb-4 w-full sm:w-[350px] md:w-[400px] h-[500px]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBox
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isChatOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
