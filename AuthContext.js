import React from "react";
import { useState } from "react";

export const AuthContext = React.createContext({
    loginState: false,
    userName: "NoName",
    setLoginState: () => {},
})

export const AuthContextProvider = (props) => {

    const setLoginState = (loginState, userName) => {
        setState({...state, loginState: loginState, userName: userName})
    }


    const initState = {
        loginState: false,
        userName: "NoName",
        setLoginState: setLoginState,
    }

    const [state, setState] = useState(initState)

    return(
        <AuthContext.Provider value={state}>
            {props.children}
        </AuthContext.Provider>
    )
}