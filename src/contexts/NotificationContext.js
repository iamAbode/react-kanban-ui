import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);

    // Load notifications from localStorage with error handling
    useEffect(() => {
        if (user) {
            try {
                const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
                if (savedNotifications) {
                    const parsed = JSON.parse(savedNotifications);
                    // Validate parsed data
                    if (Array.isArray(parsed)) {
                        // Clean up old notifications (keep only last 100)
                        const recentNotifications = parsed.slice(0, 100);
                        setNotifications(recentNotifications);
                        setUnreadCount(recentNotifications.filter(n => !n.read).length);
                    }
                }
            } catch (error) {
                console.warn('Failed to load notifications from localStorage:', error);
                // Clear corrupted data
                localStorage.removeItem(`notifications_${user.id}`);
            }
        }
    }, [user]);

    // Save notifications to localStorage with error handling and debouncing
    useEffect(() => {
        if (user && notifications.length > 0) {
            const timeoutId = setTimeout(() => {
                try {
                    // Check if we have space before saving
                    const testKey = `test_${Date.now()}`;
                    localStorage.setItem(testKey, 'test');
                    localStorage.removeItem(testKey);
                    
                    // Save notifications (keep only last 100)
                    const recentNotifications = notifications.slice(0, 100);
                    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(recentNotifications));
                    
                    // Update state if we trimmed notifications
                    if (recentNotifications.length !== notifications.length) {
                        setNotifications(recentNotifications);
                    }
                } catch (error) {
                    console.warn('Failed to save notifications to localStorage:', error);
                    if (error.name === 'QuotaExceededError') {
                        // Clear old notifications when quota exceeded
                        try {
                            const trimmedNotifications = notifications.slice(0, 50);
                            localStorage.setItem(`notifications_${user.id}`, JSON.stringify(trimmedNotifications));
                            setNotifications(trimmedNotifications);
                        } catch (fallbackError) {
                            console.error('Critical: Cannot save notifications:', fallbackError);
                        }
                    }
                }
            }, 500); // Debounce saves

            return () => clearTimeout(timeoutId);
        }
    }, [user, notifications]);

    // Add a new notification with improved error handling
    const addNotification = useCallback((notification) => {
        try {
            // Validate notification data
            if (!notification || !notification.message) {
                console.warn('Invalid notification data:', notification);
                return null;
            }

            const newNotification = {
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique ID
                timestamp: new Date().toISOString(),
                read: false,
                type: notification.type || 'info',
                message: String(notification.message).substring(0, 200), // Limit message length
                details: notification.details ? String(notification.details).substring(0, 300) : undefined,
                ...notification
            };

            setNotifications(prev => {
                // Prevent duplicate notifications (same message within 5 seconds)
                const recentSimilar = prev.find(n => 
                    n.message === newNotification.message && 
                    Date.now() - new Date(n.timestamp).getTime() < 5000
                );
                
                if (recentSimilar) {
                    return prev; // Skip duplicate
                }
                
                return [newNotification, ...prev.slice(0, 99)]; // Keep only 100 notifications
            });
            
            setUnreadCount(prev => Math.min(prev + 1, 999)); // Cap at 999

            // Show browser notification if permitted and conditions are met
            if (Notification.permission === 'granted' && 
                (document.hidden || !document.hasFocus()) &&
                notification.type !== 'info') { // Don't show browser notifications for info messages
                try {
                    const browserNotification = new Notification('Kanban Board Update', {
                        body: newNotification.message,
                        icon: '/favicon.ico',
                        silent: false,
                        tag: newNotification.id, // Prevent duplicate browser notifications
                        requireInteraction: false
                    });

                    // Auto-close browser notification after 5 seconds
                    setTimeout(() => {
                        browserNotification.close();
                    }, 5000);
                } catch (browserError) {
                    console.warn('Failed to show browser notification:', browserError);
                }
            }

            return newNotification;
        } catch (error) {
            console.error('Failed to add notification:', error);
            return null;
        }
    }, []);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    }, []);

    // Clear all notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
        if (user) {
            localStorage.removeItem(`notifications_${user.id}`);
        }
    }, [user]);

    // Delete a specific notification
    const deleteNotification = useCallback((notificationId) => {
        setNotifications(prev => {
            const notification = prev.find(n => n.id === notificationId);
            if (notification && !notification.read) {
                setUnreadCount(count => Math.max(0, count - 1));
            }
            return prev.filter(n => n.id !== notificationId);
        });
    }, []);

    // Request notification permission
    const requestPermission = useCallback(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }, []);

    const value = {
        notifications,
        unreadCount,
        showPanel,
        setShowPanel,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        deleteNotification,
        requestPermission
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
