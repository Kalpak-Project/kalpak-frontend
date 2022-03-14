import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone } from '@ant-design/icons';




const Home = withUser(({user}) => {

    


    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
            <SmileTwoTone style={{ fontSize: '200px', color: '#08c' }} />  
        </div>
    )
})

export default Home