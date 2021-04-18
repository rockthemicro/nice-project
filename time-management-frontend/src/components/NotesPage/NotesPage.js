import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Button, DatePicker, InputNumber, Space, Table} from "antd";
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
            performGetNotes(false);
        } else if (props.loginReducer.userState.user.role === RoleEnum.ADMIN) {
            performGetNotes(true);
        }
    }, [startDate, endDate]);

    const performGetNotes = (weAreAdmin) => {
        setData([]);

        if (weAreAdmin && (!targetUserId || targetUserId <= 0)) {
            return;
        }

        const params = {};

        if (startDate != null) {
            params["from"] = startDate;
        }

        if (endDate != null) {
            params["to"] = endDate;
        }

        if (weAreAdmin) {
            params["userId"] = targetUserId;
        }

        let url = weAreAdmin ? "/note/getNotesForUser" : "/note/getNotes";

        axiosInstance
            .get(url, { params: params })
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

    const [targetUserId, setTargetUserId] = useState(0);

    const onChangeTargetUserId = (value) => {
        setTargetUserId(value);
    }

    const onEnterTargetUserId = () => {
        performGetNotes(true);
    }

    return (
        <div>
            <Space direction="vertical">
                <br/>
                <Space>
                    {
                        props.loginReducer.userState.user.role === RoleEnum.ADMIN &&
                        <InputNumber
                            name="targetUserId"
                            placeholder="User Id"
                            onChange={onChangeTargetUserId}
                            onPressEnter={onEnterTargetUserId}
                        />
                    }
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