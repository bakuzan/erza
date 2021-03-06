import Strings from 'constants/strings';

const themeOne = {
  baseBackground: 'ffffff',
  baseBackgroundHover: 'd9d9d9',
  baseColour: '000000',
  colour: '850512',
  contrast: '414143',
  anchorColour: '850512',
  anchorColourHover: '414143',
  primaryBackground: '850512',
  primaryBackgroundHover: 'cf081c',
  primaryColour: 'e1e3ef',
  neutralColour: 'B0B0B0'
};

const themeTwo = {
  baseBackground: '420309',
  baseBackgroundHover: '8b0613',
  baseColour: 'ffffff',
  colour: 'e49aa1',
  contrast: 'e1e3ef',
  anchorColour: 'e49aa1',
  anchorColourHover: 'e1e3ef',
  primaryBackground: '850512',
  primaryBackgroundHover: 'cf081c',
  primaryColour: 'e1e3ef',
  neutralColour: 'DD0319'
};

const themeList = [themeOne, themeTwo];

const DEFAULT_THEME = themeOne;
const themes = new Map(Strings.themes.map((o, i) => [o.value, themeList[i]]));

export default function getTheme(key, opts = {}) {
  const prependHash = opts.prependHash ?? false;
  const theme = { ...(themes.get(key) || DEFAULT_THEME) };

  if (prependHash) {
    Object.keys(theme).forEach((key) => (theme[key] = `#${theme[key]}`));
  }

  return theme;
}
