import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import {useNavigate} from 'react-router-dom';

export const userData = createContext(null)
export const UserContext = ({children}) => {
    const [user, setUser] = useState()
    const navigate = useNavigate()
    
    const refreshUser = useCallback(
        () => {
            axios.get('/api/current_user').then(request => {
                setUser(request.data)
            }).catch((res) => {
                setUser(null)
                navigate('/login')
            }
                // document.location = '/login'
            )
        },
        [setUser])

    const logoutUser = useCallback(() => {
        axios.post('/api/logout').then(
          res => {
            refreshUser()
            console.log(res)
    
          }
        )
      }, [refreshUser])


    useEffect(() => {
        refreshUser()
    }, [])
    
    return <userData.Provider value={{user: user, refreshUser: refreshUser, logoutUser: logoutUser}}>
                {children({user: user, refreshUser: refreshUser, logoutUser: logoutUser})}
            </userData.Provider>
}

export const withUser = (Component) => {
    return (props) => <userData.Consumer>
        {({user, refreshUser}) => 
            //  component({user: user, refeshUser: refreshUser, ...props})
            <Component user={user} refreshUser={refreshUser} {...props} />
        }
    </userData.Consumer>
}


