import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone, FrownTwoTone } from '@ant-design/icons';
import { Steps,Button, message } from 'antd';
import { Role } from './RolesTable';



const StaffingForm = withUser(({user}) => {

     
    const [{staffingForm, loading}, setStaffingForm] = useState({staffingForm:[], loading: true});

    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    
    const resetStaffingForm = useCallback(
        () => {
            axios.get('/api/StaffingForm').then(
                res => {
                    console.log(res.data.staffingForm)
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



        return (
          
            user === null ? <Navigate to='/login' /> :
            !user['isAdmin'] ? <Navigate to='/' /> : 
            
            <>
            <Steps current={current}>
                {staffingForm.map(({Role}) =>
                <Step key={Role.Title} title={Role.Title} />
                )}
            </Steps>
            <div className="steps-content">{"Candidates for the position"}</div>
            <div className="steps-action">
                {current < staffingForm.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                    Next
                </Button>
                )}
                {current === staffingForm.length - 1 && (
                <Button type="primary" onClick={() => message.success('Processing complete!')}>
                    Done
                </Button>
                )}
                {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    Previous
                </Button>
                )}
            </div>
            </>
        );

})

export default StaffingForm

    // const steps = staffingForm.map(role =>(
    //     {
    //         title: role["Title"],
    //         content: 'user',
        
    //     }
    // ))

    // const steps = [
    //     {
    //       title: 'First',
    //       content: 'First-content',
    //     },
    //     {
    //       title: 'Second',
    //       content: 'Second-content',
    //     },
    //     {
    //       title: 'Last',
    //       content: 'Last-content',
    //     },
    //   ];
    //   staffingForm[current]["Description"]
//     const customDot = (dot, { status, index }) => (
//       <Popover
//         content={
//           <span>
//             step {index} status: {status}
//           </span>
//         }
//       >
//         {dot}
//       </Popover>
//     );
    
//     return (
//         user === null ? <Navigate to='/login' /> :
//         !user['isAdmin'] ? <Navigate to='/' /> : 
    
//         <Steps current={0} progressDot={customDot}>
      
//         {staffingForm.map(({Role}) =>
//         <Step title={Role["Title"]} description={Role["Description"]} />

// )}      
//         </Steps>

//     );