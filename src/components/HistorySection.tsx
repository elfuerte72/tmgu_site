"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { universityData } from '../utils/universityData';

/**
 * Компонент с историческими событиями
 */
const HistorySection: React.FC = () => {
  return (
    <section id="history" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">История университета</h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            {universityData.history.intro}
          </p>
        </motion.div>

        <div className="relative">
          {/* Вертикальная линия для временной шкалы */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden md:block" />

          {universityData.history.events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`flex flex-col md:flex-row items-center mb-12 md:mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="w-full md:w-1/2 flex justify-center md:justify-end md:pr-8">
                <div className={`p-6 rounded-lg shadow-lg bg-white max-w-md transform transition-transform duration-300 hover:scale-105 ${
                  index % 2 === 0 ? 'text-right' : 'text-left'
                }`}>
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">{event.year}</h3>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              </div>

              {/* Точка на временной шкале */}
              <div className="relative flex items-center justify-center my-4 md:my-0">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 shadow-md">
                  {index + 1}
                </div>
              </div>

              <div className="w-full md:w-1/2 md:pl-8 hidden md:block" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-blue-800 font-medium mb-6">
            Сегодня — ведущий вуз России с 20+ факультетами и современной инфраструктурой.
          </p>
          <a 
            href="#programs" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
          >
            Узнать о программах
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HistorySection; 