import React from 'react';
import _ from 'underscore';
import ActionCreator from '../../actions/actionCreator';
import * as EventCodes from '../../eventSinkCodes';
import EventArgs from '../../eventSink/eventArgs';
import StatWidgetContainer from './container/statWidgetContainer.jsx';
import EventSinkListenerComponent from '../../eventSink/eventSinkListenerComponent.jsx';
import ActiveUsersStatWidgetCompanyTable from './activeUsersStatWidgetCompanyTable.jsx';

const ACTIVE_USER_MONITOR_TIME_MS = 10000;
const MAX_DATA_POINT_LIMIT = 25;

export default class ActiveUsersStatWidget extends EventSinkListenerComponent {
    constructor(props) {
        super(props);
        this.stats = {
            chart: null,
            refreshing: false,
            ticks: 0,
            data: [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
            ],
            axisData: [
                1, 2, 3, 4, 5,
                6, 7, 8, 9, 10,
                11, 12, 13, 14, 15,
                16, 17, 18, 19, 20,
                21, 22, 23, 24, 25,
            ],
            maxValue: 0,
        };

        this.actionCreator = new ActionCreator();
    }

    componentDidMount() {
        jQuery(() => {
            this._initializeRealTimeCharts();
            this._monitorActiveUsers();
            this._quietlyHandleResizing();
        });
    }

    render() {
        return (
            <StatWidgetContainer ownerDraw={true} looseLayout={true} fluidHeight={true}>
                <div className="stat-widget-active-users rounded">
                    <div className="card-header bg-transparent light">
                        <h5 className="text-white">Users online right now</h5>
                        <div id="real-time-user" className="real-time-user display-1 fw-normal text-white">
                            ...
                        </div>
                    </div>
                    <div className="card-body text-white fs--1 light pb-4">
                        <p className="border-bottom pb-2" style={{borderColor: 'rgba(255, 255, 255, 0.15) !important'}}>
                            Active Users / minute
                        </p>
                        <div className="echart-real-time-users" style={{height: '150px'}}></div>
                        <ActiveUsersStatWidgetCompanyTable />
                    </div>
                    <div className="card-footer text-end bg-transparent light">
                        <a className="text-white" href="javascript:void(0)">
                            Observe Data
                            <i className="fa-solid fa-chevron-right" style={{color: 'white', marginLeft: '5px'}} />
                        </a>
                    </div>
                </div>
            </StatWidgetContainer>
        );
    }

    _formatNumberToLocale(val) {
        return val.toLocaleString('en-US');
    }

    _getTotalActiveUsers(data) {
        let total = 0;

        for (let i = 0; i < data.length; ++i) {
            total += data[i].ActiveUsers;
        }

        return total;
    }

    _updateUserStats() {
        if (this.stats.refreshing) {
            return;
        }

        this.stats.refreshing = true;

        this.actionCreator.getActiveUserStatData().then((results) => {
            if (results.length === 0) {
                $('#real-time-user').text(0);
                return;
            }

            this.stats.ticks++;

            const currentActiveUsers = this._getTotalActiveUsers(results);

            if (this.stats.data.length >= MAX_DATA_POINT_LIMIT) {
                this.stats.data.shift();
                this.stats.axisData.shift();
            }

            this.stats.data.push(currentActiveUsers);
            this.stats.axisData.push(this.stats.axisData[this.stats.axisData.length - 1] + 1);

            $('#real-time-user').text(this._formatNumberToLocale(currentActiveUsers));

            // Re-adjust the display after about 2 times the data point limit so that
            // it will re-adjust itself according to the 2nd highest value recorded.
            if (this.stats.ticks > 0 && this.stats.ticks % MAX_DATA_POINT_LIMIT === 0) {
                this.stats.ticks = 0;
            }

            if (this.stats.maxValue < currentActiveUsers) {
                this.stats.maxValue = currentActiveUsers;
                this.stats.ticks = 0;
            }

            this.stats.chart.setOption({
                xAxis: {
                    data: this.stats.axisData,
                },
                yAxis: {
                    max: this.stats.maxValue,
                    min: 0,
                },
                series: [{
                    data: this.stats.data,
                }],
            });

            global.eventSinkManager.postMessage(new EventArgs(EventCodes.EVT_WIDGET_ACTIVE_USERS_UPDATED, results));
        }).finally(() => {
            this.stats.refreshing = false;
        });
    }

    _monitorActiveUsers() {
        this._updateUserStats();

        const weakSelf = this;

        setInterval(() => {
            weakSelf._updateUserStats();
        }, ACTIVE_USER_MONITOR_TIME_MS);
    }

    // !! DEPRECATED AND ONLY KEPT AROUND FOR QUICK TESTING PURPOSES !!
    _randomizeActiveUsers() {
        const weakSelf = this;
        let maxValue = 0;

        setInterval(() => {
            const activeUsersRandomized = Math.floor(Math.random() * 3100) + 950;

            weakSelf.stats.data.shift();
            weakSelf.stats.data.push(activeUsersRandomized);

            weakSelf.stats.axisData.shift();
            weakSelf.stats.axisData.push(Math.floor(Math.random() * 500) + 100);

            $('#real-time-user').text(weakSelf._formatNumberToLocale(activeUsersRandomized));

            if (maxValue < activeUsersRandomized) {
                maxValue = activeUsersRandomized;
            }

            weakSelf.stats.chart.setOption({
                xAxis: {
                    data: weakSelf.stats.axisData,
                },
                yAxis: {
                    max: maxValue,
                },
                series: [{
                    data: weakSelf.stats.data,
                }],
            });
        }, 2500);
    }

    _initializeRealTimeCharts() {
        const $realTimeUsersChart = document.querySelector('.echart-real-time-users');

        if (!$realTimeUsersChart) {
            return;
        }

        const userOptions = this._getData($realTimeUsersChart, 'options');
        this.stats.chart = window.echarts.init($realTimeUsersChart);

        this._setEChartsOption(this.stats.chart, userOptions, this._getDefaultOptions(this.stats.data, this.stats.axisData, this));
    }

    _quietlyHandleResizing() {
        const weakSelf = this;
        window.addEventListener('resize', () => {
            weakSelf.stats.chart.resize();
        });
    }

    _setEChartsOption(chart, userOptions, defaultOptions) {
        const themeController = document.body;

        chart.setOption(_.extend(defaultOptions, userOptions));

        themeController.addEventListener('clickControl', ({ detail: { control } }) => {
            if (control === 'theme') {
                chart.setOption(_.extend(defaultOptions, userOptions));
            }
        });
    }

    _getDefaultOptions(data, axisData, weakSelf) {
        return {
            tooltip: {
              trigger: 'axis',
              padding: [7, 10],
              axisPointer: {
                type: 'none',
              },
              backgroundColor: weakSelf._getGrays()['white'],
              borderColor: weakSelf._getGrays()['300'],
              textStyle: { color: weakSelf._getColors().dark },
              borderWidth: 1,
              transitionDuration: 0,
              position(pos, params, dom, rect, size) {
                return weakSelf._getPosition(pos, params, dom, rect, size);
              },
              formatter: weakSelf._tooltipFormatter,
            },
            xAxis: {
              type: 'category',
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              boundaryGap: [0.2, 0.2],
              data: axisData,
            },
            yAxis: {
              type: 'value',
              scale: true,
              boundaryGap: false,
              axisLabel: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              min: 2,
              max: 10000,
            },
            series: [
              {
                type: 'bar',
                barCategoryGap: '12%',
                data,
                itemStyle: {
                  color: weakSelf._rgbaColor('#fff', 0.3),
                },
              },
            ],
            grid: {
                right: '0px',
                left: '0px',
                bottom: 0,
                top: 0,
            },
        };
    }

    _tooltipFormatter(params) {
        return `
        <div class="bg-white">
            <h6 class="text-700 mb-0"><span class="fas fa-circle me-1 text-info"></span>
              Users : ${params[0].value}
            </h6>
        </div>
        `;
    }

    _getPosition(pos, params, dom, rect, size) {
        return {
            top: pos[1] - size.contentSize[1] - 10,
            left: pos[0] - size.contentSize[0] / 2,
        };
    }

    _hexToRgb(hexValue) {
        let hex = hexValue.indexOf('#') === 0 ? hexValue.substring(1) : hexValue;

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
          hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b),
        );

        return result
          ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
          : null;
    }

    _rgbaColor(color = '#fff', alpha = 0.5) {
        return `rgba(${this._hexToRgb(color)}, ${alpha})`;
    }

    _camelize(str) {
        const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
        return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
    }

    _getColor(name, dom = document.documentElement) {
        return getComputedStyle(dom).getPropertyValue(`--mdb-${name}`).trim();
    }

    _getColors(dom) {
        return {
            primary: this._getColor('primary', dom),
            secondary: this._getColor('secondary', dom),
            success: this._getColor('success', dom),
            info: this._getColor('info', dom),
            warning: this._getColor('warning', dom),
            danger: this._getColor('danger', dom),
            light: this._getColor('light', dom),
            dark: this._getColor('dark', dom),
          };
    }

    _getGrays(dom) {
        return {
            white: this._getColor('white', dom),
            100: this._getColor('100', dom),
            200: this._getColor('200', dom),
            300: this._getColor('300', dom),
            400: this._getColor('400', dom),
            500: this._getColor('500', dom),
            600: this._getColor('600', dom),
            700: this._getColor('700', dom),
            800: this._getColor('800', dom),
            900: this._getColor('900', dom),
            1000: this._getColor('1000', dom),
            1100: this._getColor('1100', dom),
            black: this._getColor('black', dom),
        };
    }

    _getData(el, data) {
        try {
            return JSON.parse(el.dataset[this._camelize(data)]);
        } catch (e) {
            return el.dataset[this._camelize(data)];
        }
    }
}
