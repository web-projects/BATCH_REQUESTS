import https from 'https';
import _ from 'underscore';
import * as TYPES from '../../sql/ipa5SqlDbTypes';
import * as HC from '../../../../core/httpConstants';
import * as CC from '../../../../core/constants';

const axios = require('axios').default;

export default class StatDataService {
    constructor(sqlConnectionWorkerProvider, sqlQueryBuilder) {
        this.sqlConnectionWorkerProvider = sqlConnectionWorkerProvider;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    getActiveIPA5UserData() {
        const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(TYPES.CommunicationBrokerDbType);
        return new Promise((resolve, reject) => {
            const builtQuery = this.sqlQueryBuilder
                .select('CompanyID, Count(CompanyID) As "ActiveUsers"')
                .from('[CommunicationBroker].[dbo].[Connection] WITH (NOLOCK)')
                .where('IsCloud = 0')
                .and('ServiceTypeId = 8')
                .and('LastUpdated >= DATEADD(minute, -5, GETUTCDATE())')
                .groupBy('CompanyID')
                .orderByDesc('ActiveUsers')
                .build();

            sqlConnectionWorker.execute(builtQuery, null, null, null)
                .then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getAppRollCallsInPastWeek() {
        const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(TYPES.IPAv5DbType);
        return new Promise((resolve, reject) => {
            const builtQuery = this.sqlQueryBuilder
                .select('CAST(CreatedDate as Date) as RecordDate, COUNT(AppID) as DailyCount')
                .from('[IPAv5].[dbo].[AppRollCall] WITH (NOLOCK)')
                .where('CreatedDate < GETUTCDATE()')
                .and('CreatedDate > DATEADD(day, -10, GETUTCDATE())')
                .groupBy('CAST(CreatedDate as Date)')
                .orderByDesc('RecordDate')
                .build();

            sqlConnectionWorker.execute(builtQuery, null, null, null)
                .then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getDeviceTypesInPast24Hours() {
        const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(TYPES.IPAv5DbType);
        return new Promise((resolve, reject) => {
            const builtQuery = this.sqlQueryBuilder
                .select('DISTINCT CONCAT(MM.MfgName, \' \', M.Description) as DeviceType, A.DeviceID')
                .from('[IPAv5].[dbo].[Device] A WITH (NOLOCK)')
                .join('Manufacturer MM on A.ManufacturerID = MM.ManufacturerID')
                .join('Model M on A.ModelID = M.ModelID')
                .where('A.CreatedDate < GETUTCDATE()')
                .and('A.CreatedDate > DATEADD(hour, -24, GETUTCDATE())')
                .build();

            sqlConnectionWorker.execute(builtQuery, null, null, null)
                .then((result) => {
                    const tempSet = _.countBy(result.data, (values) => values.DeviceType);
                    const dataSet = [];

                    _.keys(tempSet).forEach((key) => {
                        dataSet.push({
                            DeviceType: key,
                            Count: tempSet[key],
                        });
                    });

                    resolve({
                        data: dataSet,
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getHealthCheckDataForIPA5Services(targetServices) {
        /**
         * We would like to show the following information:
         * 1. Service Name
         * 2. Service Version
         * 3. Response Time (colored based on latency)
         * 4. HTTP Response Code
         *
         * The UI has a status column (200 = GREEN, anything else = RED)
         */
        const promises = [];
        const dataSet = [];
        const services = JSON.parse(targetServices).server;

        const AppVersionRegex = /App\sVersion:\s?(.*)/im;

        services.forEach((service) => {
          const startTimeOfRequest = Date.now();
          promises.push(
            new Promise((resolve) => {
              axios({
                  method: HC.HttpGetMethodType,
                  url: service.url + process.env.HEALTH_CHECK_ACTION_URL,
                  headers: {
                      'Content-Type': HC.ApplicationHtmlContentType,
                  },
                  timeout: 2000,
                  responseType: HC.ApplicationHtmlContentType,
                  httpsAgent: new https.Agent({
                    rejectUnauthorized: process.env.NODE_ENV === CC.NodeEnvironmentProduction,
                  }),
              }).then((resp) => {
                  dataSet.push({
                    serviceAppName: service.name,
                    serviceAppVersion: AppVersionRegex.exec(resp.data)[1],
                    serviceResponseTime: Date.now() - startTimeOfRequest,
                    serviceResponseCode: resp.status,
                  });
                  resolve({
                    data: dataSet,
                  });
              }).catch((err) => {
                  dataSet.push({
                    serviceAppName: service.name,
                    serviceAppVersion: 'N/A',
                    serviceResponseTime: Date.now() - startTimeOfRequest,
                    serviceResponseCode: err.code,
                  });
              });
          }),
          );
        });

        return new Promise((resolve) => {
          Promise.all(promises).then(() => {
            dataSet.sort((a,b) => ((a.serviceAppName > b.serviceAppName) ? 1 : ((b.serviceAppName > a.serviceAppName) ? -1 : 0)));
            resolve(dataSet);
          });
        });
    }

    getCompaniesInPast24Hours() {
      const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(TYPES.IPAv5DbType);
      return new Promise((resolve, reject) => {
          const builtQuery = this.sqlQueryBuilder
            .select('COUNT(*) AS Count, CompanyID')
            .from('[IPAv5].[dbo].[AppRollCall] A WITH (NOLOCK)')
            .where('A.CreatedDate < GETUTCDATE()')
            .and('A.CreatedDate > DATEADD(hour, -24, GETUTCDATE())')
            .groupBy('CompanyID')
            .build();

          sqlConnectionWorker.execute(builtQuery, null, null, null)
              .then((result) => {
                resolve({
                  data: result.data,
                });
          }).catch((err) => {
                  reject(err);
              });
      });
    }

    getRTTicketsInPast24Hours() {
      const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(TYPES.DataWarehouseDbType);
      return new Promise((resolve, reject) => {
          const builtQuery = this.sqlQueryBuilder
              .select('DISTINCT A.TicketId, A.TicketStatus, A.TicketPriority, A.TicketSubject')
              .from('[dbo].[RtTickets] A WITH (NOLOCK)')
              .where('A.TicketCreated < GETUTCDATE()')
              .and('A.TicketCreated > DATEADD(hour, -24, GETUTCDATE())')
              .orderBy('TicketId')
              .build();

          sqlConnectionWorker.execute(builtQuery, null, null, null)
              .then((result) => {
                const tempSet = _.countBy(result.data, (values) => values.TicketStatus);
                const dataSet = [];

                _.keys(tempSet).forEach((key) => {
                    dataSet.push({
                        TicketStatus: key,
                        Count: tempSet[key],
                    });
                });

                resolve({
                      data: dataSet,
                  });
              }).catch((err) => {
                  reject(err);
              });
      });
    }

    getUpcomingPackageDeployments() {
      const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(TYPES.IPAv5DbType);
      return new Promise((resolve, reject) => {
          const builtQuery = this.sqlQueryBuilder
              .select('COUNT(*) As Count, A.CompanyID')
              .from('[Updater].[dbo].[PackageDeploy] A WITH (NOLOCK)')
              .where('A.PickedUpDate is NULL')
              .groupBy('CompanyID')
              .build();

          sqlConnectionWorker.execute(builtQuery, null, null, null)
              .then((result) => {
                resolve({
                      data: result.data,
                  });
              }).catch((err) => {
                  reject(err);
              });
      });
    }
}
