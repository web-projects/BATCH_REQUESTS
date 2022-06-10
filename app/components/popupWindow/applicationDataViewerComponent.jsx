import React from 'react';
import PropTypes from 'prop-types';

export default class ApplicationDataViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.applicationDataHeaderColumns = this.props.applicationDataHeaderColumns || [];
  }

  getGeneralInformation() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.appData;
    Object.keys(rowObject).forEach((key) => {
      if (this.props.data.appData[key] !== null
      && this.props.data.appData[key].toString().length > 0
      && !key.toLowerCase().startsWith('dns')
      && !key.toLowerCase().startsWith('ipv4')
      && !key.toLowerCase().startsWith('ipv6')
      && !key.toLowerCase().startsWith('created')
      && !key.toLowerCase().startsWith('updated')) {
        workingValues.push({
              name: key,
              value: this.props.data.appData[key].toString(),
          });
      }
    });

    if (workingValues.length > 0) {
      for (let i = 0; i < workingValues.length; ++i) {
        if (workingValues[i].name === 'AppGuid') {
          cardDeckContents.push((
            <div className="col-12 col-lg-8 shadow-inner">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{workingValues[i].name}</div>
                {workingValues[i].value}
              </div>
            </div>
          ));
        } else {
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
    }

    return cardDeckContents;
  }

  getConnectivity() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.appData;
    Object.keys(rowObject).forEach((key) => {
      if (this.props.data.appData[key] !== null
      && this.props.data.appData[key].toString().length > 0
      && (key.toLowerCase().startsWith('dns') || key.toLowerCase().startsWith('ipv4') || key.toLowerCase().startsWith('ipv6'))) {
        workingValues.push({
              name: key,
              value: this.props.data.appData[key].toString(),
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

  getCreatedUpdatedDeck() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.appData;
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('created')) {
        workingValues.push({
              name: key,
              value: this.props.data.appData[key],
          });
      }
    });
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('updated')) {
        workingValues.push({
              name: key,
              value: this.props.data.appData[key],
          });
      }
    });

    if (workingValues.length > 0) {
      for (let i = 0; i < workingValues.length; ++i) {
        if (workingValues[i].name === 'AppGuid') {
          cardDeckContents.push((
            <div className="col-12 col-lg-8 shadow-inner">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{workingValues[i].name}</div>
                {workingValues[i].value}
              </div>
            </div>
          ));
        } else {
          cardDeckContents.push((
            <div className="col-6 col-sm-4 shadow-inner">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{workingValues[i].name}</div>
                {workingValues[i].value}
              </div>
            </div>
          ));
        }
      }
    }

    return cardDeckContents;
  }

  render() {
    const generalInformation = this.getGeneralInformation();
    const connectivity = this.getConnectivity();
    const createdUpdated = this.getCreatedUpdatedDeck();

    return (
      <div>
        <div className="fw-bold fst-italic bg-light text-dark">Application Data</div>
        <div className="row">
          {generalInformation}
        </div>
      </div>
    );
  }
}

ApplicationDataViewerComponent.propTypes = {
  applicationDataHeaderColumns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
