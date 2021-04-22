import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Button, DatePicker, Select, Space, Table} from "antd";
import RoleEnum from "../../RoleEnum";
import {alertResponseMessages, responseIsSuccess} from "../../ResponseUtils";
import exportNotes from "./exportNotes";
import fileDownload from 'js-file-download'
import axios from "axios";
import {getUsers} from "../../common/Utils";

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
    const [enteredTargetUserId, setEnteredTargetUserId] = useState(0);


    const getNoteActions = (note) => {
        return (
            <div>
                <Button onClick={handleEditNote(note)}>Edit</Button>
                <Button onClick={handleDeleteNote(note)}>Delete</Button>
            </div>
        );
    }

    useEffect(() => {
        if (props.loginReducer.userState.user.id === 0) {
            return;
        }

        if (props.loginReducer.userState.user.role === RoleEnum.USER) {
            performGetNotes(false);
        } else if (props.loginReducer.userState.user.role === RoleEnum.ADMIN) {
            performGetNotes(true);
        }
    }, [startDate, endDate, props.loginReducer.userState.user.id]);

    const performGetNotes = (weAreAdmin) => {
        setData([]);

        if (weAreAdmin && (!enteredTargetUserId || enteredTargetUserId <= 0)) {
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
            params["userId"] = enteredTargetUserId;
        }

        let url = weAreAdmin ? "/note/getNotesForUser" : "/note/getNotes";

        axios
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

    const getEditNotesUserIdSuffix = () => {
        let suffix = "";

        if (props.loginReducer.userState.user.role === RoleEnum.ADMIN) {
            suffix += "/user/" + enteredTargetUserId;
        }

        return suffix;
    }

    const handleAddNote = () => {
        props.history.push("/notes/editNote/0" + getEditNotesUserIdSuffix());
    }

    const handleEditNote = (note) => () => {
        props.history.push("/notes/editNote/" + note.id + getEditNotesUserIdSuffix(), {
            note: note
        });
    }

    const handleDeleteNote = (note) => () => {
        let url;
        const params = {};
        const deleteData = { noteIds: [note.id] };
        let weAreAdmin;

        if (props.loginReducer.userState.user.role === RoleEnum.ADMIN) {
            url = "/note/deleteNotesForUser";
            params.userId = enteredTargetUserId;
            weAreAdmin = true;
        } else {
            url = "/note/deleteNotes";
            weAreAdmin = false;
        }

        axios
            .delete(url, {
                params: params,
                data: deleteData
            })
            .then((response) => {
                if (!responseIsSuccess(response)) {
                    alertResponseMessages(response);
                    return;
                }
                performGetNotes(weAreAdmin);
            }, (error) => {
                alert(error);
            })
    }

    useEffect(() => {
        performGetNotes(true);
    }, [enteredTargetUserId]);

    const [userOptions, setUserOptions] = useState([]);

    /**
     * Fill the User Suggestions
     */
    useEffect(() => {
        getUsers(props.loginReducer.userState.user, setUserOptions);
    }, [props.loginReducer.userState.user.id]);

    /**
     * Step 1 Select a username from the dropdown and trigger page reload
     * @param value
     */
    const onSelectChange = (value) => {
        const userOptionsUsernames = userOptions.map(user => user.username);
        const index = userOptionsUsernames.indexOf(value);
        const userOption = userOptions[index];

        setEnteredTargetUserId(userOption.id);
    }

    return (
        <div>
            <Space direction="vertical">
                <br/>
                <Space>
                    {props.loginReducer.userState.user.role === RoleEnum.ADMIN &&
                    <Select
                        showSearch
                        style={{width: "200px"}}
                        placeholder="Target Username"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={onSelectChange}
                    >
                        {userOptions.map((user, index) => {
                            return (
                                <Select.Option value={user.username} key={index}>
                                    {user.username}
                                </Select.Option>
                            );
                        })}
                    </Select>}

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