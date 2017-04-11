import React, {Component, PropTypes} from 'react'
import {Strings} from '../../constants/values'
import './dialog.css'

class Dialog extends Component {

  handleRef(element) {
    this.self = element;
    this.props.getDialogRef(element);
  }

  handleClose() {
    this.self.close();
  }

  handleAction(event) {
    event.preventDefault();
    this.props.action(event);
  }

  render() {
    const dialogStyle = { 'top': `calc(${window.scrollY}px + 50vh)` };
    return (
      <dialog ref={(el) => this.handleRef(el)}
              style={dialogStyle}
              className="dialog backdrop"
        >
        <div className="dialog-content">
          <form name={this.props.name}
                onSubmit={(e) => this.handleAction(e)}
                noValidate=""
                autoComplete="false">
            <h4 className="dialog-title">{ this.props.title }</h4>
            <div className="dialog-content-custom">
             { this.props.children }
            </div>

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
                onClick={() => this.handleClose()}
                >
                { Strings.cancel }
              </button>
            </div>
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
  actionText: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
}

export default Dialog
