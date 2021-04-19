import {Menu, Button} from "antd";
import React, {useState} from "react";
import {CalendarOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, TeamOutlined} from "@ant-design/icons";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import loginReducer from "../../reducers/loginReducer";
import RoleEnum from "../../RoleEnum";

const mapStateToProps = (state) => ({
    loginReducer: state.loginReducer
});

const mapDispatchToProps = (dispatch) => ({
});

function AppMenu(props) {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    if (!props.loginReducer.userState.token) {
        return (<div/>);
    }

    const userRole = props.loginReducer.userState.user.role;

    return (
        <div>
            <Button type="primary" onClick={toggleCollapsed} style={{marginBottom: 16}}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
            >

                {userRole !== RoleEnum.MANAGER && <Menu.Item key="notes" icon={<CalendarOutlined/>}>
                    Notes
                </Menu.Item>}
                <Menu.Item key="myProfile" icon={<SettingOutlined/>}>
                    My profile
                </Menu.Item>
                {userRole !== RoleEnum.USER && <Menu.Item key="profiles" icon={<TeamOutlined/>}>
                    Profiles
                </Menu.Item>}
            </Menu>
        </div>
    );
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps))
(AppMenu);