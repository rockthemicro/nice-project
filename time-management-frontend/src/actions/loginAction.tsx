import {UserState} from "../Types";

const loginAction = (userState: UserState) => (dispatch: any) => {
    dispatch({
        type: 'LOG_IN',
        payload: userState
    })
};

export default loginAction;