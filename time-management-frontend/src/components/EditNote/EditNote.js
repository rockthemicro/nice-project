import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import React from "react";
import {DatePicker, Button, Form, Input, InputNumber, Space} from "antd";
import axiosInstance from "../../index";
import {alertResponseMessages, responseIsSuccess} from "../../ResponseUtils";

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});


function EditNote(props) {

    const onFinish = (values) => {
        if (!values.date) {
            form.getFieldInstance("date").focus();
            return;
        }

        axiosInstance
            .post("/note/createOrUpdate", {
                content: values.content,
                hours: values.hours,
                date: values.date.format("YYYY-MM-DD")
            })
            .then((response) => {
                if (!responseIsSuccess(response)) {
                    alertResponseMessages(response);
                    return;
                }
                props.history.push("/notes");

            }, (error) => {
                alert(error);
            })
    };

    const onCancel = () => {
        props.history.goBack();
    }

    const [form] = Form.useForm();

    return (
        <div>
            <Form
                form={form}
                size={"large"}
                style={{maxWidth: '400px', margin: '0 auto'}}
                onFinish={onFinish}
                name="edit_note_form"
            >
                <Form.Item
                    name="content"
                    rules={[
                        {
                            required: true,
                            message: 'Please describe what you worked on.',
                        }
                    ]}
                >
                    <Input placeholder="Note"/>
                </Form.Item>

                <Form.Item
                    name="hours"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the number of hours you worked on this.'
                        }
                    ]}
                >
                    <InputNumber
                        min={0}
                        placeholder={"Hours"}
                        style={{width: "100%"}}
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    validateStatus="success"
                >
                    <DatePicker style={{ width: '100%' }}/>
                </Form.Item>

                <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>

                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Space>
            </Form>
        </div>
    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(EditNote);