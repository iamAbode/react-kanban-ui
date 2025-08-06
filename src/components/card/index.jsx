import './card.scss'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Card = ({ task, onAssignTask, teamMembers }) => {
    const [showAssignMenu, setShowAssignMenu] = useState(false);
    const { user } = useAuth();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowAssignMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAssign = (memberId) => {
        onAssignTask(task.id, memberId);
        setShowAssignMenu(false);
    };

    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'high': return 'card__priority--high';
            case 'medium': return 'card__priority--medium';
            case 'low': return 'card__priority--low';
            default: return '';
        }
    };

    const isAssignedToCurrentUser = task.assignee?.id === user?.id;

    return (
        <div className={`card ${isAssignedToCurrentUser ? 'card--assigned-to-me' : ''}`}>
            <div className="card__header">
                <h4 className="card__title">{task.title}</h4>
                <span className={`card__priority ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
            
            {task.description && (
                <p className="card__description">{task.description}</p>
            )}

            <div className="card__footer">
                <div className="card__assignee" ref={menuRef}>
                    <button 
                        className="card__assignee-button"
                        onClick={() => setShowAssignMenu(!showAssignMenu)}
                        title={task.assignee ? `Assigned to ${task.assignee.name}` : 'Click to assign'}
                    >
                        {task.assignee ? (
                            <>
                                <img 
                                    src={task.assignee.picture} 
                                    alt={task.assignee.name}
                                    className="card__assignee-avatar"
                                />
                                <span className="card__assignee-name">{task.assignee.name}</span>
                            </>
                        ) : (
                            <>
                                <div className="card__assignee-placeholder">
                                    <svg viewBox="0 0 24 24" className="card__assignee-icon">
                                        <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                                    </svg>
                                </div>
                                <span className="card__assignee-text">Assign</span>
                            </>
                        )}
                    </button>

                    {showAssignMenu && (
                        <div className="card__assignee-menu">
                            <div className="card__assignee-menu-header">Assign to:</div>
                            {task.assignee && (
                                <button
                                    className="card__assignee-menu-item card__assignee-menu-item--unassign"
                                    onClick={() => handleAssign(null)}
                                >
                                    <svg viewBox="0 0 24 24" className="card__assignee-menu-icon">
                                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                    </svg>
                                    Unassign
                                </button>
                            )}
                            {teamMembers.map(member => (
                                <button
                                    key={member.id}
                                    className={`card__assignee-menu-item ${task.assignee?.id === member.id ? 'card__assignee-menu-item--selected' : ''}`}
                                    onClick={() => handleAssign(member)}
                                >
                                    <img 
                                        src={member.picture} 
                                        alt={member.name}
                                        className="card__assignee-menu-avatar"
                                    />
                                    <div className="card__assignee-menu-info">
                                        <span className="card__assignee-menu-name">{member.name}</span>
                                        <span className="card__assignee-menu-email">{member.email}</span>
                                    </div>
                                    {task.assignee?.id === member.id && (
                                        <svg viewBox="0 0 24 24" className="card__assignee-menu-check">
                                            <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {isAssignedToCurrentUser && (
                    <span className="card__assigned-badge">My Task</span>
                )}
            </div>
        </div>
    )
}

export default Card