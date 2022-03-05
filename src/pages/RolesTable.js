import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';


const RolesTable = withUser(({user}) => {

    const [{roles, loading}, setRoles] = useState({roles:[], loading: true});


    const resetRoles = useCallback(
        () => {
            axios.get('/roles').then(
                res => {
                    console.log("update data")
                    setRoles({roles: res.data.roles, loading: false})
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )


    useEffect(() => {
       resetRoles()
       
    }, [])


    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            width: '33%',
        },
        {
            title: 'Duration',
            dataIndex: 'Duration',
            width: '33%',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            width: '33%',
        }
    ]

    const coolmnsTitles = columns.map(elem => elem.title)

   

    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            <ModalAdd onUpdate={resetRoles} table={"roles"} fields={coolmnsTitles} button='Add New Role' />
            <Table loading={loading} dataSource={roles} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 250 }} />
        </div>
    )
})

export default RolesTable