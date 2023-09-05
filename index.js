const { exec } = require('child_process');
const fs = require('fs');

const refreshRate = 100;
const activityMonitorTimer = 60000;
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
	const winPlatform = 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"';
	const otherPlatform = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';

	let prevLineData = null;
	let currentLineData = '';

	setInterval(async () => {
		try {
			const platform = process.platform;
			let command = platform === 'win32' ? winPlatform : otherPlatform;

			currentLineData = await executeCommand(command);

			if (currentLineData !== prevLineData) {
				process.stdout.write('\r' + currentLineData);
				prevLineData = currentLineData;
			}
		} catch (err) {
			console.error(`Error: ${err}`);
		}
	}, refreshRate);

	setInterval(() => {
		if (currentLineData) {
			writeToLog(currentLineData)
		}
	}, activityMonitorTimer)
}

monitor();
