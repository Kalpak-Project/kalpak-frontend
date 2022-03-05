import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import RolesTable from './pages/RolesTable';
import PersonsTable from './pages/PersonsTable';
import LogInPage from './pages/LogInPage';
import RegisterPage from './pages/RegisterPage';
import { Layout, Menu, Breadcrumb, Image } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, Navigate  } from 'react-router-dom';
import { UserContext } from './components/userContext';
import MenuItem from 'antd/lib/menu/MenuItem';

const { Header, Content, Footer } = Layout;

const App = () => {
  

  return (
    <Router>
    <UserContext>
    {({user}) => user == null ? <LogInPage /> : 
     <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Link to='/'>
          <Menu.Item key="0">
            <img src="/kalpak.png" width={75} height={35}></img>
          </Menu.Item>
        </Link>
        <Link to='/roles'>
        <Menu.Item key="1">Roles</Menu.Item>
        </Link>
        <Link to='/persons'>
        <Menu.Item key="2">Persons</Menu.Item>
        </Link>
        <Menu.Item key="3">Settings</Menu.Item>
        <Menu.Item style={{backgroundColor: '#87CEFA', marginLeft: '65%'}} key="4">{user.user}</Menu.Item>
        
      </Menu>
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px' , marginTop: 64 }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      
      <div className="site-layout-background" style={{ padding: 24, minHeight: 430 }}>
      
       <Routes> 
        <Route path='/' element={<div>Home</div>} />
        <Route path='/roles' element={<RolesTable />} />
        <Route path='/persons' element={<PersonsTable />} />
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
