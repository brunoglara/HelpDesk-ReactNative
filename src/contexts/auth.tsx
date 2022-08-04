import React, { createContext, useContext, useState } from 'react';

type AuthContextData = {
    userId: string
    setUserId: React.Dispatch<React.SetStateAction<string>>
    userType: string
    setUserType: React.Dispatch<React.SetStateAction<string>>
}



export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function AuthProvider({ children }) {
    const [userId, setUserId] = useState('')
    const [userType, setUserType] = useState<'admin' | 'solver' | 'requester' | null>(null)


    return (
        <AuthContext.Provider value={{ userId, setUserId, userType, setUserType }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider