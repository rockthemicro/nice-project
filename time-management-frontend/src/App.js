import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import RegisterAndAuthPage from "./components/RegisterAndAuthPage/index";
import NotesPage from "./components/NotesPage/NotesPage";
import UsersPage from "./components/UsersPage/UsersPage";
import EditNote from "./components/EditNote/EditNote";
import {Space} from "antd";
import AppMenu from "./components/AppMenu/AppMenu";

function App() {
    return (
    <div className="App">
        <Space>
            <AppMenu/>
            <Switch>
                <Route path="/notes/editNote/:noteId/user/:userId">
                    <EditNote/>
                </Route>
                <Route path="/notes/editNote/:noteId">
                    <EditNote/>
                </Route>
                <Route path="/notes">
                    <NotesPage/>
                </Route>

                <Route path="/users/:userId">
                    <UsersPage/>
                </Route>
                <Route path="/users">
                    <UsersPage/>
                </Route>

                <Route path="/">
                    <RegisterAndAuthPage/>
                </Route>
            </Switch>
        </Space>
    </div>
  );
}

export default App;
