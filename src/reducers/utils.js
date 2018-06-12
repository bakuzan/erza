import update from 'immutability-helper';

const getItem = action => action.item.node || action.item;

export function updateById(state, action) {
  const item = getItem(action);
  const staleItem = state.byId[item._id] || {};
  return update(state, {
    byId: {
      [item._id]: { $set: { ...staleItem, ...item } }
    }
  });
}

export function addEntity(state, action) {
  const updatedById = updateById(state, action);
  const item = getItem(action);
  const idExists = updatedById.allIds.find(x => x === item._id);
  if (idExists) return updatedById;

  return update(updatedById, {
    allIds: { $push: [item._id] }
  });
}

function addListEntity(state, action) {
  const item = getItem(action);
  const updatedById = update(state, {
    byId: {
      [item._id]: { $set: item }
    }
  });
  const idExists = updatedById.allIds.find(x => x === item._id);
  if (idExists) return updatedById;

  return update(updatedById, {
    allIds: { $push: [item._id] }
  });
}

export function loadEntityList(state, action) {
  const resetState = !action.pageChange;
  const newIds = [];
  let latestState = resetState ? { byId: {}, allIds: [] } : state;

  action.data.forEach(item => {
    const data = getItem({ item });
    newIds.push(data._id);
    latestState = addListEntity(latestState, { item });
  });
  return resetState
    ? latestState
    : (() => {
        const { itemsPerPage: pageSize, page } = action.paging;
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
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
  return update(state, {
    allIds: { $set: state.allIds.filter(x => x !== action.id) },
    byId: {
      $set: Object.keys(state.byId).reduce((o, k) => {
        if (k !== action.id) o[k] = state.byId[k];
        return o;
      }, {})
    }
  });
}
