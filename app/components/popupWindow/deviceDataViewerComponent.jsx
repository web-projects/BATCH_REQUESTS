import React from 'react';
import PropTypes from 'prop-types';

export default class DeviceDataViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.deviceDataHeaderColumns = this.props.deviceDataHeaderColumns || [];
  }

  getGeneralInformation() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.deviceData;
    Object.keys(rowObject).forEach((key) => {
      if (this.props.data.deviceData[key] !== null
        && this.props.data.deviceData[key].toString().length > 0
        && !key.toLowerCase().startsWith('vos')
        && !key.toLowerCase().includes('package')
        && !key.toLowerCase().startsWith('created')
        && !key.toLowerCase().startsWith('updated')) {
          workingValues.push({
                name: key,
                value: this.props.data.deviceData[key].toString(),
            });
        }
    });

    if (workingValues.length > 0) {
      for (let i = 0; i < workingValues.length; ++i) {
        cardDeckContents.push((
          <div className="col-4 col-sm-3 shadow-inner">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{workingValues[i].name}</div>
              {workingValues[i].value}
            </div>
          </div>
        ));
      }
    }

    return cardDeckContents;
  }

  getVOSDeck() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.deviceData;
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('vos')) {
        workingValues.push({
              name: key,
              value: this.props.data.deviceData[key],
          });
      }
    });

    if (workingValues.length > 0) {
      for (let i = 0; i < workingValues.length; ++i) {
        cardDeckContents.push((
          <div className="col-4 col-sm-3 shadow-inner">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{workingValues[i].name}</div>
              {workingValues[i].value}
            </div>
          </div>
        ));
      }
    }

    return cardDeckContents;
  }

  getPackagesDeck() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.deviceData;
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().includes('package')) {
        workingValues.push({
              name: key,
              value: this.props.data.deviceData[key],
          });
      }
    });

    if (workingValues.length > 0) {
      for (let i = 0; i < workingValues.length; ++i) {
        cardDeckContents.push((
          <div className="col-8 col-lg-6 shadow-inner">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{workingValues[i].name}</div>
              {workingValues[i].value}
            </div>
          </div>
        ));
      }
    }

    return cardDeckContents;
  }

  getCreatedUpdatedDeck() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.deviceData;
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('created')) {
        workingValues.push({
              name: key,
              value: this.props.data.deviceData[key],
          });
      }
    });
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('updated')) {
        workingValues.push({
              name: key,
              value: this.props.data.deviceData[key],
          });
      }
    });

    if (workingValues.length > 0) {
      for (let i = 0; i < workingValues.length; ++i) {
        cardDeckContents.push((
          <div className="col-4 col-md-3 shadow-inner">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{workingValues[i].name}</div>
              {workingValues[i].value}
            </div>
          </div>
        ));
      }
    }

    return cardDeckContents;
  }

  render() {
    const generalInformation = this.getGeneralInformation();
    const deviceVOS = this.getVOSDeck();
    const devicePackages = this.getPackagesDeck();
    const createdUpdated = this.getCreatedUpdatedDeck();

    return (
      <section>
        <div>
          <div className="fw-bold fst-italic bg-light text-dark">General Data</div>
          <div className="row">
            {generalInformation}
          </div>
        </div>
        <div>
          <div className="fw-bold fst-italic bg-light text-dark">VOS Data</div>
          <div className="row">
            {deviceVOS}
          </div>
        </div>
        <div>
          <div className="fw-bold fst-italic bg-light text-dark">Packages</div>
          <div className="row">
            {devicePackages}
          </div>
        </div>
        <div>
          <div className="fw-bold fst-italic bg-light text-dark">TimeStamps</div>
          <div className="row">
            {createdUpdated}
          </div>
        </div>
      </section>
    );
  }
}

DeviceDataViewerComponent.propTypes = {
  deviceDataHeaderColumns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
