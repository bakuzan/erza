import React from 'react';
import { NavLink } from 'react-router-dom';
import { withButtonisation, NewTabLink } from 'meiko';

export const ButtonisedNavLink = withButtonisation(NavLink);

export const ButtonisedNewTabLink = withButtonisation(NewTabLink);
