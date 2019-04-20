import PropTypes from 'prop-types';
import React from 'react';

import { useWindowSize } from 'mko';
import getDisplayName from 'utils/getDisplayName';

function withMedia(Wrapped, hideOnMap) {
  function Media({ hideOn, ...props }) {
    const size = useWindowSize();
    const isHidden = hideOnMap.get(hideOn);

    if (isHidden(size.width)) {
      return null;
    }

    return <Wrapped {...props} />;
  }

  Media.displayName = `Media(${getDisplayName(Wrapped)})`;
  Media.propTypes = {
    hideOn: PropTypes.string.isRequired
  };

  return Media;
}

export default withMedia;
