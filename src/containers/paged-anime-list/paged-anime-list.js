import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PagingControls from '../../containers/paging-controls/paging-controls'
import AnimeList from '../../components/anime-list/anime-list'
import Dialog from '../../components/dialog/dialog'
import RatingControl from '../../components/rating-control/rating-control'
import {Strings} from '../../constants/values'
import {getEventValue, updateNestedProperty} from '../../utils/common'
import {addEpisodes} from '../../actions/anime'

class PagedAnimeList extends Component {

  constructor() {
    super();
    this.state = {
      editItem: {
        id: null,
        episode: 0,
        min: 0,
        max: null,
        ratings: {},
        notes: {}
      }
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.assignDialogRef = this.assignDialogRef.bind(this);
  }

  openEditDialog(id) {
    const editItem = this.props.items.find(x => x.id === id);
    this.setState((prevState) => {
      return {
        editItem: Object.assign({}, prevState.editItem, {
          id,
          episode: editItem.episode || 0,
          min: editItem.episode || 0,
          max: editItem.series_episodes || null,
        })
      };
    });
    this.dialog.showModal();
  }

  handleEdit(event) {
    this.props.addEpisodesToAnime(this.state.editItem);
    this.dialog.close();
  }

  handleUserInput(event) {
    const target = event.target;
    const newValue = getEventValue(target);
    const updateEditValues = updateNestedProperty(this.state.editItem, target.name, newValue);
    this.setState({ editItem: updateEditValues });
  }

  assignDialogRef(element) {
    this.dialog = element;
  }

  selectPageOfItems({ page, itemsPerPage }, items) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  render() {
    const { filters, paging, items } = this.props;
    const pagedItems = this.selectPageOfItems(paging, items);
    const editItem = items.find(x => x.id === this.state.editItem.id) || {};
    console.log(items);
    return (
      <div className="flex-column flex-grow">
        <PagingControls
          listType={Strings.anime}
          filters={filters}
        />
        <AnimeList
            items={pagedItems}
            addEpisode={this.openEditDialog}
        />
        <Dialog
          name="animeEdit"
          title={`Edit ${editItem.title}`}
          getDialogRef={this.assignDialogRef}
          actionText={Strings.edit}
          action={this.handleEdit}
          >
          <div>
          {
            !!this.state.editItem.id &&
            <div>
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
                      <li key={index}
                          className="flex-row">
                        <RatingControl
                          name={`ratings.${episodeNumber}`}
                          label={`rating for episode ${episodeNumber}`}
                          value={this.state.editItem.ratings[episodeNumber] || 0}
                          onChange={this.handleUserInput}
                          />
                        <div className="has-float-label input-container">
                          <input type="text"
                            name={`notes.${episodeNumber}`}
                            value={this.state.editItem.notes[episodeNumber] || ''}
                            maxLength={140}
                            placeholder="enter note"
                            onChange={(e) => this.handleUserInput(e)}
                            />
                          <label>{`note for ${episodeNumber}`}</label>
                        </div>
                      </li>
                    );
                  })
              }
              </ul>
            </div>
          }
          </div>
        </Dialog>
      </div>
    );
  }

}

PagedAnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
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
