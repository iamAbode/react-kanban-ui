// Comprehensive testing utilities for notifications
export const notificationTests = {
    // Test notification creation
    testBasicNotification: (addNotification) => {
        try {
            const result = addNotification({
                type: 'test',
                message: 'Test notification',
                details: 'This is a test'
            });
            return result !== null;
        } catch (error) {
            console.error('Basic notification test failed:', error);
            return false;
        }
    },

    // Test invalid notification handling
    testInvalidNotification: (addNotification) => {
        try {
            // Should handle missing message
            const result1 = addNotification({});
            
            // Should handle null
            const result2 = addNotification(null);
            
            // Should handle undefined
            const result3 = addNotification(undefined);
            
            return result1 === null && result2 === null && result3 === null;
        } catch (error) {
            console.error('Invalid notification test failed:', error);
            return false;
        }
    },

    // Test duplicate prevention
    testDuplicatePrevention: async (addNotification) => {
        try {
            const notification = {
                type: 'test',
                message: 'Duplicate test',
                details: 'Should not duplicate'
            };

            // Add first notification
            const result1 = addNotification(notification);
            
            // Try to add duplicate immediately
            const result2 = addNotification(notification);
            
            return result1 !== null && result2 === null;
        } catch (error) {
            console.error('Duplicate prevention test failed:', error);
            return false;
        }
    },

    // Test localStorage handling
    testLocalStorage: () => {
        try {
            const testKey = 'notification_test_key';
            const testData = { test: 'data' };
            
            // Test write
            localStorage.setItem(testKey, JSON.stringify(testData));
            
            // Test read
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            
            // Test delete
            localStorage.removeItem(testKey);
            
            return retrieved && retrieved.test === 'data';
        } catch (error) {
            console.error('localStorage test failed:', error);
            return false;
        }
    },

    // Test browser notification permission
    testBrowserNotificationPermission: async () => {
        try {
            if (!('Notification' in window)) {
                return { supported: false, permission: null };
            }

            const permission = Notification.permission;
            return { supported: true, permission };
        } catch (error) {
            console.error('Browser notification test failed:', error);
            return { supported: false, permission: null, error };
        }
    },

    // Test notification truncation
    testNotificationTruncation: (addNotification) => {
        try {
            const longMessage = 'A'.repeat(300); // Longer than 200 char limit
            const longDetails = 'B'.repeat(400); // Longer than 300 char limit

            const result = addNotification({
                type: 'test',
                message: longMessage,
                details: longDetails
            });

            return result && 
                   result.message.length <= 200 && 
                   result.details.length <= 300;
        } catch (error) {
            console.error('Notification truncation test failed:', error);
            return false;
        }
    },

    // Run all tests
    runAllTests: async (addNotification) => {
        console.log('🧪 Running notification system tests...');
        
        const results = {
            basicNotification: notificationTests.testBasicNotification(addNotification),
            invalidNotification: notificationTests.testInvalidNotification(addNotification),
            duplicatePrevention: await notificationTests.testDuplicatePrevention(addNotification),
            localStorage: notificationTests.testLocalStorage(),
            browserNotification: await notificationTests.testBrowserNotificationPermission(),
            notificationTruncation: notificationTests.testNotificationTruncation(addNotification)
        };

        const passed = Object.values(results).filter(r => r === true || (r && r.supported !== false)).length;
        const total = Object.keys(results).length;

        console.log('📊 Test Results:', results);
        console.log(`✅ Passed: ${passed}/${total} tests`);

        return results;
    }
};

// Performance monitoring utilities
export const performanceMonitor = {
    measureNotificationRender: (callback) => {
        const start = performance.now();
        callback();
        const end = performance.now();
        return end - start;
    },

    measurePanelOpen: (callback) => {
        const start = performance.now();
        callback();
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                const end = performance.now();
                resolve(end - start);
            });
        });
    },

    memoryUsage: () => {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
};
