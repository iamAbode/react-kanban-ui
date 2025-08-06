import React, { useState, useEffect } from 'react';
import './NotificationToast.scss';

const NotificationToast = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = 5000; // 5 seconds
        const interval = 50; // Update every 50ms
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - decrement;
                if (newProgress <= 0) {
                    clearInterval(timer);
                    handleClose();
                    return 0;
                }
                return newProgress;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'task-moved':
                return (
                    <svg viewBox="0 0 24 24" className="notification-toast__icon notification-toast__icon--move">
                        <path fill="currentColor" d="M14,16L10,12L14,8V11H20V13H14V16M4,20V18H10V20H4M4,12V10H8V12H4M4,6V4H10V6H4Z" />
                    </svg>
                );
            case 'task-assigned':
                return (
                    <svg viewBox="0 0 24 24" className="notification-toast__icon notification-toast__icon--assign">
                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                );
            case 'task-updated':
                return (
                    <svg viewBox="0 0 24 24" className="notification-toast__icon notification-toast__icon--update">
                        <path fill="currentColor" d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z" />
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 24 24" className="notification-toast__icon">
                        <path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                    </svg>
                );
        }
    };

    return (
        <div className={`notification-toast ${!isVisible ? 'notification-toast--hidden' : ''}`}>
            <div className="notification-toast__content">
                {getIcon()}
                <div className="notification-toast__text">
                    <p className="notification-toast__message">{notification.message}</p>
                    {notification.details && (
                        <span className="notification-toast__details">{notification.details}</span>
                    )}
                </div>
                <button 
                    className="notification-toast__close"
                    onClick={handleClose}
                >
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </button>
            </div>
            <div 
                className="notification-toast__progress" 
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default NotificationToast;
