const { exec } = require('child_process');
const fs = require('fs');

const refreshRate = 100;
const logFilePath = 'activityMonitor.log';

function executeCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout.trim());
		});
	});
}

function writeToLog(data) {
	const currentTime = new Date().getTime();
	const logEntry = `${currentTime} : ${data}\n`;

	fs.appendFile(logFilePath, logEntry, (err) => {
		if (err) {
			console.error(`Error: ${err}`);
		}
	});
}

async function monitor() {
	let prevLineData = null;

	setInterval(async () => {
		try {
			const platform = process.platform;
			let command = '';

			if (platform === 'win32') {
				command = 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"';
			} else {
				command = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
			}

			const result = await executeCommand(command);
			const currentLineData = result;

			if (currentLineData !== prevLineData) {
				process.stdout.write('\r' + currentLineData);
				prevLineData = currentLineData;
			}

			if (new Date().getSeconds() === 0) {
				writeToLog(result);
			}
		} catch (err) {
			console.error(`Error: ${err}`);
		}
	}, refreshRate);
}

monitor();
