import {createContext} from 'react'
import { User } from '../entities/user';

export interface UserInfo {
    token: string
    user: User
}

interface AuthContextProps {
    userInfo: UserInfo | null
    setUserInfo: (userInfo: UserInfo | null) => void
    isLoading: boolean
}

export const AuthContext = createContext<AuthContextProps | null>(null);