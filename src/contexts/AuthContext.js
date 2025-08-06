import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Google OAuth configuration
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

    useEffect(() => {
        // Initialize Google Identity Services when component mounts
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true
            });
            setIsLoading(false);
        } else {
            // Wait for Google script to load
            const checkGoogle = setInterval(() => {
                if (window.google) {
                    window.google.accounts.id.initialize({
                        client_id: CLIENT_ID,
                        callback: handleCredentialResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });
                    setIsLoading(false);
                    clearInterval(checkGoogle);
                }
            }, 100);
        }

        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('kanban_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [CLIENT_ID]);

    const handleCredentialResponse = (response) => {
        // Decode JWT token to get user information
        const userObject = parseJwt(response.credential);
        const userData = {
            id: userObject.sub,
            email: userObject.email,
            name: userObject.name,
            picture: userObject.picture,
            given_name: userObject.given_name,
            family_name: userObject.family_name
        };
        
        setUser(userData);
        localStorage.setItem('kanban_user', JSON.stringify(userData));
        
        // Add current user to team members if not already present
        const teamMembers = JSON.parse(localStorage.getItem('team_members') || '[]');
        const userExists = teamMembers.some(member => member.id === userData.id);
        if (!userExists) {
            teamMembers.push({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                picture: userData.picture
            });
            localStorage.setItem('team_members', JSON.stringify(teamMembers));
        }
    };

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT token:', error);
            return null;
        }
    };

    const signIn = () => {
        if (window.google) {
            window.google.accounts.id.prompt();
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('kanban_user');
        if (window.google) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    const value = {
        user,
        signIn,
        signOut,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
