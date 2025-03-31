"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { universityData } from '../utils/universityData';

/**
 * Компонент с программами обучения
 */
const ProgramsSection: React.FC = () => {
  // Анимация для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section id="programs" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Академические программы</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Широкий выбор образовательных программ для студентов с разными интересами и целями
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {universityData.academicPrograms.map((program, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-blue-50 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{program.title}</h3>
              <ul className="space-y-3">
                {program.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 text-center"
        >
          <a 
            href="https://www.utmn.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Подать заявку на поступление →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection; 