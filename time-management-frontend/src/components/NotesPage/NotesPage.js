import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";


const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

function NotesPage(props) {

    return (
        <div>
            button
            <div>
                {props.loginReducer.userState.token}
            </div>
        </div>

    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(NotesPage);