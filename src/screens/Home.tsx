import React, { useState, useEffect, useContext } from 'react';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut, ChatTeardropText } from 'phosphor-react-native'
import { Alert } from 'react-native';

import { signOut } from 'firebase/auth'
import {
    collection,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { auth, database } from "../config/firebaseConfig"

import Logo from '../assets/logo_secondary.svg'

import { Filters } from '../components/Filters';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { AuthContext } from '../contexts/auth';

export type RouteParamsDetails = {
    orderId: string
}

export function Home() {
    const { userId, setUserId, userType, setUserType } = useContext(AuthContext)


    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [ordersOpen, setOrdersOpen] = useState<OrderProps[]>([])
    const [ordersClose, setOrdersClose] = useState<OrderProps[]>([])

    const [isLoading, setIsLoading] = useState(true)


    const navigation = useNavigation()

    function handleNewOrder() {
        navigation.navigate('Register')
    }

    function handleOpenDetails(orderId: string) {
        // setOrders([])
        navigation.navigate('Details', { orderId })
    }

    function handleLogout() {

        const subscribe = signOut(auth).then(() => {
            setUserId('')
            setUserType(null)
        }).catch((error) => {
            console.log(error)
            return Alert.alert("Logout", "Logout failed")
        });

        return subscribe
    }

    function getOrders() {
        let q
        if (userType === "admin" || userType === "solver") {
            q = query(collection(database, "orders"), where("status", "==", statusSelected))
        } else {
            q = query(collection(database, "orders"), where("status", "==", statusSelected), where('userId', '==', userId))
        }


        const subscribe = onSnapshot(q, (querySnapshot) => {
            setIsLoading(true)
            const list: OrderProps[] = []
            querySnapshot.docs.map((doc) => {
                const { inventory, description, status, created_at } = doc.data()
                list.push({
                    id: doc.id,
                    inventory,
                    description,
                    status,
                    when: dateFormat(created_at)
                } as OrderProps)
            });
            statusSelected === 'open' ? setOrdersOpen(list) : setOrdersClose(list)
            setIsLoading(false)
            return subscribe
        })
    }

    const { colors } = useTheme()


    useEffect(() => {

        if (userType !== null) {
            getOrders()
        }
    }, [statusSelected, userId, userType])

    return (
        <VStack flex={1} pb={6} bg={'gray.700'}>
            <HStack
                w='full'
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />

                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w='full' mt={8} mb={4} justifyContent="space-between" alignItems="center"  >
                    <Heading color="gray.100">
                        Requests
                    </Heading>
                    <Text color="gray.200" fontSize='xl'>
                        {statusSelected === 'open' ? ordersOpen.length : ordersClose.length}
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filters
                        type='open'
                        title='in progress'
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    <Filters
                        type='closed'
                        title='completed'
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}

                    />
                </HStack>

                {
                    isLoading
                        ? <Loading />
                        :
                        <FlatList
                            data={statusSelected === 'open' ? ordersOpen : ordersClose}
                            keyExtractor={(item => item.id)}
                            renderItem={({ item }) => {
                                return (
                                    <Order data={item} onPress={() => handleOpenDetails(item.id)} />
                                )
                            }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <ChatTeardropText color={colors.gray[300]} size={40} />
                                    <Text color='gray.300' fontSize='xl' mt={6} textAlign='center'>
                                        You don't have {'\n'}
                                        requests {statusSelected === 'open' ? 'in progress' : 'completed'}

                                    </Text>
                                </Center>
                            )}
                        />
                }
                <Button title='New Request' onPress={handleNewOrder} />
            </VStack>

        </VStack>
    );
}