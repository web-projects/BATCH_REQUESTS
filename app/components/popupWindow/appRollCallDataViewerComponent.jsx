import React from 'react';
import PropTypes from 'prop-types';

export default class AppRollCallDataViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.appRollCallDataHeaderColumns = this.props.appRollCallDataHeaderColumns || [];
  }

  getGeneralInformation() {
    const cardDeckContents = [];
    const workingValues = [];
    const rowObject = this.props.data.appRollCall;
    Object.keys(rowObject).forEach((key) => {
      if (this.props.data.appRollCall[key] !== null
      && this.props.data.appRollCall[key].toString().length > 0
      && !key.toLowerCase().startsWith('created')
      && !key.toLowerCase().startsWith('updated')) {
        workingValues.push({
              name: key,
              value: this.props.data.appRollCall[key].toString(),
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
    const rowObject = this.props.data.appRollCall;
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('created')) {
        workingValues.push({
              name: key,
              value: this.props.data.appRollCall[key],
          });
      }
    });
    Object.keys(rowObject).forEach((key) => {
      if (key !== null
        && key.toLowerCase().startsWith('updated')) {
        workingValues.push({
              name: key,
              value: this.props.data.appRollCall[key],
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

  render() {
    const generalInformation = this.getGeneralInformation();
    const createdUpdated = this.getCreatedUpdatedDeck();

    return (
      <section>
        <div>
          <div className="fw-bold fst-italic bg-light text-dark">General Information</div>
          <div className="row">
            {generalInformation}
          </div>
        </div>
        <div>
          <div className="fw-bold fst-italic bg-light text-dark">Record Information</div>
          <div className="row">
            {createdUpdated}
          </div>
        </div>
      </section>
    );
  }
}

AppRollCallDataViewerComponent.propTypes = {
  appRollCallDataHeaderColumns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
