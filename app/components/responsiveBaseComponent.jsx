import React from 'react';

export default class ResponsiveBaseComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    renderLoader() {
        return (
            <div className="progress-loader-component text-center">
                <div className="progress md-progress primary-color-dark">
                    <div className="indeterminate"></div>
                </div>
            </div>
        );
    }
}
