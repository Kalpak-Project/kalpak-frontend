import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone, FrownTwoTone } from '@ant-design/icons';
import { Steps, Popover } from 'antd';



const StaffingForm = withUser(({user}) => {

    
    const [{staffingForm, loading}, setStaffingForm] = useState({staffingForm:[], loading: true});

    const resetStaffingForm = useCallback(
        () => {
            axios.get('/api/StaffingForm').then(
                res => {
                    console.log("update data")
                    setStaffingForm({staffingForm: res.data.staffingForm, loading: false})
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )


    useEffect(() => {
        resetStaffingForm()
    }, [])

    const { Step } = Steps;

    const customDot = (dot, { status, index }) => (
      <Popover
        content={
          <span>
            step {index} status: {status}
          </span>
        }
      >
        {dot}
      </Popover>
    );
    
    return (
        user === null ? <Navigate to='/login' /> :
        !user['isAdmin'] ? <Navigate to='/' /> : 
    
        <Steps current={0} progressDot={customDot}>
      
        {staffingForm.map(({Role}) =>
        <Step title={Role["Title"]} description={Role["Description"]} />

)}      
        </Steps>

    );
})



export default StaffingForm