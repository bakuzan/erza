import PropTypes from 'prop-types';
import React from 'react';
import Dialog from '../dialog/dialog';

const InlineItemEdit = ({}) => (
  <Dialog
    name="animeEdit"
    title={`Edit ${editItem.title}`}
    getDialogRef={this.assignDialogRef}
    actionText={Strings.edit}
    action={this.handleEdit}
  >
    <div className="paged-list-edit">
      {!!this.state.editItem._id && (
        <div>
          <div className="has-float-label input-container">
            <input
              type="number"
              name="episode"
              value={this.state.editItem.episode}
              min={this.state.editItem.min}
              max={this.state.editItem.max}
              placeholder=" "
              onChange={this.handleUserInput}
            />
            <label>episode</label>
          </div>
          <ul className="list column one">
            {!!this.state.editItem.episode &&
              Array(this.state.editItem.episode - this.state.editItem.min)
                .fill(null)
                .map((item, index) => {
                  const episodeNumber = this.state.editItem.min + 1 + index;
                  return (
                    <li key={index} className="flex-row">
                      <RatingControl
                        name={`ratings.${episodeNumber}`}
                        label={`rating for episode ${episodeNumber}`}
                        value={this.state.editItem.ratings[episodeNumber] || 0}
                        onChange={this.handleUserInput}
                      />
                      <div className="has-float-label input-container">
                        <input
                          type="text"
                          name={`notes.${episodeNumber}`}
                          value={this.state.editItem.notes[episodeNumber] || ''}
                          maxLength={140}
                          placeholder=" "
                          onChange={this.handleUserInput}
                        />
                        <label>{`note for ${episodeNumber}`}</label>
                      </div>
                    </li>
                  );
                })}
          </ul>
        </div>
      )}
    </div>
  </Dialog>
);

InlineItemEdit.propTypes = {};

export default InlineItemEdit;
