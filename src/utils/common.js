import {Strings} from '../constants/values'

export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const parseIfInt = (val) => parseInt(val) || val;
export const getEventValue = ({ type, checked, value }) => 
  type === Strings.checkbox   ? checked : 
  type === Strings.selectbox  ? parseIfInt(value) : 
                                value;
