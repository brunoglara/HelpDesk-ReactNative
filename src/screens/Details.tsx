import { Text, VStack } from 'native-base';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native';
import { RouteParamsDetails } from './Home';

export function Details() {
    const route = useRoute()
    const { orderId } = route.params as RouteParamsDetails

    return (
        <VStack flex={1} bg='gray.700'>
            <Header title='Request' />

            <Text color='white'>{orderId}</Text>
        </VStack>
    );
}