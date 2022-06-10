import React from 'react';
import _ from 'underscore';
import ActionCreator from '../../actions/actionCreator';
import DateHelper from '../../../core/utils/dateHelper';
import StatWidgetContainer from './container/statWidgetContainer.jsx';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

const APPROLLCALL_MONITOR_TIME_MS = 1000 * 60 * 2;

export default class AppRollStatWidget extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);

        this.chartId = 'approllcall-bar-chart';
        this.state = {
            data: [],
            isLoading: true,
        };

        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
        jQuery(() => {
            this._monitorAppRollCalls();
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
            <StatWidgetContainer title="App Roll Calls in past few days">
                {contents}
            </StatWidgetContainer>
        );
    }

    _updateAppRollCallStats() {
        this.actionCreator.getRecentAppRollCallStatData().then((result) => {
            if (result.length > 0) {
                this.setState({
                    isLoading: false,
                    data: result,
                });
            }
        });
    }

    _monitorAppRollCalls() {
        this._updateAppRollCallStats();

        const weakSelf = this;

        setInterval(() => {
            weakSelf.setState({
                isLoading: true,
            });

            weakSelf._updateAppRollCallStats();
        }, APPROLLCALL_MONITOR_TIME_MS);
    }

    _initializeChart() {
        const relevantDataSet = _.sortBy(_.first(this.state.data, 5), 'RecordDate');

        const dataBarCustomOptions = {
            type: 'bar',
            data: {
                labels: relevantDataSet.map((obj) => DateHelper.getIsoCompliantDateString(obj['RecordDate'])),
                datasets: [
                    {
                        label: 'Daily Tallies',
                        data: relevantDataSet.map((obj) => obj['DailyCount']),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255,99,132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
        };

        const dataBarStyleOptions = {
            options: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'green',
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#4285F4',
                        },
                    },
                    y: {
                        ticks: {
                            color: '#F44242',
                        },
                    },
                },
            },
        };

        new mdb.Chart(document.getElementById(this.chartId), dataBarCustomOptions, dataBarStyleOptions);
    }
}
