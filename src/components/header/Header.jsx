import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import NotificationPanel from '../notifications/NotificationPanel';
import NotificationErrorBoundary from '../notifications/NotificationErrorBoundary';
import './Header.scss';

const Header = () => {
    const { user, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = () => {
        signOut();
        setShowUserMenu(false);
    };

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__left">
                    <h1 className="header__title">
                        📋 Kanban Board
                    </h1>
                </div>
                
                <div className="header__right">
                    {user && (
                        <>
                            <div className="header__notifications">
                                <NotificationErrorBoundary>
                                    <NotificationBell />
                                    <NotificationPanel />
                                </NotificationErrorBoundary>
                            </div>
                            <div className="header__user">
                            <div 
                                className="header__user-info"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <img 
                                    src={user.picture} 
                                    alt={user.name}
                                    className="header__user-avatar"
                                />
                                <div className="header__user-details">
                                    <span className="header__user-name">{user.name}</span>
                                    <span className="header__user-email">{user.email}</span>
                                </div>
                                <svg 
                                    className={`header__user-arrow ${showUserMenu ? 'rotated' : ''}`}
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                                </svg>
                            </div>
                            
                            {showUserMenu && (
                                <div className="header__user-menu">
                                    <div className="header__user-menu-item">
                                        <strong>{user.name}</strong>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="header__user-menu-divider"></div>
                                    <button 
                                        className="header__user-menu-item header__user-menu-button"
                                        onClick={handleSignOut}
                                    >
                                        <svg viewBox="0 0 24 24" className="header__logout-icon">
                                            <path fill="currentColor" d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4A2,2 0 0,0 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z"/>
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Backdrop to close menu when clicking outside */}
            {showUserMenu && (
                <div 
                    className="header__backdrop"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
};

export default Header;
