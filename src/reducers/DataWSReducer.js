import {
  DATA_WS_RESET_GRAPH_RAW_DATA_STATE,
  DATA_WS_INITIALIZE_GRAPH,
  DATA_WS_PROCESS_GRAPH_RAW_DATA_MQTT,
  DATA_WS_INITIALIZE_GRAPH_LENGTH,
  DATA_WS_RESET
} from '../actions/types';

const INITIAL_STATE = {
  lengths: {},
  lastConnection: {},
  };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DATA_WS_RESET_GRAPH_RAW_DATA_STATE:
      let currentState = {...state};
      delete currentState[action.payload];
      return { ...currentState};
    case DATA_WS_INITIALIZE_GRAPH:
      let array = action.payload.storeArray;
      return {
        ...state,
        [action.payload.storeKey]: array
      };
    case DATA_WS_PROCESS_GRAPH_RAW_DATA_MQTT:
      let graphState = {};
      try {
        graphState[action.payload.storeKey] = [...state[action.payload.storeKey]];
        if (graphState[action.payload.storeKey])
        {
          if (graphState[action.payload.storeKey].length >= state.lengths[action.payload.storeKey]) {
            graphState[action.payload.storeKey].push(action.payload.value);
            graphState[action.payload.storeKey].shift();
          }
          return {
            ...state,
            ...graphState,
          };
        }
      } catch (e) {
        console.log(e);
      }
      return {...state};


    case DATA_WS_INITIALIZE_GRAPH_LENGTH:
      let lengths = { ...state.lengths };
      lengths[action.payload.storeKey] = action.payload.length;
      return {
        ...state,
        lengths,
      };
    case DATA_WS_RESET:
      return {...INITIAL_STATE};
    default:
      return state;
  }
};
