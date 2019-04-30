import PropTypes from 'prop-types';
import React from 'react';

import { RadioButton } from 'mko';
import Strings from 'constants/strings';

function SortOrderToggle({ value, onChange }) {
  return (
    <div className="radio-group" role="radiogroup">
      <RadioButton
        id="sort-order-asc"
        name="sortOrder"
        label={Strings.ascending}
        value={Strings.ascending}
        checked={value === Strings.ascending}
        onChange={(e) => onChange(e)}
      />
      <RadioButton
        id="sort-order-desc"
        name="sortOrder"
        label={Strings.descending}
        value={Strings.descending}
        checked={value === Strings.descending}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}

SortOrderToggle.propsTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SortOrderToggle;
