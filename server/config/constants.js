/**
 * Global Constants
 * Centralized configuration for Enums and Magic Strings
 */

export const ROLES = {
    ADMIN: 'admin',
    COMPANY: 'company',
    EMPLOYEE: 'employee'
};

export const REVIEW_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const DOCUMENT_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected'
};

export const EMPLOYMENT_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    FREELANCE: 'freelance'
};

export const AUDIT_EVENTS = {
    LOGIN: 'user_login',
    LOGOUT: 'user_logout',
    FAILED_LOGIN: 'failed_login_attempt',
    PASSWORD_CHANGE: 'password_change',
    ACCOUNT_SUSPENDED: 'account_suspended',
    ACCOUNT_ACTIVATED: 'account_activated'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};
