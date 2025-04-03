"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeExcelFile = analyzeExcelFile;
exports.parseExcelFile = parseExcelFile;
exports.createChunksFromExcel = createChunksFromExcel;
exports.createChunksFromTextFile = createChunksFromTextFile;
exports.createTopicBasedChunks = createTopicBasedChunks;
var XLSX = __importStar(require("xlsx"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var fs_2 = require("fs");
/**
 * Анализирует структуру Excel-файла и выводит информацию о листах и данных
 * @param filePath Путь к файлу Excel
 */
function analyzeExcelFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var workbook_1;
        return __generator(this, function (_a) {
            try {
                // Проверка существования файла
                if (!fs_1.default.existsSync(filePath)) {
                    throw new Error("\u0424\u0430\u0439\u043B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D: ".concat(filePath));
                }
                workbook_1 = XLSX.readFile(filePath);
                console.log("\n\u0410\u043D\u0430\u043B\u0438\u0437 \u0444\u0430\u0439\u043B\u0430: ".concat(path_1.default.basename(filePath)));
                console.log("\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043B\u0438\u0441\u0442\u043E\u0432: ".concat(workbook_1.SheetNames.length));
                console.log("\u0418\u043C\u0435\u043D\u0430 \u043B\u0438\u0441\u0442\u043E\u0432: ".concat(workbook_1.SheetNames.join(', ')));
                // Анализ каждого листа
                workbook_1.SheetNames.forEach(function (sheetName) {
                    console.log("\n--- \u041B\u0438\u0441\u0442: ".concat(sheetName, " ---"));
                    var sheet = workbook_1.Sheets[sheetName];
                    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    // Фильтрация пустых строк
                    var cleanedData = jsonData.filter(function (row) { return row.length > 0 && row.some(function (cell) { return cell !== null && cell !== ''; }); });
                    console.log("\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u0442\u0440\u043E\u043A: ".concat(cleanedData.length));
                    if (cleanedData.length > 0) {
                        console.log("\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438 (\u043F\u0435\u0440\u0432\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430): ".concat(JSON.stringify(cleanedData[0])));
                        // Проверка структуры данных
                        var firstColumn = cleanedData.map(function (row) { return row[0]; }).filter(function (cell) { return cell; });
                        console.log("\u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0432 \u043F\u0435\u0440\u0432\u043E\u043C \u0441\u0442\u043E\u043B\u0431\u0446\u0435 (\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u0435 \u0442\u0435\u043C\u044B): ".concat(JSON.stringify(__spreadArray([], new Set(firstColumn), true))));
                        // Выводим первые 3 строки для примера
                        console.log("\u041F\u0440\u0438\u043C\u0435\u0440 \u0434\u0430\u043D\u043D\u044B\u0445 (\u043F\u0435\u0440\u0432\u044B\u0435 3 \u0441\u0442\u0440\u043E\u043A\u0438):");
                        for (var i = 0; i < Math.min(3, cleanedData.length); i++) {
                            console.log("  \u0421\u0442\u0440\u043E\u043A\u0430 ".concat(i + 1, ": ").concat(JSON.stringify(cleanedData[i])));
                        }
                    }
                });
            }
            catch (error) {
                console.error('Ошибка при анализе Excel файла:', error);
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Парсит файл Excel и извлекает текстовое содержимое
 * @param filePath Путь к файлу Excel
 * @returns ExcelContent с структурированным содержимым
 */
function parseExcelFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var workbook_2, result_1;
        return __generator(this, function (_a) {
            try {
                // Проверка существования файла
                if (!fs_1.default.existsSync(filePath)) {
                    throw new Error("\u0424\u0430\u0439\u043B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D: ".concat(filePath));
                }
                workbook_2 = XLSX.readFile(filePath);
                result_1 = {
                    sheets: [],
                    text: ''
                };
                // Обработка каждого листа
                workbook_2.SheetNames.forEach(function (sheetName) {
                    var sheet = workbook_2.Sheets[sheetName];
                    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    // Фильтрация пустых строк и ячеек
                    var cleanedData = jsonData
                        .filter(function (row) { return row.length > 0 && row.some(function (cell) { return cell !== null && cell !== ''; }); })
                        .map(function (row) { return row.map(function (cell) { return (cell === null || cell === void 0 ? void 0 : cell.toString()) || ''; }); });
                    result_1.sheets.push({
                        name: sheetName,
                        data: cleanedData
                    });
                    // Формирование текста листа с учетом структуры
                    var sheetText = "## \u041B\u0438\u0441\u0442: ".concat(sheetName, "\n\n");
                    // Проверка, есть ли заголовки (первая строка)
                    if (cleanedData.length > 0) {
                        var headers = cleanedData[0];
                        // Проверяем, является ли первая строка заголовком
                        var hasHeaders = headers.some(function (header) {
                            return typeof header === 'string' &&
                                header.length > 0 &&
                                cleanedData.slice(1).some(function (row) {
                                    return row.some(function (cell) { return typeof cell === 'string' && cell.length > 0; });
                                });
                        });
                        if (hasHeaders) {
                            // Добавляем данные с заголовками
                            for (var i = 1; i < cleanedData.length; i++) {
                                var row = cleanedData[i];
                                for (var j = 0; j < Math.min(headers.length, row.length); j++) {
                                    if (row[j] && headers[j]) {
                                        sheetText += "".concat(headers[j], ": ").concat(row[j], "\n");
                                    }
                                }
                                sheetText += '\n';
                            }
                        }
                        else {
                            // Добавляем данные без заголовков
                            for (var _i = 0, cleanedData_1 = cleanedData; _i < cleanedData_1.length; _i++) {
                                var row = cleanedData_1[_i];
                                sheetText += row.filter(function (cell) { return cell; }).join(' ') + '\n';
                            }
                        }
                    }
                    result_1.text += sheetText + '\n\n';
                });
                return [2 /*return*/, result_1];
            }
            catch (error) {
                console.error('Ошибка при парсинге Excel файла:', error);
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Извлекает текст из Excel файла и разбивает его на чанки
 * @param filePath Путь к файлу Excel
 * @param chunkSize Размер чанка (в символах)
 * @param chunkOverlap Перекрытие между чанками
 * @returns Массив текстовых чанков
 */
function createChunksFromExcel(filePath_1) {
    return __awaiter(this, arguments, void 0, function (filePath, chunkSize, chunkOverlap) {
        var content, text, chunks, startIndex, endIndex, error_1;
        if (chunkSize === void 0) { chunkSize = 500; }
        if (chunkOverlap === void 0) { chunkOverlap = 100; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, parseExcelFile(filePath)];
                case 1:
                    content = _a.sent();
                    text = content.text;
                    chunks = [];
                    startIndex = 0;
                    while (startIndex < text.length) {
                        endIndex = Math.min(startIndex + chunkSize, text.length);
                        // Добавляем чанк в массив
                        chunks.push(text.slice(startIndex, endIndex));
                        // Передвигаем стартовый индекс с учетом перекрытия
                        startIndex += (chunkSize - chunkOverlap);
                        // Избегаем бесконечного цикла для коротких текстов
                        if (startIndex >= text.length)
                            break;
                    }
                    return [2 /*return*/, chunks.filter(function (chunk) { return chunk.trim().length > 0; })];
                case 2:
                    error_1 = _a.sent();
                    console.error('Ошибка при создании чанков из Excel файла:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Создает более семантически значимые чанки по темам/разделам
 * @param filePath Путь к файлу Excel
 * @returns Массив чанков, разделенных по логическим блокам
 */
/**
 * Читает текстовый файл и создает чанки для RAG
 * @param filePath Путь к текстовому файлу
 * @returns Массив чанков с метаданными
 */
function createChunksFromTextFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, sections, chunks, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Проверка существования файла
                    if (!fs_1.default.existsSync(filePath)) {
                        throw new Error("\u0424\u0430\u0439\u043B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D: ".concat(filePath));
                    }
                    return [4 /*yield*/, fs_2.promises.readFile(filePath, 'utf-8')];
                case 1:
                    content = _a.sent();
                    sections = content.split(/\n\s*\n/);
                    chunks = sections.map(function (section, index) {
                        // Определяем заголовок раздела (первая строка)
                        var lines = section.trim().split('\n');
                        var title = lines[0].trim();
                        var text = section.trim();
                        return {
                            text: text,
                            metadata: {
                                source: path_1.default.basename(filePath),
                                section: title || "\u0420\u0430\u0437\u0434\u0435\u043B ".concat(index + 1)
                            }
                        };
                    });
                    return [2 /*return*/, chunks.filter(function (chunk) { return chunk.text.length > 0; })];
                case 2:
                    error_2 = _a.sent();
                    console.error('Ошибка при чтении текстового файла:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createTopicBasedChunks(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, chunks, _loop_1, _i, _a, sheet, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, parseExcelFile(filePath)];
                case 1:
                    content = _b.sent();
                    chunks = [];
                    _loop_1 = function (sheet) {
                        // Определяем, есть ли явные заголовки или темы
                        var data = sheet.data;
                        if (data.length === 0)
                            return "continue";
                        // Проверка, являются ли первая строка заголовками
                        var possibleHeaders = data[0];
                        var hasHeaders = possibleHeaders.some(function (header) {
                            return typeof header === 'string' &&
                                header.length > 0 &&
                                data.slice(1).some(function (row) {
                                    return row.some(function (cell) { return typeof cell === 'string' && cell.length > 0; });
                                });
                        });
                        if (hasHeaders) {
                            // Группируем данные по разделам, если первый столбец содержит название темы/раздела
                            var currentTopic = '';
                            var currentChunk = '';
                            for (var i = 1; i < data.length; i++) {
                                var row = data[i];
                                // Если первый столбец заполнен, считаем его новой темой
                                if (row[0] && row[0].trim()) {
                                    // Если у нас уже есть тема и контент, сохраняем предыдущий чанк
                                    if (currentTopic && currentChunk) {
                                        chunks.push({
                                            text: "## ".concat(currentTopic, "\n").concat(currentChunk),
                                            metadata: {
                                                source: path_1.default.basename(filePath),
                                                sheet: sheet.name
                                            }
                                        });
                                    }
                                    currentTopic = row[0];
                                    currentChunk = '';
                                    // Добавляем остальные данные из строки
                                    for (var j = 1; j < Math.min(possibleHeaders.length, row.length); j++) {
                                        if (row[j] && possibleHeaders[j]) {
                                            currentChunk += "".concat(possibleHeaders[j], ": ").concat(row[j], "\n");
                                        }
                                    }
                                }
                                else {
                                    // Продолжаем добавлять данные к текущей теме
                                    for (var j = 0; j < Math.min(possibleHeaders.length, row.length); j++) {
                                        if (row[j] && possibleHeaders[j]) {
                                            currentChunk += "".concat(possibleHeaders[j], ": ").concat(row[j], "\n");
                                        }
                                    }
                                }
                                // Добавляем разделитель для лучшей читаемости
                                if (currentChunk) {
                                    currentChunk += '\n';
                                }
                            }
                            // Добавляем последний чанк
                            if (currentTopic && currentChunk) {
                                chunks.push({
                                    text: "## ".concat(currentTopic, "\n").concat(currentChunk),
                                    metadata: {
                                        source: path_1.default.basename(filePath),
                                        sheet: sheet.name
                                    }
                                });
                            }
                        }
                        else {
                            // Разбиваем по абзацам, если нет явной структуры
                            var currentChunk = '';
                            var lineCount = 0;
                            for (var _c = 0, data_1 = data; _c < data_1.length; _c++) {
                                var row = data_1[_c];
                                var rowText = row.filter(function (cell) { return cell; }).join(' ');
                                if (rowText) {
                                    currentChunk += rowText + '\n';
                                    lineCount++;
                                    // Ограничиваем чанк по количеству строк
                                    if (lineCount >= 10) {
                                        chunks.push({
                                            text: currentChunk,
                                            metadata: {
                                                source: path_1.default.basename(filePath),
                                                sheet: sheet.name
                                            }
                                        });
                                        currentChunk = '';
                                        lineCount = 0;
                                    }
                                }
                            }
                            // Добавляем последний чанк
                            if (currentChunk) {
                                chunks.push({
                                    text: currentChunk,
                                    metadata: {
                                        source: path_1.default.basename(filePath),
                                        sheet: sheet.name
                                    }
                                });
                            }
                        }
                    };
                    // Обрабатываем каждый лист как отдельный источник
                    for (_i = 0, _a = content.sheets; _i < _a.length; _i++) {
                        sheet = _a[_i];
                        _loop_1(sheet);
                    }
                    return [2 /*return*/, chunks];
                case 2:
                    error_3 = _b.sent();
                    console.error('Ошибка при создании тематических чанков из Excel файла:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
