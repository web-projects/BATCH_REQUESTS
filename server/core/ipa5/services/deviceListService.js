export default class DeviceListService {
    constructor(sqlConnectionWorker) {
        this.sqlConnectionWorker = sqlConnectionWorker;
    }

    retrieveDeviceList() {
        return new Promise((resolve, reject) => {
            const deviceMap = new Map();
            const objectMap = new Map();
            /*
            try {
                this.getDeviceData().then((result) => {
                    result.data.forEach((conn) => {
                        objectMap[conn.ConnectionId] = conn;
                        // if BrokerOwnerId is null or whitespace, continue
                        if (conn.BrokerOwnerId == null || conn.BrokerOwnerId === '') {
                            return;
                        }

                        // if connectionList does not yet have the connectionId, add an emptyList
                        if (connectionMap[conn.ConnectionId] == null) {
                            connectionMap[conn.ConnectionId] = [];
                        }
                        // if connectionList does not yet have the BrokerOwnerId, add an emptyList
                        if (connectionMap[conn.BrokerOwnerId] == null) {
                            connectionMap[conn.BrokerOwnerId] = [];
                        }

                        connectionMap[conn.ConnectionId].push(conn.BrokerOwnerId);
                        connectionMap[conn.BrokerOwnerId].push(conn.ConnectionId);
                    });
                    resolve({
                        objectMap,
                        adjacencyList: connectionMap,
                    });
                }).catch((err) => {
                    reject(err);
                });
            } catch (e) {
                reject(e.message);
            }
            */
        });
    }

    getDeviceData() {
        return new Promise((resolve, reject) => {
            try {
                this.sqlConnectionWorker.execute('SELECT * FROM Device with (NOLOCK)', null, null, null)
                    .then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
            } catch (e) {
                reject(e.message);
            }
        });
    }
}
