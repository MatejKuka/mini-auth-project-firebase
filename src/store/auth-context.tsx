import React, {useCallback, useContext, useEffect, useState} from 'react';

let logoutTimer: ReturnType<typeof setTimeout>;

interface IAuthContext {
    token: string | null,
    isLoggedIn: boolean,
    login: (token: string, expirationTime: number) => void,
    logout: () => void,
}

type Props = {
    children?: React.ReactNode;
}

const AuthContext = React.createContext<IAuthContext>({} as IAuthContext);

const calculateRemainingTime = (expirationTime: number) => {
    const currentTime: number = new Date().getTime();
    const adjExpirationTime: number = new Date(expirationTime).getTime();
    return adjExpirationTime - currentTime;
};

const retrieveStoredToken = () => {
    const storedToken: string | null = localStorage.getItem('token');
    const storedExpirationDate: number | null = Number(localStorage.getItem('expirationTime'));

    const remainingTime: number | null = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 3600) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    };
};


export const AuthContextProvider = ({children}: Props) => {
    const tokenData = retrieveStoredToken();

    let initialToken: string | null = null;
    if (tokenData) {
        initialToken = tokenData.token;
    }

    const [token, setToken] = useState<string | null>(initialToken);

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler: (token: string, expirationTime: number) => void = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', String(expirationTime));

        const remainingTime: number = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
