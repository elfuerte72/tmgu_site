import { Variants } from 'framer-motion';

/**
 * Предустановленные варианты анимаций для компонентов с использованием Framer Motion
 */

/**
 * Анимация появления с затуханием
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6
    }
  }
};

/**
 * Анимация появления снизу
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6
    }
  }
};

/**
 * Анимация появления слева
 */
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6
    }
  }
};

/**
 * Анимация появления справа
 */
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6
    }
  }
};

/**
 * Анимация с задержкой для дочерних элементов
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

/**
 * Анимация для дочерних элементов в контейнере
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5
    }
  },
};

/**
 * Анимация для карточек при наведении
 */
export const hoverCardVariants: Variants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

/**
 * Пульсирующая анимация
 */
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

/**
 * Анимация для кнопок при нажатии
 */
export const buttonTapVariants: Variants = {
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}; 