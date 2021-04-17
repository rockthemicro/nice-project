import React, {useState} from "react";
import {connect} from "react-redux";

import {Button, Form, Input, Switch} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import axiosInstance from "../../index";
import loginAction from "../../actions/loginAction";
import {compose} from "redux";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    loginAction: (userState) => dispatch(loginAction(userState))
});

function RegisterAndAuthPage(props) {
    const [isRegister, setIsRegister] = useState(false);

    const onFinish = (values) => {
        if (!isRegister) {
            axiosInstance
                .post("/user/auth", {
                    username: values.username,
                    password: values.password
                })
                .then(
                    (response) => {
                        props.loginAction(response.data);
                        props.history.push("/notes")
                    }, (error) => {
                        alert(error);
                    });
        } else {
        }
    }

    return (
        <Form
            name="normal_login"
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
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>


            {isRegister && <Form.Item
                name="repeat_password"
                rules={[
                    {
                        required: true,
                        message: 'Please repeat your Password!',
                    },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Repeat Password"
                />
            </Form.Item>}

            <div>
                {'Toggle Register '}
                <Switch defaultChecked={isRegister}
                        onChange={(value) => setIsRegister(value)}/>
            </div>

            {isRegister && <Form.Item>
                <Button type="primary" htmlType="submit" style={{width: '50%'}}>
                    Register
                </Button>
            </Form.Item>}

            {!isRegister && <Form.Item>
                <Button type="primary" htmlType="submit" style={{width: '50%'}}>
                    Log In
                </Button>
            </Form.Item>}
        </Form>);
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(RegisterAndAuthPage);