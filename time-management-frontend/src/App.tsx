import React from 'react';
import './App.css';
import {Switch, Route} from "react-router-dom";
import RegisterAndAuthPage from "./components/RegisterAndAuthPage";

function App() {
  return (
    <div className="App">
        <Switch>
            <Route path="/">
                <RegisterAndAuthPage/>
            </Route>
        </Switch>
    </div>
  );
}

export default App;
