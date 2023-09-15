const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { pipeline } = require('stream');
const { Transform } = require('stream');

const csvFilePath = path.join(__dirname, './csvdirectory/csvfile.csv');
const outputFilePath = path.join(__dirname, './csvdirectory/output.txt');

const converter = csvtojson({
	noheader: true,
	headers: ['book', 'author', 'amount', 'price'],
	colParser: {
		'price': 'number', // Parse 'price' column as a number
	},
});

const readStream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
const writeStream = fs.createWriteStream(outputFilePath, { encoding: 'utf-8' });

pipeline(
	readStream,
	converter,
	transformToJsonStream(),
	writeStream,
	(error) => {
		if (error) {
			console.error('Error:', error);
		} else {
			console.log('CSV to JSON conversion complete.');
		}
	}
);

function transformToJsonStream() {
	return new Transform({
		transform(chunk, encoding, callback) {
			try {
				const jsonObj = JSON.parse(chunk);
				const output = `{"book":"${jsonObj.book}","author":"${jsonObj.author}","price":${jsonObj.price}}\n`;
				callback(null, output);
			} catch (error) {
				callback(error);
			}
		},
	});
}
