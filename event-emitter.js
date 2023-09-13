class EventEmitter {
	constructor() {
		this.listeners = {};
	}

	addListener(eventName, fn) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(fn);
	}

	on(eventName, fn) {
		this.addListener(eventName, fn);
	}

	removeListener(eventName, fn) {
		if (this.listeners[eventName]) {
			this.listeners[eventName] = this.listeners[eventName].filter(listener => listener !== fn);
		}
	}

	off(eventName, fn) {
		this.removeListener(eventName, fn);
	}

	once(eventName, fn) {
		const onceWrapper = (...args) => {
			fn(...args);
			this.off(eventName, onceWrapper);
		};
		this.on(eventName, onceWrapper);
	}

	emit(eventName, ...args) {
		if (this.listeners[eventName]) {
			for (const listener of this.listeners[eventName]) {
				listener(...args);
			}
		}
	}

	listenerCount(eventName) {
		return this.listeners[eventName] ? this.listeners[eventName].length : 0;
	}

	rawListeners(eventName) {
		return this.listeners[eventName] || [];
	}
}

module.exports = EventEmitter;
