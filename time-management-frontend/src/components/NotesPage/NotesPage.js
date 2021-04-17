import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Table} from "antd";
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

    useEffect(() => {
        if (props.loginReducer.userState.user.role === RoleEnum.USER) {
            axiosInstance
                .get("/note/getNotes")
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
    }, []);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                size="middle"
                pagination={false}
                scroll={{y: '30vw', scrollToFirstRowOnChange: true}}
            />

        </div>

    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(NotesPage);