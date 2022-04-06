import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table, Select, Spin } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
const {Option}=Select;

const RolesTable = withUser(({user}) => {

    const [{roles, loading}, setRoles] = useState({roles:[], loading: true});


    const resetRoles = useCallback(
        () => {
            axios.get('/api/roles').then(
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
        !user['isAdmin'] ? <Navigate to='/' /> :
        <div>
            <ModalAdd onChange={resetRoles} table={"roles"} fields={coolmnsTitles} button='Add New Role' />
            <Table loading={loading} dataSource={roles} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 250 }} />
        </div>
    )
})
export const Role = ({value})=> {
    const [data,setData]=useState();
    useEffect(()=>{
        axios.get(`/api/roles/${value}`).then((response)=>{
        setData(response.data["Title"])            
        }).catch();
    },[]);
    return data? <div>{data}</div>: <Spin/>
}


export const RoleSelect = ({value,onChange})=> {
    const [data,setData]=useState([]);
    useEffect(()=>{
        axios.get("/api/roles").then((response)=>{
        setData(response.data.roles)            
        }).catch();
    },[]);
    return <Select value={value} onChange={onChange}> 
        {data.map((option,i)=><Option key={i} value={option.key}><Role value={option.key}/></Option>)}
    </Select>
}

export default RolesTable