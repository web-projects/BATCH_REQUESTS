import React from 'react';

export default class StatWidgetFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card-footer">
                {this.props.children}
            </div>
        );
    }
}
