import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PagingControls from '../../containers/paging-controls/paging-controls'
import AnimeList from '../../components/anime-list/anime-list'
import Dialog from '../../components/dialog/dialog'
import RatingControl from '../../components/rating-control/rating-control'
import {Strings} from '../../constants/values'
import {getEventValue, updateNestedProperty} from '../../utils/common'
import {addEpisodes} from '../../actions/index'

class PagedAnimeList extends Component {

  constructor() {
    super();
    this.state = {
      showEdit: false,
      editItem: {
        id: null,
      }
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);
  }

  openEditDialog(id) {
    const editItem = this.props.items.find(x => x.id === id);
    this.setState({
      showEdit: true,
      editItem: {
        id,
        episode: editItem.episode || 0,
        min: editItem.episode || 0,
        max: editItem.series_episodes || null,
        ratings: {}
      }
    });
  }

  handleEdit(event) {
    console.log('submit edit! => ', event.target);
    this.props.addEpisodesToAnime(this.state.editItem);
    this.closeEditDialog();
  }

  handleUserInput(event) {
    const target = event.target;
    const newValue = getEventValue(target);
    console.log('input handle => ', this, newValue);
    const updateEditValues = updateNestedProperty(this.state.editItem, target.name, newValue);
    console.log('spec => ', updateEditValues);
    this.setState({ editItem: updateEditValues });
  }

  closeEditDialog() {
    this.setState({ showEdit: false, editItem: { id: null } });
  }

  selectPageOfItems({ page, itemsPerPage }, items) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  render() {
    const { items, paging } = this.props;
    const pagedItems = this.selectPageOfItems(paging, items);
    const editItem = items.find(x => x.id === this.state.editItem.id) || {};

    return (
      <div className="flex-column flex-grow">
        <PagingControls totalItems={items.length} />
        <AnimeList
            items={pagedItems}
            addEpisode={this.openEditDialog}
        />
        {
          this.state.showEdit &&
          <Dialog
            name="animeEdit"
            title={`Edit ${editItem.title}`}
            isOpen={this.state.showEdit}
            close={this.closeEditDialog}
            actionText={Strings.edit}
            action={this.handleEdit}
            >

            <div className="has-float-label input-container">
              <input type="number"
                name="episode"
                value={this.state.editItem.episode}
                min={this.state.editItem.min}
                max={this.state.editItem.max}
                placeholder="episode"
                onChange={(e) => this.handleUserInput(e)}
                />
              <label>episode</label>
            </div>
            <ul className="list column one">
            {
                !!this.state.editItem.episode &&
                Array(this.state.editItem.episode - this.state.editItem.min).fill(null).map((item, index) => {
                  const episodeNumber = this.state.editItem.min + 1 + index;
                  return (
                    <li key={index}>
                      <RatingControl
                        name={`ratings.${episodeNumber}`}
                        label={`rating for episode ${episodeNumber}`}
                        value={this.state.editItem.ratings[episodeNumber] || 0}
                        onChange={this.handleUserInput}
                        />
                    </li>
                  );
                })
            }
            </ul>
          </Dialog>
        }
      </div>
    );
  }

}

PagedAnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  paging: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  paging: state.paging
})

const mapDispatchToProps = {
  addEpisodesToAnime: addEpisodes
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagedAnimeList)
