const exportNotes = (notes) => {
    let previousDate = "";
    let result = "";

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];

        if (note.date !== previousDate && previousDate) {
            result += "</ul></ul>";
        }

        if (note.date !== previousDate) {
            previousDate = note.date;
            result += "<ul>";
            result += "<li>Date: " + note.date + "</li>";
            result += "<li>Total time: " + getTotalTime(notes, i) + "</li>";
            result += "<li>Notes:</li>";
            result += "<ul>";
        }

        result += "<li>" + note.content + "</li>";

    }

    if (notes.length > 0) {
        result += "</ul></ul>";
    }

    return result;
};

const getTotalTime = (notes, idx) => {
    let sum = 0;
    let date = notes[idx].date;

    while (notes[idx] && notes[idx].date === date) {
        sum += notes[idx].hours;
        idx++;
    }

    return sum;
}

export default exportNotes;