import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";


const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

const f = (value) => () => {
    debugger;
    alert(value);
}

function NotesPage(props) {

    return (
        <div onClick={f(props.loginReducer.userState.token)}>
            button
        </div>
    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(NotesPage);