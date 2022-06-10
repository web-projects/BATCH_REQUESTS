import React from 'react';
import StatWidgetContainer from './container/statWidgetContainer.jsx';

export default class AzureSystemStatusStatWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StatWidgetContainer title="Azure System Status (Focused)" phantomMode={true} />
        );
    }
}
