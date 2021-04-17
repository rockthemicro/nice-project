
export default (state = {}, action) => {
    debugger;
    if (action.type === "LOG_IN") {
        return {
            userState: state
        }
    }

    return state;
};