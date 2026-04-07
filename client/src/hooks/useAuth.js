import { useEffect, useState } from 'react';

const getToken = () => localStorage.getItem('token');

const decodeJwt = (token) => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

const AUTH_EVENT = 'authchange';

export const getAuthPayload = () => decodeJwt(getToken());

export const isAuthenticated = () => !!getAuthPayload();

export const isAdmin = () => getAuthPayload()?.role === 'admin';

export const emitAuthChange = () => {
    window.dispatchEvent(new Event(AUTH_EVENT));
};

export default function useAuth() {
    const [state, setState] = useState({ isLoggedIn: false, isAdmin: false, user: null });

    useEffect(() => {
        const updateState = () => {
            const authPayload = getAuthPayload();
            setState({
                isLoggedIn: !!authPayload,
                isAdmin: authPayload?.role === 'admin',
                user: authPayload ? { userId: authPayload.userId, email: authPayload.email, role: authPayload.role } : null,
            });
        };

        updateState();
        window.addEventListener('storage', updateState);
        window.addEventListener(AUTH_EVENT, updateState);

        return () => {
            window.removeEventListener('storage', updateState);
            window.removeEventListener(AUTH_EVENT, updateState);
        };
    }, []);

    return state;
}
