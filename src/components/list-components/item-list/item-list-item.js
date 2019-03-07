import PropTypes from 'prop-types';
import React from 'react';

import { withButtonisation, Image, NewTabLink } from 'meiko';
import {
  ButtonisedNavButton,
  ButtonisedNewTabLink,
  ButtonIcon
} from 'components/buttonised';
import { Paths } from '../../../constants/paths';
import { Enums, Icons } from '../../../constants/values';
import { getKeyByValue, formatDateTimeForDisplay } from '../../../utils/common';
import { getUniquePropertiesForItemType } from '../../../utils/data';

const SpanIcon = (props) => <span {...props} />;
const ButtonisedSpan = withButtonisation(SpanIcon);

const ItemListItem = ({ type, item, addAction }) => {
  const { current, total } = getUniquePropertiesForItemType(type);
  const hasMalId = !!item.malId;
  const hasLink = !!item.link;
  const statusIcon = item.isRepeat
    ? Icons.clockwise
    : item.status === Enums.status.onhold
    ? Icons.pause
    : item.status === Enums.status.completed
    ? Icons.tick
    : null;

  return (
    <li className={`${type}-item`}>
      <div>
        <time dateTime={item.updatedDate}>
          {formatDateTimeForDisplay(item.updatedDate)}
        </time>
        <h4>{item.title}</h4>
        <div className="flex-row start-center-contents">
          {!!addAction && (
            <ButtonIcon
              btnStyle="primary"
              btnSize="small"
              rounded
              icon="+"
              onClick={() => addAction(item._id)}
              disabled={
                item.status === Enums.status.completed && !item.isRepeat
              }
            />
          )}
          <span>{`${item[current]}/${item[total] || '??'}`}</span>
          {!!statusIcon && (
            <ButtonisedSpan
              btnSize="small"
              className="bold"
              icon={statusIcon}
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
            />
          )}
        </div>
      )}
      <div className="series-image-container">
        <Image src={item.image} alt={`Cover for ${item.title}`} />
      </div>
    </li>
  );
};

ItemListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  addAction: PropTypes.func
};

export default ItemListItem;
