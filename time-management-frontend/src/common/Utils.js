import RoleEnum from "./RoleEnum";
import axios from "axios";
import {alertResponseMessages, responseIsSuccess} from "./ResponseUtils";

const getUsers = (user, setUserOptions) => {
    if (user.id === 0) {
        return;
    }

    if (user.role === RoleEnum.USER) {
        return;
    }

    axios
        .get("/user/manage/getUsers")
        .then((response) => {
            if (!responseIsSuccess(response)) {
                alertResponseMessages(response);
                return;
            }

            setUserOptions(response.data.users);
        }, (error) => {
            alert(error);
        })
}

export { getUsers };