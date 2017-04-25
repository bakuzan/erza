import update from 'immutability-helper';

export function updateById(state, action) {
  return update(state, {
    byId: {
      [action.item._id]: { $set: action.item }
    }
  })
}

export function addEntity(state, action) {
  const updatedById = updateById(state, action);
  const idExists = updatedById.allIds.find(x => x === action.item._id);
  if (idExists) return updatedById;

  return update(updatedById, {
    allIds: { $push: [action.item._id] }
  })
}

export function addListEntity(state, action) {
  const updatedById = update(state, {
    byId: {
      [action.item.node._id]: { $set: action.item }
    }
  });
  const idExists = updatedById.allIds.find(x => x === action.item.node._id);
  if (idExists) return updatedById;

  return update(updatedById, {
    allIds: { $push: [action.item.node._id] }
  })
}

export function loadEntityList(state, action) {
  let latestState = state;
  action.data.forEach(item => {
    latestState = addListEntity(latestState, { item });
  });
  return latestState;
}

export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
