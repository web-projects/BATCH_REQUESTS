import React from 'react';
import StatWidgetContainer from './container/statWidgetContainer.jsx';

export default class PreviousPackageDeploymentsStatWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StatWidgetContainer title="Previous Package Deployments" phantomMode={true} />
        );
    }
}
