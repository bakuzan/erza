import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import HistoryNoteLink from './HistoryNoteLink';

const MATCH_CUSTOM_TEXT = /(?!\[).*?(?=\])/;
const MATCH_LINKS = /\[.*?\]\(http.*?\)|\(http.*?\)/g;

function processNoteText(text) {
  if (!text) {
    return text;
  }

  const linkMatches = [...text.matchAll(MATCH_LINKS)];

  if (!linkMatches.length) {
    return text;
  }

  const matchLastIndex = linkMatches.length - 1;
  const linkParts = linkMatches.reduce(
    (p, linkMatch, i) => {
      const link = linkMatch[0];
      const [before, after] = p.text.replace(link, '{0}').split('{0}');
      const isLast = matchLastIndex === i;

      const [customText] = link.match(MATCH_CUSTOM_TEXT) || [];
      const href = link.replace(/.*\(/, '').slice(0, -1);

      return {
        text: after,
        parts: [
          ...p.parts,
          { text: before },
          { href, text: customText },
          { text: isLast ? after : '' }
        ]
      };
    },
    { text, parts: [] }
  );

  return linkParts.parts.map((x, i) => <HistoryNoteLink key={i} {...x} />);
}

const HistoryNote = React.memo(function HistoryNote({
  className,
  text,
  ...props
}) {
  const processedText = processNoteText(text);

  return (
    <p {...props} className={classNames('history-note', className)}>
      {processedText}
    </p>
  );
});

HistoryNote.defaultProps = {
  text: ''
};

HistoryNote.propTypes = {
  text: PropTypes.string
};

export default HistoryNote;
