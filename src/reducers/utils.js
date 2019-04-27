export function updateById(state, action) {
  const item = action.item;
  const staleItem = state.byId[item.id] || {};

  return {
    ...state,
    byId: {
      ...state.byId,
      [item.id]: { ...staleItem, ...item }
    }
  };
}

export function addEntity(state, action) {
  const updatedById = updateById(state, action);
  const item = action.item;

  const allIds = new Set(updatedById.allIds);
  allIds.add(item.id);

  return {
    ...updatedById,
    allIds: [...allIds.values()]
  };
}

function addListEntity(state, item) {
  const allIds = new Set(state.allIds);
  allIds.add(item.id);

  return {
    ...state,
    allIds: [...allIds.values()],
    byId: {
      ...state.byId,
      [item.id]: item
    }
  };
}

export function loadEntityList(state, action) {
  const resetState = !action.pageChange;
  const newIds = [];
  let latestState = resetState ? { byId: {}, allIds: [] } : state;

  action.data.forEach((item) => {
    newIds.push(item.id);
    latestState = addListEntity(latestState, item);
  });

  return resetState
    ? latestState
    : (() => {
        const { size, page } = action.paging;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        return {
          ...latestState,
          allIds: [
            ...latestState.allIds.slice(0, startIndex),
            ...newIds,
            ...latestState.allIds.slice(endIndex)
          ]
        };
      })();
}

export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

export function removeEntityById(state, action) {
  const allIds = new Set(state.allIds);
  allIds.delete(action.id);

  return {
    ...state,
    allIds: [...allIds.values()],
    byId: {
      ...Object.keys(state.byId).reduce((o, k) => {
        if (Number(k) !== action.id) {
          o[k] = state.byId[k];
        }

        return o;
      }, {})
    }
  };
}
