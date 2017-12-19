export class Stream {
    constructor(initialValue) {
        this._value = initialValue;
        this._listeners = [];
    }

    get value() {
        return this._value;
    }

    subscribe(listener) {
        this._listeners.push(listener);
        listener(this.value);
    }

    unsubscribe(listener) {
        const newListeners = this._listeners.filter(listenerInList => listenerInList !== listener);

        if (newListeners.length === this._listeners.length) {
            throw new Error("Listener was not subscribed");
        }

        this._listeners = newListeners;
    }

    set(value) {
        this._value = value;
        this._listeners.forEach(listener => listener(value));
    }
}