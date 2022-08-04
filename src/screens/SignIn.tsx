import React, { useState, useContext } from "react"

import { VStack, Heading, Icon, useTheme, Text, HStack } from "native-base"
import { Envelope, Key } from "phosphor-react-native"
import { useNavigation } from "@react-navigation/native"

import Logo from "../assets/logo_primary.svg" //para reconhecer instalar yarn add --dev react-native-svg-transformer - alterar metro.config.js e criar pasta @types/svg.d.ts
import { Input } from "../components/Input"
import { Button } from "../components/Button"

import {
    signInWithEmailAndPassword,
} from 'firebase/auth/react-native'

import { auth } from "../config/firebaseConfig"
import { AuthContext } from "../contexts/auth"

export function SignIn() {

    const { userId, setUserId } = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigation = useNavigation()

    const { colors } = useTheme()

    function handleSignIn() {
        if (!email || !password) {
            return setError("Enter e-mail and password")
        }

        setIsLoading(true)

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                setUserId(userCredential.user.uid);
                return userCredential
            })
            .catch((error) => {
                setIsLoading(false)

                if (error.code === 'auth/invalid-email') {
                    return setError("Invalid e-mail")
                }

                if (error.code === 'auth/wrong-password') {
                    return setError("Invalid e-mail or password")
                }

                if (error.code === 'auth/user-not-found') {
                    return setError("Invalid e-mail or password")
                }

                return setError('Could not access')
            })

    }

    function handleSubscribe() {
        navigation.navigate('UserRegister')
    }
    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />
            <Heading color='gray.100' fontSize="xl" mt={20} mb={6}>
                Sign In your account
            </Heading>

            <Input
                placeholder="E-mail"
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
                placeholder="Password"
                mb={4}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                value={password}
                onChangeText={(newValue) => setPassword(newValue)}
                autoCapitalize='none'
                autoCorrect={false}
                borderColor={error && 'red.500'}
                borderWidth={error && 1}
            />

            {
                error &&
                <Text
                    color='red.500'

                >
                    {error}
                </Text>
            }

            <Button
                title='Login'
                w='full'
                onPress={handleSignIn}
                isLoading={isLoading}
                my={4}
            />


            <Text fontSize='sm' color='gray.100'>Don't have a registration?</Text>
            <Text fontSize='sm' color='green.500' onPress={handleSubscribe}> Create Account</Text>

        </VStack>
    )
}