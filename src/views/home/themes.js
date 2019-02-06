import Strings from 'constants/strings';

const themeOne = {
  baseBackground: 'ffffff',
  baseBackgroundHover: 'd9d9d9',
  baseColour: '000000',
  colour: '850512',
  contrast: '7e7e86',
  anchorColour: 'ce414a',
  anchorColourHover: 'e1e3ef',
  primaryBackground: '850512',
  primaryBackgroundHover: 'cf081c',
  primaryColour: 'e1e3ef'
};

const themeTwo = {
  baseBackground: '420309',
  baseBackgroundHover: '8b0613',
  baseColour: 'ffffff',
  colour: 'ce414a',
  contrast: 'e1e3ef',
  anchorColour: '7e7e86',
  anchorColourHover: '850512',
  primaryBackground: '850512',
  primaryBackgroundHover: 'cf081c',
  primaryColour: 'e1e3ef'
};

const themeList = [themeOne, themeTwo];

export const DEFAULT_THEME = themeOne;
export const themes = new Map(
  Strings.themes.map((o, i) => [o.class, themeList[i]])
);
