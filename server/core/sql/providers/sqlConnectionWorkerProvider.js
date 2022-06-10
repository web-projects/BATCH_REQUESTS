/* eslint-disable default-case */
import SqlConfigurationProvider from './sqlConfigurationProvider';
import SqlRowResultBuilder from '../builders/SqlRowResultBuilder';
import SqlConnectionWorker from '../sqlConnectionWorker';
import * as _ from '../ipa5SqlDbTypes';

export default class SqlConnectionWorkerProvider {
    getConnectionWorker(dbType) {
        let connectionStringObject;
        const sqlConfigurationProvider = new SqlConfigurationProvider();

        switch (dbType) {
            case _.IPAv5DbType:
                connectionStringObject = sqlConfigurationProvider.getIPA5ConnectionStringObject();
                break;

            case _.DataWarehouseDbType:
                connectionStringObject = sqlConfigurationProvider.getDataWarehouseConnectionStringObject();
                break;

            case _.CommunicationBrokerDbType:
                connectionStringObject = sqlConfigurationProvider.getCommBrokerConnectionStringObject();
                break;
        }

        return new SqlConnectionWorker(connectionStringObject, new SqlRowResultBuilder());
    }
}
