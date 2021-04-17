import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import RegisterAndAuthPage from "./components/RegisterAndAuthPage/index";
import NotesPage from "./components/NotesPage/NotesPage";

function App() {
    return (
    <div className="App">
        <Switch>

            <Route path="/notes">
                <NotesPage/>
            </Route>

            <Route path="/">
                <RegisterAndAuthPage/>
            </Route>

        </Switch>
    </div>
  );
}

export default App;
