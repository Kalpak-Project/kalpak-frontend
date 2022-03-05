import React, { useContext, useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { withUser } from '../components/userContext';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';


const RegisterPage = ({user, refreshUser}) => { 

    const navigate = useNavigate()

    const onFinish = (values) => {
      axios.post('/api/register', {username: values.username, password: values.password}).then(
        res => {
          refreshUser()
          navigate('/')
        }
        ).catch(err => {
            // need to show message: 'user name: {username} is already exist. try another one.
        })
      };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        
      };


    return (
          <Form
      name="basic"
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
        <Button block type="primary" htmlType="submit" >
          Submit
        </Button>
      </Form.Item>
    </Form>
    )
}

export default RegisterPage
