import React, { useCallback, useContext, useState } from 'react';
import { Layout, Menu, Form, Input, Button, Checkbox, message } from 'antd';
import { withUser } from '../components/userContext';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import 'antd/dist/antd.css';
import '../cssFiles/LogInPage.css'

const LogInPage = withUser(({user, refreshUser}) => { 

  const [isLogin, setIsLogin] = useState(true)

  const {Header} = Layout

    const navigate = useNavigate()

    // use callback, depends on isLogin
    const onFinish = (values) => {
      if (isLogin){
      axios.post('/api/login', {user_name: values.user_name, password: values.password}).then(
        res => {
          console.log(res.message)
          refreshUser()
          navigate('/')
        }
        ).catch(err => console.log(err.response.data))
      } else {
        const newUser = {private_name: values.private_name, family_name: values.family_name,
          personal_id: values.personal_id, user_name: values.user_name, password: values.password}
        axios.post('/api/register', newUser).then(
          res => {
            console.log(res.message)
            refreshUser()
            // need to login the user automaticlly and navigate to '/'
          }
        ).catch(err => console.log(err.response.data))
      }};

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        
      };

    return (
    <div>
       <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>

        {isLogin ? <Menu.Item onClick={() => setIsLogin(false)} key="1">Register</Menu.Item> :
        <Menu.Item onClick={() => setIsLogin(true)} key="1">Log in</Menu.Item> }
      
        
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

      {!isLogin && <Form.Item
        label="Private Name"
        name="private_name"
        rules={[
          {
            required: true,
            message: 'Please enter your privte name!',
          },
        ]}
      >
        <Input placeholder='Private Name' />
      </Form.Item>}

      {!isLogin && <Form.Item
        label="Family Name"
        name="family_name"
        rules={[
          {
            required: true,
            message: 'Please enter your family name!',
          },
        ]}
      >
        <Input placeholder='Family Name' />
      </Form.Item>}

      {!isLogin && <Form.Item
        label="Personal ID"
        name="personal_id"
        rules={[
          {
            required: true,
            message: 'Please enter your personal ID!',
          },
        ]}
      >
        <Input placeholder='Personal ID' />
      </Form.Item>}
      

         <Form.Item
        label="UserName"
        name="user_name"
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
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please enter your password!',
          },
        ]}
      >
        <Input.Password placeholder='Password' />
      </Form.Item>
      
      {!isLogin && <Form.Item
        label="Confirm Password"
        name="confirmpassword"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder='Confirm Password' />
      </Form.Item>}


        {isLogin && <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>}

    
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
