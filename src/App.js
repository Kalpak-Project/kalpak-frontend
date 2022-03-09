import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import RolesTable from './pages/RolesTable';
import PersonsTable from './pages/UsersTable';
import LogInPage from './pages/LogInPage';
import RegisterPage from './pages/RegisterPage';
import { Layout, Menu, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, Navigate  } from 'react-router-dom';
import { UserContext } from './components/userContext';
import MenuItem from 'antd/lib/menu/MenuItem';
import axios from 'axios';
import UsersTable from './pages/UsersTable';

const { Header, Content, Footer } = Layout;

const App = () => {

  const { SubMenu } = Menu;

  const logoutUser = () => {
    axios.get('/api/logout').then(
      res => {
        console.log(res)
      }
    )
  }

  return (
    <Router>
    <UserContext>
    {({user}) => user == null ? <LogInPage /> : 
     <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="0"> 
        <Link to='/'>
          <img src="/kalpak.png" width={75} height={35}></img>
        </Link>
        </Menu.Item>
        <Menu.Item key="1">
        <Link to='/roles'>  
          Roles
          </Link>  
          </Menu.Item>
        <Menu.Item key="2">
        <Link to='/users'>
          Users
        </Link>
        </Menu.Item>

        <SubMenu
          key="3"
          title={
            <span className="submenu-title-wrapper">
              {user.user}
            </span>
          }
          style={{backgroundColor: '#87CEFA', marginLeft: '72%'}}
        >
            <Menu.Item key="settings">Settings</Menu.Item>
            <Menu.Item onClick={() => logoutUser()} key="logout">Log out</Menu.Item>
        </SubMenu>
        
      </Menu>
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px' , marginTop: '5rem' }}>
      {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
      
      <div className="site-layout-background" style={{ padding: 24, minHeight: 430 }}>
      
       <Routes> 
        <Route path='/' element={<div>Home</div>} />
        <Route path='/roles' element={<RolesTable />} />
        <Route path='/users' element={<UsersTable />} />
       </Routes>
             
      </div>
      
    </Content>
    <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' }}>KALPAK ©2022 Created by P.ziv & A.chen</Footer>
  </Layout>}
  </UserContext>
  </Router>

  )
}

export default App
