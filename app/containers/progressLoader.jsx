import React from 'react';

export default class ProgressLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let element = null;
        if (this.props.isLoading && !this.props.isError) {
            element = (
                <div className="container center-all">
                    <div className="row justify-content-center">
                        <div className="col">
                            <div className="progress">
                                <div className="indeterminate"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {element}
            </div>
        );
    }
}
