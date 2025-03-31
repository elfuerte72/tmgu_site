import { NextRequest, NextResponse } from 'next/server';
import { searchWeb } from '@/utils/tavily';

export async function GET(request: NextRequest) {
  try {
    // Получаем запрос и проверяем его наличие
    const searchQuery = request.nextUrl.searchParams.get('query');
    
    if (!searchQuery) {
      return NextResponse.json({ 
        success: false,
        error: 'Запрос не указан' 
      }, { status: 400 });
    }
    
    console.log('Выполняю тестовый запрос к Tavily API:', searchQuery);
    
    // Проверяем работу нашего моковского решения напрямую
    if (searchQuery.includes('поступлени')) {
      const result = await searchWeb("правила поступления в ТюмГУ 2025");
      return NextResponse.json({ 
        success: true,
        result
      });
    } else if (searchQuery.includes('новост')) {
      const result = await searchWeb("новости и события в ТюмГУ 2025");
      return NextResponse.json({ 
        success: true,
        result
      });
    } else {
      // Пробуем выполнить запрос как есть
      const result = await searchWeb(searchQuery);
      return NextResponse.json({ 
        success: true,
        result
      });
    }
  } catch (error) {
    console.error('Ошибка при тестировании Tavily API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
      },
      { status: 500 }
    );
  }
} 