"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { universityData } from '../utils/universityData';

/**
 * Компонент с контактной информацией
 */
const ContactsSection: React.FC = () => {
  // Анимация для элементов контактов
  const contactItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section id="contacts" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Контактная информация</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Свяжитесь с нами для получения дополнительной информации
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-blue-50 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Наши контакты</h3>
            
            <motion.div 
              custom={0}
              variants={contactItemVariants}
              className="flex items-start mb-6"
            >
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-blue-900 mb-1">Адрес</h4>
                <p className="text-gray-700">{universityData.contacts.address}</p>
              </div>
            </motion.div>
            
            <motion.div 
              custom={1}
              variants={contactItemVariants}
              className="flex items-start mb-6"
            >
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-blue-900 mb-1">Телефон</h4>
                <p className="text-gray-700">{universityData.contacts.phone}</p>
              </div>
            </motion.div>
            
            <motion.div 
              custom={2}
              variants={contactItemVariants}
              className="flex items-start mb-6"
            >
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-blue-900 mb-1">Email</h4>
                <p className="text-gray-700">{universityData.contacts.email}</p>
              </div>
            </motion.div>
            
            <motion.div 
              custom={3}
              variants={contactItemVariants}
            >
              <h4 className="text-lg font-medium text-blue-900 mb-3">Социальные сети</h4>
              <div className="flex gap-3">
                {universityData.contacts.social.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white p-3 rounded-full transition-colors duration-300 shadow"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-blue-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-800 rounded-full -mr-20 -mt-20" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">Обратная связь</h3>
              <p className="mb-6 text-blue-100">Если у вас возникли вопросы или предложения, заполните форму, и мы обязательно ответим вам в ближайшее время.</p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-blue-100 mb-2" htmlFor="name">Имя</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-blue-100 mb-2" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Введите ваш email"
                  />
                </div>
                <div>
                  <label className="block text-blue-100 mb-2" htmlFor="message">Сообщение</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Введите ваше сообщение"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white text-blue-800 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300"
                >
                  Отправить
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection; 