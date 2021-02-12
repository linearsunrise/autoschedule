# Перевод текста в iCal

Константы:
```js
const TIMEZONE = '+04:00';
const TZID = "Europe/Samara";
const STARTDATE = [2021, 02, 01];
const ENDPERIOD = timeStamp(new Date('2021-06-31'));
```

Запуск:
```ps1
node .\index.js\ | Out-File .\output.ics
```

Задачи:
- Создать встроенный функционал создания файла, не используя пайплайн `| Out-File`
- Создать функционал изменения цикличности событий, основываясь на данных о неделях в ивенте
- Создать функционал ввода начальных данных (файлы и константы) из командной строки
- Исправить функционал создания дат: вероятно, при использовании скрипта со стартом расписания ближе к концу месяца, могут случаться коллизии дат, из-за чего события, происходящие в следующем месяце, могут оказаться в начале того же месяца