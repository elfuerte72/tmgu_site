"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { universityData } from '../utils/universityData';

/**
 * Компонент с информацией о студенческой жизни
 */
const StudentLifeSection: React.FC = () => {
  return (
    <section id="student-life" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Студенческая жизнь</h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            {universityData.studentLife.intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {universityData.studentLife.facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-700" />
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 text-2xl font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{fact}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="text-lg text-blue-800 mb-8 max-w-3xl mx-auto">
            <p>Университетская жизнь — это не только учеба. Это возможность раскрыть свой потенциал в спорте, творчестве и науке.</p>
          </div>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {["Спортивные секции", "Творческие студии", "Научные клубы", "Волонтерство", "Международные обмены"].map((activity, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1 },
                }}
                className="px-4 py-2 bg-white text-blue-800 rounded-full shadow-md text-sm font-medium"
              >
                {activity}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentLifeSection; 