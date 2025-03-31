"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { universityData } from '../utils/universityData';

/**
 * Компонент с информацией об исследованиях
 */
const ResearchSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="research"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-blue-900 to-blue-800 text-white"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Исследования и инновации</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {universityData.research.intro}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {universityData.research.areas.map((area, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl hover:bg-white/15 transition-colors duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>
              <p className="text-blue-50">{area}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-center"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg">
            <a
              href="#"
              className="block px-6 py-3 bg-blue-800 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Узнать больше о наших исследованиях
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchSection; 