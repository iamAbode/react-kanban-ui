import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { notificationTests } from '../../utils/testNotifications';
import './NotificationDemo.scss';

const NotificationDemo = () => {
    const { addNotification } = useNotifications();
    const [testResults, setTestResults] = useState(null);
    const [isRunningTests, setIsRunningTests] = useState(false);

    const demoNotifications = [
        {
            type: 'task-assigned',
            message: 'New task assigned to you',
            details: '"Set up development environment"'
        },
        {
            type: 'task-moved',
            message: 'Your task "Write documentation" was moved',
            details: 'From "To do" to "In progress"'
        },
        {
            type: 'task-updated',
            message: 'Task "Code review" was reassigned',
            details: 'Assigned to Jane Smith'
        }
    ];

    const sendDemoNotification = (index) => {
        addNotification(demoNotifications[index]);
    };

    const runTests = async () => {
        setIsRunningTests(true);
        try {
            const results = await notificationTests.runAllTests(addNotification);
            setTestResults(results);
        } catch (error) {
            console.error('Test run failed:', error);
            setTestResults({ error: 'Tests failed to run' });
        }
        setIsRunningTests(false);
    };

    return (
        <div className="notification-demo">
            <h3>🧪 Test Notifications</h3>
            <p>Click buttons below to test different notification types:</p>
            <div className="notification-demo__buttons">
                <button 
                    className="notification-demo__button notification-demo__button--assign"
                    onClick={() => sendDemoNotification(0)}
                >
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                    Task Assigned
                </button>
                <button 
                    className="notification-demo__button notification-demo__button--move"
                    onClick={() => sendDemoNotification(1)}
                >
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M14,16L10,12L14,8V11H20V13H14V16M4,20V18H10V20H4M4,12V10H8V12H4M4,6V4H10V6H4Z" />
                    </svg>
                    Task Moved
                </button>
                <button 
                    className="notification-demo__button notification-demo__button--update"
                    onClick={() => sendDemoNotification(2)}
                >
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z" />
                    </svg>
                    Task Updated
                </button>
            </div>
            <div className="notification-demo__test-section">
                <h4>🔧 System Tests</h4>
                <button 
                    className="notification-demo__test-button"
                    onClick={runTests}
                    disabled={isRunningTests}
                >
                    {isRunningTests ? 'Running Tests...' : 'Run Notification Tests'}
                </button>
                
                {testResults && (
                    <div className="notification-demo__test-results">
                        <h5>Test Results:</h5>
                        <ul>
                            {Object.entries(testResults).map(([test, result]) => (
                                <li key={test} className={
                                    result === true || (result && result.supported !== false) 
                                        ? 'success' : 'failure'
                                }>
                                    <strong>{test}:</strong> {
                                        typeof result === 'boolean' 
                                            ? (result ? '✅ Pass' : '❌ Fail')
                                            : result && typeof result === 'object'
                                                ? `✅ ${JSON.stringify(result)}`
                                                : '❌ Fail'
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <p className="notification-demo__note">
                💡 In real usage, these notifications are triggered automatically when tasks change.
            </p>
        </div>
    );
};

export default NotificationDemo;
