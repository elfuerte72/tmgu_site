"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { universityData } from '../utils/universityData';
import HeroChatBot from './HeroChatBot';

/**
 * Герой-секция с текстовым контентом и чат-ботом
 */
const HeroSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section className="min-h-screen pt-24 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-sky-50">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-full bg-pattern-grid opacity-[0.03] z-0" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-200/20 to-sky-300/20 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-200/20 to-blue-300/20 blur-3xl animate-float-delay" />
      
      <motion.div 
        className="container mx-auto px-4 py-12 md:py-24 z-10 flex flex-col md:flex-row items-center"
        style={{ opacity, scale }}
      >
        <motion.div 
          className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-sky-900 mb-4 gradient-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {universityData.name}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-sky-700 mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {universityData.motto}
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <a 
              href="#programs" 
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-1"
            >
              Программы обучения
            </a>
            <a 
              href="#history" 
              className="px-8 py-3 bg-white text-sky-800 rounded-xl font-medium hover:bg-sky-50 transition-all duration-300 border border-sky-200 shadow-sm hover:shadow-md"
            >
              Узнать больше
            </a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 h-[400px] md:h-[450px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Чат-бот вместо логотипа университета */}
          <HeroChatBot className="static transform-none" />
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <a href="#history" className="text-sky-500 flex flex-col items-center group">
            <span className="mb-2 group-hover:text-sky-700 transition-colors duration-300">Прокрутите вниз</span>
            <motion.svg 
              className="w-6 h-6 group-hover:text-sky-700 transition-colors duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 