import React, { Component } from 'react';
import * as _ from 'underscore';
import ActionCreator from '../../actions/actionCreator';
import EventSinkManager from '../../eventSink/eventSinkManager';
import * as EventCodes from '../../eventSinkCodes';
import EventArgs from '../../eventSink/eventArgs';
import ResponsiveDataViewerComponent from '../../components/tables/responsiveDataViewerComponent.jsx';
import DeviceAppDataDetailsWindow from '../../components/popupWindow/deviceAppDataDetailsWindow.jsx';

export default class DeviceDataViewerPageItem extends Component {
    constructor(props) {
        super(props);
        this.dispatchPtr = null;
        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
        this.dispatchPtr = this.props.dispatch;
        this.actionCreator.getDeviceData('', null)(this.dispatchPtr);
    }

    onXrefLinkShow(id) {
        global.eventSinkManager.postMessage(new EventArgs(EventCodes.EVT_DEVICE_DATA_DISPLAY_APP_DETAILS, id));
    }

    render() {
        // Create the header columns for the data we would like to display. {name, key}
        const headerColumns = [];
        headerColumns.push({
            label: 'CompanyId',
            field: 'CompanyID',
            sort: true,
        });
        headerColumns.push({
            label: 'SerialNumber',
            field: 'SerialNumber',
            sort: true,
        });
        headerColumns.push({
            label: 'FirmwareVersion',
            field: 'FirmwareVersion',
            sort: true,
        });
        headerColumns.push({
            label: 'Device Branding',
            field: 'DeviceBranding',
            sort: true,
        });
        headerColumns.push({
            label: 'Debit',
            field: 'Debit',
            sort: true,
        });
        headerColumns.push({
            label: 'P2PEEnabled',
            field: 'P2PEEnabled',
            sort: true,
        });
        headerColumns.push({
            label: 'IsEMVCapable',
            field: 'IsEMVCapable',
            sort: true,
        });
        headerColumns.push({
            label: 'User',
            field: 'CreatedBy',
            sort: true,
        });
        headerColumns.push({
            label: 'CreationDate',
            field: 'CreatedDate',
            sort: true,
        });
        headerColumns.push({
            label: 'XRef',
            field: 'DeviceID',
            sort: false,
        });
        headerColumns.push({
            label: 'Tags',
            field: 'VipaPackageTag',
            sort: false,
        });

        const fieldTypesMap = new Map();
        fieldTypesMap.set('DeviceID', {
            type: 'link',
            callback: (id) => this.onXrefLinkShow(id),
        });

        return (
            <section>
              <ResponsiveDataViewerComponent
                fetching={this.props.fetching}
                isLoaded={this.props.isLoaded}
                data={this.props.data}
                headerColumns={headerColumns}
                defaultSortField="creationDate"
                customFieldTypes={fieldTypesMap}
              />
              <DeviceAppDataDetailsWindow title="Device Details" />
            </section>
        );
    }
}
