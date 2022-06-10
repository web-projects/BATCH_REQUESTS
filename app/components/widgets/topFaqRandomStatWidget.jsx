import React from 'react';
import StatWidgetContainer from './container/statWidgetContainer.jsx';

export default class TopFaqRandomStatWidget extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StatWidgetContainer title="Top 5 Random FAQ Items" phantomMode={true} />
        );
    }
}
