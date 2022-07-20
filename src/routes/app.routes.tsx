import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from "../screens/Home";
import { Register } from "../screens/Register";
import { Details } from "../screens/Details";

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name='Home' component={Home} />
            <Screen name='Register' component={Register} />
            <Screen name='Details' component={Details} />
        </Navigator>
    )
}