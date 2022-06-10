import React from 'react';
import StatWidgetContainer from './container/statWidgetContainer.jsx';

export default class ProcessorSummaryStatWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StatWidgetContainer title="Processor Summary in past 24hrs" phantomMode={true} />
        );
    }
}
