import { useState } from 'react';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut, ChatTeardropText } from 'phosphor-react-native'


import Logo from '../assets/logo_secondary.svg'

import { Filters } from '../components/Filters';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export type RouteParamsDetails = {
    orderId: string
}

export function Home() {

    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [orders, setOrders] = useState<OrderProps[]>([
        {
            id: '15',
            inventory: '1234',
            when: '18/07/2022',
            status: 'open'
        }
    ])

    const navigation = useNavigation()

    function handleNewOrder() {
        navigation.navigate('Register')
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('Details', { orderId })
    }


    const { colors } = useTheme()

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
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w='full' mt={8} mb={4} justifyContent="space-between" alignItems="center"  >
                    <Heading color="gray.100">
                        Requests
                    </Heading>
                    <Text color="gray.200" fontSize='xl'>
                        {orders.length}
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

                <FlatList
                    data={orders}
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

                <Button title='New Request' onPress={handleNewOrder} />
            </VStack>

        </VStack>
    );
}