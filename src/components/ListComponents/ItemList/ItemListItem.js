import PropTypes from 'prop-types';
import React from 'react';

import { withButtonisation, NewTabLink } from 'mko';
import {
  ButtonisedNavButton,
  ButtonisedNewTabLink,
  ButtonIcon
} from 'components/Buttonised';
import SeriesImageContainer from 'components/SeriesImageContainer';
import { Paths } from 'constants/paths';
import { Enums, Icons } from 'constants/values';
import { getKeyByValue, formatDateTimeForDisplay } from 'utils';
import { getUniquePropertiesForItemType } from 'utils/data';

const SpanIcon = (props) => <span {...props} />;
const ButtonisedSpan = withButtonisation(SpanIcon);

const ItemListItem = ({ type, item, addAction }) => {
  const { current, total } = getUniquePropertiesForItemType(type);
  const hasMalId = !!item.malId;
  const hasLink = !!item.link;
  const iconStatusProps = item.isRepeat
    ? { icon: Icons.clockwise, [`aria-label`]: 'Is Repeat' }
    : item.status === Enums.status.onhold
    ? { icon: Icons.pause, [`aria-label`]: 'On hold' }
    : item.status === Enums.status.completed
    ? { icon: Icons.tick, [`aria-label`]: 'Completed' }
    : null;

  return (
    <li className={`${type}-item list-item`}>
      <div>
        <time dateTime={item.updatedDate}>
          {formatDateTimeForDisplay(item.updatedDate)}
        </time>
        <h4>{item.title}</h4>
        <div className="flex flex--row start-center-contents">
          {!!addAction && (
            <ButtonIcon
              btnStyle="primary"
              btnSize="small"
              className="list-item__plus-button"
              icon="+"
              aria-label={`Add ${item.title} ${current}s`}
              onClick={() => addAction(item._id)}
              disabled={
                item.status === Enums.status.completed && !item.isRepeat
              }
            />
          )}
          <span>{`${item[current]}/${item[total] || '??'}`}</span>
          {!!iconStatusProps && (
            <ButtonisedSpan
              btnSize="small"
              className="bold"
              {...iconStatusProps}
              title={getKeyByValue(Enums.status, item.status)}
            />
          )}
        </div>
        <div className="button-group fixed-width">
          <ButtonisedNavButton
            to={`${Paths.base}${Paths[type].view}${item._id}`}
            className="ripple"
          >
            View
          </ButtonisedNavButton>
          <ButtonisedNavButton
            to={`${Paths.base}${Paths[type].edit}${item._id}`}
            className="ripple"
          >
            Edit
          </ButtonisedNavButton>
        </div>
      </div>
      <div className="flex-spacer" />
      {(hasMalId || hasLink) && (
        <div className="mal-image">
          {hasMalId && (
            <NewTabLink
              href={`https://myanimelist.net/${type}/${item.malId}`}
              className="mal-link"
              title="Open MAL entry in new tab."
              aria-label={`Open MAL entry for ${item.title} in new tab.`}
            >
              <img
                src="https://myanimelist.net/favicon.ico"
                alt="MyAnimelist icon"
              />
            </NewTabLink>
          )}
          {hasLink && (
            <ButtonisedNewTabLink
              href={item.link}
              btnSize="small"
              icon={Icons.link}
              title="Open content link"
              aria-label={`Open content link for ${item.title} in new tab.`}
            />
          )}
        </div>
      )}
      <SeriesImageContainer src={item.image} alt={`Cover for ${item.title}`} />
    </li>
  );
};

ItemListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  addAction: PropTypes.func
};

export default ItemListItem;
