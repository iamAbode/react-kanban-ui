# Video tutorial

    https://youtu.be/AL7IJVhuGeA

# Reference

    - Create react app: https://create-react-app.dev/
    - SASS: https://sass-lang.com/
    - Boxicons: https://boxicons.com/
    - Google font: https://fonts.google.com/
    - React beautiful dnd: https://github.com/atlassian/react-beautiful-dnd/

# Preview

!["React Draggable Kanban Board"](https://user-images.githubusercontent.com/67447840/155845190-bd85601d-d2a0-4419-82bf-b8361f33075a.gif "React Draggable Kanban Board")





# React Kanban Board with Google Authentication

A modern, responsive Kanban board application built with React and integrated with Google Authentication. Organize your tasks efficiently with drag-and-drop functionality while keeping your data secure with Google Sign-In.

## ✨ Features

### Authentication & Security
- 🔐 **Google Authentication** - Secure sign-in using Google accounts
- 👤 **User Profile** - Display user information and avatar
- 💾 **Persistent Login** - Remember user sessions using localStorage

### Task Management
- 📋 **Drag & Drop** - Intuitive task management with react-beautiful-dnd
- 👥 **Task Assignment** - Assign tasks to specific team members
- 🏷️ **Priority Levels** - Set task priorities (High, Medium, Low)
- 📝 **Task Details** - Add descriptions to tasks

### Team Collaboration
- 👨‍👩‍👧‍👦 **Team Members** - View and manage team members
- 🎯 **Personal Focus Mode** - Shows only your tasks by default
- 🔍 **Smart Filtering** - Filter by:
  - My Tasks (Default view)
  - All Tasks (Toggle to see team's work)
  - Unassigned Tasks
  - Specific Team Member's Tasks
- 👁️ **Toggle View** - Switch between personal and team views
- 🎯 **Visual Indicators** - Easily identify your assigned tasks
- 🖼️ **Avatar Display** - See team member avatars on assigned tasks

### Notifications
- 🔔 **Real-time Alerts** - Get notified when tasks assigned to you change
- 📬 **Notification Panel** - View all notifications in one place
- 🍞 **Toast Notifications** - Non-intrusive pop-up alerts
- 🔴 **Unread Counter** - See pending notifications at a glance
- 🌐 **Browser Notifications** - Get alerts even when tab is inactive

### User Experience
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Clean, professional interface with smooth animations
- 🚀 **Fast & Lightweight** - Optimized performance
- 💾 **Auto-save** - Changes are automatically saved

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- A Google Cloud Project with OAuth 2.0 credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-kanban-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Authentication**

   a. Go to the [Google Cloud Console](https://console.cloud.google.com/)
   
   b. Create a new project or select an existing one
   
   c. Enable the Google Identity Services API
   
   d. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   
   e. Configure the OAuth consent screen
   
   f. Create OAuth 2.0 credentials:
      - Application type: Web application
      - Authorized JavaScript origins: `http://localhost:3000` (for development)
      - Authorized redirect URIs: `http://localhost:3000` (for development)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Google Cloud Console Setup

1. **Create OAuth 2.0 Credentials:**
   - Go to Google Cloud Console
   - Navigate to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized JavaScript origins (your domain)

2. **Configure OAuth Consent Screen:**
   - Add your app information
   - Add authorized test users (during development)
   - Configure scopes (basic profile information)

## 🏗️ Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Update OAuth credentials**
   - Add your production domain to authorized JavaScript origins
   - Update the environment variable with production Client ID

3. **Deploy**
   The `build` folder contains the production-ready files.

## 📱 Usage

### Authentication Flow

1. Users are presented with a Google Sign-In screen
2. After successful authentication, user information is stored locally
3. Users can access their personal Kanban board
4. Sign out option is available in the header

### Kanban Board Features

#### Task Management
- **Drag & Drop:** Move tasks between columns (To Do, In Progress, Completed)
- **Task Assignment:** Click on any task to assign it to team members
- **Priority Indicators:** Visual priority badges on each task
- **Task Descriptions:** Detailed information for each task

#### Team Collaboration
- **Default View:** The board opens with your assigned tasks only
- **Toggle Team View:** Use the switch to see all team tasks
- **Filter Controls:** When in team view, use filters to:
  - **All Tasks:** See everything on the board
  - **My Tasks:** Return to your personal view
  - **Unassigned:** Find tasks that need assignment
  - **Team Member View:** Click on any team member to see their tasks

#### Visual Feedback
- **My Task Highlight:** Tasks assigned to you have a purple border
- **Task Count:** See the number of tasks in each column
- **Avatar Display:** Team member avatars on assigned tasks
- **Responsive Design:** Optimized for all devices

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: This is a one-way operation!** Ejects from Create React App configuration.

## 📦 Dependencies

- **React** - User interface library
- **react-beautiful-dnd** - Drag and drop functionality
- **Sass** - CSS preprocessing
- **uuid** - Unique ID generation
- **Google Identity Services** - Authentication (loaded via script tag)

## 🎨 Customization

### Styling
The app uses Sass for styling. Key files:
- `src/App.scss` - Global styles and app layout
- `src/components/*/` - Component-specific styles

### Authentication
Modify `src/contexts/AuthContext.js` to customize authentication behavior.

### Kanban Logic
Update `src/components/kanban/index.jsx` to modify board functionality.

## 🔒 Security Notes

- Never commit your actual Google Client ID to version control
- Use environment variables for sensitive configuration
- Implement proper server-side validation for production apps
- Consider implementing token refresh for long-lived sessions

## 🐛 Troubleshooting

### Common Issues

1. **Google Sign-In not working:**
   - Verify your Client ID is correct
   - Check that your domain is in authorized JavaScript origins
   - Ensure the Google Identity Services script is loaded

2. **Environment variables not loading:**
   - Restart the development server after changing `.env`
   - Ensure variables start with `REACT_APP_`

3. **Drag and drop issues:**
   - Check React version compatibility with react-beautiful-dnd
   - Verify proper DOM structure in kanban components

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help setting up the project, please create an issue in the repository.

---

## Original Project Reference

This project is based on a tutorial and includes the following references:

- **Video tutorial**: https://youtu.be/AL7IJVhuGeA
- **Create react app**: https://create-react-app.dev/
- **SASS**: https://sass-lang.com/
- **Boxicons**: https://boxicons.com/
- **Google font**: https://fonts.google.com/
- **React beautiful dnd**: https://github.com/atlassian/react-beautiful-dnd/
