
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    registerUser,
    getCurrentUser
} from "../services/api";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    /* =========================
       CHECK EXISTING LOGIN
    ========================= */

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        getCurrentUser()
            .then((data) => {

                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(data);
                }

            })
            .catch(() => {

                localStorage.removeItem("token");
                setUser(null);

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    /* =========================
       LOGIN
    ========================= */

    async function login(
        email,
        password
    ) {

        const data = await loginUser(
            email,
            password
        );

        localStorage.setItem(
            "token",
            data.access_token
        );

        setUser(data.user);

        return data;
    }


    /* =========================
       REGISTER
    ========================= */

    async function register(
        name,
        email,
        password
    ) {

        const data = await registerUser(
            name,
            email,
            password
        );

        return data;
    }


    /* =========================
       LOGOUT
    ========================= */

    function logout() {

        localStorage.removeItem("token");

        setUser(null);

        window.location.href = "/login";
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);
}

