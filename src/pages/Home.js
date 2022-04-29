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

    const resetSmile = useCallback(
        () => {
            axios.get(`/api/users/${user.id}/smile`).then(
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


    useEffect(() => {
       resetSmile()
    }, [])

    useEffect(() => {
        resetRolesList()
     }, [])


    return (
        user === null ? <Navigate to='/login' /> : 
        <div>
             {user["userRole"] !== null ?
            <h2>{user["userRole"]["Job end date"]}</h2>:
            <h2 style={{color: "red"}}>WITHOUT ROLE!</h2>}
            {smile ? 
            <SmileTwoTone style={{fontSize: '80px', color: '#08c'}} /> : 
            <div>
            <FrownTwoTone style={{fontSize: '80px', color: '#08c'}} />
           
            {/* <h2>{user["userRole"]["Job end date"]}</h2> */}
                        
            <List
            header={<h2 style={{color: "blue", marginLeft: "-1rem"}}>Optional future roles</h2>}
            // footer={<div>Footer</div>}
            bordered
            style={{marginTop: "2rem"}}
            dataSource={rolesList}
            renderItem={item => (
                <List.Item >
                <Title level={4} bordered>{item["Title"]}</Title>
                </List.Item>
            )}
            />
            </div>
            }
        </div>
    )
})

export default Home