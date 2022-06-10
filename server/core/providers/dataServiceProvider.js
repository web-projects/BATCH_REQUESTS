import StatDataService from '../ipa5/services/statDataService';
import SqlConnectionWorkerProvider from '../sql/providers/sqlConnectionWorkerProvider';
import SqlQueryBuilder from '../sql/builders/sqlQueryBuilder';

export default class DataServiceProvider {
    constructor() {
        this.connectionWorkerProvider = new SqlConnectionWorkerProvider();
    }

    getStatDataService() {
        return new StatDataService(this.connectionWorkerProvider, new SqlQueryBuilder());
    }
}
