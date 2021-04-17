import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import configureStore from "./configureStore";
import axios from "axios";
import {Store} from "redux";

enum Role {
    USER,
    MANAGER,
    ADMIN
}

interface User {
     id: number;
     username: string;
     password: string;
     role: Role;
     preferredWorkingHours: number;
}

interface ApplicationState {
    token: string;
    user: User;
}

const initialState: ApplicationState = {
    token: "",
    user: {
        id: 0,
        username: "",
        password: "",
        preferredWorkingHours: 0,
        role: Role.USER,
    }
}

const store: Store = configureStore(initialState);

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api'
});

axiosInstance.interceptors.request.use(req => {
    // `req` is the Axios request config, so you can modify
    // the `headers`.
    if (store.getState().token) {
        req.headers.authorization = 'Bearer ' + store.getState().token;
    }

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default axiosInstance;
