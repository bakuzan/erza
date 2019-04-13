import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { withButtonisation, NewTabLink, Button as MButton } from 'mko';

const LINK_CUSTOM_PROPS = {
  className: 'erza-button-link',
  link: true
};

function withCustomButtonWrapper(
  WrappedComponent,
  { className: customClass, ...customProps }
) {
  return function({ className, ...props }) {
    return (
      <WrappedComponent
        {...props}
        className={classNames(customClass, className)}
        {...customProps}
      />
    );
  };
}

export const ButtonisedNavButton = withCustomButtonWrapper(
  withButtonisation(NavLink),
  { className: 'erza-button' }
);
export const ButtonisedNavLink = withCustomButtonWrapper(
  withButtonisation(NavLink),
  LINK_CUSTOM_PROPS
);
export const ButtonisedNewTabLink = withCustomButtonWrapper(
  withButtonisation(NewTabLink),
  LINK_CUSTOM_PROPS
);
export const ButtonLink = withCustomButtonWrapper(MButton, LINK_CUSTOM_PROPS);
export const Button = withCustomButtonWrapper(MButton, {
  className: 'erza-button'
});
export const ButtonIcon = withCustomButtonWrapper(MButton, {
  className: 'erza-button-icon'
});
