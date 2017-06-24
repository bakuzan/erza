import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import fetchFromServer from '../../graphql/fetch'
import PagingControls from '../../containers/paging-controls/paging-controls'
import MangaList from '../../components/list-components/manga-list/manga-list'
import Dialog from '../../components/dialog/dialog'
import ClearableInput from '../../components/clearable-input/clearable-input'
import RatingControl from '../../components/rating-control/rating-control'
import {Paths} from '../../constants/paths'
import {Strings} from '../../constants/values'
import {getEventValue, updateNestedProperty} from '../../utils/common'
import { shouldIntergrateMalEntry } from '../../utils/data'
import {addChapters} from '../../actions/manga'

import '../../components/inline-item-edit/inline-item-edit.css'

const EMPTY_OBJECT = {};
const getMalEntry = search => fetchFromServer(Paths.build(Paths.malSearch, { type: Strings.manga, search }));

class PagedMangaList extends Component {

  constructor() {
    super();
    this.state = {
      editItem: {
        _id: null,
        chapter: 0,
        min: 0,
        max: null,
        ratings: {},
        notes: {}
      },
      malUpdates: {
        values: null,
        message: null,
        status: ''
      }
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.assignDialogRef = this.assignDialogRef.bind(this);
  }

  componentDidMount() {
    this.shouldHydrateMal = shouldIntergrateMalEntry(Strings.manga);
  }

  openEditDialog(_id) {
    const editItem = this.props.items.find(x => x._id === _id);
    if (editItem.malId) this.refreshMalValues(editItem);
    this.setState((prevState) => ({
        editItem: Object.assign({}, prevState.editItem, {
          _id,
          chapter: editItem.chapter || 0,
          min: editItem.chapter || 0,
          max: editItem.series_chapters || null,
        }),
        malUpdates: {
          values: null,
          message: editItem.malId ? Strings.fetchingMalEntry : Strings.noLinkedMalEntry,
          status: editItem.malId ? Strings.loading : ''
        }
    }));
    this.dialog.showModal();
  }

  refreshMalValues(editItem) {
    getMalEntry(editItem.name).then(response => {
      const malItem = response.find(x => x.id === editItem.malId);
      const shouldUpdateMalEntry = this.shouldHydrateMal(editItem, malItem) && !!malItem;
      this.setState({
        malUpdates: {
          values: shouldUpdateMalEntry ? malItem : null,
          message: shouldUpdateMalEntry ? Strings.updatedMalEntry : Strings.malEntryUpToDate,
          status: shouldUpdateMalEntry ? Strings.success : ''
        }
      });
    })
  }

  handleEdit(event) {
    this.props.addChaptersToManga(this.state.editItem);
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

  render() {
    const { filters, items } = this.props;
    const editItem = items.find(x => x._id === this.state.editItem._id) || EMPTY_OBJECT;
    // console.log('PAGED ANIME LIST => ', filters, items);

    return (
      <div className="flex-column flex-grow">
        <PagingControls
          listType={Strings.manga}
          filters={filters}
        />
        <MangaList
            items={items}
            addChapter={this.openEditDialog}
        />
        <Dialog
          name="mangaEdit"
          title={`Edit ${editItem.title}`}
          getDialogRef={this.assignDialogRef}
          actionText={Strings.edit}
          action={this.handleEdit}
          >
          <div className="paged-list-edit">
            <span className={`mal-update-message ${this.state.malUpdates.status}`}>
              { this.state.malUpdates.message }
            </span>
          {
            !!this.state.editItem._id &&
            <div>
              <div className="has-float-label input-container">
                <input type="number"
                  name="chapter"
                  value={this.state.editItem.chapter}
                  min={this.state.editItem.min}
                  max={this.state.editItem.max}
                  placeholder=" "
                  onChange={this.handleUserInput}
                  />
                <label>chapter</label>
              </div>
              <ul className="list column one">
                {
                  !!this.state.editItem.chapter &&
                  Array(this.state.editItem.chapter - this.state.editItem.min).fill(null).map((item, index) => {
                    const chapterNumber = this.state.editItem.min + 1 + index;
                    return (
                      <li key={index}
                          className="flex-row">
                        <RatingControl
                          name={`ratings.${chapterNumber}`}
                          label={`rating for chapter ${chapterNumber}`}
                          value={this.state.editItem.ratings[chapterNumber] || 0}
                          onChange={this.handleUserInput}
                          />
                        <ClearableInput
                          name={`notes.${chapterNumber}`}
                          label={`note for ${chapterNumber}`}
                          value={this.state.editItem.notes[chapterNumber] || ''}
                          maxLength={140}
                          placeholder=" "
                          onChange={this.handleUserInput}
                        />
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

PagedMangaList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  paging: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  paging: state.paging
})

const mapDispatchToProps = {
  addChaptersToManga: addChapters
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagedMangaList)
