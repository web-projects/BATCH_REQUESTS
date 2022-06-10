import express from 'express';
import DataServiceProvider from '../core/providers/dataServiceProvider';
import { log2 } from '../logger';

const router = express.Router();

router.use((req, res, next) => {
  log2('New Statistics API Request received.');
  next();
});

router.get('/get-batch-dev', (req, res) => {
  const serviceProvider = new DataServiceProvider();
  const service = serviceProvider.getStatDataService();

  return service.getHealthCheckDataForIPA5Services(process.env.SERVICES_DEV).then((result) => {
      res.send(result);
  }).catch((err) => {
      res.status(500).send(err.message);
  });
});

router.get('/get-batch-test1', (req, res) => {
  const serviceProvider = new DataServiceProvider();
  const service = serviceProvider.getStatDataService();

  return service.getHealthCheckDataForIPA5Services(process.env.SERVICES_TEST1).then((result) => {
      res.send(result);
  }).catch((err) => {
      res.status(500).send(err.message);
  });
});

router.get('/get-batch-test2', (req, res) => {
  const serviceProvider = new DataServiceProvider();
  const service = serviceProvider.getStatDataService();

  return service.getHealthCheckDataForIPA5Services(process.env.SERVICES_TEST2).then((result) => {
      res.send(result);
  }).catch((err) => {
      res.status(500).send(err.message);
  });
});

module.exports = router;
