import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import {useNavigate} from 'react-router-dom';

const userData = createContext(null)
export const UserContext = ({children}) => {
    const [user, setUser] = useState()
    const navigate = useNavigate()
    
    const refreshUser = useCallback(
        () => {
            axios.get('/api/current_user').then(request => {
                setUser(request.data)
            }).catch((res) => {
                navigate('/login')
            }
                // document.location = '/login'
            )
        },
        [],
    )
    useEffect(() => {
        refreshUser()
    }, [])
    
    return <userData.Provider value={{user: user, refreshUser: refreshUser}}>
                {children({user: user, refreshUser: refreshUser})}
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