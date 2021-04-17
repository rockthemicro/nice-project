import React from "react";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";


const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

function UsersPage(props) {
    return (
        <div>
            hello
        </div>
    );
}


export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(UsersPage);