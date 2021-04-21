import React, {useEffect, useState} from "react";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Space, Select, Form, Input, InputNumber, Button} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import RoleEnum from "../../RoleEnum";
import {alertResponseMessages, responseIsSuccess} from "../../ResponseUtils";
import loginAction from "../../actions/loginAction";
import axios from "axios";


const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
    loginAction: (userState) => dispatch(loginAction(userState))
});

function UsersPage(props) {
    const [form] = Form.useForm();

    /**
     * targetUser is the user whose information will be desplayed in the form
     * if we are at path /user, then targetUser is the logged user
     * if we are at path /users/:userId, then targetUser is the user with id :userId
     */
    const [targetUser, setTargetUser] = useState({});

    /**
     * this is the value of the InputNumber box for switching the targetUser
     */
    const [inputUserId, setInputUserId] = useState(0);

    const performLoadUser = () => {
        const userId = props.match.params.userId;

        if (userId !== undefined && userId !== "0") {
            axios
                .get("/user/manage/getUser", { params: {
                        userId: props.match.params.userId
                    }})
                .then((response) => {
                    if (!responseIsSuccess(response)) {
                        alertResponseMessages(response);
                        return;
                    }

                    setTargetUser(response.data.user);

                }, (error) => {
                    setTargetUser({});
                    alert(error);
                })
        } else if (userId === undefined) {
            setTargetUser(props.loginReducer.userState.user);
        } else {
            setTargetUser({});
        }
    }

    /**
     * Step 3 page is reloaded when userId is changed
     */
    useEffect(() => {
        performLoadUser();
    }, [props.match.params.userId]);

    /**
     * Step 4 performLoadUser will update the targetUser, and this will trigger the
     * re-rendering of our components
     */
    useEffect(() => {
        form.setFieldsValue({
            username: targetUser.username,
            preferredWorkingHours: targetUser.preferredWorkingHours,
            role: targetUser.role,
            password: "",
            repeat_password: ""
        })
    }, [targetUser]);

    /**
     * Step 1 Change the User Id
     * @param value
     */
    const onChangeInputUserId = (value) => {
        setInputUserId(value);
    }

    /**
     * Step 2 Press enter on User Id and trigger page reload by changing
     * :noteId at /users/:noteId
     */
    const onEnterInputUserId = () => {
        props.history.push("/users/" + inputUserId);
    }

    const handleCancelForm = () => {
        performLoadUser();
    }

    const onFinish = (values) => {
        let url;
        let isSelfUpdate = false;
        const postData = {
            id: targetUser.id,
            username: values.username,
            role: values.role,
            preferredWorkingHours: values.preferredWorkingHours
        };

        if (values.password || values.repeat_password) {
            if (values.password === values.repeat_password) {
                postData.password = values.password;
            } else {
                alert("Passwords don't match!");
                return;
            }
        }

        if (targetUser.id === props.loginReducer.userState.user.id) {
            url = "/user/selfUpdate";
            isSelfUpdate = true;
        } else {
            url = "/user/manage/createOrUpdate";
        }

        axios
            .post(url, postData)
            .then((response) => {
                if (!responseIsSuccess(response)) {
                    alertResponseMessages(response);
                }

                if (isSelfUpdate) {
                    props.loginAction({
                        token: props.loginReducer.userState.token,
                        user: postData
                    });
                }
            }, (error) => {
                alert(error);
            });
    }

    const handleOnDelete = () => {
        const url = "/user/manage/deleteUser";

        axios
            .delete(url, {params: {userId: props.match.params.userId}})
            .then((response) => {
                if (!responseIsSuccess(response)) {
                    alertResponseMessages(response);
                    return;
                }

                props.history.push("/users/0");
            }, (error) => {
                alert(error);
            });
    }

    return (
        <div>
            <Space direction="vertical" size={25}>
                {props.match.params.userId &&
                <InputNumber
                    min={1}
                    style={{width: "100%"}}
                    placeholder="User Id"
                    onChange={onChangeInputUserId}
                    onPressEnter={onEnterInputUserId}
                />}
                <Form
                    form={form}
                    name="user_form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    size={"large"}
                    style={{maxWidth: '400px', margin: '0 auto'}}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="Username"
                            disabled={!props.match.params.userId}
                        />
                    </Form.Item>


                    <Form.Item
                        name="password"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>


                    <Form.Item
                        name="repeat_password"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Repeat Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="preferredWorkingHours"
                    >
                        <InputNumber
                            style={{width: "100%"}}
                            min={1}
                            placeholder="Preferred Working Hours"
                        />
                    </Form.Item>


                    <Form.Item
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Please choose a role!",
                            }
                        ]}
                    >
                        <Select
                            placeholder="Role"
                        >
                            <Select.Option value={RoleEnum.USER}>{RoleEnum.USER}</Select.Option>
                            <Select.Option value={RoleEnum.MANAGER}>{RoleEnum.MANAGER}</Select.Option>
                            <Select.Option value={RoleEnum.ADMIN}>{RoleEnum.ADMIN}</Select.Option>
                        </Select>
                    </Form.Item>


                    <Space>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={handleCancelForm}>
                                Cancel
                            </Button>
                        </Form.Item>

                        {props.match.params.userId &&
                        <Form.Item>
                            <Button type="primary" danger onClick={handleOnDelete}>
                                Delete
                            </Button>
                        </Form.Item>}
                    </Space>
                </Form>
            </Space>
        </div>
    );
}


export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(UsersPage);