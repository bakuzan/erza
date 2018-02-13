import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import ClearableInput from '../../components/clearable-input/clearable-input';
import TagList from '../../components/list-components/tag-list'

import { mapStateToEntityList} from '../../utils/data';
import * as actions from '../../actions/tags';


const loadData = props => props.actions.loadTagList();

class TagManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      selectedTag: null
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this)
  }

  componentDidMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAdult !== this.props.isAdult) {
      loadData(nextProps)
    }
  }

  handleUserInput(event) {
    const search = event.target.value.toLowerCase()
    this.setState({ search });
  }

  handleTagClick(selectedTag) {
    console.log("tag clicked", selectedTag)
    this.setState({ selectedTag })
    // TODO
    // display ability to edit tag text and delete tag
    // fetch series linked to tag ?
    // how to handle removing deleted tag from series ?
  }

  render() {
    if (this.state.selectedTag) {
      console.log("%c TM - edit :: not implemented yet", "color: maroon", this.props, this.state)
      return (
        <div>
          Display "tag edit" component here
          <button type="button" onClick={() => this.handleTagClick(null)}>Ok</button>
        </div>
      )
    }

    const items = this.props.tags.filter(x => x.name.indexOf(this.state.search) > -1)

    console.log("%c TM", "color: magenta", this.props, this.state)
    return (
      <div className="flex-row">
        <div className="filters-container">
          <div>
            <ClearableInput
              value={this.state.search}
              onChange={this.handleUserInput}
            />
          </div>
        </div>
        {this.props.isFetching && <LoadingSpinner size="fullscreen" />}
        {!this.props.isFetching && (
          <TagList items={items} onClick={this.handleTagClick} />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  tags: mapStateToEntityList(state.entities.tags),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagManagement)
