import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Button, Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone , FrownFilled} from '@ant-design/icons';
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

    const resetRolesList = useCallback(
        () => {
                axios.get(`/api/optional_roles/${user.id}`).then(
                    res => {
                        console.log(res.data)
                        setRolesList({rolesList: res.data.dataRoles, loadingRoles: false})
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
        console.log("current index: " + currentRole.index + ", changedIndex: " + changedIndex)
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
        console.log("indexafterchange: " + currentRole.index)
        console.log("insexofotherafterchange: " + otherRole)
    })

    useEffect(() => {
       resetSmile()
    }, [])

    useEffect(() => {
        resetEmployeeList()
    }, [])

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
            
                <h2 style={{color: "blue", marginLeft: "-1rem"}}>Optional future roles</h2>           
                <List
                    // header={<h2 style={{color: "blue", marginLeft: "-1rem", marginTop: '-1rem'}}>Optional future roles</h2>}
                    // footer={<div>Footer</div>}
                    bordered
                    loading={loadingRoles}
                    style={{overflow: "auto", height: "280px"}}
                    dataSource={rolesList.sort((a, b) => a['index'] > b['index'] ? 1:-1)}
                    renderItem={(item) => (
                        <List.Item>
                        <Title level={4}>{item["Title"]}</Title>
                        <div>
                            {item['index'] !== 0 &&
                            <Button onClick={() => changeRolesOrder(item['index'], 'up')}>UP</Button>
                            }
                            {item['index'] !== rolesList.length - 1 &&
                            <Button onClick={() => changeRolesOrder(item['index'], 'down')}>DOWN</Button>
                            }
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