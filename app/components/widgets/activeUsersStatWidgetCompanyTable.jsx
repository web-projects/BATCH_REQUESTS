import React from 'react';
import * as EventCodes from '../../eventSinkCodes';
import EventSinkListenerComponent from '../../eventSink/eventSinkListenerComponent.jsx';

const MIN_TABLE_ROW_COUNT = 4;

export default class ActiveUsersStatWidgetCompanyTable extends EventSinkListenerComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        global.eventSinkManager.subscribe(this.getKey(), this);
    }

    componentWillUnmount() {
        global.eventSinkManager.unsubscribe(this.getKey());
    }

    render() {
        const companyListing = [];

        while (this.state.data.length < MIN_TABLE_ROW_COUNT) {
            this.state.data.push({
                CompanyID: '',
                ActiveUsers: '',
            });
        }

        for (let i = 0; i < this.state.data.length; ++i) {
            const record = this.state.data[i];
            companyListing.push(this._renderCompanyRow(`company-user-count-list-${i}`, record.CompanyID, record.ActiveUsers, record.CompanyID === ''));
        }

        return (
            <div className="list-group-flush mt-4">
                <div className="rounded-2" style={{border: '1px solid rgba(255, 255, 255, 0.15)'}}>
                    <div className="px-3 bg-transparent text-white d-flex justify-content-between px-0 py-1 fw-bold border-top-0 echart-real-time-users-list">
                        <p className="mb-0">Active Companies</p>
                        <p className="mb-0">User Count</p>
                    </div>
                    <div className="echart-active-companies scrollbar-primary">
                        {companyListing}
                    </div>
                </div>
            </div>
        );
    }

    _renderCompanyRow(rowKey, companyId, activeUsers, shouldFill) {
        const companyLabel = shouldFill ? '' : `Company ${companyId}`;
        return (
            <div key={rowKey} className="px-3 bg-transparent text-white d-flex justify-content-between px-0 py-1 echart-real-time-users-lists"
                style={{height: shouldFill ? '33px' : 'auto'}}>
                <p className="mb-0">{companyLabel}</p>
                <p className="mb-0">{activeUsers.toLocaleString('en-US')}</p>
            </div>
        );
    }

    _sortDataSetAppropriately(data) {
        if (data === undefined || data === null) {
            return [];
        }

        if (data.length > 0) {
            data.sort((a, b) => {
                if (a.ActiveUsers > b.ActiveUsers) {
                    return -1;
                }

                if (a.ActiveUsers < b.ActiveUsers) {
                    return 1;
                }

                return 0;
            });
        }

        return data;
    }

    getKey() {
        return 'ActiveUsersStatWidgetCompanyTable';
    }

    onEventProcedure(e) {
        switch (e.eventCode) {
            case EventCodes.EVT_WIDGET_ACTIVE_USERS_UPDATED:
                this.setState({
                    data: this._sortDataSetAppropriately(e.eventObject),
                });
                break;

            default:
                break;
        }
    }
}
