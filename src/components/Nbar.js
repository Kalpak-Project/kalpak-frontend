import React from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function Nbar() {

  const { Header, Menu } = Layout;

    return (
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Link to='/roles'>
        <Menu.Item key="1">Roles</Menu.Item>
        </Link>
        <Link to='/persons'>
        <Menu.Item key="2">Persons</Menu.Item>
        </Link>
        <Menu.Item key="3">Settings</Menu.Item>
      </Menu>
    </Header>
    )
}

export default Nbar
