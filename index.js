const fs = require('fs').promises;

const TIMEZONE = '+04:00';
const STARTDATE = [2021,02,01];

const SCHEDULE = {
    1: ["08:30", "10:05"],
    2: ["10:15", "11:50"],
    3: ["12:50", "14:25"],
    4: ["14:35", "16:10"],
    5: ["16:20", "17:55"]
};

const DAYOFTHEWEEK = {
    "Понедельник": 01,
    "Вторник": 02,
    "Среда": 03,
    "Четверг": 04,
    "Пятница": 05,
    "Суббота": 06
};

const WEEKODDEVEN = {
	"НЕЧЕТНАЯ НЕДЕЛЯ": 01,
	"ЧЕТНАЯ НЕДЕЛЯ": 02
}

function parseEvent(inputArray) {
	const arr = inputArray.replace(/\s+$/gm, '')
	.replace(/\u0020+/gm, ' ')
	.replace(/\t+/gm, ";\t")
	.replace(/^(.*?\;){3}\t\w$/gm, "")
	.split('\n')
	.filter(word => word.length > 0)
	.map(word => word.split(";\t"));

	for (const key in arr) {
		if (Object.hasOwnProperty.call(arr, key)) {
			const element = arr[key];
			arr[key][4] = element[4]
				.replace(/ (доцент|профессор|старший преподаватель|ассистент)/, "; $1")
				.replace(/^(.*?) (лекция|практика|Лабораторные работы)(.*?)$/, "$2; $1$3")
				.replace(/ (Недели:)/, "; $1")
				.replace(/ (ауд\..*?|Спортивный зал)/, "; $1")
				.replace(/^((.*?;){3}) (Недели:.*?); (.*?)$/, "$1 $4; $3")
				.replace(/^(.*?); (.*?); (.*?)$/, "$2; $1; $3")
				.replace(/ауд./, "Аудитория ")
				.replace(/\s+/g, " ")
				.split("; ");
			arr[key][4] = element[4].map(el => el.toUpperCase())

			// console.log(key, element);
		}
	}
	return arr
};

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath);
        let output = parseEvent(data.toString());
        
		output.map((el) => {
			el[2] |= 0;
			el[3] |= 0;
			const dur = el[3] - 1;
			el[0] = WEEKODDEVEN[el[0]];
			el[1] = DAYOFTHEWEEK[el[1]];
			const date = [
				STARTDATE[0],
				STARTDATE[1],
				STARTDATE[2] + el[1] + (el[0] - 1)*7,
			].map(el => el > 9 ? "" + el : "0" + el)

			el[2] = [
				el[3],
				new Date(`${date.join('-')}T${SCHEDULE[el[2]][0]}${TIMEZONE}`),
				new Date(`${date.join('-')}T${SCHEDULE[el[2] + dur][1]}${TIMEZONE}`),
			]
			el.splice(0,2);
			el.splice(1,1);
		})

        console.log(output);

    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
};

readFile('demofile.txt')