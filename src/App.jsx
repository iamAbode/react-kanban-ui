import './App.scss'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import GoogleSignIn from './components/auth/GoogleSignIn'
import Header from './components/header/Header'
import DemoInfo from './components/demo/DemoInfo'
import NotificationDemo from './components/demo/NotificationDemo'
import Kanban from './components/kanban'
import NotificationContainer from './components/notifications/NotificationContainer'

function AppContent() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <GoogleSignIn />;
    }

    return (
        <div className="app">
            <Header />
            <main className="app-main">
                <div className="app-container">
                    <div className="app-header">
                        <h1>Welcome back, {user.given_name || user.name}! 👋</h1>
                        <p>Your personal task dashboard - focus on what matters to you.</p>
                    </div>
                    <DemoInfo user={user} />
                    <NotificationDemo />
                    <Kanban />
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <AppContent />
                <NotificationContainer />
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App
