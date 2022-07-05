import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Row, Col, List, Typography, Timeline, Popover, Card } from 'antd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { UpOutlined, DownOutlined, SmileTwoTone, FrownFilled, FilePdfOutlined } from '@ant-design/icons';

const Home = withUser(({user}) => {

    const { Title } = Typography;

    const [smile , setSmile] = useState(true);
    const [{rolesList, loadingRoles}, setRolesList] = useState({rolesList: [], loadingRoles: true });
    const [{employeeList, loadingEmployee}, setEmployeeList] = useState({employeeList: [], loadingEmployee: true});
    const [jobEndDate, setJobEndDate] = useState(null);
    const [rolesHistory, setRolesHistory] = useState([])
  
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
        }, [])

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
        }, [])

    const sendForCalculation = useCallback(
        () => {
            axios.post('/api/updateRolesOrder',
            {'userUpdate': `${user.id}`, 'orderedList': rolesList}).then(
                res => {
                    console.log('orederedList',  rolesList)
                    // need to print to user that the order updated. 
            }).catch(err => {console.log(err)})
        }, [rolesList])

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
        }, [])

    const resetJobEndDate = useCallback(
        () => {
            console.log(user.id)
            axios.get(`/api/user_role/${user.id}`).then(
                res => {
                    console.log(res.data.userRole)
                    // the date format not mach to the Date format of JS.
                    console.log(new Date(res.data.userRole["Job end date"]))
                    setJobEndDate(res.data.userRole["Job end date"])
                }
            ).catch(err => {
                console.log(err)
            })
        }, [])

    const resetRolesHistory = useCallback(
        () => {
            axios.get(`/api/rolesHistory/${user.id}`).then(
                res => {
                    console.log(res.data.rolesHistory)
                    setRolesHistory(res.data.rolesHistory)
                }
            )
        }, [])

    const getFileOfRole = (manningId => {
            axios.get(`/api/getFileOfRole/${manningId}`).then(
                res => {
                    console.log(res.data)
                }
            ).catch(
                err => console.log(manningId)
            )
        })

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

    const convertDateFormat = ((dateStr)=>{
        var date = new Date(dateStr);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        date = dd + '/' + mm + '/' + yyyy;
        console.log(date)
        return date
    })

    const rolesHistoryList = () =>
        {
            const rolesList = structuredClone(rolesHistory)
            for (const role of rolesList) {
                delete role['_id'];
                delete role['Role ID'];
                delete role['User ID'];
                delete role['Title'];
                delete role['file_path']
            }
            return rolesList
        }

    const rolesHistoryContent = rolesHistoryList().map(role=>
        <div>
            {Object.keys(role).map((key)=>
            <p><b>{key  + ': '}</b>{role[key]}</p>)}
        </div>)


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

     useEffect(() => {
        resetRolesHistory()
        }, [])

    return (
        user === null ? <Navigate to='/login' /> : 
        
        <div style={{marginTop: '-3rem'}}>
                {smile ?
                    <h2>{"Job end date: " + convertDateFormat(jobEndDate)}</h2> :
                new Date(jobEndDate) < new Date() ?
                <h2 style={{color: "red"}}>WITHOUT ROLE!</h2> :
                <h2 style={{color: "red"}}>{"Job end date: " + convertDateFormat(jobEndDate)}</h2>}
            <Row>
            {smile ?
            <Col span={12}>
                <div> 
                    <SmileTwoTone style={{fontSize: '80px', color: '#08c'}} />
                    <h2 style={{color: "blue", marginLeft: "-1rem"}}>Employee status</h2>
                    <List
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
                </div>
            </Col> : 
            <Col span={12}>
                <div>
                    <FrownFilled style={{fontSize: '80px', color: '#08c'}} />
                    <h2 style={{ color: "blue", marginBottom:'-2rem', marginLeft: "-1rem"}}>Optional future roles</h2>
                    <Button shape='round' onClick={() => {sendForCalculation()}} style={{position: 'relative', marginLeft: '78%'}}>Update Order</Button>         
                    <List
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
            </Col>
            }
            <Col style={{marginLeft: '1rem', borderRadius: '10px', border: '1px solid grey', padding: '1rem', backgroundColor: 'white'}} span={11}>
                <Timeline>
                    {rolesHistory.map(({Title, _id}, i)=>
                    <Timeline.Item key={i}
                    dot={
                        <Popover 
                            content={
                                <Card
                                title={Title}
                                extra={<FilePdfOutlined style={{fontSize: '20px'}} onClick={()=>getFileOfRole(_id)} />}
                                style={{
                                width: 300,
                                }}
                                >       
                                {rolesHistoryContent[i]}
                                </Card>
                            } trigger={'hover'}
                                placement="left">
                            O
                        </Popover>                 
                    }
                    color="green">{Title}
                </Timeline.Item>)}

                </Timeline>
            </Col>
            </Row>
        </div>
    )
})

export default Home