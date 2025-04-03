// initialize-rag.mjs - ESM-совместимый скрипт для инициализации RAG
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Запуск Next.js в режиме разработки с флагом запуска RAG инициализации
async function main() {
  console.log('Запуск скрипта инициализации RAG...');
  
  try {
    console.log('Копирование Excel файла в директорию data...');
    await execAsync(`cp "${join(projectRoot, 'Скрипт 20.01.2025 (1).xlsx')}" "${join(projectRoot, 'data', 'script.xlsx')}"`, { cwd: projectRoot });
    console.log('Файл успешно скопирован');
    
    console.log('Запуск Next.js с флагом инициализации RAG...');
    console.log('Это запустит разработческий сервер и выполнит инициализацию...');
    
    // Запускаем Next.js с переменной окружения для инициализации RAG
    const nextProcess = exec('INIT_RAG=true npm run dev', { cwd: projectRoot });
    
    nextProcess.stdout.on('data', (data) => {
      console.log(data);
      // Ищем сообщение об успешной инициализации
      if (data.includes('RAG-система успешно инициализирована')) {
        console.log('===============================');
        console.log('Инициализация RAG завершена успешно!');
        console.log('Вы можете остановить этот процесс (Ctrl+C) и запустить обычный сервер разработки командой npm run dev');
      }
    });
    
    nextProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    nextProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`Процесс завершился с кодом ${code}`);
      }
    });
    
  } catch (error) {
    console.error('Ошибка при выполнении скрипта инициализации:', error);
    process.exit(1);
  }
}

// Запуск скрипта
main();
