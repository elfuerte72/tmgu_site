"use client";

import { useState, useEffect, RefObject } from 'react';

/**
 * Хук для определения, находится ли элемент в видимой части экрана при скролле
 * @param ref - ссылка на DOM элемент
 * @param threshold - порог видимости (0-1), по умолчанию 0.1
 * @param rootMargin - отступ от корневого элемента, по умолчанию "0px"
 * @returns isInView - булево значение, true если элемент в поле зрения
 */
export const useScrollAnimation = (
  ref: RefObject<HTMLElement>,
  threshold: number = 0.1,
  rootMargin: string = '0px'
): boolean => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Обновляем состояние на основе видимости
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // Если элемент уже увидели, можно отключить наблюдение
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: null, // используем viewport как корневой элемент
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Очистка при размонтировании
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold, rootMargin]);

  return isInView;
};

export default useScrollAnimation; 