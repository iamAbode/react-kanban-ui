import React from 'react';

class NotificationErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Notification component error:', error, errorInfo);
        
        // In production, you could send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: sendErrorReport(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="notification-error" style={{
                    padding: '10px',
                    color: '#dc3545',
                    fontSize: '0.85rem',
                    textAlign: 'center'
                }}>
                    <svg 
                        viewBox="0 0 24 24" 
                        style={{ width: '16px', height: '16px', marginRight: '4px' }}
                    >
                        <path fill="currentColor" d="M13,13H11V7H13M12,17.3A1.3,1.3 0 0,1 10.7,16A1.3,1.3 0 0,1 12,14.7A1.3,1.3 0 0,1 13.3,16A1.3,1.3 0 0,1 12,17.3M15.73,3H8.27L3,8.27V15.73L8.27,21H15.73L21,15.73V8.27L15.73,3Z" />
                    </svg>
                    Notifications temporarily unavailable
                </div>
            );
        }

        return this.props.children;
    }
}

export default NotificationErrorBoundary;
