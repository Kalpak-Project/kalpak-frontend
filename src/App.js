import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import RolesTable from './pages/RolesTable';
import UsersTable from './pages/UsersTable';
import LogInPage from './pages/LogInPage';
import ManningTable from './pages/ManningTable';
import { Layout, Menu, Breadcrumb } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, Navigate  } from 'react-router-dom';
import { UserContext, userData } from './components/userContext';
import MenuItem from 'antd/lib/menu/MenuItem';
import axios from 'axios';
import Home from './pages/Home';


const { Header, Content, Footer } = Layout;

const App = () => {

  const { SubMenu } = Menu;

  

  return (
    <Router>
    <UserContext>
    {({user}) => !user ? <LogInPage /> : 
     <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <userData.Consumer>
        {({logoutUser}) => 
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="0"> 
        <Link to='/'>
          <img src="/kalpak.png" width={75} height={35}></img>
        </Link>
        </Menu.Item>

        {user['isAdmin'] &&
        <><Menu.Item key="1">
        <Link to={user['isAdmin'] ? '/roles' : '/'}>  
          Roles
          </Link>  
          </Menu.Item>
        <Menu.Item key="2">
        <Link to='/users'>
          Users
        </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to='/manning'>
          Manning
            </Link>
          </Menu.Item></>}
        
        {user['isAdmin'] ?
        <SubMenu
          key="4"
          title={
            <span className="submenu-title-wrapper">
              {user.user}
            </span>
          }
          style={{backgroundColor: '#87CEFA', marginLeft: '64%'}}
        >
            <Menu.Item key="settings">Settings</Menu.Item>
            <Menu.Item onClick={() => logoutUser()} key="logout">Log out</Menu.Item>
        </SubMenu> : 
        <SubMenu
        key="4"
        title={
          <span className="submenu-title-wrapper">
            {user.user}
          </span>
        }
        style={{backgroundColor: '#87CEFA', marginLeft: '83%'}}
      >
          <Menu.Item key="settings">Settings</Menu.Item>
          <Menu.Item onClick={() => logoutUser()} key="logout">Log out</Menu.Item>
      </SubMenu>
        }
        
        
      </Menu>
      }
      </userData.Consumer>
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px' , marginTop: '5rem' }}>
      
      <div className="site-layout-background" style={{ padding: 24, minHeight: 430 }}>
      
       <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/roles' element={<RolesTable />} />
        <Route path='/users' element={<UsersTable />} />
        <Route path='/manning' element={<ManningTable />} /> 
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
