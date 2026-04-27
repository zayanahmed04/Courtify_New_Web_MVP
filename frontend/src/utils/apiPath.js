export const API_PATH = {

    AUTH: {
        LOGIN_USER: "/users/login",
        REGISTER_USER: "/users/register",
        CURRENT_USER: "/users/current"
    },
    COURT: {
        REGISTER_COURT: "/courts/register", // POST
        ALL_COURTS: "/courts/all",
        COURT_ALL_COURTS_PENDING: "/courts/all/pending",
        APPROVED_COURTS: "/courts/all/approved",

        COURTS_BY_USER: "/courts/byuser", // GET
        COURT_BY_ID: (id) => `/courts/${id}`, // GET
        UPDATE_COURT: (id) => `/courts/${id}`,
        DELETE_COURT: (id) => `/courts/${id}` // DELETE
    },
    MatchMaking: {
        CREATE_MATCH: "/matchmaking/create",
        GET_MATCHES: "/matchmaking/all",
        DELETE_MATCH: (id) => `/matchmaking/${id}`
    },
    FAVOURITES: {
        ADD_FAVOURITE: "/favs/add",
        GET_FAVOURITES: "/favs/all",
        REMOVE_FAVOURITE: (id) => `/favs/delete/${id}`
    },
    BOOKINGS: {
        CREATE_BOOKING: "/bookings/create",
        GET_BOOKINGS_BY_USER: "/bookings/mybookings",
        GET_BOOKINGS_BY_COURT: (courtId) => `/bookings/bycourt/${courtId}`,
        CANCEL_BOOKING: (bookingId) => `/bookings/cancel/${bookingId}`,
        BY_USER: "/bookings/mybookings",
        UPDATE_BOOKING: (bookingId) => `/bookings/update/${bookingId}`,
        OWNER_COURT_BOOKINGS: "/bookings/all-with-courts",
        REJECT_BOOKING: (bookingId) => `/bookings/reject/${bookingId}`,
        APPROVE_BOOKING: (bookingId) => `/bookings/approve/${bookingId}`,
    },
    PAYMENTS: {
        CREATE: "/payments/create-session"
    },
    ADMIN: {
        GET_ALL_USERS: "/admin/dashboard-stats",
        DELETE_USER: (user_id) => `/admin/delete-user/${user_id}`,
        UPDATE_COURT_STATUS: (court_id) => `/admin/update-court-status/${court_id}`,
        GET_ALL_COURTS_PENDING: "/courts/all/pending"
    },
    REVIEWS: {
        GIVE_RATING: "/reviews/rate",
        MY_REVIEWS: "/reviews/my-reviews",
        BY_COURT: (court_id) => `/reviews/court/${court_id}`
    },
    CHAT: {
        WARMUP: "/chat/warmup",
        ASK: "/chat/ask"
    },
    USER: {
        GET_USER: "/users/current",
        UPDATE_USER: "/users/update"
    }
}