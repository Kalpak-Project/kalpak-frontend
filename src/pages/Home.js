import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
import { SmileTwoTone, FrownTwoTone } from '@ant-design/icons';
import { List, Typography } from 'antd';



const Home = withUser(({user}) => {

    const { Title } = Typography;


    const [smile , setSmile] = useState(true);
    const [rolesList, setRolesList] = useState([]);
    const [soldiersList, setSoldiersList] = useState([]);
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

    const resetSoldiersList = useCallback(
        () => {
            axios.get(`/api/soldiers_status/${user.id}`).then(
                res => {
                    console.log(res.data)
                    setSoldiersList(res.data.soldiersList)

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
                        setRolesList(res.data.dataRoles)
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


    useEffect(() => {
       resetSmile()
    }, [])
    useEffect(() => {
        resetSoldiersList()
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
                    style={{height: '20%', overflow: "auto", height: "300px"}}
                    dataSource={soldiersList}
                    renderItem={item => (
                        <List.Item >
                        <Title style={{width: "20%"}} level={4}>{item["soldier"]["user_name"]}</Title>
                        {item["smile"] ? 
                        <SmileTwoTone style={{fontSize: '30px', marginLeft: '5%' ,color: '#08c'}} /> : 
                        <FrownTwoTone style={{fontSize: '30px', marginLeft: '5%' ,color: '#08c'}} />}
                        </List.Item>
                    )}
                />
            </div> : 
            <div>
                <FrownTwoTone style={{fontSize: '80px', color: '#08c'}} />
            
                <h2 style={{color: "blue", marginLeft: "-1rem"}}>Optional future roles</h2>           
                <List
                    // header={<h2 style={{color: "blue", marginLeft: "-1rem", marginTop: '-1rem'}}>Optional future roles</h2>}
                    // footer={<div>Footer</div>}
                    bordered
                    style={{height: '20%', overflow: "auto", height: "300px"}}
                    dataSource={rolesList}
                    renderItem={item => (
                        <List.Item >
                        <Title level={4}>{item["Title"]}</Title>
                        </List.Item>
                    )}
                />
            </div>
            }
        </div>
    )
})

export default Home