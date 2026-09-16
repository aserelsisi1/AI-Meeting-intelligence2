import { useAuth } from "../context/AuthContext";

function Header({ title, subtitle }) {

    const { user } = useAuth();

    return (
        <header className="top-header">

            <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            <div className="header-user">

                <div className="header-avatar">
                    U
                </div>

                <div>
                    <strong>
                        {user?.name || user?.email || "User"}
                    </strong>

                    <span>
                        AI Meeting Workspace
                    </span>
                </div>

            </div>

        </header>
    );
}

export default Header;