import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import configureStore from "./configureStore";

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

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Provider store={configureStore(initialState)}>
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
