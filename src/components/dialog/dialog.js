import React, {Component, PropTypes} from 'react'
import {Strings} from '../../constants/values'
import './dialog.css'

class Dialog extends Component {

  constructor() {
    super();

    this.handleRef = this.handleRef.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleRef(element) {
    this.self = element;
    this.props.getDialogRef(element);
  }

  handleClose() {
    this.self.close();
  }

  handleAction(event) {
    event.preventDefault();
    if (this.props.action) this.props.action(event);
  }

  render() {
    const dialogStyle = { 'top': !!this.props.localised ? '0' : `calc(${window.scrollY}px + 50vh)` };
    const hasTitle = !!this.props.title;
    const hasAction = !!this.props.action;

    return (
      <dialog ref={this.handleRef}
              style={dialogStyle}
              className="dialog backdrop"
        >
        <div className="dialog-content">
          <form
            name={this.props.name}
            onSubmit={this.handleAction}
            noValidate=""
            autoComplete="off"
            >
            {
              hasTitle &&
              <h4 className="dialog-title">{ this.props.title }</h4>
            }
            <div className="dialog-content-custom">
              { this.props.children }
            </div>
            {
              hasAction &&
              <div className="button-group">
                <button
                  type="submit"
                  className="button ripple"
                  >
                  { this.props.actionText }
                </button>
                <button
                  type="button"
                  className="button ripple"
                  onClick={this.handleClose}
                  >
                  { Strings.cancel }
                </button>
              </div>
            }
          </form>
        </div>
      </dialog>
    );
  }
}

Dialog.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  getDialogRef: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  actionText: PropTypes.string,
  action: PropTypes.func
}

export default Dialog
