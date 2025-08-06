import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import './NotificationPanel.scss';

const NotificationPanel = () => {
    const {
        notifications,
        showPanel,
        setShowPanel,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications
    } = useNotifications();

    const panelRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target) && 
                !event.target.closest('.notification-bell')) {
                setShowPanel(false);
            }
        };

        if (showPanel) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showPanel, setShowPanel]);

    if (!showPanel) return null;

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'task-moved':
                return (
                    <svg viewBox="0 0 24 24" className="notification-panel__item-icon notification-panel__item-icon--move">
                        <path fill="currentColor" d="M14,16L10,12L14,8V11H20V13H14V16M4,20V18H10V20H4M4,12V10H8V12H4M4,6V4H10V6H4Z" />
                    </svg>
                );
            case 'task-assigned':
                return (
                    <svg viewBox="0 0 24 24" className="notification-panel__item-icon notification-panel__item-icon--assign">
                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                );
            case 'task-updated':
                return (
                    <svg viewBox="0 0 24 24" className="notification-panel__item-icon notification-panel__item-icon--update">
                        <path fill="currentColor" d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z" />
                    </svg>
                );
            default:
                return (
                    <svg viewBox="0 0 24 24" className="notification-panel__item-icon">
                        <path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                );
        }
    };

    return (
        <div 
            className="notification-panel" 
            ref={panelRef}
            role="dialog"
            aria-label="Notifications panel"
            aria-modal="false"
        >
            <div className="notification-panel__header">
                <h3 id="notifications-heading">Notifications</h3>
                <div className="notification-panel__actions">
                    {notifications.some(n => !n.read) && (
                        <button 
                            className="notification-panel__action"
                            onClick={markAllAsRead}
                            title="Mark all as read"
                            aria-label="Mark all notifications as read"
                        >
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
                            </svg>
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button 
                            className="notification-panel__action"
                            onClick={clearNotifications}
                            title="Clear all"
                            aria-label="Clear all notifications"
                        >
                            <svg viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                        </button>
                    )}
                    <button 
                        className="notification-panel__close"
                        onClick={() => setShowPanel(false)}
                        aria-label="Close notifications panel"
                    >
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div 
                className="notification-panel__content"
                aria-labelledby="notifications-heading"
            >
                {notifications.length === 0 ? (
                    <div 
                        className="notification-panel__empty"
                        role="status"
                        aria-label="No notifications"
                    >
                        <svg viewBox="0 0 24 24" className="notification-panel__empty-icon">
                            <path fill="currentColor" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" opacity="0.3" />
                            <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <p>No notifications yet</p>
                        <span>Task updates will appear here</span>
                    </div>
                ) : (
                    <div 
                        className="notification-panel__list"
                        role="list"
                        aria-label="Notification list"
                    >
                        {notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`notification-panel__item ${!notification.read ? 'unread' : ''}`}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                role="listitem"
                                tabIndex={0}
                                aria-label={`${notification.read ? 'Read' : 'Unread'} notification: ${notification.message}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        if (!notification.read) markAsRead(notification.id);
                                    }
                                }}
                            >
                                <div className="notification-panel__item-left">
                                    {getNotificationIcon(notification.type)}
                                    <div className="notification-panel__item-content">
                                        <p className="notification-panel__item-message">
                                            {notification.message}
                                        </p>
                                        <span className="notification-panel__item-time">
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    className="notification-panel__item-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                    }}
                                    title="Delete notification"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
