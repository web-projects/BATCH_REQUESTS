import React from 'react';

export default class StatWidgetBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card-body">
                {this.props.children}
            </div>
        );
    }
}
