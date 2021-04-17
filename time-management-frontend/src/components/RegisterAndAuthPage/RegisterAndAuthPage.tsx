import React, {useState} from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";

import {Button, Form, FormInstance, Input, Switch} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import axiosInstance from "../../index";

const mapStateToProps:MapStateToProps<any, any> = state => ({
});

const mapDispatchToProps:MapDispatchToProps<any, any> = (_: any) => ({
});

function RegisterAndAuthPage() {
    const [isRegister, setIsRegister] = useState(false);

    const onFinish = (values: any) => {
        if (!isRegister) {
            axiosInstance
                .post("/user/auth", {
                    username: values.username,
                    password: values.password
                })
                .then(
                    (response: any) => {
                        console.log(response);
                    }, (error) => {

                    });
        }
    }

    const [form]: FormInstance[] = Form.useForm();

    return (
        <Form
            form={form}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterAndAuthPage);