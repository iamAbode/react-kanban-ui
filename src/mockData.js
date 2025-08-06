import { v4 as uuidv4 } from 'uuid'

// Mock team members - in a real app, this would come from your backend
export const mockTeamMembers = [
    {
        id: 'user_1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff'
    },
    {
        id: 'user_2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        picture: 'https://ui-avatars.com/api/?name=Jane+Smith&background=764ba2&color=fff'
    },
    {
        id: 'user_3',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        picture: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=f093fb&color=fff'
    },
    {
        id: 'user_4',
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        picture: 'https://ui-avatars.com/api/?name=Alice+Williams&background=4facfe&color=fff'
    }
];

const mockData = [
    {
        id: uuidv4(),
        title: ' 📃 To do',
        tasks: [
            {
                id: uuidv4(),
                title: 'Learn JavaScript',
                description: 'Complete JavaScript fundamentals course',
                assignee: mockTeamMembers[0], // John Doe
                priority: 'medium',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                title: 'Learn Git',
                description: 'Master version control with Git',
                assignee: mockTeamMembers[1], // Jane Smith
                priority: 'high',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                title: 'Learn Python',
                description: 'Python programming basics',
                assignee: null,
                priority: 'low',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                title: 'Review Code PRs',
                description: 'Review pending pull requests',
                assignee: mockTeamMembers[2], // Bob Johnson
                priority: 'high',
                createdAt: new Date().toISOString()
            },
        ]
    },
    {
        id: uuidv4(),
        title: ' ✏️ In progress',
        tasks: [
            {
                id: uuidv4(),
                title: 'Learn CSS',
                description: 'Advanced CSS and animations',
                assignee: mockTeamMembers[0], // John Doe
                priority: 'medium',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                title: 'Learn Golang',
                description: 'Go programming language basics',
                assignee: mockTeamMembers[3], // Alice Williams
                priority: 'high',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                title: 'Write Documentation',
                description: 'Update project documentation',
                assignee: null,
                priority: 'medium',
                createdAt: new Date().toISOString()
            }
        ]
    },
    {
        id: uuidv4(),
        title: ' ✔️ Completed',
        tasks: [
            {
                id: uuidv4(),
                title: 'Learn HTML',
                description: 'HTML5 semantic markup',
                assignee: mockTeamMembers[1], // Jane Smith
                priority: 'low',
                createdAt: new Date().toISOString()
            },
            {
                id: uuidv4(),
                title: 'Setup Development Environment',
                description: 'Configure local dev environment',
                assignee: mockTeamMembers[2], // Bob Johnson
                priority: 'high',
                createdAt: new Date().toISOString()
            }
        ]
    }
]

export default mockData