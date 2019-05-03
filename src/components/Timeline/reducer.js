export const MOVE_VIEW_DATE = 'MOVE_VIEW_DATE';
export const UPDATE_VIEW_DATE = 'UPDATE_VIEW_DATE';

export default function timelineReducer(state, action) {
  switch (action.type) {
    case MOVE_VIEW_DATE: {
      const viewDate = new Date(state.viewDate);
      viewDate.setMonth(viewDate.getMonth() + action.value);

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
