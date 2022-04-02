import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone, FrownTwoTone } from '@ant-design/icons';


const Home = withUser(({user}) => {

    const [smile , setSmile] = useState(true);

    const resetSmile = useCallback(
        () => {
            axios.get("/api/users/<key>/smile").then(
                res => {
                    console.log("update data")
                    setSmile(res.data.smile)
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )


    useEffect(() => {
       resetSmile()
    }, [])


    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            {smile ? 
            <SmileTwoTone style={{fontSize: '200px', color: '#08c'}} /> : 
            <FrownTwoTone style={{fontSize: '200px', color: '#08c'}} />} 
        </div>
    )
})

export default Home