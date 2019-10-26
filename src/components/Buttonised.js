import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { withButtonisation, Button as MButton } from 'meiko/Button';
import NewTabLink from 'meiko/NewTabLink';
import { nano } from 'meiko/styles/nano';

nano.put(
  '.label:nth-child(odd):hover + .value .erza-button-link--hover-override',
  {
    color: 'inherit'
  }
);

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
