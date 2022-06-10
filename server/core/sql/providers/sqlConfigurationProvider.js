import ConfigurationProvider from '../../providers/configurationProvider';

export default class SqlConfigurationProvider {
    constructor() {
        this.configurationProvider = new ConfigurationProvider();
    }

    getIPA5ConnectionStringObject() {
        return JSON.parse(this.configurationProvider.getConnectionStringForIPA5DB());
    }

    getDataWarehouseConnectionStringObject() {
        return JSON.parse(this.configurationProvider.getConnectionstringForDataWarehouseDB());
    }

    getCommBrokerConnectionStringObject() {
        return JSON.parse(this.configurationProvider.getConnectionStringForCommBrokerDB());
    }
}
