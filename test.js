const EventEmitter = require('./event-emitter');

const myEmitter = new EventEmitter();

function c1() {
	console.log('an event occurred!');
}

function c2() {
	console.log('yet another event occurred!');
}

myEmitter.on('eventOne', c1);
myEmitter.on('eventOne', c2);

myEmitter.once('eventOnce', () => console.log('eventOnce once fired'));
myEmitter.once('init', () => console.log('init once fired'));

myEmitter.on('status', (code, msg) => console.log(`Got ${code} and ${msg}`));

myEmitter.emit('eventOne');
myEmitter.emit('eventOnce');
myEmitter.emit('eventOne');
myEmitter.emit('init');
myEmitter.emit('init');
myEmitter.emit('eventOne');
myEmitter.emit('status', 200, 'ok');

console.log(myEmitter.listenerCount('eventOne'));
console.log(myEmitter.rawListeners('eventOne'));

myEmitter.off('eventOne', c1);
console.log(myEmitter.listenerCount('eventOne'));
myEmitter.off('eventOne', c2);
console.log(myEmitter.listenerCount('eventOne'));
