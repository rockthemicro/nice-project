import React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import { withRouter } from "react-router-dom";
import {compose} from "redux";


const mapStateToProps:MapStateToProps<any, any> = (state: any) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps:MapDispatchToProps<any, any> = (dispatch: any) => ({
});

function NotesPage(props: any) {

    return (
        <div>
            {props.loginReducer.userState}
        </div>
    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(NotesPage);