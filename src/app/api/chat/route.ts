import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai';
import { ChatMessage } from '@/utils/types';

export async function POST(request: NextRequest) {
  try {
    const { message, history, instanceId = 'default' } = await request.json();
    
    // Создаем массив сообщений для отправки в API
    const messages: ChatMessage[] = [
      // Системное сообщение теперь добавляется внутри generateChatResponse
      ...history
    ];
    
    // Добавляем сообщение пользователя
    messages.push({ role: 'user', content: message });

    const responseContent = await generateChatResponse(messages);
    
    return NextResponse.json({ 
      message: responseContent,
      instanceId
    });
  } catch (error) {
    console.error('Ошибка API чата:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
} 