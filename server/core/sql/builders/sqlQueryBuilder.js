import escapeString from 'sql-escape-string';
import * as _ from '../sqlDataTypes';

export default class SqlQueryBuilder {
    constructor() {
        this.whereStatements = [];
        this.tableNameList = [];
        this.orderByStatements = [];
        this.joinStatements = [];
        this.fromStatements = [];
        this.selectStatements = [];
        this.groupByStatements = [];
        this.parameters = [];
        this.numRows = [];
        this.playback = ['start'];
    }

    build() {
        let output = '';
        for (let i = 0; i < this.playback.length; ++i) {
            const seperator = this.combineNextStatement(i);
            output += this.nextStatement(i);
            output += seperator;
        }

        output = this.replaceParameters(output);

        this.playback = ['start'];

        return output;
    }

    nextStatement(currentIndex) {
        let output;
        const action = this.playback[currentIndex];
        switch (this.playback[currentIndex]) {
            case 'start':
                output = 'select';
                break;
            case 'top':
                output = `top ${this.numRows[0]}`;
                this.numRows.shift();
                break;
            case 'select':
                output = this.selectStatements[0].toString();
                this.selectStatements.shift();
                break;
            case 'from':
                output = this.tableNameList[0].toString();
                this.tableNameList.shift();
                break;
            case 'join':
                output = this.joinStatements[0].toString();
                this.joinStatements.shift();
                break;
            case 'where':
            case 'and':
            case 'or':
                output = this.whereStatements[0].toString();
                this.whereStatements.shift();
                break;
            case 'orderBy':
                output = `${this.orderByStatements[0].toString()}`;
                this.orderByStatements.shift();
                break;
            case 'groupBy':
                output = `${this.groupByStatements[0].toString()}`;
                this.groupByStatements.shift();
                break;
            case 'parameter':
                output = '';
                break;
            default:
                throw Error(`Unsupported option ${action}`);
        }
        return output;
    }

    replaceParameters(input) {
        // Validation:
        // Does Parameter exist in current string?
        // Escape sql string for safety
        // ToDo: Does parameter.Value match parameter.Type
        let output = input;
        if (this.parameters.length < 1) {
            return output;
        }

        for (let i = 0; i < this.parameters.length; ++i) {
            const paramName = this.parameters[i].name;
            const paramValue = this.escapedValue(this.parameters[i]);

            if (output.indexOf(paramName, 0) >= 0) {
                output = output.replaceAll(paramName, paramValue);
            } else {
                throw Error(`Unable to find parameter ${paramName}!`);
            }
        }

        this.parameters = [];

        return output;
    }

    escapedValue(parameter) {
        switch (parameter.type) {
            case _.SqlVarCharType:
            case _.SqlTextType:
            case _.SqlNcharType:
            case _.SqlNVarCharType:
            case _.SqlNTextType:
                return escapeString(parameter.value);
            default:
                return parameter.value.toString();
        }
    }

    combineNextStatement(currentIndex) {
        if (currentIndex + 1 === this.playback.length) {
            return '';
        }

        const combination = `${this.playback[currentIndex]}${this.playback[currentIndex + 1]}`;
        switch (combination) {
            case 'topselect':
            case 'fromparameter':
                return ' ';
            case 'fromorderBy':
                return ' order by ';
            case 'fromwhere':
            case 'joinwhere':
                return ' where ';
            case 'joinjoin':
            case 'fromjoin':
                return ' join ';
            case 'joinorderBy': // ToDo: add test
                return ' order by ';
            case 'whereand':
            case 'andand':
            case 'orand':
                return ' and ';
            case 'whereor':
            case 'oror':
            case 'andor':
                return ' or ';
            case 'andgroupBy':
            case 'orgroupBy':
            case 'fromgroupBy':
            case 'wheregroupBy':
                return ' group by ';
            case 'whereorderBy':
            case 'ororderBy':
            case 'andorderBy':
            case 'groupByorderBy':
                return ' order by ';
            case 'whereparameter':
            case 'orparameter':
            case 'andparameter':
            case 'orderByparameter':
            case 'parameterparameter':
                return '';
            case 'startfrom':
            case 'topfrom':
                return ' * from ';
            case 'selectfrom':
                return ' from ';
            case 'orderByorderBy':
            case 'selectselect':
                return ', ';
            case 'starttop':
            case 'startselect':
                return ' ';
            case 'groupBy':
                return ' group by ';
            default:
                throw Error(`${combination} not supported`);
        }
    }

    top(numRows) {
        this.playback.push('top');
        this.numRows.push(numRows);
        return this;
    }

    select(selectString) {
        this.playback.push('select');
        this.selectStatements.push(selectString);
        return this;
    }

    from(tableName) {
        this.playback.push('from');
        this.tableNameList.push(tableName);
        return this;
    }

    join(joinClause) {
        this.playback.push('join');
        this.joinStatements.push(joinClause);
        return this;
    }

    where(whereStatement) {
        this.playback.push('where');
        this.whereStatements.push(whereStatement);
        return this;
    }

    groupBy(groupStatement) {
        this.playback.push('groupBy');
        this.groupByStatements.push(groupStatement);
        return this;
    }

    and(whereStatement) {
        this.playback.push('and');
        this.whereStatements.push(whereStatement);
        return this;
    }

    or(whereStatement) {
        this.playback.push('or');
        this.whereStatements.push(whereStatement);
        return this;
    }

    orderBy(orderByColumn) {
        this.playback.push('orderBy');
        this.orderByStatements.push(`${orderByColumn} asc`);
        return this;
    }

    orderByDesc(orderByColumn) {
        this.playback.push('orderBy');
        this.orderByStatements.push(`${orderByColumn} desc`);
        return this;
    }

    addParameter(parameterName, parameterType, parameterValue) {
        this.playback.push('parameter');
        this.parameters.push({
            name: parameterName,
            type: parameterType,
            value: parameterValue,
        });
        return this;
    }
}
