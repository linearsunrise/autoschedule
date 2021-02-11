const fs = require('fs').promises;

const SCHEDULE = [
    ["08:30", "10:05"],
    ["10:15", "11:50"],
    ["12:50", "14:25"],
    ["14:35", "16:10"],
    ["16:20", "17:55"]

]


async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath);
        let output = data.toString()
        output = output.replace(/\s+$/gm, '')
            .replace(/\u0020+/gm, ' ')
            .replace(/\t+/gm, ";\t")
            .replace(/^(.*?\;){3}\t\w$/gm, "")
            .split('\n')
            .filter(word => word.length > 0);
        output = output.map(word => word.split(";\t"));

        for (const key in output) {
            if (Object.hasOwnProperty.call(output, key)) {
                const element = output[key];
                output[key][4] = element[4]
                    .replace(/ (доцент|профессор|старший преподаватель|ассистент)/, "; $1")
                    .replace(/^(.*?) (лекция|практика|Лабораторные работы)(.*?)$/, "$2; $1$3")
                    .replace(/ (Недели:)/, "; $1")
                    .replace(/ (ауд\..*?|Спортивный зал)/, "; $1")
                    .replace(/^((.*?;){3}) (Недели:.*?); (.*?)$/, "$1 $4; $3")
                    .replace(/^(.*?); (.*?); (.*?)$/, "$2; $1; $3")
                    .replace(/ауд./, "Аудитория ")
                    .replace(/\s+/g, " ")
                    .split("; ");
                // output[key][4] = element[4].map(el => el.toUpperCase())
                console.log(
                    key,
                    element
                );
            }
        }

        console.log(output);

    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
};

readFile('demofile.txt')