import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {Table, Select , Spin} from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate  } from 'react-router-dom';
const {Option}=Select;

const UsersTable = ({user}) => {

    const [{users: users, loading}, setUsers] = useState({users: [], loading: true});

    const resetUsers = useCallback(
        () => {
            axios.get('/api/users').then(
            res => {
                console.log("update data")
                setUsers({users: res.data.users, loading: false})
            }
        ).catch(err => {
            console.log(err)
        })
    }, [],)


    useEffect(() => {
        resetUsers()
    }, [])
    

    const columns = [
        {
            title: 'Family Name',
            dataIndex: 'Family Name',
            width: '20%',
        },
        {
            title: 'Private Name',
            dataIndex: 'Private Name',
            width: '20%',
        },
        {
            title: 'user_name',
            dataIndex: 'user_name',
            width: '20%',
        },
        {
            title: 'Personal ID',
            dataIndex: 'Personal ID',
            width: '20%',
        },
        {
            title: 'Employer',
            dataIndex: 'Employer',
            width: '20%',
            render: (text, record) => <User value={text}/>,
            inputRender: (value, onChange)=><UserSelect key={1} value={value} onChange={onChange}/>,
        }

    ]

    const cols = columns.map(elem => ({title:elem.title, inputRender:elem.inputRender}))

    return (
        user === null ? <Navigate to='/login' /> :
        !user['isAdmin'] ? <Navigate to='/' /> : 
        <div>
            <ModalAdd onChange={resetUsers} table={"users"} fields={cols} button='Add New User' />
            <Table loading={loading} dataSource={users} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 320 }} />
        </div>
    )
}

export const User = ({value})=> {
    const [data,setData]=useState();
    useEffect(()=>{
        axios.get(`/api/users/${value}`).then((response)=>{
        setData(response.data["user_name"])            
        }).catch();
    },[]);
    return data? <div>{data}</div>: <Spin/>
}


export const UserSelect = ({value,onChange})=> {
    const [data,setData]=useState([]);
    useEffect(()=>{
        axios.get("/api/users").then((response)=>{
        setData(response.data.users)            
        }).catch();
    },[]);
    return <Select value={value} onChange={onChange}> 
        {data.map((option,i)=><Option key={i} value={option.key}><User value={option.key}/></Option>)}
    </Select>
}
export default withUser(UsersTable)

