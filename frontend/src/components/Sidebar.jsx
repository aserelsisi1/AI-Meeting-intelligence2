import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

    const { logout } = useAuth();

    return (
        <aside className="sidebar">

            <div className="brand">
                <div className="brand-icon">
                    AI
                </div>

                <div>
                    <h2>MeetingAI</h2>
                    <span>Meeting Intelligence</span>
                </div>
            </div>


            <div className="menu-title">
                WORKSPACE
            </div>

            <nav>

                <NavLink to="/dashboard">
                    <span>⌂</span>
                    Dashboard
                </NavLink>

                <NavLink to="/meetings">
                    <span>▣</span>
                    My Meetings
                </NavLink>

                <NavLink to="/meetings/create">
                    <span>＋</span>
                    New Meeting
                </NavLink>

            </nav>


            <div className="menu-title">
                TOOLS
            </div>

            <nav>

                <NavLink to="/meetings">
                    <span>◉</span>
                    Transcriptions
                </NavLink>

                <NavLink to="/meetings">
                    <span>✦</span>
                    AI Summaries
                </NavLink>

            </nav>


            <div className="sidebar-bottom">

                <div className="user-mini">

                    <div className="avatar">
                        U
                    </div>

                    <div>
                        <strong>User</strong>
                        <small>Account</small>
                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;