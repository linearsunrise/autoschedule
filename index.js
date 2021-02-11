const fs = require('fs').promises;

const TIMEZONE = '+04:00';
const STARTDATE = [2021, 02, 01];
const ENDPERIOD = ''

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

function parseEvents(inputArray) {
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
			// arr[key][4] = element[4].map(el => el.toUpperCase())

			// console.log(key, element);
		}
	}

	arr.map((el) => {
		el[2] |= 0;
		el[3] |= 0;
		const dur = el[3] - 1;
		el[0] = WEEKODDEVEN[el[0]];
		el[1] = DAYOFTHEWEEK[el[1]];
		const date = [
			STARTDATE[0],
			STARTDATE[1],
			STARTDATE[2] + el[1] + (el[0] - 1) * 7,
		].map(el => el > 9 ? "" + el : "0" + el)

		el[2] = [
			el[3],
			new Date(`${date.join('-')}T${SCHEDULE[el[2]][0]}${TIMEZONE}`),
			new Date(`${date.join('-')}T${SCHEDULE[el[2] + dur][1]}${TIMEZONE}`),
		]
		el.splice(0, 2);
		el.splice(1, 1);
	})

	return arr
};

function timeStamp(str) {
	return [
		str.getYear() + 1900,
		str.getMonth()+1,
		str.getDate(),
		"T",
		str.getHours(),
		str.getMinutes(),
		str.getSeconds(),
		"Z"
	].map(el => el > 9 || typeof(el) != 'number' ? "" + el : "0" + el)
	.join("")
}

function iCalParser(arrayElement) {
	const day = {
		0: "SU",
		1: "MO",
		2: "TU",
		3: "WE",
		4: "TH",
		5: "FR",
		6: "SA"
	}
	const string = arrayElement;
	const DTSTART = timeStamp(string[0][1]);
	const DTEND = timeStamp(string[0][2]);
	const UNTIL = ENDPERIOD;
	const BYDAY = day[string[0][1].getDay()];
	const DESCRIPTION = [
		string[1][1],
		string[1][2],
		string[1][3]
	].join('\\n');
	const LOCATION = string[1][3];
	const SUMMARY = string[1][0];

	return (
`BEGIN:VEVENT
	DTSTART;TZID=Europe/Samara:${DTSTART}
	DTEND;TZID=Europe/Samara:${DTEND}
	RRULE:FREQ=WEEKLY;UNTIL=${UNTIL};INTERVAL=2;BYDAY=${BYDAY}
	DTSTAMP:20210210T202950Z
	UID:1vkos60b34dt243i4q3clnk86i@google.com
	CREATED:20180128T102236Z
	DESCRIPTION:${DESCRIPTION}
	LAST-MODIFIED:20180128T102236Z
	LOCATION:${LOCATION}
	SEQUENCE:0
	STATUS:CONFIRMED
	SUMMARY:${SUMMARY}
	TRANSP:OPAQUE
END:VEVENT
`)
}

async function readFile(filePath) {
	try {
		const data = await fs.readFile(filePath);
		let output = parseEvents(data.toString());
		output.map(el => {
			console.log(iCalParser(el))
		})

		// console.log(output);

	} catch (error) {
		console.error(`Got an error trying to read the file: ${error.message}`);
	}
};

readFile('demofile.txt')