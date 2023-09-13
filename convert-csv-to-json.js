const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');

const csvFilePath = path.join(__dirname, './csvdirectory/csvfile.csv');
const outputFilePath = path.join(__dirname, './csvdirectory/output.txt');

const converter = csvtojson({
	noheader: true,
	headers: ['book', 'author', 'amount', 'price'],
	colParser: {
		'price': 'number', // Parse 'price' column as a number
	},
});

const outputStream = fs.createWriteStream(outputFilePath);

converter.fromFile(csvFilePath)
.subscribe((jsonObj) => {
	const { book, author, price } = jsonObj;
	const output = `{"book":"${book}","author":"${author}","price":${price}}\n`;

	outputStream.write(output, 'utf-8');
})
.on('done', (error) => {
	if (error) {
		console.error('Error:', error);
	} else {
		console.log('CSV to JSON conversion complete.');
	}

	outputStream.end();
});
