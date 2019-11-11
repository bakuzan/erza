import PropTypes from 'prop-types';
import React from 'react';

import NewTabLink from 'meiko/NewTabLink';

function getUrlDomain(data) {
  const a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

const HistoryNoteLink = React.memo(function InlineLink({ href, text }) {
  if (!text && !href) {
    return null;
  }

  if (!href) {
    return text;
  }

  const domain = getUrlDomain(href);
  const linkText = text || (domain || 'Unknown link');

  return (
    <NewTabLink className="button button--link history-note-link" href={href}>
      {linkText}
    </NewTabLink>
  );
});

HistoryNoteLink.defaultProps = {
  href: '',
  text: ''
};

HistoryNoteLink.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string
};

export default HistoryNoteLink;
