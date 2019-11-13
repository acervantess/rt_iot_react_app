import { combineReducers } from 'redux';
import DataWSReducer from './DataWSReducer';

export default combineReducers({
  dataWS: DataWSReducer,
});
