import React, { Component } from 'react';
import MasterPageLayout from './masterPageLayout.jsx';
import AzureAppServiceHealthCheckStatWidget from '../components/widgets/azureAppServiceHealthCheckStatWidget.jsx';

export default class Homepage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <MasterPageLayout pageTitle="Dashboard Stats">
          <div className="row stat-widget-compliant">
            <div className="col-md-6 col-xxl-6 col-sm-12 stat-widget-compliant">
              <AzureAppServiceHealthCheckStatWidget environment="TEST" />
            </div>
            <div className="col-md-6 col-xxl-6 col-sm-12 stat-widget-compliant">
              <AzureAppServiceHealthCheckStatWidget environment="DEV" />
            </div>
          </div>
        </MasterPageLayout>
      );
    }
}
