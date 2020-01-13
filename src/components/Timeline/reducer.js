import adjustDateMonth from 'ayaka/adjustDateMonth';
import getFirstDateOfMonth from 'ayaka/getFirstDateOfMonth';

export const MOVE_VIEW_DATE = 'MOVE_VIEW_DATE';
export const UPDATE_VIEW_DATE = 'UPDATE_VIEW_DATE';

export default function timelineReducer(state, action) {
  switch (action.type) {
    case MOVE_VIEW_DATE: {
      let viewDate = getFirstDateOfMonth(state.viewDate);
      viewDate = adjustDateMonth(viewDate, action.value);

      const currentMonth = new Date();

      return {
        ...state,
        viewDate: viewDate <= currentMonth ? viewDate : currentMonth
      };
    }
    case UPDATE_VIEW_DATE:
      return { ...state, viewDate: action.value };
    default:
      return state;
  }
}

export const initialState = () => ({
  viewDate: new Date()
});
