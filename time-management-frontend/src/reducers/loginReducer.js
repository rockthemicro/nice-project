
const loginReducer = (state = {}, action) => {
    if (action.type === "LOG_IN") {
        return {
            userState: action.payload
        }
    }

    return state;
};

export default loginReducer;