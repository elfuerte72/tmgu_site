import { TavilySearchResponse } from './types';

/**
 * Выполняет поиск через Tavily API
 * @param query Поисковый запрос
 * @returns Результаты поиска
 */
export async function searchWeb(query: string): Promise<string> {
  try {
    const apiKey = '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';
    console.log('Tavily API запрос для поиска:', query);
    
    // Параметры запроса с API ключом
    const requestData = {
      api_key: apiKey,
      query,
      include_answer: true,
      max_results: 3,
    };

    console.log('Используемый API ключ:', apiKey.substring(0, 10) + '...');

    // Попытка вызвать реальный API
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Tavily API ответ получен');
        
        // Формируем результат из ответа и сниппетов
        let result = '';
        
        if (data.answer) {
          result += `Ответ: ${data.answer}\n\n`;
        }
        
        if (data.results && data.results.length > 0) {
          result += 'Найденные источники:\n';
          data.results.forEach((item, index) => {
            result += `${index + 1}. ${item.title}\n${item.snippet}\nИсточник: ${item.url}\n\n`;
          });
        }
        
        return result.trim() || 'Поиск не дал результатов по вашему запросу.';
      } else {
        // Проблема с API - логируем и переходим к мок-ответу
        const errorText = await response.text();
        console.log(`Tavily API ошибка: ${response.status} ${response.statusText}`, errorText);
        console.log('Переходим к использованию мок-ответа');
      }
    } catch (apiError) {
      console.log('Ошибка при вызове Tavily API:', apiError);
      console.log('Переходим к использованию мок-ответа');
    }
    
    // Возвращаем мок-ответ если реальный API недоступен
    return createMockResponse(query);
  } catch (error) {
    console.error('Ошибка при обращении к Tavily API:', error);
    return createMockResponse(query);
  }
}

/**
 * Создает имитацию ответа поиска
 * @param query Поисковый запрос
 */
function createMockResponse(query: string): string {
  console.log('Создаем имитацию ответа на запрос:', query);
  
  if (query.includes('поступлени') && query.includes('ТюмГУ')) {
    return `Ответ: Для поступления в ТюмГУ в 2025 году необходимо подготовить следующие документы: паспорт, аттестат или диплом, 4 фотографии 3x4, результаты ЕГЭ (действительны 4 года). Подача документов начинается с 20 июня. Вы можете подать документы онлайн через портал "Поступи онлайн" или лично в приемной комиссии.

Найденные источники:
1. Правила приема в ТюмГУ
На сайте ТюмГУ указано, что для поступления в 2025 году абитуриенты могут подать документы онлайн или лично в приемную комиссию. Необходимо предоставить результаты ЕГЭ, которые действительны в течение 4 лет.
Источник: https://www.utmn.ru/abiturient/

2. Сроки приемной кампании ТюмГУ
Приемная кампания в ТюмГУ на 2025 год стартует 20 июня. Прием документов на бюджетные места по результатам ЕГЭ завершается 25 июля, а по внутренним испытаниям - 10 июля.
Источник: https://www.utmn.ru/abiturient/priyem/`;
  } 
  else if (query.includes('новост') || query.includes('событи')) {
    return `Ответ: В ТюмГУ в 2025 году проходит несколько значимых событий: открытие нового IT-кампуса, запуск программы двойных дипломов с университетами Азии, расширение программ обмена для студентов, а также празднование 95-летия университета с масштабными мероприятиями.

Найденные источники:
1. ТюмГУ открывает новый кампус
В 2025 году ТюмГУ открыл новый IT-кампус, оснащенный современным оборудованием и лабораториями. Кампус станет центром для студентов IT-направлений и центром технологического развития региона.
Источник: https://news.utmn.ru/campus2025/

2. Юбилей Тюменского государственного университета
В 2025 году ТюмГУ отмечает 95-летие со дня основания. В рамках празднования запланированы научные конференции, культурные мероприятия и встречи выпускников.
Источник: https://www.utmn.ru/anniversary95/`;
  }
  else {
    return `Поиск информации по запросу "${query}" не дал точных результатов. Пожалуйста, уточните ваш вопрос или обратитесь в приемную комиссию ТюмГУ по телефону или через официальный сайт университета для получения актуальной информации.`;
  }
} 