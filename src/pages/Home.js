import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone } from '@ant-design/icons';


const Home = withUser(({user}) => {

    const [smaile , setSmaile] = useState(true);



    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            {smaile ? <SmileTwoTone style={{fontSize: '200px', color: '#08c'}} /> : 
            <SmileTwoTone style={{fontSize: '100px', color: '#08c'}} />} 
            <button onClick={()=>{setSmaile(!smaile)}}> </button> 
        </div>
    )
})

export default Home