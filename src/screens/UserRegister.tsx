import { useNavigation } from '@react-navigation/native';
import { VStack, Heading, Icon, useTheme, Text, Select } from 'native-base';
import { useState } from 'react';
import Logo from "../assets/logo_primary.svg"


import { Envelope, Key } from "phosphor-react-native"
import { Input } from "../components/Input"
import { Button } from "../components/Button"

import { createUserWithEmailAndPassword, User } from 'firebase/auth/react-native'

import { doc, setDoc } from "firebase/firestore";

import { auth, database } from "../config/firebaseConfig"
import { Alert } from 'react-native';



export function UserRegister() {
    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [typeUser, setTypeUser] = useState('')


    const [error, setError] = useState(null)

    const navigation = useNavigation()

    const { colors } = useTheme()

    function handleLogin() {
        navigation.goBack()
    }

    function handleRegisterUser() {
        if (!email || !password || !confirmPassword || !typeUser) {
            return setError("Enter e-mail, password, confirm password and type user")
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters long")
        }

        setIsLoading(true)

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                registerCollectionUsers(user)


                return user
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error.code)

                if (error.code === 'auth/email-already-in-use') {
                    return setError("E-mail already in use")
                }

                if (error.code === 'auth/weak-password') {
                    return setError("Password must be at least 6 characters long")
                }

                if (error.code === 'auth/weak-password') {
                    return setError("Password must be at least 6 characters long")
                }


                return setError('Could not access')
            })

    }

    async function registerCollectionUsers(user: User) {
        const subscribe = await setDoc(doc(database, "users", user.uid), {
            email: user.email,
            name: user.displayName,
            typeUser
        })
            .catch(error => {
                setIsLoading(false)
                return Alert.alert("Register", "Could not register")
            })
        return subscribe
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />
            <Heading color='gray.100' fontSize="xl" mt={20} mb={6}>
                Create Account
            </Heading>

            <Input
                placeholder="Entry E-mail"
                mb={2}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                keyboardType="email-address"
                value={email}
                onChangeText={(newValue) => setEmail(newValue)}
                autoCapitalize='none'
                autoCorrect={false}
                borderColor={error && 'red.500'}
                borderWidth={error && 1}
            />
            <Input
                placeholder="Entry Password"
                mb={2}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                value={password}
                onChangeText={(newValue) => setPassword(newValue)}
                autoCapitalize='none'
                autoCorrect={false}
                borderColor={error && 'red.500'}
                borderWidth={error && 1}
            />

            <Input
                placeholder="Confirm Password"
                mb={2}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(newValue) => setConfirmPassword(newValue)}
                autoCapitalize='none'
                autoCorrect={false}
                borderColor={error && 'red.500'}
                borderWidth={error && 1}
            />

            <Select
                placeholder="Type User"
                color='white'
                placeholderTextColor='gray.300'
                selectedValue={typeUser}
                fontSize='md'
                fontFamily="body"
                size='md'
                bg='gray.700'
                h={14}
                w='full'
                width={150}
                onValueChange={(itemValue) => setTypeUser(itemValue)}
                _item={{ _pressed: { bg: 'green.500' } }}
            >
                <Select.Item label="Admin" value="admin" />
                <Select.Item label="Solver" value="solver" />
                <Select.Item label="Requester" value="requester" />
            </Select>

            {
                error &&
                <Text
                    color='red.500'

                >
                    {error}
                </Text>
            }

            <Button
                title='Create'
                w='full'
                onPress={handleRegisterUser}
                isLoading={isLoading}
                my={4}
            />


            <Text fontSize='sm' color='gray.100'>Already have an account?</Text>
            <Text fontSize='sm' color='green.500' onPress={handleLogin}> Login</Text>
        </VStack >
    );
}