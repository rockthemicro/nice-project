import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Space, DatePicker, Table, Button} from "antd";
import RoleEnum from "../../RoleEnum";
import axiosInstance from "../../index";
import {alertResponseMessages, responseIsSuccess} from "../../ResponseUtils";
import exportNotes from "./exportNotes";
import fileDownload from 'js-file-download'

const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

function NotesPage(props) {
    const render = (text, row, index) => {
        const color = row.flagged ? "red" : "green";

        const obj = {
            // children: row.flagged ? text.fontcolor("red") : text.fontcolor("green"),
            children: <p style={{color: color}}> {text} </p>,
            props: {},
        };

        return obj;
    }

    const columns = [
        {
            title: "Content",
            dataIndex: "content",
            render: render
        }, {
            title: "Hours",
            dataIndex: "hours",
            render: render
        }, {
            title: "Date",
            dataIndex: "date",
            render: render
        }, {
            title: "Actions",
            dataIndex: "actions"
        }
    ];
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getNoteActions = (note) => {
        return (
            <div>
                <Button onClick={handleEditNote(note)}>Edit</Button>
                <Button onClick={handleDeleteNote(note)}>Delete</Button>
            </div>
        );
    }

    useEffect(() => {
        if (props.loginReducer.userState.user.role === RoleEnum.USER) {
            const params = {};

            if (startDate != null) {
                params["from"] = startDate;
            }

            if (endDate != null) {
                params["to"] = endDate;
            }

            axiosInstance
                .get("/note/getNotes", { params: params })
                .then((response) => {
                    if (!responseIsSuccess(response)) {
                        alertResponseMessages(response);
                        return;
                    }

                    const indexedNotes = response.data.notes.map((note, index) => {
                        return {
                            ...note,
                            key: index,
                            actions: getNoteActions(note)
                        }
                    });
                    setData(indexedNotes);
                }, (error) => {
                    alert(error);
                });
        }
    }, [startDate, endDate]);

    const onChangeStartDate = (values) => {
        if (values == null) {
            setStartDate(null);
        } else {
            setStartDate(values.format("YYYY-MM-DD"));
        }
    }

    const onChangeEndDate = (values) => {
        if (values == null) {
            setEndDate(null);
        } else {
            setEndDate(values.format("YYYY-MM-DD"));
        }
    }

    const handleExport = () => {
        fileDownload(exportNotes(data), "notes.html");
    }

    const handleAddNote = () => {
        props.history.push("/notes/editNote/0");
    }

    const handleEditNote = (note) => () => {
        props.history.push("/notes/editNote/" + note.id, {
            note: note
        });
    }


    const handleDeleteNote = (note) => () => {

    }

    return (
        <div>
            <Space direction="vertical">
                <br/>
                <Space>
                    <DatePicker placeholder="Start Date" onChange={onChangeStartDate}/>
                    <DatePicker placeholder="End Date" onChange={onChangeEndDate}/>
                    <Button type="primary" onClick={handleExport}>
                        Export
                    </Button>
                    <Button onClick={handleAddNote}>
                        Add Note
                    </Button>
                </Space>
                <Table
                    columns={columns}
                    dataSource={data}
                    size="middle"
                    pagination={false}
                    scroll={{y: '30vw', scrollToFirstRowOnChange: true}}
                />
            </Space>

        </div>

    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(NotesPage);