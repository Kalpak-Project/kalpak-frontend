import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {Table} from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate  } from 'react-router-dom';



const PersonsTable = ({user}) => {

    const [{persons, loading}, setPersons] = useState({persons: [], loading: true});


    const resetPersons = useCallback(
        () => {
            axios.get('/persons1').then(
            res => {
                console.log("update data")
                setPersons({persons: res.data.users, loading: false})
            }
        ).catch(err => {
            console.log(err)
        })
    }, [],)

    useEffect(() => {
        resetPersons()
        
    }, [])
    

    const columns = [
        {
            title: 'Family Name',
            dataIndex: 'Family Name',
            width: '33%',
        },
        {
            title: 'Private Name',
            dataIndex: 'Private Name',
            width: '33%',
        },
        {
            title: 'Personal ID',
            dataIndex: 'Personal ID',
            width: '33%',
        }
    ]

    const cols = columns.map(elem => elem.title)

    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            <ModalAdd onUpdate={resetPersons} table={"persons"} fields={cols} button='Add New Person' />
            <Table loading={loading} dataSource={persons} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 250 }} />
        </div>
    )
}

export default withUser(PersonsTable)