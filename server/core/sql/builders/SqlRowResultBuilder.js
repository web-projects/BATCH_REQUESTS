export default class SqlRowResultBuilder {
    constructor() {
        this.rows = [];
        this.lastRow = {};
    }

    endRow() {
        this.rows.push(this.lastRow);
        this.lastRow = {};
    }

    addColumn(column) {
        /**
         * TODO:
         *
         * Refactor this later to handle a special case where there
         * are multiple columns with the same name. In those cases,
         * we will find an array of columns as the type of the column.value.
         */
        this.lastRow[column.metadata.colName] = column.value;
    }

    build() {
        return this.rows;
    }
}
