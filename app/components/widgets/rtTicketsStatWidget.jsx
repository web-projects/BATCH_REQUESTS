import React from 'react';
import ActionCreator from '../../actions/actionCreator.js';
import StatWidgetContainer from './container/statWidgetContainer.jsx';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

const ACTIVERTTICKETS_MONITOR_TIME_MS = 1000 * 60 * 2;

export default class RTTicketsStatWidget extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);

        this.chartId = 'activeRTTickets-bar-chart';
        this.state = {
          data: [],
          isLoading: true,
        };

        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
      jQuery(() => {
        this._monitorActiveRTTicketsSeen();
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
              labels: this.state.data.map((obj) => obj.TicketStatus.charAt(0).toUpperCase() + obj.TicketStatus.slice(1)).sort((a, b) => String(a[0]).localeCompare(b[0])),
              datasets: [
                {
                    label: 'Ticket Count',
                    data: this.state.data.map((obj) => obj.Count),
                    backgroundColor: [
                      'rgba(51, 204, 0, 0.2)',
                      'rgba(255, 255, 51, 0.2)',
                      'rgba(255, 0, 0, 0.2)',
                    ],
                    borderColor: [
                      'rgba(51, 204, 0, 1)',
                      'rgba(255, 255, 51, 1)',
                      'rgba(255, 0, 0, 1)',
                    ],
                    borderWidth: 1,
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

    _updateActiveRTTicketsSeen() {
      this.actionCreator.getRTTicketsSeenResponse().then((result) => {
        if (result.data !== undefined && result.data.length > 0) {
          this.setState({
            isLoading: false,
            data: result.data,
          });
        }
      });
    }

    _monitorActiveRTTicketsSeen() {
      this._updateActiveRTTicketsSeen();

      const weakSelf = this;

      setInterval(() => {
          weakSelf.setState({
              isLoading: true,
          });

          weakSelf._updateActiveRTTicketsSeen();
      }, ACTIVERTTICKETS_MONITOR_TIME_MS);
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
        <StatWidgetContainer title="RT Tickets in last 24hrs">
          {contents}
        </StatWidgetContainer>
      );
    }
}
