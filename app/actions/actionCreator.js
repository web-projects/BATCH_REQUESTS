import HttpDispatcher from '../../core/dispatchers/httpDispatcher';
import * as _ from './actionTypes';

export default class ActionCreator {
    constructor(httpDispatcher) {
        this.httpDispatcher = httpDispatcher || new HttpDispatcher();
    }

    startedDeviceDataViewerRequest() {
        return {
            type: _.DEVICE_DATA_VIEWER_LOAD_STARTED,
        };
    }

    completedDeviceDataViewerRequest(response) {
        return {
            type: _.DEVICE_DATA_VIEWER_LOAD_COMPLETED,
            response,
        };
    }

    requestError(error) {
        return {
            type: _.REQUEST_ERROR,
            error,
        };
    }

    getDeviceData(query, pageOptions) {
        const options = {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        };

        const targetUri = '/api/devices/get-all-devices';
        const self = this;

        return (dispatch) => {
            dispatch(self.startedDeviceDataViewerRequest());
            return self.httpDispatcher.processRequest(targetUri, options)
                .then((json) => {
                    dispatch(self.completedDeviceDataViewerRequest(json));
                }).catch((err) => {
                    dispatch(self.requestError(err));
                });
        };
    }

    getConnectionData() {
        const options = {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        };

        const targetUri = '/get-connection-list';

        return this.httpDispatcher.processRequest(targetUri, options)
            .then((json) => json)
            .catch((err) => null);
    }

    getExtendedDeviceData(deviceId) {
        const options = {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        };

        const targetUri = `/api/devices/get-extended-device-data/${deviceId}`;

        return this.httpDispatcher.processRequest(targetUri, options)
            .then((json) => json)
            .catch((err) => console.log(err));
    }

    getActiveUserStatData() {
        return this._makeStatApiCall('/api/stats/get-active-ipa5-users');
    }

    getRecentAppRollCallStatData() {
        return this._makeStatApiCall('/api/stats/get-recent-approllcalls');
    }

    getRecentDeviceTypesStatData() {
        return this._makeStatApiCall('/api/stats/get-recent-device-types');
    }

    getAzureServiceHealthCheckResponse(environment) {
      if (environment === 'DEV') {
        return this._makeStatApiCall('/api/stats/get-azure-service-health-checks');
      }
      // assume TEST is the target environment
      return this._makeStatApiCall('/api/stats/get-azure-service-test-health-checks');
    }

    getCompaniesSeenResponse() {
      return this._makeStatApiCall('/api/stats/get-recent-companies');
    }

    getRTTicketsSeenResponse() {
      return this._makeStatApiCall('/api/stats/get-recent-rttickets');
    }

    getUpcomingPackageDeploymentsResponse() {
      return this._makeStatApiCall('/api/stats/get-upcoming-package-deployments');
    }

    _makeStatApiCall(actionPath) {
        const options = {
            method: 'GET',
            header: {
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        };

        return this.httpDispatcher.processRequest(actionPath, options)
            .then((json) => json)
            .catch((err) => []);
    }
}
