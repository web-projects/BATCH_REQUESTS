import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import _ from 'underscore';
import { v4 as uuidv4 } from 'uuid';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

export default class ResponsiveDataViewerComponent extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);
        this.tableName = `rdvc-${uuidv4()}`;
        this.enableSearch = this.props.enableSearch || true;
        this.enableSort = this.props.enableSort || true;
        this.enablePagination = this.props.enablePagination || true;
        this.showPageEntriesLabel = this.props.showPageEntriesLabel || true;
        this.pageSize = this.props.pageSize || 10;
        this.headerColumns = this.props.headerColumns || [];
        this.headerSortFields = this.props.headerColumns || [];
        this.defaultSortField = this.props.defaultSortField || null;
        this.customFields = this.props.customFieldTypes || new Map();
        this.dataSet = null;
    }

    componentDidUpdate() {
        jQuery(() => {
            const dataTableInstance = new mdb.Datatable(document.getElementById(`${this.tableName}`), this.dataSet);
            const advancedSearchInput = document.getElementById(`asi-${this.tableName}`);
            const search = (value) => {
                let [phrase, columns] = value.split(' in:').map((str) => str.trim());

                if (columns) {
                    columns = columns.split(',').map((str) => str.toLowerCase().trim());
                }

                dataTableInstance.search(phrase, columns);
            };

            document.getElementById(`asi-button-${this.tableName}`).addEventListener('click', (e) => {
                search(advancedSearchInput.value);
            });

            document.getElementById(`asi-${this.tableName}`).addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {
                    search(e.target.value);
                }
            });

            document.getElementsByClassName(`${this.tableName}-callback`).forEach((btn) => {
                btn.addEventListener('click', () => {
                    const dataValue = btn.attributes['data-mdb-value'].value;
                    const dataField = btn.attributes['data-mdb-field'].value;

                    this.customFields.get(dataField).callback(dataValue);
                });
            });
        });
    }

    createHeaderColumns() {
        const headers = this.headerColumns;

        // TODO: Consider the case where we may want to display "No data Found".
        if (this.props.data.length === 0) {
            return [];
        }

        if (this.headerColumns.length === 0) {
            const singleRowObject = this.props.data[0];
            Object.keys(singleRowObject).forEach((item) => {
                headers.push({
                    label: item,
                    field: item,
                    sort: true,
                });
            });
        } else {
            _.each(headers, (element, index) => {
                if (!element.sort) {
                    _.extend(element, { sort: false });
                }
            });
        }

        return headers;
    }

    appendCustomFields() {
        if (this.customFields.size > 0 && this.props.data.length > 0) {
            for (let i = 0; i < this.props.data.length; ++i) {
                const singleRowObject = this.props.data[i];
                Object.keys(singleRowObject).forEach((key) => {
                    if (this.customFields.has(key)) {
                        // TODO: Sort this out later for anything other than links.
                        const preservedValue = singleRowObject[key];
                        singleRowObject[key] = this.buildCustomFieldType(key, preservedValue);
                    }
                });
            }
        }

        return this.props.data;
    }

    render() {
        if (this.props.fetching || !this.props.isLoaded) {
            return super.renderLoader();
        }

        this.dataSet = {
            columns: this.createHeaderColumns(),
            rows: this.appendCustomFields(),
        };

        return (
            <div>
                <div className="input-group mb-4">
                    <input type="text" className="form-control" id={`asi-${this.tableName}`} placeholder="phrase in:column1,column2" />
                    <button className="btn btn-primary" id={`asi-button-${this.tableName}`} type="button">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
                <div id={this.tableName} data-mdb-max-height="460" data-mdb-fixed-header="true"></div>
            </div>
        );
    }

    buildCustomFieldType(fieldName, columnValue) {
        // ToDo: assume this is a link
        return renderToStaticMarkup(
          <button type="button" id="btnId" className={`${this.tableName}-callback call-btn btn btn-outline-primary btn-floating btn-sm`}
                data-mdb-value={columnValue} data-mdb-field={fieldName} data-toggle="modal" data-target="#basicExampleModal"
                href="javascript:void(0)">
            <i class="fa-solid fa-eye" />
          </button>,
        );
    }
}
