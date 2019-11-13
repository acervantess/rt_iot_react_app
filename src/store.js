import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

//Considerar uso de redux-persist para mantener el estado de la store
//cuando se cierra la app. Si se usa hay que incluir compose (redux)
//para incluir varias funciones a la store

export default store;
