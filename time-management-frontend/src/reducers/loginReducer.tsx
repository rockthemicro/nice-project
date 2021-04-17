
export default (state = {}, action: any) => {
    if (action.type === "LOG_IN") {
        return {
            userState: state
        }
    }

    return state;
};