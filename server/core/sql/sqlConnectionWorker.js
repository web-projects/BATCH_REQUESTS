import { Connection, Request } from 'tedious';
// eslint-disable-next-line camelcase
import { log2, log2_e } from '../../logger';

export default class SqlConnectionWorker {
    constructor(dbOptions, builder) {
        this.dbOptions = dbOptions;
        this.connection = new Connection(dbOptions);
        this.builder = builder;
    }

    execute(query, storedProc, inputParameters, outputParameters) {
        return new Promise((resolve, reject) => {
            const returnValueMap = new Map();
            const request = new Request(query || storedProc, ((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: this.builder.build(),
                        returnValueMap,
                    });
                }
            }));

            /**
             * Options are optional and are necessary only if we are trying to
             * specify additional type options.
             *
             * Ex..
             *  request.addParameter('city', TYPES.VarChar, 'London');
             *
             * options -> {name, type (TYPES..), value, options (length, precision, scale)}
             */
            if (inputParameters !== null) {
                inputParameters.forEach((param) => {
                    if (param.options) {
                        request.addParameter(param.name, param.type, param.value, param.options);
                    } else {
                        request.addParameter(param.name, param.type, param.value);
                    }
                });
            }

            /**
             * If output parameters are specified then we can tap into the
             * 'returnValue' callback event to receive information on the
             * return values.
             */
            if (outputParameters !== null) {
                outputParameters.forEach((param) => {
                    request.addOutputParameter(param.name, param.type);
                });

                request.on('returnValue', (parameterName, value, metadata) => {
                    returnValueMap.set(parameterName, value);
                });
            }

            /**
             * TODO:
             *  `execute` may need another param (e.g. `context`) which could target diff dbs.
             */
            request.on('row', (columns) => {
                columns.forEach((column) => {
                    this.builder.addColumn(column);
                });

                this.builder.endRow();
            });

            request.on('done', (rowCount, more) => {
                log2(`${rowCount} rows returned on latest SQL query to ${this.dboOptions.server}.`);
            });

            request.on('requestCompleted', (rowCount, more) => {
                this.connection.close();
            });

            this.connection.on('connect', (err) => {
                if (err) {
                    log2_e(`There was a problem connecting to the SQL Server ${this.dbOptions.server} due to ${err}.`);
                    reject(err);
                } else {
                    log2(`Connection established to SQL ${this.dbOptions.server}.`);

                    if (storedProc !== undefined && storedProc !== null && storedProc.length > 0) {
                        this.connection.callProcedure(request);
                    } else {
                        this.connection.execSql(request);
                    }
                }
            });

            this.connection.connect();
        });
    }
}
