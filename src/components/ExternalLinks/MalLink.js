import PropTypes from 'prop-types';
import React from 'react';

import Image from 'meiko/Image';
import NewTabLink from 'meiko/NewTabLink';
import malIcon from './myanimelist.ico';

import './ExternalLinks.scss';

function MalLink({ type, title, malId }) {
  const label = title
    ? `Open MAL entry for ${title} in new tab.`
    : 'Open MAL entry in new tab.';

  return (
    <NewTabLink
      href={`https://myanimelist.net/${type}/${malId}`}
      className="mal-link"
      title={label}
      aria-label={label}
    >
      <Image src={malIcon} alt="MyAnimelist icon" width={20} height={20} />
    </NewTabLink>
  );
}

MalLink.propTypes = {
  type: PropTypes.string.isRequired,
  malId: PropTypes.number.isRequired,
  title: PropTypes.string
};

export default React.memo(MalLink);
