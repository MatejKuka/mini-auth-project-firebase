import React, {Fragment, useState, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {URL_FOR_LOGIN, URL_FOR_SIGNUP} from "../../Firebase-config";
import {useAuthContext} from '../../store/auth-context';
import "./AuthForm.css";

const AuthForm = () => {
    const history = useHistory();

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    let enteredEmail: string | undefined;
    let enteredPassword: string |undefined;

    const authCtx = useAuthContext();

    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const fetchData = async () => {
        enteredEmail = emailInputRef.current?.value;
        enteredPassword = passwordInputRef.current?.value;

        setIsLoading(true);
        let url;
        if (isLogin) {
            url = URL_FOR_LOGIN;
        } else {
            url = URL_FOR_SIGNUP;
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
                returnSecureToken: true,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        setIsLoading(false);
        if (!response.ok) {
            return response.json().then((data) => {
                throw new Error(data.error.message);
            });
        } else {
            return response.json();
        }
    }

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        // VALIDATION HERE
        if (!enteredEmail && !enteredPassword) {
            return;
        }

        fetchData().then((data) => {
            const expirationTime = new Date(
                new Date().getTime() + +data.expiresIn * 1000
            ).getTime();
            authCtx.login(data.idToken, expirationTime);
            history.replace('/');
        }).catch((err) => {
            console.log(err.message);
        });

    };

    return (
        <Fragment>
            <section className={"auth"}>
                <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={submitHandler}>
                    <div className={"control"}>
                        <label htmlFor='email'>Your Email</label>
                        <input type='email' id='email' required ref={emailInputRef}/>
                    </div>
                    <div className={"control"}>
                        <label htmlFor='password'>Your Password</label>
                        <input
                            type='password'
                            id='password'
                            required
                            ref={passwordInputRef}/>
                    </div>
                    <div className={"actions"}>
                        {!isLoading && (
                            <button>{isLogin ? 'Login' : 'Create Account'}</button>
                        )}
                        {isLoading && <p>Sending request...</p>}
                        <button
                            type='button'
                            className={"toggle"}
                            onClick={switchAuthModeHandler}
                        >
                            {isLogin ? 'Create new account' : 'Login with existing account'}
                        </button>
                    </div>
                </form>
            </section>
        </Fragment>
    );
};

export default AuthForm;
