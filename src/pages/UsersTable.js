import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {Table} from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate  } from 'react-router-dom';


const UsersTable = ({user}) => {

    const [{users: users, loading}, setUsers] = useState({users: [], loading: true});

    const resetUsers = useCallback(
        () => {
            axios.get('/users').then(
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
    }, [users])
    

    const columns = [
        {
            title: 'Family Name',
            dataIndex: 'Family Name',
            width: '25%',
        },
        {
            title: 'Private Name',
            dataIndex: 'Private Name',
            width: '25%',
        },
        {
            title: 'user_name',
            dataIndex: 'user_name',
            width: '25%',
        },
        {
            title: 'Personal ID',
            dataIndex: 'Personal ID',
            width: '25%',
        }
    ]

    const cols = columns.map(elem => elem.title)

    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            <ModalAdd onUpdate={resetUsers} table={"users"} fields={cols} button='Add New User' />
            <Table loading={loading} dataSource={users} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 250 }} />
        </div>
    )
}

export default withUser(UsersTable)