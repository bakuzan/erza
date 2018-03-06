import classNames from 'classnames';
import React from 'react';

import { Icons } from '../../constants/values';
import './alert.css';

const AlertMessage = ({
  id,
  type,
  message,
  detail,
  expandDetail,
  remove,
  isExpanded
}) => (
  <div className={classNames('alert', [`${type}`])}>
    <div className={classNames('alert-content', { 'is-expanded': isExpanded })}>
      <div className="alert-top-content">
        <div className="alert-icon" />
        <div className="alert-title">{message}</div>
        <div className="button-group">
          {detail &&
            !isExpanded && (
              <button
                type="button"
                className="button"
                onClick={() => expandDetail(id)}
              >
                Details
              </button>
            )}
          <button
            type="button"
            className="button-icon"
            icon={Icons.cross}
            onClick={() => remove(id)}
          />
        </div>
      </div>
      <div className="alert-details">{detail}</div>
    </div>
  </div>
);

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedAlerts: []
    };

    this.handleShowDetail = this.handleShowDetail.bind(this);
  }

  handleShowDetail(alertId) {
    this.setState({ expandedAlerts: [alertId] });
  }

  render() {
    const { alerts, actions } = this.props;
    return (
      <div id="alert-container">
        {alerts
          .slice(0, 1)
          .map(a => (
            <AlertMessage
              key={a.id}
              {...a}
              isExpanded={this.state.expandedAlerts.includes(a.id)}
              expandDetail={this.handleShowDetail}
              remove={actions.dismissAlertMessage}
            />
          ))}
      </div>
    );
  }
}

export default Alert;
