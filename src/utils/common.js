import {Strings} from '../constants/values'

export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const parseIfInt = (val) => parseInt(val, 10) || val;
export const getEventValue = ({ type, checked, value }) =>
  type === Strings.checkbox                      ? checked :
  type === Strings.date || type === Strings.text ? value   :
                                                   parseIfInt(value);
