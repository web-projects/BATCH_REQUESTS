import React from 'react';
import ConnectionCanvasVisualizer from '../canvas-visualizer/connectionCanvasVisualizer.jsx';
import StatWidgetHeader from './container/statWidgetHeader.jsx';
import StatWidgetBody from './container/statWidgetBody.jsx';
import StatWidgetContainer from './container/statWidgetContainer.jsx';

export default class ConnectionVisualizerStatWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StatWidgetContainer ownerDraw={true} fluidHeight={true}>
                <StatWidgetHeader title="Connection Visualization Canvas" />
                <StatWidgetBody>
                    <ConnectionCanvasVisualizer />
                </StatWidgetBody>
            </StatWidgetContainer>
        );
    }
}
