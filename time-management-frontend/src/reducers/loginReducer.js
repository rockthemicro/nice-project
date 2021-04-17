
export default (state = {}, action) => {
    if (action.type === "LOG_IN") {
        return {
            userState: {
                token: action.payload.token,
                user: action.payload.user
            }
        }
    }

    return state;
};