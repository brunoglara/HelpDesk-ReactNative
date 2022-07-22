import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { VStack } from 'native-base';
import { Button } from '../components/Button';

import { Header } from '../components/Header';
import { Input } from '../components/Input';

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { database } from "../config/firebaseConfig"


export function Register() {
    const [isLoading, setIsLoading] = useState(false)
    const [inventory, setInventory] = useState('')
    const [description, setDescription] = useState('')

    const navigation = useNavigation()

    async function handleNewOrderRegister() {
        if (!inventory || !description) {
            return Alert.alert('Register', 'fill in all the fields to register')
        }

        setIsLoading(true)

        await addDoc(collection(database, "orders"), {
            inventory,
            description,
            status: 'open',
            created_at: serverTimestamp()
        })
            .then(() => {
                Alert.alert("Register", "Successfully registered")
                navigation.goBack()
            })
            .catch(error => {
                setIsLoading(false)
                return Alert.alert("Register", "Could not register")
            })

    }

    return (
        <VStack flex={1} bg='gray.600'>
            <Header title='Request' />
            <VStack p={5} flex={1}>
                <Input
                    placeholder='Inventory number'
                    mt={4}
                    value={inventory}
                    onChangeText={setInventory}
                    keyboardType='numeric'
                />

                <Input
                    placeholder='Problem description'
                    flex={1}
                    mt={5}
                    multiline
                    textAlignVertical='top'
                    value={description}
                    onChangeText={setDescription}
                />


                <Button
                    title='Register'
                    mt={5}
                    onPress={handleNewOrderRegister}
                    isLoading={isLoading}
                />
            </VStack>
        </VStack>
    );
}