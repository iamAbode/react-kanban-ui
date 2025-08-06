import './kanban.scss'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import mockData, { mockTeamMembers } from '../../mockData'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import Card from '../card'

const Kanban = () => {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [data, setData] = useState(mockData);
    const [teamMembers, setTeamMembers] = useState([]);
    const [filterMode, setFilterMode] = useState('my-tasks'); // Default to user's tasks
    const [selectedMember, setSelectedMember] = useState(null);
    const [showAllTasks, setShowAllTasks] = useState(false); // Toggle for viewing all tasks

    // Initialize team members
    useEffect(() => {
        // Get team members from localStorage or use mock data
        const savedTeamMembers = localStorage.getItem('team_members');
        if (savedTeamMembers) {
            const members = JSON.parse(savedTeamMembers);
            // Merge with mock members to ensure we have some team data
            const mergedMembers = [...mockTeamMembers];
            members.forEach(member => {
                if (!mergedMembers.find(m => m.id === member.id)) {
                    mergedMembers.push(member);
                }
            });
            setTeamMembers(mergedMembers);
        } else {
            // Initialize with mock team members and current user
            const initialTeam = [...mockTeamMembers];
            if (user && !initialTeam.find(m => m.id === user.id)) {
                initialTeam.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture
                });
            }
            setTeamMembers(initialTeam);
            localStorage.setItem('team_members', JSON.stringify(initialTeam));
        }
    }, [user]);

    // Load user-specific data from localStorage
    useEffect(() => {
        if (user) {
            const userDataKey = `kanban_data_${user.id}`;
            const savedData = localStorage.getItem(userDataKey);
            if (savedData) {
                setData(JSON.parse(savedData));
            }
        }
    }, [user]);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (user && data) {
            const userDataKey = `kanban_data_${user.id}`;
            localStorage.setItem(userDataKey, JSON.stringify(data));
        }
    }, [user, data]);

    const onDragEnd = result => {
        if (!result.destination) return
        const { source, destination, draggableId } = result

        // Find the actual task being dragged
        let draggedTask = null;
        for (const section of data) {
            const task = section.tasks.find(t => t.id === draggableId);
            if (task) {
                draggedTask = task;
                break;
            }
        }

        if (!draggedTask) return;

        if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
            const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)

            const sourceCol = data[sourceColIndex]
            const destinationCol = data[destinationColIndex]

            // Remove task from source column
            const sourceTask = sourceCol.tasks.filter(task => task.id !== draggableId)
            
            // Get filtered tasks for destination to find correct position
            const destFilteredTasks = getFilteredTasks(destinationCol.tasks)
            const destTaskAtIndex = destFilteredTasks[destination.index]
            
            // Find actual index in unfiltered array
            let actualDestIndex = destTaskAtIndex 
                ? destinationCol.tasks.findIndex(t => t.id === destTaskAtIndex.id)
                : destinationCol.tasks.length;

            // Insert task at correct position
            const destinationTask = [...destinationCol.tasks]
            destinationTask.splice(actualDestIndex, 0, draggedTask)

            const newData = [...data]
            newData[sourceColIndex] = { ...sourceCol, tasks: sourceTask }
            newData[destinationColIndex] = { ...destinationCol, tasks: destinationTask }

            setData(newData)

            // Send notification if task is assigned to current user
            if (draggedTask.assignee?.id === user?.id) {
                try {
                    addNotification({
                        type: 'task-moved',
                        message: `Your task "${draggedTask.title}" was moved`,
                        details: `From "${sourceCol.title.replace(/[📃✏️✔️]/g, '').trim()}" to "${destinationCol.title.replace(/[📃✏️✔️]/g, '').trim()}"`
                    });
                } catch (notificationError) {
                    console.warn('Failed to send move notification:', notificationError);
                }
            }
        } else {
            // Reordering within the same column
            const colIndex = data.findIndex(e => e.id === source.droppableId)
            const column = data[colIndex]
            const filteredTasks = getFilteredTasks(column.tasks)
            
            // Get the task being moved
            const movedTask = filteredTasks[source.index]
            const taskAtDestination = filteredTasks[destination.index]
            
            // Find actual indices in unfiltered array
            const actualSourceIndex = column.tasks.findIndex(t => t.id === movedTask.id)
            const actualDestIndex = taskAtDestination 
                ? column.tasks.findIndex(t => t.id === taskAtDestination.id)
                : column.tasks.length;

            // Reorder tasks
            const reorderedTasks = [...column.tasks]
            const [removed] = reorderedTasks.splice(actualSourceIndex, 1)
            
            // Adjust destination index if moving down
            const adjustedDestIndex = actualSourceIndex < actualDestIndex 
                ? actualDestIndex - 1 
                : actualDestIndex;
                
            reorderedTasks.splice(adjustedDestIndex, 0, removed)

            const newData = [...data]
            newData[colIndex] = { ...column, tasks: reorderedTasks }
            
            setData(newData)
        }
    }

    const handleAssignTask = (taskId, assignee) => {
        // Find the task being assigned
        let taskToUpdate = null;
        let previousAssignee = null;
        
        for (const section of data) {
            const task = section.tasks.find(t => t.id === taskId);
            if (task) {
                taskToUpdate = task;
                previousAssignee = task.assignee;
                break;
            }
        }

        const newData = data.map(section => ({
            ...section,
            tasks: section.tasks.map(task => 
                task.id === taskId 
                    ? { ...task, assignee: assignee }
                    : task
            )
        }));
        setData(newData);

        // Send notifications for assignment changes
        if (taskToUpdate) {
            try {
                // Notify new assignee
                if (assignee && assignee.id === user?.id && assignee.id !== previousAssignee?.id) {
                    addNotification({
                        type: 'task-assigned',
                        message: `New task assigned to you`,
                        details: `"${taskToUpdate.title}"`
                    });
                }
                
                // Notify previous assignee if task was reassigned
                if (previousAssignee && previousAssignee.id === user?.id && assignee?.id !== previousAssignee.id) {
                    addNotification({
                        type: 'task-updated',
                        message: `Task "${taskToUpdate.title}" was reassigned`,
                        details: assignee ? `Assigned to ${assignee.name}` : 'Unassigned'
                    });
                }
            } catch (notificationError) {
                console.warn('Failed to send assignment notification:', notificationError);
            }
        }
    };

    const getFilteredTasks = (tasks) => {
        switch (filterMode) {
            case 'my-tasks':
                return tasks.filter(task => task.assignee?.id === user?.id);
            case 'unassigned':
                return tasks.filter(task => !task.assignee);
            case 'member':
                return selectedMember 
                    ? tasks.filter(task => task.assignee?.id === selectedMember.id)
                    : tasks;
            case 'all':
            default:
                return tasks;
        }
    };

    return (
        <div className="kanban-wrapper">
            <div className="kanban-filters">
                <div className="kanban-filters__header">
                    <h2 className="kanban-filters__main-title">
                        {filterMode === 'my-tasks' && !selectedMember ? 'My Tasks' : 
                         filterMode === 'member' && selectedMember ? `${selectedMember.name}'s Tasks` :
                         filterMode === 'unassigned' ? 'Unassigned Tasks' :
                         'All Tasks'}
                    </h2>
                    <div className="kanban-filters__toggle">
                        <label className="kanban-filters__switch">
                            <input
                                type="checkbox"
                                checked={showAllTasks}
                                onChange={(e) => {
                                    setShowAllTasks(e.target.checked);
                                    if (!e.target.checked) {
                                        setFilterMode('my-tasks');
                                        setSelectedMember(null);
                                    } else {
                                        setFilterMode('all');
                                    }
                                }}
                            />
                            <span className="kanban-filters__switch-slider"></span>
                        </label>
                        <span className="kanban-filters__toggle-label">
                            View all team tasks
                        </span>
                    </div>
                </div>
                
                {showAllTasks && (
                    <>
                        <div className="kanban-filters__section">
                            <h3 className="kanban-filters__title">Quick Filters</h3>
                            <div className="kanban-filters__buttons">
                                <button 
                                    className={`kanban-filters__button ${filterMode === 'all' ? 'active' : ''}`}
                                    onClick={() => { setFilterMode('all'); setSelectedMember(null); }}
                                >
                                    <svg viewBox="0 0 24 24" className="kanban-filters__button-icon">
                                        <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                                    </svg>
                                    All Tasks
                                </button>
                                <button 
                                    className={`kanban-filters__button ${filterMode === 'my-tasks' && !selectedMember ? 'active' : ''}`}
                                    onClick={() => { setFilterMode('my-tasks'); setSelectedMember(null); }}
                                >
                                    <svg viewBox="0 0 24 24" className="kanban-filters__button-icon">
                                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                    </svg>
                                    My Tasks
                                </button>
                                <button 
                                    className={`kanban-filters__button ${filterMode === 'unassigned' ? 'active' : ''}`}
                                    onClick={() => { setFilterMode('unassigned'); setSelectedMember(null); }}
                                >
                                    <svg viewBox="0 0 24 24" className="kanban-filters__button-icon">
                                        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,7V13H13V7H11M11,15V17H13V15H11Z" />
                                    </svg>
                                    Unassigned
                                </button>
                            </div>
                        </div>
                        <div className="kanban-filters__section">
                            <h3 className="kanban-filters__title">Filter by Team Member</h3>
                            <div className="kanban-filters__team">
                                {teamMembers.map(member => {
                                    const isCurrentUser = member.id === user?.id;
                                    return (
                                        <button
                                            key={member.id}
                                            className={`kanban-filters__member ${selectedMember?.id === member.id ? 'active' : ''} ${isCurrentUser ? 'current-user' : ''}`}
                                            onClick={() => { 
                                                setFilterMode('member'); 
                                                setSelectedMember(member);
                                            }}
                                            title={`Filter by ${member.name}${isCurrentUser ? ' (You)' : ''}`}
                                        >
                                            <img 
                                                src={member.picture} 
                                                alt={member.name}
                                                className="kanban-filters__member-avatar"
                                            />
                                            <span className="kanban-filters__member-name">
                                                {member.name}
                                                {isCurrentUser && <span className="kanban-filters__member-badge"> (You)</span>}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
                
                {!showAllTasks && (
                    <div className="kanban-filters__info">
                        <svg viewBox="0 0 24 24" className="kanban-filters__info-icon">
                            <path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                        </svg>
                        <p>You're viewing only your assigned tasks. Toggle "View all team tasks" to see everyone's work.</p>
                    </div>
                )}
            </div>

            {/* Check if user has any tasks when in personal view */}
            {filterMode === 'my-tasks' && !showAllTasks && 
             data.every(section => getFilteredTasks(section.tasks).length === 0) && (
                <div className="kanban-empty-state">
                    <svg viewBox="0 0 24 24" className="kanban-empty-state__icon">
                        <path fill="currentColor" d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z" />
                    </svg>
                    <h3>No tasks assigned to you yet!</h3>
                    <p>Toggle "View all team tasks" to see unassigned tasks or ask your team lead for assignments.</p>
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban" style={{ 
                    display: filterMode === 'my-tasks' && !showAllTasks && 
                            data.every(section => getFilteredTasks(section.tasks).length === 0) ? 'none' : 'flex' 
                }}>
                    {
                        data.map(section => {
                            const filteredTasks = getFilteredTasks(section.tasks);
                            return (
                                <Droppable
                                    key={section.id}
                                    droppableId={section.id}
                                >
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            className='kanban__section'
                                            ref={provided.innerRef}
                                        >
                                            <div className="kanban__section__title">
                                                {section.title}
                                                <span className="kanban__section__count">
                                                    {filteredTasks.length}
                                                </span>
                                            </div>
                                            <div className="kanban__section__content">
                                                {
                                                    filteredTasks.map((task, index) => (
                                                        <Draggable
                                                            key={task.id}
                                                            draggableId={task.id}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        opacity: snapshot.isDragging ? '0.5' : '1'
                                                                    }}
                                                                >
                                                                    <Card
                                                                        task={task}
                                                                        onAssignTask={handleAssignTask}
                                                                        teamMembers={teamMembers}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                }
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            )
                        })
                    }
                </div>
            </DragDropContext>
        </div>
    )
}

export default Kanban