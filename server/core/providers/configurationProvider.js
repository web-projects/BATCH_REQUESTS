export default class ConfigurationProvider {
    getServerPort() {
        return process.env.PORT;
    }

    getServerSessionSecret() {
        return process.env.SESSION_SECRET;
    }

    getConnectionStringForIPA5DB() {
        return process.env.IPAV5_DB_JSON_CONNSTRING;
    }

    getConnectionstringForDataWarehouseDB() {
        return process.env.DATA_WAREHOUSE_CORESALES_DB_JSON_CONNSTRING;
    }

    getConnectionStringForCommBrokerDB() {
        return process.env.COMMBROKER_DB_JSON_CONNSTRING;
    }
}
