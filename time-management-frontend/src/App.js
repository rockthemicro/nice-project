import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import RegisterAndAuthPage from "./components/RegisterAndAuthPage/index";
import NotesPage from "./components/NotesPage/NotesPage";
import UsersPage from "./components/UsersPage/UsersPage";
import EditNote from "./components/EditNote/EditNote";

function App() {
    return (
    <div className="App">
        <Switch>

            <Route path="/notes/editNote/:noteId">
                <EditNote/>
            </Route>
            <Route path="/notes">
                <NotesPage/>
            </Route>

            <Route path="/users">
                <UsersPage/>
            </Route>

            <Route path="/">
                <RegisterAndAuthPage/>
            </Route>

        </Switch>
    </div>
  );
}

export default App;
