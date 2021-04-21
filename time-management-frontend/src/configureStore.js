import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/lib/storage';
export default function configureStore(initialState={}) {

    const persistConfig = {
        key: 'loginReducer',
        storage: storage,
        whitelist: ['loginReducer']
    };
    const pReducer = persistReducer(persistConfig, rootReducer);

    const store = createStore(
        pReducer,
        initialState,
        applyMiddleware(thunk)
    );
    persistStore(store);

    return store;
}