"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var excelParser_1 = require("../src/utils/excel/excelParser");
var filePath = '/Users/maximpenkin/Documents/projects/tmgy_site/data/script.xlsx';
// Запуск анализа
(0, excelParser_1.analyzeExcelFile)(filePath)
    .then(function () {
    console.log('Анализ завершен');
})
    .catch(function (error) {
    console.error('Ошибка при запуске анализа:', error);
});
