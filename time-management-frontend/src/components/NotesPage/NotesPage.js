import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Form, Button, DatePicker, Select, Space, Table} from "antd";
import RoleEnum from "../../common/RoleEnum";
import {alertResponseMessages, responseIsSuccess} from "../../common/ResponseUtils";
import exportNotes from "./exportNotes";
import fileDownload from 'js-file-download'
import axios from "axios";
import {getUsers} from "../../common/Utils";
import moment from "moment";

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
    const [startDate, setStartDate] = useState(!!props.location.state?.startDate ?
        props.location.state.startDate : null);
    const [endDate, setEndDate] = useState(!!props.location.state?.endDate ?
        props.location.state.endDate : null);
    const [enteredTargetUserId, setEnteredTargetUserId] = useState(!!props.location.state?.targetUserId ?
        props.location.state.targetUserId : 0);

    const getNoteActions = (note) => {
        return (
            <div>
                <Button onClick={handleEditNote(note)}>Edit</Button>
                <Button onClick={handleDeleteNote(note)}>Delete</Button>
            </div>
        );
    }

    /**
     * Beginning: Page gets reloaded whenever there's a change in startDate/endDate/logged user id
     */
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
        props.history.push("/notes/editNote/0" + getEditNotesUserIdSuffix(), {
            startDate: startDate,
            endDate: endDate,
            targetUserId: enteredTargetUserId
        });
    }

    const handleEditNote = (note) => () => {
        props.history.push("/notes/editNote/" + note.id + getEditNotesUserIdSuffix(), {
            note: note,
            startDate: startDate,
            endDate: endDate,
            targetUserId: enteredTargetUserId
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

    /**
     * Step 2 Page gets reloaded when the targeted user id changes
     */
    useEffect(() => {
        if (props.loginReducer.userState.user.id === 0) {
            return;
        }
        performGetNotes(true);
    }, [enteredTargetUserId]);

    const [userOptions, setUserOptions] = useState([]);

    /**
     * Fill the User Suggestions at the beginning
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

    const [form] = Form.useForm();

    /**
     * When we return from EditNote, we need to update the appearance
     * of startDate, endDate and Target Username
     */
    useEffect(() => {
        const data = {};

        if (!!props.location.state?.startDate) {
            data.startDate = moment(props.location.state.startDate, "YYYY-MM-DD");
        }

        if (!!props.location.state?.endDate) {
            data.endDate = moment(props.location.state.endDate, "YYYY-MM-DD");
        }

        if (!!props.location.state?.targetUserId && userOptions.length !== 0) {
            const targetUserId = props.location.state.targetUserId;
            const userOptionsIds = userOptions.map(user => user.id);
            const index = userOptionsIds.indexOf(targetUserId);
            const userOption = userOptions[index];

            data.target_username = userOption.username;
        }

        form.setFieldsValue(data);

    }, [props.location.state, userOptions]);

    return (
        <div>
            <Space direction="vertical">
                <br/>
                <Form form={form}>
                    <Space>
                        {props.loginReducer.userState.user.role === RoleEnum.ADMIN &&
                        <Form.Item name="target_username">
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
                            </Select>
                        </Form.Item>}

                        <Form.Item name="startDate">
                            <DatePicker placeholder="Start Date" onChange={onChangeStartDate}/>
                        </Form.Item>

                        <Form.Item name="endDate" >
                            <DatePicker placeholder="End Date" onChange={onChangeEndDate}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={handleExport}>
                                Export
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={handleAddNote}>
                                Add Note
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
                <Table
                    columns={columns}
                    dataSource={data} // Step 3 Table gets reloaded
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