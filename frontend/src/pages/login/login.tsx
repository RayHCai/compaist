import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router';

import { UserContext } from '@/contexts/userContext';
import { BACKEND_URL } from '@/settings';

import classes from './styles.module.css';

export default function Login() {
    const navigate = useNavigate();
    const { setUser, setProfile } = useContext(UserContext);

    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const publicKey = useRef<HTMLInputElement>(null);
    const privateKey = useRef<HTMLInputElement>(null);

    const [loggingIn, setLoggingIn] = useState(true);

    async function login() {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.current!.value,
                password: password.current!.value,
            }),
        });

        const json = await response.json();

        if (response.ok) {
            setUser(json.user);
            setProfile(json.profile);
            navigate('/dashboard');
        }
    }

    async function register() {
        const responseBalance = await fetch(`${BACKEND_URL}/blockchain/balance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderPublic: publicKey.current!.value,
            }),
        });

        const balance = await responseBalance.json();
        
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName.current!.value,
                lastName: lastName.current!.value,
                email: email.current!.value,
                password: password.current!.value,
                publicKey: publicKey.current!.value,
                privateKey: privateKey.current!.value,
                firstBalance: balance,
            }),
        });

        const json = await response.json();

        if (response.ok) {
            setUser(json.user);
            setProfile(json.profile);
            navigate('/dashboard');
        }
    }

    return (
        <div className="min-h-screen bg-[#f3f1ea] content-center">
            <main className="flex-1 flex flex-col items-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Compaist Logo"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto cursor-pointer"
                        onClick={() => navigate('/')}
                    />

                    <h2
                        className="mt-10 text-center text-3xl/9 font-bold tracking-tight text-gray-900"
                        style={{ fontFamily: 'var(--font-family)' }}
                    >
                        {loggingIn ? 'Sign in to' : 'Create'} your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        action="#"
                        method="POST"
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();

                            if (loggingIn) login();
                            else register();
                        }}
                    >
                        {!loggingIn && (
                            <>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        First Name
                                    </label>

                                    <div className="mt-2">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black-900 sm:text-sm/6"
                                            ref={firstName}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        Last Name
                                    </label>

                                    <div className="mt-2">
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black-900 sm:text-sm/6"
                                            ref={lastName}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        Public Key
                                    </label>

                                    <div className="mt-2">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black-900 sm:text-sm/6"
                                            ref={publicKey}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/6 font-medium text-gray-900"
                                    >
                                        Private Key
                                    </label>

                                    <div className="mt-2">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="password"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black-900 sm:text-sm/6"
                                            ref={privateKey}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Email address
                            </label>

                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black-900 sm:text-sm/6"
                                    ref={email}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-gray-900"
                                >
                                    Password
                                </label>

                                {loggingIn && (
                                    <div className="text-sm">
                                        <a
                                            href="#"
                                            className="font-semibold text-gray-500 transition hover:text-black"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black-900 sm:text-sm/6"
                                    ref={password}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs cursor-pointer transition hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loggingIn ? 'Login' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <a
                            href="#"
                            className="font-semibold text-gray-500 transition hover:text-black"
                            onClick={() => setLoggingIn(false)}
                        >
                            Create an Account
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
