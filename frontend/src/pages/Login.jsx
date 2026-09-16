import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleLogin(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await login(
                email,
                password
            );

            console.log("LOGIN SUCCESS:", data);

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            setError(
                error.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    AI
                </div>


                <h1>
                    Welcome back
                </h1>

                <p className="auth-subtitle">
                    Sign in to your MeetingAI workspace
                </p>


                <form onSubmit={handleLogin}>

                    <label>
                        Email address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>


                <div className="auth-footer">

                    Don't have an account?

                    <Link to="/register">
                        Create an account
                    </Link>

                </div>

            </div>

        </div>

    );
}


export default Login;