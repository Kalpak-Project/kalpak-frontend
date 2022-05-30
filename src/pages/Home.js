import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { UpOutlined, DownOutlined, SmileTwoTone , FrownFilled} from '@ant-design/icons';
import { List, Typography } from 'antd';



const Home = withUser(({user}) => {

    const { Title } = Typography;

    const [smile , setSmile] = useState(true);
    const [{rolesList, loadingRoles}, setRolesList] = useState({rolesList: [], loadingRoles: true });
    const [{employeeList, loadingEmployee}, setEmployeeList] = useState({employeeList: [], loadingEmployee: true});
    const [jobEndDate, setJobEndDate] = useState(null);
  
    const resetSmile = useCallback(
        () => {
            axios.get(`/api/users/${user.id}/smile`).then(
                res => {
                    console.log("update smile")
                    setSmile(res.data.smile)
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )

    const resetEmployeeList = useCallback(
        () => {
            axios.get(`/api/employee_status/${user.id}`).then(
                res => {
                    console.log(res.data)
                    setEmployeeList({employeeList: res.data.employeeList, loadingEmployee: false})

                }
            ).catch(err => {
                console.log(err)
            })
        }, [],
    )

    const sendForCalculation = useCallback(
        () => {
            axios.post('/api/updateRolesOrder',
            {'userUpdate': `${user.id}`, 'orderedList': rolesList}).then(
                res => {
                    console.log('orederedList',  rolesList)
                    // need to print to user that the order updated. 
            }).catch(err => {console.log(err)})
        }, [rolesList],
    )

    const resetRolesList = useCallback(
        () => {
                axios.get(`/api/optional_roles/${user.id}`).then(
                    res => {
                        setRolesList({rolesList: res.data.dataRoles, loadingRoles: false})
                        console.log(rolesList)
                    }
                ).catch(err => {
                    console.log(err)
                })
        },
        [],
    )

    const resetJobEndDate = useCallback(
        () => {
            console.log(user.id)
            axios.get(`/api/user_role/${user.id}`).then(
                res => {
                    console.log(res.data)
                    setJobEndDate(res.data.userRole["Job end date"])
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )

    const changeRolesOrder = ((changedIndex, action) => {
        var orderedList = Array.from(rolesList);
        var currentRole = orderedList[changedIndex];
        var otherRole;
        if (action === 'up'){
            otherRole = orderedList[changedIndex - 1]
            currentRole['index'] = changedIndex - 1
            otherRole['index'] = changedIndex
        } else {
            otherRole = orderedList[changedIndex + 1]
            currentRole['index'] = changedIndex + 1
            otherRole['index'] = changedIndex
        }
        setRolesList({rolesList: orderedList, loadingRoles: false})
    })

    useEffect(() => {
       resetSmile()
    }, [])

    useEffect(() => {
        resetEmployeeList()
    }, [])

    // useEffect(() => {
    //     sendForCalculation()
    //  }, [])

    useEffect(() => {
        resetRolesList()
     }, [])

     useEffect(() => {
        resetJobEndDate()
     }, [])


   


    return (
        user === null ? <Navigate to='/login' /> : 
        <div style={{marginTop: '-2rem'}}>
            {jobEndDate !== null && smile ?
            <h2>{"Job end date: " + jobEndDate}</h2> :
            jobEndDate !== null && !smile ?
            <h2 style={{color: "red"}}>{"Job end date: " + jobEndDate}</h2> :
            <h2 style={{color: "red"}}>WITHOUT ROLE!</h2>}
            {smile ?
            <div> 
                <SmileTwoTone style={{fontSize: '80px', color: '#08c'}} />
                <h2 style={{color: "blue", marginLeft: "-1rem"}}>Employee status</h2>
                <List
                    // header={<h2 style={{color: "blue", marginLeft: "-1rem", marginTop: '-1rem'}}>Optional future roles</h2>}
                    // footer={<div>Footer</div>}
                    bordered
                    loading={loadingEmployee}
                    style={{height: '20%', overflow: "auto", height: "300px"}}
                    dataSource={employeeList}
                    renderItem={item => (
                        <List.Item >
                        <Title style={{width: "20%"}} level={4}>{item["employee"]["user_name"]}</Title>
                        {item["smile"] ? 
                        <SmileTwoTone style={{fontSize: '30px', marginLeft: '5%' ,color: '#08c'}} /> : 
                        <FrownFilled style={{fontSize: '30px', marginLeft: '5%' ,color: '#08c'}} />}
                        </List.Item>
                    )}
                />
            </div> : 
            <div>
                <FrownFilled style={{fontSize: '80px', color: '#08c'}} />
                <h2 style={{position: 'fixed', color: "blue", marginLeft: "-1rem"}}>Optional future roles</h2>
                <Button shape='round' onClick={() => {sendForCalculation()}} style={{position: 'relative', marginLeft: '87%', marginBottom: '0rem'}}>Update Order</Button>         
                <List
                    // header={<h2 style={{color: "blue", marginLeft: "-1rem", marginTop: '-1rem'}}>Optional future roles</h2>}
                    // footer={<div>Footer</div>}
                    bordered
                    loading={loadingRoles}
                    style={{overflow: "auto", height: "280px", marginTop: '1rem'}}
                    dataSource={rolesList.sort((a, b) => a['index'] > b['index'] ? 1:-1)}
                    renderItem={(item) => (
                        <List.Item>
                        <Title level={4}>{item["Title"]}</Title>
                        <div>
                            <Button disabled={item['index'] === 0} style={{paddingLeft: '1rem', paddingRight: '1rem'}} shape='round' onClick={() => changeRolesOrder(item['index'], 'up')}><UpOutlined /></Button>
                            <Button disabled={item['index'] === rolesList.length - 1} shape='round' onClick={() => changeRolesOrder(item['index'], 'down')}><DownOutlined /></Button>
                        </div>
                       
                        </List.Item>
                    )}
                />
            </div>
            }
        </div>
    )
})

export default Home