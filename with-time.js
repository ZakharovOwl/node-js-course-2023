const EventEmitter = require('./event-emitter');
const https = require('https');

class WithTime extends EventEmitter {
	async execute() {
		this.emit('begin');
		console.time('execute');

		try {
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
						this.emit('data', jsonData);
					} catch (error) {
						this.emit('error', error);
					}
					console.timeEnd('execute');
					this.emit('end');
				});
			});

			req.on('error', (error) => {
				this.emit('error', error);
				this.emit('end');
			});

			req.end();
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

console.log(withTime.rawListeners("end"));

withTime.execute();
