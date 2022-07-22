import React, { useState } from "react"

import { VStack, Heading, Icon, useTheme } from "native-base"
import { Alert } from "react-native"
import { Envelope, Key } from "phosphor-react-native"

import Logo from "../assets/logo_primary.svg" //para reconhecer instalar yarn add --dev react-native-svg-transformer - alterar metro.config.js e criar pasta @types/svg.d.ts
import { Input } from "../components/Input"
import { Button } from "../components/Button"

import {

    signInWithEmailAndPassword,
} from 'firebase/auth/react-native'

import { auth } from "../config/firebaseConfig"

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { colors } = useTheme()

    function handleSignIn() {
        if (!email || !password) {
            return Alert.alert('Sign in', "enter email and password")
        }

        setIsLoading(true)

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
            })
            .catch((error) => {
                setIsLoading(false)

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Sign in', "Invalid e-mail")
                }

                if (error.code === 'auth/wrong-password') {
                    return Alert.alert('Sign in', "Invalid e-mail or password")
                }

                if (error.code === 'auth/user-not-found') {
                    return Alert.alert('Sign in', "Invalid e-mail or password")
                }

                return Alert.alert('Sign in', 'Could not access')
            })

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
            />

            <Input
                placeholder="Password"
                mb={8}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                value={password}
                onChangeText={(newValue) => setPassword(newValue)}
                autoCapitalize='none'
                autoCorrect={false}
            />

            <Button
                title='Login'
                w='full'
                onPress={handleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    )
}