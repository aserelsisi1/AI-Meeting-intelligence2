
import { Link } from "react-router-dom";

function Register() {
    return (
        <div>
            <h1>Create Account</h1>

            <p>Registration page</p>

            <Link to="/login">
                Back to Login
            </Link>
        </div>
    );
}

export default Register;

