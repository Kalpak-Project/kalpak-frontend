import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table , DatePicker } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { Role, RoleSelect } from './RolesTable';
import { User, UserSelect} from './UsersTable';
import Moment from 'react-moment';


const ManningTable = withUser(({user}) => {

    const [{manning, loading}, setManning] = useState({manning:[], loading: true});

    const resetManning = useCallback(
        () => {
            axios.get('/api/manning').then(
                res => {
                    console.log("update data")
                    setManning({manning: res.data.manning, loading: false})
                }
            ).catch(err => {
                console.log(err)
            })
        }, [])


    useEffect(() => {
       resetManning()
    }, [])


    const columns = [
       
        {
            title: 'User ID',
            dataIndex: 'User ID',
            width: '25%',
            render: (text, record) => <User value={text}/>,
            inputRender: (value, onChange)=><UserSelect key={1} value={value} onChange={onChange}/>,
            required: true
        },
        {
            title: 'Role ID',
            dataIndex: 'Role ID',
            width: '25%',
            render: (text, record) => <Role value={text}/>,
            inputRender: (value, onChange) =><RoleSelect key={1} value={value} onChange={onChange}/>,
            required: true
        },
        {
            title: 'Date of staffing',
            dataIndex: 'Date of staffing',
            width: '25%',
            render: value => <Moment date={value} format = {"DD-MM-yyyy"}/>, 
            inputRender: (value, onChange)=><DatePicker key={1} date={value} onChange={(newValue)=>onChange(newValue.toISOString())}/>,
            required: true
        },
        {
            title: 'Job end date',
            dataIndex: 'Job end date',
            width: '25%',
            render: value => <Moment date={value} format = {"DD-MM-yyyy"}/>,
            inputRender: (value, onChange)=><DatePicker key={1} date={value} onChange={(newValue)=>onChange(newValue.toISOString())}/>,
            required: true
        }]

    const columnsTitles = columns.map(elem => ({title:elem.title,inputRender:elem.inputRender, required:elem.required}))

    return (
        user === null ? <Navigate to='/login' /> :
        !user['isAdmin'] ? <Navigate to='/' /> : 
        <div>
            <ModalAdd onChange={resetManning} table={"manning"} fields={columnsTitles} button='Add New Manning' />
            <Table loading={loading} dataSource={manning.sort((a, b) => a['Job end date'] > b['Job end date'] ? -1:1)} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 275 }} />
        </div>
    )
})

export default ManningTable