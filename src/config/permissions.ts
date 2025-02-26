export const ALL_PERMISSIONS = {
    COMPANIES: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/companies",
            module: "COMPANIES",
        },
        CREATE: {
            method: "POST",
            apiPath: "/api/v1/companies",
            module: "COMPANIES",
        },
        UPDATE: {
            method: "PUT",
            apiPath: "/api/v1/companies",
            module: "COMPANIES",
        },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/companies/{id}",
            module: "COMPANIES",
        },
    },
    JOBS: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/jobs",
            module: "JOBS",
        },
        CREATE: { method: "POST", apiPath: "/api/v1/jobs", module: "JOBS" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/jobs", module: "JOBS" },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/jobs/{id}",
            module: "JOBS",
        },
    },
    PERMISSIONS: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/permissions",
            module: "PERMISSIONS",
        },
        CREATE: {
            method: "POST",
            apiPath: "/api/v1/permissions",
            module: "PERMISSIONS",
        },
        UPDATE: {
            method: "PUT",
            apiPath: "/api/v1/permissions",
            module: "PERMISSIONS",
        },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/permissions/{id}",
            module: "PERMISSIONS",
        },
    },
    RESUMES: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/resumes",
            module: "RESUMES",
        },
        CREATE: {
            method: "POST",
            apiPath: "/api/v1/resumes",
            module: "RESUMES",
        },
        UPDATE: {
            method: "PUT",
            apiPath: "/api/v1/resumes",
            module: "RESUMES",
        },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/resumes/{id}",
            module: "RESUMES",
        },
    },
    ROLES: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/roles",
            module: "ROLES",
        },
        CREATE: { method: "POST", apiPath: "/api/v1/roles", module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/roles", module: "ROLES" },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/roles/{id}",
            module: "ROLES",
        },
    },
    USERS: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/users",
            module: "USERS",
        },
        CREATE: { method: "POST", apiPath: "/api/v1/users", module: "USERS" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/users", module: "USERS" },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/users/{id}",
            module: "USERS",
        },
    },
    POST_LIMITS: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/post-limits",
            module: "POST_LIMITS",
        },
        CREATE: {
            method: "POST",
            apiPath: "/api/v1/post-limits",
            module: "POST_LIMITS",
        },
        UPDATE: {
            method: "PUT",
            apiPath: "/api/v1/post-limits/{id}",
            module: "POST_LIMITS",
        },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/post-limits/{id}",
            module: "POST_LIMITS",
        },
    },
    PAYMENTS: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/payments/success",
            module: "PAYMENTS",
        },
        CREATE: {
            method: "POST",
            apiPath: "/api/v1/payments",
            module: "PAYMENTS",
        },
        UPDATE: {
            method: "PUT",
            apiPath: "/api/v1/payments/update/${id}",
            module: "PAYMENTS",
        },
        DELETE: {
            method: "DELETE",
            apiPath: "/api/v1/payments/{id}",
            module: "PAYMENTS",
        },
    },
    CONTACT_REQUESTS: {
        GET_PAGINATE: {
            method: "GET",
            apiPath: "/api/v1/contact-requests",
            module: "CONTACT_REQUESTS",
        },
        UPDATE: {
            method: "PUT",
            apiPath: "/api/v1/contact-requests/${id}/status",
            module: "CONTACT_REQUESTS",
        },
    },
};

export const ALL_MODULES = {
    COMPANIES: "COMPANIES",
    FILES: "FILES",
    JOBS: "JOBS",
    PERMISSIONS: "PERMISSIONS",
    RESUMES: "RESUMES",
    ROLES: "ROLES",
    USERS: "USERS",
    SUBSCRIBERS: "SUBSCRIBERS",
    POST_LIMITS: "POST_LIMITS",
    PAYMENTS: "PAYMENTS",
    CONTACT_REQUESTS: "CONTACT_REQUESTS",
};
