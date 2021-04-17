import StatusEnum from "./StatusEnum";

// TODO add a nicer alert logger at the end
const alertResponseMessages = (response) => {
    let output = "";

    for (const message of response.data.messages) {
        output = output + message.statusEnum + ": " + message.content + "\n";
    }

    alert(output);
}

const responseIsSuccess = (response) => {
    return response.data.statusEnum === StatusEnum.SUCCESS;
}

export {alertResponseMessages, responseIsSuccess};