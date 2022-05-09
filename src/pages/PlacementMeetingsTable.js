import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { Role, RoleSelect } from './RolesTable';
import { SmileTwoTone , FrownFilled} from '@ant-design/icons';




const PlacementMeetingsTable = withUser(({user}) => {

    const [{placementMeetings, loading}, setPlacementMeetings] = useState({placementMeetings:[], loading: true});

    const resetPlacementMeetings = useCallback(
        () => {
            axios.get('/api/placementMeetings').then(
                res => {
                    console.log("update data")
                    setPlacementMeetings({placementMeetings: res.data.placementMeetings, loading: false})
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )


    useEffect(() => {
       resetPlacementMeetings()
    }, [])

    
    const columns = [      
        {
            title: 'Role',
            dataIndex: 'Role',
            width: '25%',
            render: (text, record) => <Role value={text["_id"]}/>,
        },
        {
            title: 'Should I be concerned?',
            dataIndex: 'Smile',
            width: '25%',
            render: (text, record) => <Smile value={text}/>,
        }
    ]

    const coolmnsTitles = columns.map(elem => ({title:elem.title}))

    

    return (
        user === null ? <Navigate to='/login' /> :
        !user['isAdmin'] ? <Navigate to='/' /> : 
        <div>
            <Table loading={loading} dataSource={placementMeetings} columns={columns} pagination={{ pageSize: 40 }} scroll={{ y: 250 }} />  
        </div>
    )
})

const Smile = ({value}) => {
    console.log(value) 
    {return value ?
        <SmileTwoTone style={{fontSize: '30px', marginLeft: '5%' ,color: '#08c'}} /> : 
        <FrownFilled style={{fontSize: '30px', marginLeft: '5%' ,color:  '#08c'}} />} 
}
export default PlacementMeetingsTable
