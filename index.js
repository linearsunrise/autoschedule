import EventEntity from './src/classes/events/EventEntity.js';
import {readFile, writeFile} from 'fs/promises'
import util from 'util'
import IcalEvent from './src/classes/processors/IcalEvent.js';

async function textToArray(data) {
	return data
		.split('\r\n')
		.map((string) => {
			return string
				.replace(/\t/gm, '; ')
				.trim();
		})
		.filter(Boolean)
		.filter((string) => !string.match(/(^(;\s)+|;\s$)/))
}

async function readFS(filePath) {
	try {
		const data = await readFile(filePath);
		let eventStringArray = await textToArray(data.toString());
		let events = eventStringArray.map(EventEntity.fromString)
    writeFile('./out.txt',events.map(IcalEvent.fromEventEntity).join('\n'))
	} catch (error) {
		console.error(`Got an error trying to read the file: ${error.message}`);
	}
};

readFS('./demofile.txt')