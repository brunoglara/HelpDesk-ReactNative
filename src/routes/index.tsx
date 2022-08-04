import { useState, useEffect, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
//Reference https://amanhimself.dev/blog/remove-asyncstorage-has-been-extracted-warning-using-firebase/


import { onAuthStateChanged, User, } from 'firebase/auth/react-native'
import { auth } from "../config/firebaseConfig"

import { SignIn } from '../screens/SignIn'

import { AppRoutes } from './app.routes'
import { Loading } from '../components/Loading'
import { UserRegister } from '../screens/UserRegister'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../contexts/auth'

import { getDoc, doc } from "firebase/firestore";

import { database } from '../config/firebaseConfig'



export function Routes() {
    const { setUserId, setUserType } = useContext(AuthContext)

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>()

    const { Navigator, Screen } = createNativeStackNavigator()

    async function getTypeUser(userId) {

        const docSnap = await getDoc(doc(database, 'users', userId))

        if (docSnap) {
            setUserType(docSnap.data().typeUser)
        }

        return docSnap

    }

    useEffect(() => {
        onAuthStateChanged(auth, (response) => {
            setUser(response)

            if (response) {
                getTypeUser(response.uid)
                    .then(() => {
                        setUserId(response.uid)
                        setLoading(false)
                    })
            } else {
                setLoading(false)
            }
        });
    }, [])


    return (
        <>
            {
                loading
                    ? <Loading />
                    :
                    <NavigationContainer>
                        {user
                            ?
                            <AppRoutes />
                            :
                            <Navigator screenOptions={{ headerShown: false }} initialRouteName='SignIn'>
                                <Screen name='SignIn' component={SignIn} />
                                <Screen name='UserRegister' component={UserRegister} />
                            </Navigator>
                        }
                    </NavigationContainer>
            }
        </>
    )
}