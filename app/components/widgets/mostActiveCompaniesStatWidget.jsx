import React from 'react';
import ActionCreator from '../../actions/actionCreator';
import StatWidgetContainer from './container/statWidgetContainer.jsx';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

const ACTIVECOMPANIES_MONITOR_TIME_MS = 1000 * 60 * 2;

export default class MostActiveCompaniesStatWidget extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);

        this.chartId = 'activeCompanies-bar-chart';
        this.state = {
          data: [],
          isLoading: true,
        };

        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
      jQuery(() => {
        this._monitorActiveCompaniesSeen();
      });
    }

    componentDidUpdate() {
      if (!this.state.isLoading) {
          this._initializeChart();
      }
    }

    _initializeChart() {
      const horizontalBarChartConfig = {
          type: 'bar',
          data: {
              labels: this.state.data.map((obj) => obj['CompanyID']),
              datasets: [
                  {
                      label: 'Companies',
                      data: this.state.data.map((obj) => obj['Count']),
                  },
              ],
          },
      };

      const horizontalBarChartOptions = {
          options: {
              indexAxis: 'y',
              scales: {
                  x: {
                      stacked: true,
                      grid: {
                          display: true,
                          borderDash: [2],
                          zeroLineColor: 'rgba(0, 0, 0, 0)',
                          zeroLineBorderDash: [2],
                          zeroLineBorderDashOffset: [2],
                      },
                      ticks: {
                          color: 'rgba(0, 0, 0, 0.5)',
                      },
                  },
                  y: {
                      stacked: true,
                      grid: {
                          display: false,
                      },
                      ticks: {
                          color: 'rgba(0, 0, 0, 0.5)',
                      },
                  },
              },
          },
      };

      new mdb.Chart(document.getElementById(this.chartId), horizontalBarChartConfig, horizontalBarChartOptions);
    }

    _updateActiveCompaniesSeen() {
      this.actionCreator.getCompaniesSeenResponse().then((result) => {
        if (result.data !== undefined && result.data.length > 0) {
          this.setState({
            isLoading: false,
            data: result.data,
          });
        }
      });
    }

    _monitorActiveCompaniesSeen() {
      this._updateActiveCompaniesSeen();

      const weakSelf = this;

      setInterval(() => {
          weakSelf.setState({
              isLoading: true,
          });

          weakSelf._updateActiveCompaniesSeen();
      }, ACTIVECOMPANIES_MONITOR_TIME_MS);
    }

    render() {
      let contents = null;

      if (this.state.isLoading) {
        contents = this.renderLoader();
      } else {
        contents = (
          <canvas id={this.chartId} />
        );
      }

      return (
        <StatWidgetContainer title="Companies active in past 24hrs">
          {contents}
        </StatWidgetContainer>
      );
    }
}
