import {Button, Menu} from "antd";
import React, {useState} from "react";
import {CalendarOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, TeamOutlined} from "@ant-design/icons";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
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

    if (props.history.location.pathname === "/") {
        return (<div/>);
    }

    const userRole = props.loginReducer.userState.user.role;

    const handleOnClickNotes = () => {
        props.history.push("/notes");
    }

    const handleOnClickMyProfile = () => {
        props.history.push("/user");
    }

    const handleOnClickProfiles = () => {
        props.history.push("/users/0");
    }

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

                {userRole !== RoleEnum.MANAGER &&
                <Menu.Item
                    key="notes"
                    icon={<CalendarOutlined/>}
                    onClick={handleOnClickNotes}
                >
                    Notes
                </Menu.Item>}

                <Menu.Item
                    key="myProfile"
                    icon={<SettingOutlined/>}
                    onClick={handleOnClickMyProfile}
                >
                    My profile
                </Menu.Item>

                {userRole !== RoleEnum.USER &&
                <Menu.Item
                    key="profiles"
                    icon={<TeamOutlined/>}
                    onClick={handleOnClickProfiles}
                >
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