import React, {createContext, useEffect, useState} from "react";

import api from '../config/configApi';

const Context = createContext();

function AuthProvider({children}) {

    const [authenticated, setAuthenticated] = useState(false);
    
    const [loading, setLoading] = useState(true);

    // VERIFICA SE O USUARIO ESTA LOGADO OU NAO
    useEffect(() => {

        const getLogin = async () => {
            const token = localStorage.getItem('token');

            if(token && valUser()) {
                api.defaults.headers.Authorization = `Bearer ${(token)}`;
                setAuthenticated(true);
            };

            setLoading(false);
        }
        getLogin();
    },[]);

    const valUser = async () => {
        const valueToken = localStorage.getItem('token');

        const headers = {
            'headers' : {
                'Authorization': 'Bearer ' + valueToken
            }
        }
        await api.get(".val-token", headers)
        .then(() => {
            return true;
        }).catch(() => {
            setAuthenticated(false);
            localStorage.removeItem('token'); // Removendo o token
            api.defaults.headers.Authorization = undefined; // Removendo o authorization como indefinido
            return false;
        });
    }

    async function signIn(sit) {
        setAuthenticated(true);
    }

    // CRIANDO LOGOUT
    function handleLogout() {
        setAuthenticated(false); // Usuario nao logado
        localStorage.removeItem('token'); // Removendo o token
        api.defaults.headers.Authorization = undefined;
    }

    if(loading) {
        return <h1>Carregando...</h1>;
    };

    return (
        <>
            <Context.Provider value={{authenticated, signIn, handleLogout}}>
                {children}
            </Context.Provider>
        </>
    );
}


export {Context, AuthProvider};