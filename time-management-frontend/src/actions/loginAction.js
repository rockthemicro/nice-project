
const loginAction = (userState) => (dispatch) => {
    dispatch({
        type: 'LOG_IN',
        payload: userState
    })
};

export default loginAction;