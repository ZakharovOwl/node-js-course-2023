const EventEmitter = require('./event-emitter');
const https = require('https');

class WithTime extends EventEmitter {
	execute(asyncFunc, ...args) {
		this.emit('begin');
		console.time('execute');

		try {
			asyncFunc(...args, (error, data) => {
				if (error) {
					this.emit('error', error);
				} else {
					this.emit('data', data);
				}
				console.timeEnd('execute');
				this.emit('end');
			});
		} catch (error) {
			this.emit('error', error);
			this.emit('end');
		}
	}
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));
withTime.on('data', (data) => console.log('Data received:', data));
withTime.on('error', (error) => console.error('Error:', error));

console.log(withTime.rawListeners('end'));

async function fn(...args) {
	const options = {
		hostname: 'jsonplaceholder.typicode.com',
		path: '/posts/1',
		method: 'GET',
	};

	const req = https.request(options, (res) => {
		let data = '';

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			try {
				const jsonData = JSON.parse(data);
				args[1](null, jsonData);
			} catch (error) {
				args[1](error);
			}
		});
	});

	req.on('error', (error) => {
		args[1](error);
	});

	req.end();
}

withTime.execute(fn, null);
