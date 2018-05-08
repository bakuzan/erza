import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { withButtonisation, NewTabLink, Button as MButton } from 'meiko';

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

export const ButtonisedNavButton = withButtonisation(
  withCustomButtonWrapper(NavLink, { className: 'erza-button' })
);
export const ButtonisedNavLink = withButtonisation(
  withCustomButtonWrapper(NavLink, LINK_CUSTOM_PROPS)
);
export const ButtonisedNewTabLink = withButtonisation(
  withCustomButtonWrapper(NewTabLink, LINK_CUSTOM_PROPS)
);
export const ButtonLink = withCustomButtonWrapper(MButton, LINK_CUSTOM_PROPS);
export const Button = withCustomButtonWrapper(MButton, {
  className: 'erza-button'
});
export const ButtonIcon = withCustomButtonWrapper(MButton, {
  className: 'erza-button-icon'
});
