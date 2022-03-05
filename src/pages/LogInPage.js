import React, { useContext } from 'react';
import { Layout, Menu, Form, Input, Button, Checkbox, message } from 'antd';
import { withUser } from '../components/userContext';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import 'antd/dist/antd.css';
import '../cssFiles/LogInPage.css'
import RegisterPage from './RegisterPage';

const LogInPage = withUser(({user, refreshUser}) => { 

  const {Header} = Layout

    const navigate = useNavigate()

    const onFinish = (values) => {
      axios.post('/api/login', {username: values.username, password: values.password}).then(
        res => {
          console.log(res.message)
          refreshUser()
          navigate('/')
        }
        ).catch(err => console.log(err.response.data))
      };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        
      };

    return (
    <div>
       <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">Register</Menu.Item>
        
      </Menu>
    </Header>
      <Form
      className='content'
      name="basic"
      style={{paddingTop: 80}}
      
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      initialValues={{
        remember: true,
      }}
      
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
         <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please enter your username!',
          },
        ]}
      >
        <Input placeholder='User Name' />
      </Form.Item>
       <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your password!',
          },
        ]}
      >
        <Input.Password placeholder='Password' />
      </Form.Item>
      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
    
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Button block type="primary" htmlType="submit" className="submit-login" >
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
    )
})

export default LogInPage
