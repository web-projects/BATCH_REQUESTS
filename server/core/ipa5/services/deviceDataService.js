import * as _ from '../../sql/sqlDataTypes';

export default class DeviceDataService {
    constructor(sqlConnectionWorkerProvider, connectionType, sqlQueryBuilder) {
        this.sqlConnectionWorkerProvider = sqlConnectionWorkerProvider;
        this.connectionType = connectionType;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    getAllDeviceData(opts) {
        const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
        return new Promise((resolve, reject) => {
            const builtQuery = this.sqlQueryBuilder
                .top(1000)
                .select(`DeviceID, CompanyID, Concat(ma.MfgName, ' ' , mo.Description) AS DeviceBranding,
                    [AppID] , [SerialNumber], [OSVersion], [FirmwareVersion], [FormsVersion], [Debit],
                    [IsEMVCapable], [P2PEEnabled], d.[Active], d.[CreatedDate], d.[CreatedBy], d.[UpdatedDate],
                    d.[UpdatedBy], [VipaPackageTag], [CertPackageTag], [IdleImagePackageTag], [VosVault],
                    [VosAppM], [VosVFOP], [VosSRED]`)
                .from('[IPAv5].[dbo].[Device] d')
                .join('Manufacturer ma on ma.ManufacturerID = d.ManufacturerID')
                .join('Model mo on mo.ModelID = d.ModelID')
                .orderByDesc('DeviceID')
                .build();

            sqlConnectionWorker.execute(builtQuery, null, null, null)
                .then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getExtendedDeviceData(opts) {
        return new Promise((resolve, reject) => {
            const deviceQuery = this.sqlQueryBuilder
            .top(1)
            .from('[IPAv5].[dbo].[Device]')
            .where('DeviceId = $DEVICEID')
            .addParameter('$DEVICEID', _.SqlIntType, opts.deviceId)
            .build();

            const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
            sqlConnectionWorker.execute(deviceQuery, null, null, null)
                .then((result) => {
                    const appId = result.data[0].AppID;
                    const appDataQuery = this.sqlQueryBuilder
                        .top(1)
                        .from('[IPAv5].[dbo].[App]')
                        .where('AppId = $APPID')
                        .addParameter('$APPID', _.SqlIntType, appId)
                        .build();
                    const appRollCallQuery = this.sqlQueryBuilder
                        .top(1)
                        .from('AppRollCall')
                        .where('AppId = $APPID')
                        .orderByDesc('AppRollCallID')
                        .addParameter('$APPID', _.SqlIntType, appId)
                        .build();

                    Promise.all([
                        new Promise((resolve2, reject2) => {
                            const sqlConnectionWorker2 = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
                            sqlConnectionWorker2.execute(appDataQuery, null, null, null)
                                .then((result2) => {
                                    resolve2(result2.data[0]);
                                }).catch((err2) => {
                                    reject2(err2);
                                });
                        }),
                        new Promise((resolve3, reject3) => {
                            const sqlConnectionWorker3 = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
                            sqlConnectionWorker3.execute(appRollCallQuery, null, null, null)
                                .then((result3) => {
                                    resolve3(result3.data[0]);
                                }).catch((err3) => {
                                    reject3(err3);
                                });
                        }),
                    ]).then((combinedResults) => {
                        resolve({
                            data: {
                                deviceData: result.data[0],
                                appData: combinedResults[0],
                                appRollCall: combinedResults[1],
                            },
                        });
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}
