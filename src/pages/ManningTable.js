import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';


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
        },
        [],
    )


    useEffect(() => {
       resetManning()
    }, [])


    const columns = [
       
        {
            title: 'User ID',
            dataIndex: 'User ID',
            width: '25%',
        },
        {
            title: 'Role ID',
            dataIndex: 'Role ID',
            width: '25%',
        },
        {
            title: 'Date of staffing',
            dataIndex: 'Date of staffing',
            width: '25%',
        },
        {
            title: 'Job end date',
            dataIndex: 'Job end date',
            width: '25%',
        }

    ]

    const coolmnsTitles = columns.map(elem => elem.title)

   


    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            <ModalAdd onChange={resetManning} table={"manning"} fields={coolmnsTitles} button='Add New Manning' />
            <Table loading={loading} dataSource={manning} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 250 }} />
        </div>
    )
})

export default ManningTable