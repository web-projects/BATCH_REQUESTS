import React from 'react';
import StatWidgetContainer from './container/statWidgetContainer.jsx';

export default class AzureAppInsightsStatWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StatWidgetContainer title="App Insights Monitoring" phantomMode={true} />
        );
    }
}
