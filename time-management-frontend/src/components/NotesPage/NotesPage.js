import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Space, DatePicker, Table} from "antd";
import RoleEnum from "../../RoleEnum";
import axiosInstance from "../../index";
import {alertResponseMessages, responseIsSuccess} from "../../ResponseUtils";

const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

function NotesPage(props) {
    const columns = [
        {
            title: "Content",
            dataIndex: "content"
        }, {
            title: "Hours",
            dataIndex: "hours"
        }, {
            title: "Date",
            dataIndex: "date"
        }
    ];
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
                            key: index
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

    return (
        <div>
            <Space direction="vertical">
                <br/>
                <Space>
                    <DatePicker placeholder="Start Date" onChange={onChangeStartDate}/>
                    <DatePicker placeholder="End Date" onChange={onChangeEndDate}/>
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