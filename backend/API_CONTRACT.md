# FixItBharat Backend Contract

This repo now has a frontend API boundary in `src/services`. The current implementation uses a browser mock so the Vite app remains runnable without external credentials. Production should replace those functions with these server endpoints.

## Authentication

`POST /api/auth/aadhaar-otp/start`

Request:

```json
{ "aadhaar": "optional 12 digits", "mobile": "optional 10 digits", "consentVersion": "2026-05" }
```

Response:

```json
{ "requestId": "otp_x", "maskedMobile": "+91 ******1234", "maskedAadhaar": "XXXX XXXX 1234" }
```

Rules:

- Use only an authorized Aadhaar authentication provider.
- Store `aadhaar_ref` or provider reference key, never raw Aadhaar in the app database.
- Persist consent text/version/timestamp.
- Rate-limit OTP requests by IP, mobile hash, and device fingerprint.

`POST /api/auth/aadhaar-otp/verify`

Request:

```json
{ "requestId": "otp_x", "otp": "123456" }
```

Response:

```json
{
  "token": "httpOnly session cookie preferred",
  "user": {
    "id": "uuid",
    "aadhaarRef": "provider_reference_key",
    "mobileMasked": "+91 ******1234"
  }
}
```

## Issues

`GET /api/issues`

Query params: `type`, `status`, `near`, `limit`, `cursor`.

`POST /api/issues`

Creates a report. Server derives `reporter_id` from the session.

```json
{
  "type": "pothole",
  "title": "Deep pothole near bus stop 14",
  "description": "Large pothole has caused several near misses.",
  "addressText": "MG Road, Bengaluru",
  "lat": 12.9716,
  "lng": 77.5946,
  "evidenceIds": ["uuid"]
}
```

Server responsibilities:

- Validate title/description/category/location.
- Run duplicate detection before creating a new issue.
- Assign department based on type and jurisdiction.
- Create initial status history and audit log.
- Return an existing issue with `action=duplicate-upvoted` when appropriate.

`POST /api/issues/:id/vote`

Rules:

- One vote per citizen per issue with a database unique constraint.
- Return the canonical vote count from the database.

`PATCH /api/issues/:id/status`

Department/admin only.

```json
{ "status": "verified_on_site", "note": "Inspector confirmed location.", "evidencePhotoId": "uuid" }
```

Rules:

- Enforce allowed workflow transitions.
- Write `issue_status_history` and `audit_logs`.
- Notify reporter on meaningful status changes.

## Uploads

`POST /api/uploads/evidence`

Multipart image upload.

Rules:

- Accept only JPEG, PNG, WEBP.
- Max 10 MB.
- Store object in S3/R2/Vercel Blob/Supabase Storage.
- Return object key and signed display URL.
- Queue image moderation before public display.

## Abuse Controls

- OTP throttling.
- Per-user and per-IP report limits.
- Profanity and spam checks on title/description/comments.
- Image content moderation.
- Audit every privileged action.
- Keep raw identity data out of logs.
