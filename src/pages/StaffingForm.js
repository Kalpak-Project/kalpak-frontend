import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { Steps, Button, message, Table, Radio, Divider, Spin} from 'antd';
import { SmileTwoTone, FrownFilled } from '@ant-design/icons';
import { Role } from './RolesTable';

const StaffingForm = withUser(({user}) => {
     
    const [{staffingForm, loading} ,setStaffingForm] = useState({staffingForm:[], loading: true});
    const [selectedUser , setSelectedUser] = useState();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    
    const resetStaffingForm = useCallback(
        () => {
            axios.get('/api/staffingForm').then(
                res => {
                    console.log(res.data.staffingForm)
                    setSelectedUser(res.data.staffingForm.map(()=>[]))
                    setStaffingForm({staffingForm: res.data.staffingForm, loading: false })
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

    const columns = [
        {
          title: 'Name',
          dataIndex: 'Private Name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Family',
          dataIndex: 'Family Name',
        },
        {
          title: 'Personal ID',
          dataIndex: 'Personal ID',
        },
      ];


    const { Step } = Steps;
    console.log(current , staffingForm[current])

    const content =  loading ? 
    <Spin></Spin>: 
    <div>
    <Radio.Group
      value={"radio"}
    >
     
    </Radio.Group>

    <Divider />
    
    <Table 
    scroll={{ y: 210 }}
      rowSelection={  
        {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedUser((pv)=> pv.map((ps,i)=>i === current? selectedRowKeys: ps))
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            }, 
        selectedRowKeys: selectedUser[current],
               
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
              
        type: "radio",
      }}
      columns={columns}
      dataSource={staffingForm[current].User}
    />
  </div>

        return (
          
            user === null ? <Navigate to='/login' /> :
            !user['isAdmin'] ? <Navigate to='/' /> : 
            
            <>
            <Steps style={{height: '1%' , margin: '-10px'}} current={current}>
                {staffingForm.map(({Role}, i) =>
                <Step key={i} title={Role.Title} />
                )}
            </Steps>
            <div className="steps-content">{content}</div>

            <div  className="steps-action">
            {current < staffingForm.length - 1 && 
            <Button  style={{marginBottom: '4%',marginInline: '1%' }} type="primary" onClick={() => next()}>
                    Next
                </Button>
                }

{/* res.data.staffingForm.map(()=>[]) */}
            {current === staffingForm.length - 1 && 
                <Button style={{marginBottom: '4%' ,marginInline: '1%'}} type="primary" onClick={() => {
                    axios.post('/api/selectedUserRole', {Roles: staffingForm.map(({Role})=> Role["_id"]) ,Users: selectedUser}).then(
                       console.log({Roles: staffingForm.map(({Role})=>Role["_id"]) ,Users: selectedUser})
                    ).catch(err => {
                    console.log(err)
                });
                message.success('Processing complete!');}}>
                    Done
                </Button>
                }
                
            {current > 0 && 
                <Button  onClick={() => prev()}>
                    Previous
                </Button>
                }
            </div>
            </>
        );

})

export default StaffingForm

    