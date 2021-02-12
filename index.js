const fs = require('fs').promises;

const TIMEZONE = '+04:00';
const STARTDATE = [2021, 02, 01];
const ENDPERIOD = timeStamp(new Date('2021-06-31'))

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
				.split("; ")
				.map(word => titleCase(word))
				.map(word => {
					const regex = /Аудитория (.*?)$/;
					if (word.match(regex) !== null) {
						const match = word.match(regex)
						const result = word.replace(match[1], match[1].split("/").map(word => titleCase(word)).join(" / "));
						return result;
					};
					return word;
				});
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
			STARTDATE[2] + el[1] + (el[0] - 1) * 7 - 1,
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

function titleCase(str) {
	return str.replace(str[0], str[0].toUpperCase())
}

function timeStamp(str) {
	return str.toISOString()
		.replace(/-/g, '')
		.replace(/\:/g, '')
		.replace(/\.\d+Z$/g, 'Z')
}

function timeStampLocale(str) {
	const date = new Date(
		str.setHours(str.getHours() - new Date().getTimezoneOffset()/60)
	);
	return date.toISOString()
		.replace(/-/g, '')
		.replace(/\:/g, '')
		.replace(/\.\d+Z$/g, 'Z')
}

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, r) => ('x' == c ? (r = Math.random(new Date()) * 16 | 0) : (r & 0x3 | 0x8)).toString(16));

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
	const TIMESTAMP = timeStamp(new Date());
	const UID = `${uuid()}`;
	const TZID = "Europe/Samara";
	const DTSTART = timeStamp(string[0][1]);
	const DTEND = timeStamp(string[0][2]);
	const UNTIL = ENDPERIOD;
	const BYDAY = day[string[0][1].getDay()];
	const DESCRIPTION = [
		string[1][1],
		string[1][2],
		string[1][3]
	].join('\\n');
	const LOCATION = string[1][3].replace(/Аудитория /, "");
	const SUMMARY = `${string[1][0]}. ${string[1][1]}`;

	return (
		`BEGIN:VEVENT
DTSTART:${DTSTART}
DTEND:${DTEND}
RRULE:FREQ=WEEKLY;UNTIL=${UNTIL};INTERVAL=2;BYDAY=${BYDAY}
DTSTAMP:${TIMESTAMP}
UID:${UID}
CREATED:${TIMESTAMP}
DESCRIPTION:${DESCRIPTION}
LAST-MODIFIED:${TIMESTAMP}
LOCATION:${LOCATION}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${SUMMARY}
TRANSP:OPAQUE
END:VEVENT
`)
}

function icalWrapper(eventList) {
	return`BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:Etc/UTC
X-LIC-LOCATION:Etc/UTC
BEGIN:STANDARD
TZOFFSETFROM:+0000
TZOFFSETTO:+0000
TZNAME:GMT
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
BEGIN:VTIMEZONE
TZID:Europe/Samara
X-LIC-LOCATION:Europe/Samara
BEGIN:STANDARD
TZOFFSETFROM:+0400
TZOFFSETTO:+0400
TZNAME:+04
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
${eventList.map(event => iCalParser(event)).join('')}END:VCALENDAR`
}

async function readFile(filePath) {
	try {
		const data = await fs.readFile(filePath);
		let output = parseEvents(data.toString());
		// output.map(el => {
		// 	console.log(iCalParser(el))
		// })

		console.log(icalWrapper(output))
		// console.log(output);

	} catch (error) {
		console.error(`Got an error trying to read the file: ${error.message}`);
	}
};

readFile('demofile.txt')