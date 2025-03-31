import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Текст не найден' },
        { status: 400 }
      );
    }

    console.log('Генерация речи для текста:', text);

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'shimmer', // Используем более естественный голос
      input: text,
      speed: 1.0,
    });

    // Конвертируем в ArrayBuffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    console.log('Аудио успешно сгенерировано');

    // Возвращаем аудио как stream
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Ошибка при создании аудио:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании аудио' },
      { status: 500 }
    );
  }
}
