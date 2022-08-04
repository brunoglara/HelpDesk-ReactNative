import { useState, useEffect, useContext } from 'react';

import { HStack, Text, VStack, useTheme, ScrollView } from 'native-base';
import { Header } from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteParamsDetails } from './Home';
import { OrderProps } from '../components/Order';

import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc
} from "firebase/firestore";
import { database } from "../config/firebaseConfig"

import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';
import { AuthContext } from '../contexts/auth';



type OrderDetails = OrderProps & {
    solution: string
    closed: string
}

export function Details() {
    const { userId, userType } = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(true)
    const [solution, setSolution] = useState('')
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

    const { colors } = useTheme()

    const navigation = useNavigation()
    const route = useRoute()
    const { orderId } = route.params as RouteParamsDetails

    async function getOrderDetails() {
        setIsLoading(true)

        const docSnap = await getDoc(doc(database, "orders", orderId));

        const { inventory, description, status, created_at, closed_at, solution } = docSnap.data()

        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
            id: docSnap.id,
            inventory,
            description,
            status,
            solution,
            when: dateFormat(created_at),
            closed,
            userId
        })
        setIsLoading(false)

        return docSnap
    }

    async function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Close request', "Solution required to close request")
        }

        setIsLoading(true)
        try {
            const subscribe = await setDoc(doc(database, 'orders', orderId), {
                status: 'closed',
                solution,
                closed_at: serverTimestamp()
            }, { merge: true })
            return subscribe
        }
        catch (error) {
            Alert.alert('Close request', "Could not close request")
        } finally {
            navigation.goBack()
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getOrderDetails()
    }, [])

    return (
        <VStack flex={1} bg='gray.700'>
            <VStack >
                <Header title='Request' />
            </VStack>
            {
                isLoading ? <Loading />
                    :
                    <>
                        <HStack bg='gray.500' justifyContent='center' p={4}>
                            {
                                order.status === 'closed'
                                    ? <CircleWavyCheck size={22} color={colors.green[300]} />
                                    : <Hourglass size={22} color={colors.secondary[700]} />
                            }

                            <Text
                                fontSize='sm'
                                color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                                ml={2}
                                textTransform='uppercase'
                            >
                                {
                                    order.status === 'closed' ? 'Completed' : 'In Progress'
                                }
                            </Text>
                        </HStack>

                        <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                            <CardDetails
                                title='equipment'
                                description={`Patrimônio ${order.inventory}`}
                                icon={DesktopTower}
                            />

                            <CardDetails
                                title='request description'
                                description={order.description}
                                icon={ClipboardText}
                                footer={`Registered in ${order.when}`}
                            />

                            <CardDetails
                                title='Solution'
                                description={order.solution}
                                icon={CircleWavyCheck}
                                footer={order.closed && `Completed at ${order.closed}`}
                            >
                                {
                                    order.status === 'open' && userType !== 'requester' &&
                                    <Input
                                        placeholder='Solution description'
                                        onChangeText={setSolution}
                                        textAlignVertical='top'
                                        h={24}
                                        multiline
                                    />
                                }
                            </CardDetails>
                        </ScrollView>
                        {
                            order.status === 'open' &&
                            <Button
                                title='Close request' m={5}
                                onPress={handleOrderClose}
                                isLoading={isLoading}
                            />
                        }
                    </>
            }
        </VStack>
    );
}