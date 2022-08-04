import { NativeBaseProvider, StatusBar } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto"

import { THEME } from './src/styles/theme'

import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import AuthProvider from './src/contexts/auth';

export default function App() {
  //Carregamento de fonts
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <AuthProvider>
      <NativeBaseProvider theme={THEME}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent={true}
        />

        {fontsLoaded ? <Routes /> : <Loading />}
      </NativeBaseProvider>
    </AuthProvider>
  );
}

