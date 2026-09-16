const API_URL = "http://127.0.0.1:8000/api";

/* =====================================================
   MAIN API REQUEST FUNCTION
===================================================== */

async function apiRequest(endpoint, options = {}) {
    // بما أننا ألغينا اللوجين، قمنا بوضع توكن وهمي افتراضي
    // لضمان مرور الطلبات حتى لو كان الباك إند يتوقع وجود توكن
    const token = localStorage.getItem("token") || "bypassed-fake-token-999";

    const headers = {
        ...options.headers
    };

    /* -------------------------------------------------
       ADD LOGIN TOKEN
    ------------------------------------------------- */
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    /* -------------------------------------------------
       JSON CONTENT TYPE
       Do NOT add it for FormData (مهم جداً لرفع ملف الصوت)
    ------------------------------------------------- */
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    /* -------------------------------------------------
       SEND REQUEST
    ------------------------------------------------- */
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    /* -------------------------------------------------
       READ RESPONSE
    ------------------------------------------------- */
    let data = {};
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    /* -------------------------------------------------
       HANDLE ERRORS
    ------------------------------------------------- */
    if (!response.ok) {
        const message =
            data.detail ||
            data.message ||
            "Something went wrong";
        throw new Error(message);
    }

    return data;
}

/* =====================================================
   AUTHENTICATION
===================================================== */

export async function loginUser(email, password) {
    return apiRequest(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({ email, password })
        }
    );
}

export async function registerUser(name, email, password) {
    return apiRequest(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        }
    );
}

export async function getCurrentUser() {
    return apiRequest(
        "/auth/me",
        { method: "GET" }
    );
}

/* =====================================================
   MEETINGS
===================================================== */

export async function getMeetings() {
    return apiRequest(
        "/meetings/",
        { method: "GET" }
    );
}

export async function getMeeting(meetingId) {
    return apiRequest(
        `/meetings/${meetingId}`,
        { method: "GET" }
    );
}

export async function createMeeting(meetingData) {
    return apiRequest(
        "/meetings/",
        {
            method: "POST",
            body: JSON.stringify(meetingData)
        }
    );
}

export async function updateMeeting(meetingId, meetingData) {
    return apiRequest(
        `/meetings/${meetingId}`,
        {
            method: "PUT",
            body: JSON.stringify(meetingData)
        }
    );
}

export async function deleteMeeting(meetingId) {
    return apiRequest(
        `/meetings/${meetingId}`,
        { method: "DELETE" }
    );
}

/* =====================================================
   UPLOAD MEETING (الربط الفعلي مع موديل الذكاء الاصطناعي)
===================================================== */

export async function uploadMeeting(meetingId, file) {
    const formData = new FormData();
    formData.append("file", file);

    /*
       هنا يتم إرسال ملف الصوت إلى الباك إند.
       تأكد أن المسار في الباك إند (@router.post("/meetings/{id}/upload"))
       هو الذي يقوم باستدعاء دالة WhisperX و Pyannote التي برمجناها مسبقاً.
    */
    return apiRequest(
        `/meetings/${meetingId}/upload`,
        {
            method: "POST",
            body: formData
        }
    );
}

/* =====================================================
   PARTICIPANTS
===================================================== */

export async function getParticipants(meetingId) {
    return apiRequest(
        `/meetings/${meetingId}/participants`,
        { method: "GET" }
    );
}

export async function addParticipant(meetingId, name, email) {
    return apiRequest(
        `/meetings/${meetingId}/participants`,
        {
            method: "POST",
            body: JSON.stringify({
                name: name,
                email: email || null
            })
        }
    );
}

export async function deleteParticipant(participantId) {
    return apiRequest(
        `/participants/${participantId}`,
        { method: "DELETE" }
    );
}