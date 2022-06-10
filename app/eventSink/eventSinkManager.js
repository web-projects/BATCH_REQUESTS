/* eslint-disable no-cond-assign */
import GeneralUtils from '../../core/utils/generalUtils';
import EventSinkListenerComponent from './eventSinkListenerComponent.jsx';

const EventSinkState = {
    IDLE: 0,
    BUSY: 1,
};

class EventSinkManager {
    constructor() {
        this.registrationMap = new Map();
        this.subscriptionQueue = [];
        this.unsubscriptionQueue = [];
        this.state = EventSinkState.IDLE;
    }

    subscribe(key, obj) {
        if (obj instanceof EventSinkListenerComponent && !this.registrationMap.has(key)) {
            if (this.state === EventSinkState.IDLE) {
                this.registrationMap.set(key, obj);
            } else {
                this.subscriptionQueue.push(this._createQueueItem(key, obj));
            }
        }
    }

    unsubscribe(key) {
        if (this.state === EventSinkState.IDLE) {
            this.registrationMap.delete(key);
        } else {
            this.unsubscriptionQueue.push(this._createQueueItem(key));
        }
    }

    postMessage(e) {
        if (this.registrationMap.size > 0) {
            this.state = EventSinkState.BUSY;

            const keyIterator = this.registrationMap.keys();
            let currentKey = null;

            while (!GeneralUtils.isNull((currentKey = keyIterator.next().value))) {
                const subscribedComponent = this.registrationMap.get(currentKey);
                subscribedComponent.onEventProcedure(e);
            }

            this.state = EventSinkState.IDLE;

            /**
             * Everyime we post a message we immediately unwind
             * new subscribers and existing unsubscribers that were
             * pending in the middle of an operation.
             */
            this._unwindSubscriptionQueue();
            this._unwindUnsubscriptionQueue();
        }
    }

    numberOfSubscribers() {
        return this.registrationMap.size;
    }

    _createQueueItem(k, o) {
        return {
            k,
            o,
        };
    }

    _shiftEarliestQueueItem(queue) {
        return (queue && queue.length > 0) ? queue.shift() : null;
    }

    _unwindSubscriptionQueue() {
        let queueItem = null;
        while (!GeneralUtils.isNull((queueItem = this._shiftEarliestQueueItem(this.subscriptionQueue)))) {
            this.subscribe(queueItem.k, queueItem.o);
        }
    }

    _unwindUnsubscriptionQueue() {
        let queueItem = null;
        while (!GeneralUtils.isNull((queueItem = this._shiftEarliestQueueItem(this.unsubscriptionQueue)))) {
            this.unsubscribe(queueItem.k);
        }
    }
}

let globalEventSinkManager = null;
if (!global.eventSinkManager) {
    // eslint-disable-next-line no-multi-assign
    global.eventSinkManager = (globalEventSinkManager = new EventSinkManager());
} else {
    globalEventSinkManager = global.eventSinkManager;
}

module.exports = globalEventSinkManager;
