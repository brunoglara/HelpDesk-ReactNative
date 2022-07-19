import { Button as NativeBaseButton, Heading, IButtonProps } from 'native-base';

type Props = IButtonProps & {
    title: string
}

export function Button({ title, ...rest }: Props) {
    return (
        <NativeBaseButton
            bg='green.700'
            h={14}
            fontSize='sm'
            rounded='sm'
            _pressed={{ bg: 'green.500' }}
            {...rest}
        >
            <Heading color='white' fontSize='sm' >{title}</Heading>
        </NativeBaseButton>
    );
}