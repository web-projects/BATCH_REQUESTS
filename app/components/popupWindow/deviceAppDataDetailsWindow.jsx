import React from 'react';
import ActionCreator from '../../actions/actionCreator';
import * as EventCodes from '../../eventSinkCodes';
import EventArgs from '../../eventSink/eventArgs';
import EventSinkListenerComponent from '../../eventSink/eventSinkListenerComponent.jsx';
import ProgressLoader from '../../containers/progressLoader.jsx';
import DeviceDataViewerComponent from './deviceDataViewerComponent.jsx';
import ApplicationDataViewerComponent from './applicationDataViewerComponent.jsx';
import AppRollCallDataViewerComponent from './appRollCallDataViewerComponent.jsx';

export default class DeviceAppDataDetailsWindow extends EventSinkListenerComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentDeviceId: 0,
            data: null,
            isLoading: false,
            isLoaded: false,
            isError: false,
        };
        this.actionCreator = new ActionCreator();
        this.modalDeviceDetailsId = 'modalDeviceDetailsId';
    }

    getKey() {
        return 'deviceAppDataDetailsPopupWindow';
    }

    componentDidMount() {
        global.eventSinkManager.subscribe(this.getKey(), this);

        jQuery(() => {
          $(`#${this.modalDeviceDetailsId}`).on('show.bs.modal', function (e) {
          });
      });
    }

    componentWillUnmount() {
        global.eventSinkManager.unsubscribe(this.getKey());
    }

    buildApplicationDataHeader() {
      const headerColumns = [];
      headerColumns.push({
        name: 'AppID',
        key: 'AppID',
      });
      headerColumns.push({
        name: 'CompanyID',
        key: 'CompanyID',
      });
      headerColumns.push({
        name: 'AppTypeID',
        key: 'AppTypeID',
      });
      headerColumns.push({
        name: 'RollCallOn',
        key: 'RollCallOn',
      });
      headerColumns.push({
        name: 'StatusLoggingOn',
        key: 'StatusLoggingOn',
      });
      headerColumns.push({
        name: 'AppGuid',
        key: 'AppGuid',
      });
      headerColumns.push({
        name: 'SerialNumber',
        key: 'SerialNumber',
      });
      headerColumns.push({
        name: 'ClientSystemName',
        key: 'ClientSystemName',
      });
      headerColumns.push({
        name: 'ClientID',
        key: 'ClientID',
      });
      headerColumns.push({
        name: 'FingerprintID',
        key: 'FingerprintID',
      });
      headerColumns.push({
        name: 'IPv4',
        key: 'IPv4',
      });
      headerColumns.push({
        name: 'IPv6',
        key: 'IPv6',
      });
      headerColumns.push({
        name: 'DNS',
        key: 'DNS',
      });
      headerColumns.push({
        name: 'Ordinal',
        key: 'Ordinal',
      });
      headerColumns.push({
        name: 'Active',
        key: 'Active',
      });
      headerColumns.push({
        name: 'CreatedDate',
        key: 'CreatedDate',
      });
      headerColumns.push({
        name: 'CreatedBy',
        key: 'CreatedBy',
      });
      headerColumns.push({
        name: 'UpdatedDate',
        key: 'UpdatedDate',
      });
      headerColumns.push({
        name: 'UpdatedBy',
        key: 'UpdatedBy',
      });
      headerColumns.push({
        name: 'LicenseKey',
        key: 'LicenseKey',
      });

      return headerColumns;
    }

    buildAppRollCallDataHeader() {
      const headerColumns = [];
      headerColumns.push({
        name: 'AppRollCallID',
        key: 'AppRollCallID',
      });
      headerColumns.push({
        name: 'CompanyID',
        key: 'CompanyID',
      });
      headerColumns.push({
        name: 'AppID',
        key: 'AppID',
      });
      headerColumns.push({
        name: 'Username',
        key: 'Username',
      });
      headerColumns.push({
        name: 'Active',
        key: 'Active',
      });
      headerColumns.push({
        name: 'Version',
        key: 'Version',
      });
      headerColumns.push({
        name: 'CreatedDate',
        key: 'CreatedDate',
      });
      headerColumns.push({
        name: 'CreatedBy',
        key: 'CreatedBy',
      });
      headerColumns.push({
        name: 'UpdatedDate',
        key: 'UpdatedDate',
      });
      headerColumns.push({
        name: 'UpdatedBy',
        key: 'UpdatedBy',
      });
      headerColumns.push({
        name: 'HostOS',
        key: 'HostOS',
      });

      return headerColumns;
    }

    buildDeviceDataHeader() {
      const headerColumns = [];
      headerColumns.push({
        name: 'Setting',
        key: 'Setting',
      });
      headerColumns.push({
        name: 'Value',
        key: 'Value',
      });

      return headerColumns;
    }

    render() {
        let bodyContent = null;

        if (this.state.isLoading) {
            bodyContent = (
              <ProgressLoader
                isLoading={this.state.isLoading}
                isError={this.state.isError}
              />
            );
        } else if (this.state.isError) {
            bodyContent = (
              <div className="container" style={{ height: '100%' }}>
                <div className="d-flex align-items-center justify-content-center">
                  <h1 style={{ fontSize: 'large', fontWeight: 'bold' }}>
                    There was a problem loading the data `&apos`(
                  </h1>
                </div>
              </div>
            );
        } else if (this.state.data !== null) {
          const applicationDataHeaderColumns = this.buildApplicationDataHeader();
          const appRollCallDataHeaderColumns = this.buildAppRollCallDataHeader();
          const deviceDataHeaderColumns = this.buildDeviceDataHeader();

          bodyContent = (
            <section>
              <ul className="nav nav-tabs nav-fill mb-3" id="device-data-with-icons" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="device-data-with-icons-1"
                    data-mdb-toggle="tab"
                    href="#device-data-with-icons-tabs-1"
                    role="tab"
                    aria-controls="device-data-with-icons-1"
                    aria-selected="true"
                  >
                    <i className="fa-solid fa-fingerprint" />
                    App Data
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="device-data-with-icons-2"
                    data-mdb-toggle="tab"
                    href="#device-data-with-icons-tabs-2"
                    role="tab"
                    aria-controls="device-data-with-icons-2"
                    aria-selected="false"
                  >
                    <i className="fa-solid fa-tty" />
                    Roll Call
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="device-data-with-icons-3"
                    data-mdb-toggle="tab"
                    href="#device-data-with-icons-tabs-3"
                    role="tab"
                    aria-controls="device-data-with-icons-3"
                    aria-selected="false"
                  >
                    <i className="fa-solid fa-network-wired" />
                    Device Data
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="device-data-with-icons-content">
                <div className="tab-pane fade show active" id="device-data-with-icons-tabs-1" role="tabpanel" aria-labelledby="device-data-with-icons-tab-1">
                  <ApplicationDataViewerComponent
                    data={this.state.data}
                    applicationDataHeaderColumns={applicationDataHeaderColumns}
                  />
                </div>
                <div className="tab-pane fade" id="device-data-with-icons-tabs-2" role="tabpanel" aria-labelledby="device-data-with-icons-tabs-2">
                  <AppRollCallDataViewerComponent
                    data={this.state.data}
                    appRollCallDataHeaderColumns={appRollCallDataHeaderColumns}
                  />
                </div>
                <div className="tab-pane fade" id="device-data-with-icons-tabs-3" role="tabpanel" aria-labelledby="device-data-with-icons-tabs-3">
                  <DeviceDataViewerComponent
                    data={this.state.data}
                    deviceDataHeaderColumns={deviceDataHeaderColumns}
                  />
                </div>
              </div>
            </section>
          );
        } else {
            bodyContent = (
              <div className="container" />
            );
        }

        return (
          /* <!-- Full Screen Modal --> */
          <div className="modal fade" id={this.modalDeviceDetailsId} tabIndex="-1" role="dialog" aria-labelledby={`${this.modalDeviceDetailsId}Label`} aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id={`${this.modalDeviceDetailsId}Label`}>{this.props.title}</h4>
                  <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  {bodyContent}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        );
    }

    refreshModalPane(deviceId) {
        this.actionCreator.getExtendedDeviceData(deviceId)
            .then((result) => {
                this.setState({
                    isError: false,
                    isLoading: false,
                    isLoaded: true,
                    data: result,
                });
            })
            .catch((err) => {
                this.setState({
                    isError: true,
                    isLoading: false,
                    isLoaded: false,
                    data: err,
                });
            });
    }

    displayModal() {
        $(`#${this.modalDeviceDetailsId}`).modal('show');
    }

    onEventProcedure(e) {
        switch (e.eventCode) {
            case EventCodes.EVT_DEVICE_DATA_DISPLAY_APP_DETAILS:
              this.displayModal();
              this.setState({
                  isError: false,
                  isLoading: true,
                  isLoaded: false,
                  currentDeviceId: e.eventObject,
              });
              this.refreshModalPane(e.eventObject);
                break;
            default:
                break;
        }
    }
}
