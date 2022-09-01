import React, {useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {URL_FOL_CHPASS} from "../../Firebase-config";

import {useAuthContext} from '../../store/auth-context';
import './ProfileForm.css';

const ProfileForm = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const newPasswordInputRef = useRef<HTMLInputElement>(null);
    let enteredNewPassword: string |undefined;
    const authCtx = useAuthContext;

    const fetchData = async () => {
        enteredNewPassword = newPasswordInputRef.current?.value;

        setIsLoading(true);
        const response = await fetch(URL_FOL_CHPASS, {
            method: 'POST',
            body: JSON.stringify({
                // @ts-ignore
                idToken: authCtx.token,
                password: enteredNewPassword,
                returnSecureToken: false
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
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

        // add validation
        if (!enteredNewPassword) {
            console.log("One of the input is empty");
        }

        fetchData().then(() => {
            history.replace('/');
        }).catch((err) => {
            console.log(err.message);
        });

    };

    return (
        <>
            <form className={"form"} onSubmit={submitHandler}>
                <div className={"control"}>
                    <label htmlFor='new-password'>New Password</label>
                    <input type='password' id='new-password' minLength={7} ref={newPasswordInputRef}/>
                </div>
                <div className={"action"}>
                    <button>Change Password</button>
                </div>
            </form>
        </>
    );
};

export default ProfileForm;
