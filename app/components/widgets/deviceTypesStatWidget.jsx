import React from 'react';
import _ from 'underscore';
import ActionCreator from '../../actions/actionCreator';
import StatWidgetContainer from './container/statWidgetContainer.jsx';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

const DEVICETYPES_MONITOR_TIME_MS = 1000 * 60 * 2;

export default class DeviceTypesStatWidget extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);

        this.chartId = 'devicetypes-bar-chart';
        this.state = {
            data: [],
            isLoading: true,
        };

        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
        jQuery(() => {
            this._monitorDeviceTypesSeen();
        });
    }

    componentDidUpdate() {
        if (!this.state.isLoading) {
            this._initializeChart();
        }
    }

    render() {
        let contents = null;

        if (this.state.isLoading) {
            contents = this.renderLoader();
        } else {
            contents = (
                <canvas id={this.chartId}></canvas>
            );
        }

        return (
          <StatWidgetContainer title="Device Types seen in past 24hrs">
            {contents}
          </StatWidgetContainer>
        );
    }

    _updateDeviceTypesSeen() {
        this.actionCreator.getRecentDeviceTypesStatData().then((result) => {
            if (result.length > 0) {
                this.setState({
                    isLoading: false,
                    data: result,
                });
            }
        });
    }

    _monitorDeviceTypesSeen() {
        this._updateDeviceTypesSeen();

        const weakSelf = this;

        setInterval(() => {
            weakSelf.setState({
                isLoading: true,
            });

            weakSelf._updateDeviceTypesSeen();
        }, DEVICETYPES_MONITOR_TIME_MS);
    }

    _initializeChart() {
        const horizontalBarChartConfig = {
            type: 'bar',
            data: {
                labels: this.state.data.map((obj) => obj['DeviceType']),
                datasets: [
                    {
                        label: 'Devices',
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
}
