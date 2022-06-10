import React from 'react';

export default class StatWidgetHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let bodyContainer = null;

        if (this.props.title) {
            bodyContainer = this.props.title;
        } else {
            bodyContainer = this.props.children;
        }

        return (
            <div className="card-header bg-dark text-white">
                {bodyContainer}
            </div>
        );
    }
}
