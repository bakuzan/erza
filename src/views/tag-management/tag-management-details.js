import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ClearableInput from '../../components/clearable-input/clearable-input';

import {Strings} from '../../constants/values'
import { getEventValue } from '../../utils/common';
import * as actions from '../../actions/tags';

class TagManagementDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item
    }

    this.handleUserInput = this.handleUserInput.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleUserInput({ target }) {
    const value = getEventValue(target)
    this.setState(prev => ({
      item: {
        ...prev.item,
        [target.name]: value
      }
    }))
  }

  handleDelete() {
    console.log("Delete Tag")
    // this.props.actions.deleteTag(this.props.item._id)
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log("%c Tag Submit Not Implemented", "color: maroon")
  }

  render() {
    const { item } = this.state
    const { onComplete } = this.props
    return (
      <div>
        {console.log("%c TM - edit :: implementation in progress", "color: orange", this.state)}
        <div>
          <form name="tag-edit" onSubmit={this.handleSubmit}>
            <ClearableInput
              name="name"
              label="name"
              placeholder="name"
              value={item.name}
              onChange={this.handleUserInput}
            />
            <div>
              <button type="submit" className="button ripple">
                {Strings.edit}
              </button>
            </div>
          </form>
        </div>
        <div>
          <div>
            <button type="button" className="button ripple" onClick={this.handleDelete}>
              {Strings.delete}
            </button>
          </div>
          List of series with the tag here?
        </div>
        <button type="button" className="button ripple" onClick={onComplete}>
          {Strings.ok}
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(TagManagementDetails)
