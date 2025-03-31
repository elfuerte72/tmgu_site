import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Аудио файл не найден' },
        { status: 400 }
      );
    }

    // Конвертируем Blob в Buffer для OpenAI API
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], 'audio.webm', { type: 'audio/webm' }),
      model: 'whisper-1',
      language: 'ru',
    });

    console.log('Распознанный текст:', transcription.text);

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Ошибка при обработке аудио:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке аудио' },
      { status: 500 }
    );
  }
}
