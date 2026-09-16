import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Meetings from "../pages/Meetings";
import CreateMeeting from "../pages/CreateMeeting";
import MeetingDetails from "../pages/MeetingDetails";
import UploadMeeting from "../pages/UploadMeeting";

// لم نعد بحاجة لاستخدام useAuth في الحماية المؤقتة
// import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ children }) {
    // تم إلغاء الحماية بالكامل: سيتم عرض الصفحات الداخلية مباشرة للجميع
    return children;
}


function PublicRoute({ children }) {
    // تم التعديل: أي محاولة للذهاب لصفحة اللوجين ستنقلك فوراً للوحة التحكم
    return <Navigate to="/dashboard" replace />;
}


function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    DEFAULT ROUTE
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* =========================
                    AUTHENTICATION
                ========================= */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />


                {/* =========================
                    DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    MEETINGS
                ========================= */}

                <Route
                    path="/meetings"
                    element={
                        <ProtectedRoute>
                            <Meetings />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    CREATE MEETING
                ========================= */}

                <Route
                    path="/meetings/create"
                    element={
                        <ProtectedRoute>
                            <CreateMeeting />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    MEETING DETAILS
                ========================= */}

                <Route
                    path="/meetings/:id"
                    element={
                        <ProtectedRoute>
                            <MeetingDetails />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    UPLOAD MEETING
                ========================= */}

                <Route
                    path="/meetings/:id/upload"
                    element={
                        <ProtectedRoute>
                            <UploadMeeting />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    INVALID URL
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;