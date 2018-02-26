import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { isNumber } from '../../utils/common';

const MalSearchSuggestionItem = ({
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
      className={classNames('autocomplete-suggestion mal-search-suggestion', {
        active: isActiveSuggestion
      })}
    >
      <button
        type="button"
        className="button ripple"
        title={itemText}
        onClick={() => selectAutocompleteSuggestion(itemId)}
      >
        {!!item.image && (
          <img
            className="mal-search-suggestion-image"
            src={item.image}
            alt="mal series cover"
          />
        )}
        {highlightMatch(itemText)}
        <span>{`(${item.series_type})`}</span>
      </button>
    </li>
  );
};

MalSearchSuggestionItem.propTypes = {
  activeSuggestion: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  attr: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  highlightMatch: PropTypes.func.isRequired,
  selectAutocompleteSuggestion: PropTypes.func.isRequired
};

export default MalSearchSuggestionItem;
