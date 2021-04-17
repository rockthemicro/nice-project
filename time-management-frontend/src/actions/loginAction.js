
const loginAction = (userState) => (dispatch) => {
    debugger;
    dispatch({
        type: 'LOG_IN',
        payload: userState
    })
};

export default loginAction;