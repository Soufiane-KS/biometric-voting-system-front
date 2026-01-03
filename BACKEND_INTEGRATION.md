# Frontend Backend Integration Guide

## Overview
This is a Next.js 16 voting application with biometric authentication (Face ID & Fingerprint). All frontend flows call API routes that currently return placeholder responses. Your backend should implement the endpoints below to enable real authentication, enrollment, consent recording, and vote casting.

## Base URL
All API routes are relative to the Next.js app root, e.g. `http://localhost:3000/api/auth/login`.

## API Endpoints

### Authentication

#### `POST /api/auth/login`
- **Purpose**: Email/password login.
- **Body**: `{ email: string, password: string }`
- **Success Response**: `{ success: true, token: string }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Validate credentials, issue a JWT/session. The frontend stores the token (TODO: implement storage).

#### `POST /api/auth/biometric`
- **Purpose**: Fingerprint login (non-Face ID biometric).
- **Body**: `{ email: string }`
- **Success Response**: `{ success: true, token: string }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Perform fingerprint verification, issue a JWT/session.

#### `POST /api/biometric/face-id`
- **Purpose**: Face ID enrollment or authentication.
- **Body**: `FormData` with:
  - `image`: JPEG file of captured face
  - `action`: `"enroll"` or `"auth"`
  - `email` (optional, for auth)
- **Success Response**: `{ success: true, verified: true, credentialId?: string }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Use a face recognition service (e.g., AWS Rekognition, Face API, or local model). Store a template on enrollment; match on auth.

#### `POST /api/auth/register`
- **Purpose**: New user registration.
- **Body**: `{ fullName: string, email: string, nationalId: string, password: string, confirmPassword: string }`
- **Success Response**: `{ success: true, token: string }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Validate fields, ensure email/nationalId uniqueness, hash password, create user, issue JWT/session.

### Consent

#### `POST /api/consent`
- **Purpose**: Record user consent to Moroccan Law 09‑08.
- **Body**: `{ consented: true }`
- **Success Response**: `{ success: true }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Store consent timestamp and user ID. Must be recorded before enrollment.

### Enrollment

#### `POST /api/enroll`
- **Purpose**: Record biometric enrollment choice (non-Face ID).
- **Body**: `{ method: "fingerprint" }`
- **Success Response**: `{ success: true, enrolled: true }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Store the user’s chosen biometric method. Face ID enrollment goes through `/api/biometric/face-id`.

### Voting

#### `POST /api/vote/validate`
- **Purpose**: Validate biometric before allowing a vote.
- **Body**: `{ candidate: string, method: "fingerprint" | "faceId" }`
- **Success Response**: `{ success: true, validated: true }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: For Face ID, the frontend already called `/api/biometric/face-id`. This endpoint can be a no-op or perform additional checks.

#### `POST /api/vote/cast`
- **Purpose**: Persist the final vote.
- **Body**: `{ candidate: string, method: "fingerprint" | "faceId" }`
- **Success Response**: `{ success: true, voteId: string }`
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Store the vote with timestamp, candidate, method, and user ID. Prevent double voting.

### History

#### `GET /api/history`
- **Purpose**: Fetch a user’s voting history.
- **Headers**: Authorization: `Bearer <token>` (if you implement auth)
- **Success Response**: Array of:
  ```ts
  {
    id: string;
    candidate: string;
    party: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status: "Completed";
    method: "Fingerprint" | "Face ID";
  }
  ```
- **Error Response**: `{ success: false, message?: string }`
- **Notes**: Return only votes for the authenticated user.

## Frontend Notes

- **JWT/Session**: The frontend currently does not store tokens. Add a client-side storage mechanism (localStorage, httpOnly cookie, or context) and attach the token to API requests.
- **Biometric Flow**: Face ID uses the device camera, captures a frame, and sends it as a JPEG to `/api/biometric/face-id`. Fingerprint flows use placeholder endpoints.
- **Navigation**: The app includes pages: `/auth`, `/register`, `/consent`, `/enroll`, `/vote`, `/history`. Ensure all endpoints enforce authentication where appropriate.
- **Error Handling**: Frontend shows `alert()` on API errors. You may want to replace this with toast notifications.

## Environment & Deployment

- The app runs on `http://localhost:3000` in development.
- Ensure CORS is configured if your backend is on a different origin.
- For production, set `NEXT_PUBLIC_API_BASE_URL` if you want to override the base API URL.

## Testing

- Use the browser dev tools to monitor network requests.
- The Face ID preview will request camera permissions; allow it to test enrollment/auth flows.
- You can simulate failures by returning `{ success: false, message: "Test error" }` from any endpoint.

## Contact

If you have questions about the frontend expectations or data formats, refer to the component files in `app/*/page.tsx` and the API route files in `app/api/*/route.ts`.
