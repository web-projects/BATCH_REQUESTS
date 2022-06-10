import React from 'react';

export default class EventSinkListenerComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /* virtual */
    }

    onEventProcedure(e) {
        /* virtual */
    }

    onQueryProcedure(e) {
        /* virtual */
    }

    getKey() {
        return null;
    }
}
