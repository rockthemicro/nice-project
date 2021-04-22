import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import configureStore from "./configureStore";
import axios from "axios";
import RoleEnum from "./common/RoleEnum";

const initialUserState = {
    token: "",
    user: {
        id: 0,
        username: "",
        password: "",
        preferredWorkingHours: 0,
        role: RoleEnum.USER,
    }
}

const store = configureStore({
    loginReducer: {
        userState: initialUserState
    }
});

axios.interceptors.request.use(req => {
    if (store.getState().loginReducer.userState.token) {
        req.headers.authorization = 'Bearer ' + store.getState().loginReducer.userState.token;
    }

    req.baseURL = 'http://localhost:8080/api';

    return req;
});

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Provider store={store}>
              <App />
          </Provider>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
