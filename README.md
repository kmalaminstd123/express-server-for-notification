# Notification API Documentation

## Overview

The Notification API is a RESTful service built with Express.js that handles push notifications and notification management. It integrates with Expo Push Notification Service and provides endpoints for sending notifications, saving them to a database, and retrieving user notifications.

**Base URL:** `http://localhost:5555/api`

---

## Authentication

Most endpoints require authentication through custom headers. The API uses a middleware system to validate user tokens and notification tokens.

### Required Headers
- `student_id`: The unique identifier for the student
- `user_token`: The authentication token for the user
- `notification_token`: The Expo push notification token

---

## API Endpoints

### 1. Send Push Notification

Send a push notification to a specific device using Expo Push Notification Service.

**Endpoint:** `POST /api/send-notification`

**Authentication:** Required

#### Request Headers
```http
Content-Type: application/json
student_id: <student_id>
user_token: <user_token>
notification_token: <notification_token>
```

#### Request Body
```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Notification Title",
  "body": "Notification message content"
}
```

#### Request Parameters
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `to`      | string | Yes      | Expo push token of the target device |
| `title`   | string | Yes      | Title of the notification |
| `body`    | string | Yes      | Content/body of the notification |

#### Success Response
**Status Code:** `200 OK`
```json
{
  "data": [
    {
      "status": "ok",
      "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    }
  ]
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "message": "Missing required fields",
  "status": false
}
```

**Status Code:** `401 Unauthorized`
```json
{
  "status": false,
  "message": "You are not authorized"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Failed to send notification",
  "status": false
}
```

---

### 2. Save Notification to Database

Store a notification record in the database for future reference.

**Endpoint:** `POST /api/save-notification`

**Authentication:** Required

#### Request Headers
```http
Content-Type: application/json
student_id: <student_id>
user_token: <user_token>
notification_token: <notification_token>
```

#### Request Body
```json
{
  "title": "Notification Title",
  "body": "Notification message content",
  "user_id": 12345
}
```

#### Request Parameters
| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `title`   | string  | Yes      | Title of the notification |
| `body`    | string  | Yes      | Content/body of the notification |
| `user_id` | integer | Yes      | ID of the user receiving the notification |

#### Success Response
**Status Code:** `200 OK`
```json
{
  "message": "Data inserted on database",
  "status": true
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "message": "Missing required fields",
  "status": false
}
```

**Status Code:** `401 Unauthorized`
```json
{
  "status": false,
  "message": "You are not authorized"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Failed to save notification",
  "status": false
}
```

---

### 3. Get User Notifications

Retrieve all notifications for a specific user from the database.

**Endpoint:** `GET /api/user-notifications/:user_id`

**Authentication:** Not Required

#### URL Parameters
| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `user_id` | integer | Yes      | ID of the user whose notifications to retrieve |

#### Example Request
```http
GET /api/user-notifications/12345
```

#### Success Response
**Status Code:** `200 OK`
```json
{
  "message": [
    {
      "id": 1,
      "title": "Welcome Notification",
      "body": "Welcome to our platform!",
      "user_id": 12345,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Course Update",
      "body": "Your course has been updated",
      "user_id": 12345,
      "created_at": "2024-01-16T14:20:00.000Z"
    }
  ],
  "status": true
}
```

#### Error Responses

**Status Code:** `404 Not Found`
```json
{
  "message": "Nothing found",
  "status": false
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "message": "Failed to get notification",
  "status": false,
  "error": {
    "code": "ER_NO_SUCH_TABLE",
    "errno": 1146,
    "sqlMessage": "Table 'database.notification' doesn't exist",
    "sqlState": "42S02"
  }
}
```

---

## Database Schema

### Notification Table
```sql
CREATE TABLE notification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Error Handling

The API uses consistent error response formats:

### Standard Error Response
```json
{
  "message": "Error description",
  "status": false,
  "error": "Additional error details (optional)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `401` - Unauthorized (authentication failed)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side error)

---

## Authentication Flow

The API uses a custom authentication middleware that:

1. Extracts headers: `student_id`, `user_token`, `notification_token`
2. Validates tokens against external API: `https://mba-edu.uk/api/v1/notificationtoken/{student_id}`
3. If tokens don't exist, automatically registers them
4. Grants access on successful validation

### External API Integration
The authentication system integrates with:
- **GET** `https://mba-edu.uk/api/v1/notificationtoken/{student_id}` - Check existing tokens
- **POST** `https://mba-edu.uk/api/v1/notificationtoken/{student_id}` - Register new tokens

---

## Usage Examples

### cURL Examples

#### Send Push Notification
```bash
curl -X POST http://localhost:5555/api/send-notification \
  -H "Content-Type: application/json" \
  -H "student_id: 12345" \
  -H "user_token: your_user_token" \
  -H "notification_token: ExponentPushToken[xxxxxx]" \
  -d '{
    "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "title": "Hello World",
    "body": "This is a test notification"
  }'
```

#### Save Notification
```bash
curl -X POST http://localhost:5555/api/save-notification \
  -H "Content-Type: application/json" \
  -H "student_id: 12345" \
  -H "user_token: your_user_token" \
  -H "notification_token: ExponentPushToken[xxxxxx]" \
  -d '{
    "title": "Course Update",
    "body": "Your course has been updated with new materials",
    "user_id": 12345
  }'
```

#### Get User Notifications
```bash
curl -X GET http://localhost:5555/api/user-notifications/12345
```

### JavaScript Examples

#### Using Fetch API
```javascript
// Send Push Notification
const sendNotification = async () => {
  const response = await fetch('http://localhost:5555/api/send-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'student_id': '12345',
      'user_token': 'your_user_token',
      'notification_token': 'ExponentPushToken[xxxxxx]'
    },
    body: JSON.stringify({
      to: 'ExponentPushToken[target_token]',
      title: 'Hello World',
      body: 'This is a test notification'
    })
  });
  
  const result = await response.json();
  console.log(result);
};

// Get User Notifications
const getUserNotifications = async (userId) => {
  const response = await fetch(`http://localhost:5555/api/user-notifications/${userId}`);
  const result = await response.json();
  console.log(result);
};
```

---

## Environment Variables

The application requires the following environment variables:

```env
PORT=5555
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

---

## Rate Limiting

Currently, there are no rate limiting restrictions implemented. Consider implementing rate limiting for production use to prevent abuse.

---

## CORS Configuration

The API is configured with CORS enabled for all origins. In production, consider restricting CORS to specific domains for security.

---

## Support

For technical support or questions about this API, please contact the development team.