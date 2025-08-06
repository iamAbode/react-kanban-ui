import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationToast from './NotificationToast';
import './NotificationContainer.scss';

const NotificationContainer = () => {
    const { notifications } = useNotifications();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Show toast for the latest notification
        if (notifications.length > 0) {
            const latestNotification = notifications[0];
            
            // Check if this notification is new (created in the last second)
            const notificationTime = new Date(latestNotification.timestamp);
            const now = new Date();
            const isNew = now - notificationTime < 1000;

            if (isNew && !toasts.find(t => t.id === latestNotification.id)) {
                setToasts(prev => [...prev, latestNotification]);
            }
        }
    }, [notifications]);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div className="notification-container">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="notification-container__item"
                    style={{ bottom: `${20 + index * 100}px` }}
                >
                    <NotificationToast
                        notification={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
