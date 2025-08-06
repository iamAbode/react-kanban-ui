import React from 'react';
import './DemoInfo.scss';

const DemoInfo = ({ user }) => {
    return (
        <div className="demo-info">
            <div className="demo-info__container">
                <h3>🎉 Authentication Demo</h3>
                <div className="demo-info__content">
                    <div className="demo-info__user-data">
                        <h4>Authenticated User Information:</h4>
                        <div className="demo-info__details">
                            <div className="demo-info__item">
                                <strong>Name:</strong> {user.name}
                            </div>
                            <div className="demo-info__item">
                                <strong>Email:</strong> {user.email}
                            </div>
                            <div className="demo-info__item">
                                <strong>User ID:</strong> {user.id}
                            </div>
                            <div className="demo-info__item">
                                <strong>Given Name:</strong> {user.given_name}
                            </div>
                            <div className="demo-info__item">
                                <strong>Family Name:</strong> {user.family_name}
                            </div>
                        </div>
                    </div>
                    <div className="demo-info__features">
                        <h4>🔧 Features Implemented:</h4>
                        <ul>
                            <li>✅ Google OAuth 2.0 Authentication</li>
                            <li>✅ User Profile Display</li>
                            <li>✅ Task Assignment to Team Members</li>
                            <li>✅ Filter Tasks by Assignee</li>
                            <li>✅ My Tasks View</li>
                            <li>✅ Unassigned Tasks Filter</li>
                            <li>✅ Team Member Avatars</li>
                            <li>✅ Task Priority Levels</li>
                            <li>✅ Real-time Notifications</li>
                            <li>✅ Notification Bell & Panel</li>
                            <li>✅ Toast Notifications</li>
                            <li>✅ Persistent Data Storage</li>
                            <li>✅ Responsive Design</li>
                        </ul>
                    </div>
                    <div className="demo-info__note">
                        <p>
                            <strong>Note:</strong> By default, you'll see only tasks assigned to you - perfect for focused work! 
                            Toggle "View all team tasks" to collaborate with your team. 
                            All data is saved locally and tied to your Google account.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoInfo;
