import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

const AutocompleteSuggestionItem = ({
  activeSuggestion,
  index,
  attr,
  item,
  highlightMatch,
  selectAutocompleteSuggestion
}) => {
  const itemId = isNumber(item.id) ? item.id : item._id;
  const itemText = item[attr];
  const isActiveSuggestion = activeSuggestion === index;

  return (
    <li
      className={classNames('autocomplete-suggestion', {
        active: isActiveSuggestion
      })}
    >
      <button
        type="button"
        className="button ripple"
        title={itemText}
        onClick={() => selectAutocompleteSuggestion(itemId)}
      >
        {highlightMatch(itemText)}
      </button>
    </li>
  );
};

AutocompleteSuggestionItem.propTypes = {
  activeSuggestion: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  attr: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  highlightMatch: PropTypes.func.isRequired,
  selectAutocompleteSuggestion: PropTypes.func.isRequired
};

export default AutocompleteSuggestionItem;
