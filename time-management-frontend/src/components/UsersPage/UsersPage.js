import React, {useEffect, useState} from "react";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Space, Select, Form, Input, InputNumber, Button} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import RoleEnum from "../../RoleEnum";
import {alertResponseMessages, responseIsSuccess} from "../../ResponseUtils";
import axiosInstance from "../../index";


const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

function UsersPage(props) {
    const [form] = Form.useForm();

    const onFinish = (values) => {

    }

    const [targetUser, setTargetUser] = useState({});
    const [inputUserId, setInputUserId] = useState(0);

    const performLoadUser = () => {
        const userId = props.match.params.userId;

        debugger;
        if (userId !== undefined && userId !== "0") {
            axiosInstance
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

    useEffect(() => {
        performLoadUser();
    }, [props.match.params.userId]);

    useEffect(() => {
        form.setFieldsValue({
            username: targetUser.username,
            preferredWorkingHours: targetUser.preferredWorkingHours,
            role: targetUser.role,
            password: "",
            repeat_password: ""
        })
    }, [targetUser]);

    const onChangeInputUserId = (value) => {
        setInputUserId(value);
    }

    const onEnterInputUserId = () => {
        props.history.push("/users/" + inputUserId);
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
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
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
                        rules={[
                            {
                                required: true,
                                message: 'Please input the preferred working hours per day!',
                            },
                        ]}
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
                            <Button>
                                Cancel
                            </Button>
                        </Form.Item>
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