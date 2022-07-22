import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
//Reference https://amanhimself.dev/blog/remove-asyncstorage-has-been-extracted-warning-using-firebase/


import { onAuthStateChanged, User, } from 'firebase/auth/react-native'
import { auth } from "../config/firebaseConfig"

import { SignIn } from '../screens/SignIn'

import { AppRoutes } from './app.routes'
import { Loading } from '../components/Loading'

export function Routes() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        onAuthStateChanged(auth, (response) => {
            setUser(response)
            setLoading(false)
        });
    }, [])


    return (
        <>
            {
                loading
                    ? <Loading />
                    :
                    <NavigationContainer>
                        {user ? <AppRoutes /> : <SignIn />}
                    </NavigationContainer>
            }
        </>
    )
}