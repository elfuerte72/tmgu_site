"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Компонент хедера с навигацией и логотипом
 */
const Header: React.FC = () => {
  const navItems = [
    { name: 'История', href: '#history' },
    { name: 'Программы', href: '#programs' },
    { name: 'Исследования', href: '#research' },
    { name: 'Студентам', href: '#student-life' },
    { name: 'Контакты', href: '#contacts' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link href="/" className="flex items-center">
            <span className="text-blue-800 font-bold text-xl md:text-2xl">ТюмГУ</span>
            <span className="ml-2 text-xs md:text-sm text-gray-500">с 1930 года</span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                href={item.href}
                className="text-gray-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:hidden"
        >
          <button className="text-gray-600 hover:text-blue-800 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header; 