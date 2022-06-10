import React from 'react';
import ActionCreator from '../../actions/actionCreator';
import StatWidgetContainer from './container/statWidgetContainer.jsx';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

const SERVICEHEALTH_MONITOR_TIME_MS = 1000 * 60 * 2;

export default class AzureAppServiceHealthCheckStatWidget extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);

        this.state = {
          data: [],
          isLoading: true,
        };

        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
      jQuery(() => {
        this._monitorServiceHealthCheckSeen();
      });
    }

    _updateServiceHealthCheckSeen() {
      this.actionCreator.getAzureServiceTestHealthCheckResponse().then((result) => {
        if (result.length > 0) {
          this.setState({
            isLoading: false,
            data: result,
          });
        }
      });
    }

    _monitorServiceHealthCheckSeen() {
      this._updateServiceHealthCheckSeen();

      const weakSelf = this;

      setInterval(() => {
          weakSelf.setState({
              isLoading: true,
          });

          weakSelf._updateServiceHealthCheckSeen();
      }, SERVICEHEALTH_MONITOR_TIME_MS);
    }

    formatServiceData() {
      const services = this.state.data;
      /**
       * Green < 100ms
       * Yellow < 500ms
       * Red > Yellow
       */
      return (
        services.map((service) => {
          let latencyColorStyle = '';

          if (service.serviceResponseTime < 100) {
            latencyColorStyle = 'fw-bold text-success';
          } else if (service.serviceResponseTime < 500) {
            latencyColorStyle = 'fw-bold text-warning';
          } else {
            latencyColorStyle = 'fw-bold text-danger';
          }

          return (
            <tr>
              <td>{service.serviceAppName}</td>
              <td>{service.serviceAppVersion}</td>
              <td className={latencyColorStyle}>{service.serviceResponseTime}</td>
              <td><i className="fa-solid fa-circle" style={{ color: service.serviceResponseCode === 200 ? 'green' : 'red' }} /></td>
            </tr>
          );
        }));
    }

    render() {
        let contents = null;

        if (this.state.isLoading) {
          contents = this.renderLoader();
        } else {
          contents = (
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Version</th>
                  <th scope="col">Response Time</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {this.formatServiceData()}
              </tbody>
            </table>
          );
        }

        return (
          <StatWidgetContainer title="App Service [TEST] Direct Health Checks">
            {contents}
          </StatWidgetContainer>
        );
    }
}
