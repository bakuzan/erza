import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { ButtonisedNewTabLink } from 'components/Buttonised';
import { Icons } from 'constants/values';

import './ExternalLinks.scss';

function ContentLink({ title, link, inline }) {
  const label = title
    ? `Open content link for ${title} in new tab.`
    : 'Open content link in new tab.';

  return (
    <ButtonisedNewTabLink
      className={classNames('content-link', { 'content-link--inline': inline })}
      href={link}
      icon={Icons.link}
      title={label}
      aria-label={label}
    />
  );
}

ContentLink.defaultProps = {
  inline: false
};

ContentLink.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string,
  inline: PropTypes.bool
};

export default React.memo(ContentLink);
