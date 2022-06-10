/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import DeviceDataViewerPageItem from '../containers/devices/deviceDataViewerPageItem.jsx';
import MasterPageLayout from './masterPageLayout.jsx';

class DeviceDataViewerPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MasterPageLayout pageTitle="Device Data Viewer" isFluid={true}>
                <DeviceDataViewerPageItem
                    dispatch={this.props.dispatch}
                    isLoaded={this.props.isLoaded}
                    fetching={this.props.fetching}
                    error={this.props.error}
                    data={this.props.data}
                    deviceId={this.props.match.params.id || ""} />
            </MasterPageLayout>
        );
    }
}

DeviceDataViewerPage.PropType = {
    fetching: PropTypes.bool,
    isLoaded: PropTypes.bool,
    error: PropTypes.bool,
    data: PropTypes.array,
};

const mapStateToProps = (state) => ({
        fetching: state.deviceDataViewerReducer.fetching,
        isLoaded: state.deviceDataViewerReducer.isLoaded,
        error: state.deviceDataViewerReducer.error,
        data: state.deviceDataViewerReducer.data,
    });

const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

const DeviceDataViewerPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DeviceDataViewerPage);

export default DeviceDataViewerPageContainer;
