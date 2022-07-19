import { Center, Spinner } from 'native-base'

export function Loading() {

    return (
        <Center flex={1} bg='gray.700'>
            <Spinner size={70} color='green.700' />
        </Center>
    )
}