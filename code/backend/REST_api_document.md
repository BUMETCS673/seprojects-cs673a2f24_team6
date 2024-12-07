REST API Documentation
==========================================================

## AUTHENTICATION ENDPOINTS

### 1.1 Create New Account
Endpoint: ~/api/account 
Method: POST
Description: Creates a new user account with the provided email, name, and password.

Request Body:
```json
{
    "email": "string (required)",
    "name": "string (required)",
    "password": "string (required)"
}
```

Response:

* Success (200 OK): `{ "token": "string (user ID)" }`
* Error (400 Bad Request): `{ "err": "Missing required fields"}`
* Error (400 Bad Request): `{"err":"user name or email already exist"}`



----------------------------------------------------------

### 1.2 Login Account
Endpoint: ~/api/account
Method: GET
Description: Authenticates a user using email/username and password

Query Parameters:
```json
{
    "email": "string (optional)",
    "name": "string (optional)",
    "password": "string (required)"
}
```

Response:

* Success (200 OK): `{ "token": "string (user ID)" }`
* Error (400 Bad Request): `{ "err": "missing not null value" }`
* Error (401 Unauthorized): `{ "err": "password error" }`
* Error (401 Unauthorized): `{ "err": "no such user" }`

----------------------------------------------------------

### 1.3 Update Password
Endpoint: ~/api/account
Method: PUT
Description: Updates user's password. Requires authentication.

Request Body:
```json
{
    "currentPassword": "string (required)",
    "newPassword": "string (required)"
}
```

Response:

* Success (200 OK): `{ "massage": "Password updated successfully" }`
* Error (400 Bad Request): `{"err": "current password error, update fail"}`

----------------------------------------------------------

### 1.4 Delete Account

Endpoint: ~/api/account
Method: DELETE
Description: Deletes user account. Requires authentication.

Request Body:
```json
{
    "password": "string (required)"
}
```

Response:

* Success (200 OK): `{ "msg": "Account deleted successfully" }`
* Error (400 Bad Request): `{ "err": "Password is required" }`
* Error (404 Not Found): `{ "err": "Account not found" }`
* Error (401 Unauthorized): `{ "err": "Invalid password" }`



## EXERCISE ENDPOINTS

### 2.1 Create Exercise

Endpoint: ~/api/exercise
Method: POST
Description: Creates a new exercise. Requires authentication.

Request Body:
```json
{
    "name": "string (required)",
    "type": "string (optional)",
    "description": "string (optional)",
    "equipment": "string (optional)",
    "url": "number (optional)"
}
```

Response:

* Success (200 OK): `{"massage": "exercise create successfully"}`
* Error (400 Bad Request): `{ "err": "only Admin account accept" }`
* Error (400 Bad Request): `{ "err": "missing name" }`
* Error (400 Bad Request): `{ "err": "exercise create fail" }`

----------------------------------------------------------

### 2.2 Get Exercise Type List
Endpoint: ~/api/exercise/typelist
Method: GET
Description: Retrieves all exercise types. Public route.

Response:

*  Success (200 OK): Array of exercise types
* Error (400 Bad Request): `{ "err": error_message }`

----------------------------------------------------------

### 2.3 Get Exercise Equipment List
Endpoint: ~/api/exercise/equipmentlist
Method: GET
Description: Retrieves all available equipment. Public route.

Response:

* Success (200 OK): Array of equipment
* Error (400 Bad Request): `{ "err": error_message }`

----------------------------------------------------------

### 2.4 Get All Exercises
Endpoint: ~/api/exercise
Method: GET
Description: Retrieves all exercises. Public route.

Response:

* Success (200 OK): Array of exercises
* Error (400 Bad Request): `{ "err": error_message }`

----------------------------------------------------------

### 2.5 Get Exercises by Type
Endpoint: ~/api/exercise/type
Method: GET
Description: Retrieves exercises of specific type. Public route.

Query Parameters:

* type: Exercise type

Response:

* Success (200 OK): Array of exercises
* Error (400 Bad Request): `{ "err": error_message }`

----------------------------------------------------------

### 2.6 Get Exercises by Equipment 

Endpoint: ~/api/exercise/equipment
Method: GET
Description: Retrieves exercises of specific equipment. Public route.

Query Parameters:

* equipment: Exercise equipment

Response:

* Success (200 OK): Array of exercises
* Error (400 Bad Request): `{ "err": error_message }`

----------------------------------------------------------

### 2.7 Get Exercises by Exercise Id

Endpoint: ~/api/exercise/id
Method: GET
Description: Retrieves exercises of specific exercise id. Public route.

Query Parameters:

* exercise_id: Exercise id

Response:

* Success (200 OK): Array of exercises
* Error (400 Bad Request): `{ "err": error_message }`

----------------------------------------------------------

### 2.8 Delete Exercise
Endpoint: ~/api/exercise/
Method: DELETE
Description: Deletes an exercise. Requires authentication.

Request Body:

```json
{
    "exercise_id": "number (required)",
}
```

Response:

* Success (200 OK): `{"massage": "exercise delete successfully"}`
* Error (400 Bad Request): `{ "err": "only Admin account accept" }`
* Error (400 Bad Request): `{ "err": "missing exercise_id" }`
* Error (400 Bad Request): `{ "err": "exercise delete fail" }`



## WORKOUT PLAN ENDPOINTS

### 3.1 Create Plan
Endpoint: ~/api/plan
Method: POST
Description: Creates new workout plan. Requires authentication.

Request Body:
```json
{
    "exercise_id": "number (required)",
    "title": "string (required)",
    "description": "string (required)",
    "frequency_type": "string (required)",
    "days_of_month": "number (optional)",
    "days_of_week": "string (optional)",
    "custom_day": "timestamp (optional)",
    "time_of_day": "time (optional)",
    "priority": "number (optional)",
    "status": "boolean (required)",
    "reminder_enabled": "boolean (optional)"
}

```

Response:

* Success (200 OK): `{ "massage":"Plan upload successfully" }`

* Error (400 Bad Request): `{ "err": "Plan upload fail"}`
* Error (400 Bad Request): `{"err":"No such execise id"}`
* Error (400 Bad Request): `{"err":"some error happen"}`



----------------------------------------------------------

### 3.2 Get All User Plans
Endpoint: ~/api/plan
Method: GET
Description: Retrieves all user's workout plans. Requires authentication.

Query Parameters:

* token: User token (required)

Response:

* Success (200 OK): Array of Record
* Error (400 Bad Request): `{"err":"some error happen"}`

----------------------------------------------------------

### 3.3 Update Plan
Endpoint: ~/api/plan
Method: PUT
Description: Updates workout plan. Requires authentication.

Request Body:

```json
{
    "plan_id": "number (required)",
    "exercise_id": "number (required)",
    "title": "string (required)",
    "description": "string (required)",
    "frequency_type": "string (required)",
    "days_of_month": "number (optional)",
    "days_of_week": "string (optional)",
    "custom_day": "timestamp (optional)",
    "time_of_day": "time (optional)",
    "priority": "number (optional)",
    "status": "boolean (required)",
    "reminder_enabled": "boolean (optional)"
}
```

Response:

* Success (200 OK): `{ "massage":"Plan updated successfully" }`

* Error (400 Bad Request): `{ "err": "Plan updated fail"}`
* Error (400 Bad Request): `{"err":"No such execise id"}`
* Error (400 Bad Request): `{"err":"some error happen"}`

----------------------------------------------------------

### 3.4 Delete Plan
Endpoint: ~/api/plan
Method: DELETE
Description: Deletes workout plan. Requires authentication.

Query Parameters:

* token: User token (required)
* plan_id: delete record id(required)

Response:

* Success (200 OK): `{ "massage":"Plan delete successfully" }`
* Error (400 Bad Request): `{ "err": "plan delete fail"}`
* Error (400 Bad Request): `{"err":"some error happen"}`


## USER PROFILE ENDPOINTS

### 4.1 Update Profile
Endpoint: ~/api/profile
Method: POST
Description: Updates user profile information

Request Body:
```json
{
    "token": "string (required)",
    "first_name": "string (optional)",
    "last_name": "string (optional)",
    "avatar_url": "string (optional)",
    "introduction": "string (optional)",
    "height": "number (optional)",
    "weight": "number (optional)",
    "fitness_level": "number (optional)",
    "fitness_goals": "string (optional)",
    "birthday": "timestamp (optional)",
    "training_start_date": "timestamp (optional)",
    "phone": "string (optional)",
    "Email": "string (optional)",
    "country": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)"
}
```

Response:

* Success (200 OK): `{ "massage": "Profile updated successfully"}`
* Error (400 Bad Request): `{"err":"Profile updated fail"}`

----------------------------------------------------------

### 4.2 Get Profile
Endpoint: ~/api/profile
Method: GET
Description: Retrieves user profile information

Query Parameters:
• token: User token (required)

Response:

* Success (200 OK): 

```json
{
    "First_name": "first2",
    "Last_name": "last2",
    "avatar_url": null,
    "introduction": null,
    "height": null,
    "weight": null,
    "fitness_level": null,
    "fitness_goals": null,
    "birthday": null,
    "training_start_date": null,
    "phone": null,
    "Email": null,
    "country": null,
    "city": null,
    "state": null
}
```



* Error (400 Bad Request): `{ "err": }`

----------------------------------------------------------

### 4.3 Update Avatar
Endpoint: ~/api/profile/avatar
Method: POST
Description: Updates user's profile picture

Request:

* Only accept .jpg file
* file key need to be `avatar`
* file size should less then 5MB

Response:

* Success (200 OK): `{ "success": "updateAvatar" }`
* Error (400 Bad Request): `{ "err": "Unexpected field"}`
* Error (400 Bad Request): `{ "err": "Invalid file type. Only JPG, PNG and GIF files are allowed."}`
* Error (400 Bad Request): `{ "err": "File too large. Maximum size is 5MB"}`

----------------------------------------------------------

### 4.4 Get Avatar
Endpoint: ~/api/profile/avatar
Method: GET
Description: Retrieves user's profile picture

Query Parameters:
• token: User token (required)

Response:
• Success (200 OK): Image file
• Error (404 Not Found): `{ "err": "no such file" }`


## Workout Log ENDPOINTS

### 5.1 Create New Record
Endpoint: ~/api/record
Method: POST
Description: Creates a new user record.Requires authentication.

Request Body:
```json
{
  "exercise_id": "number (required)",
  "description": "string (optional)",
  "number_of_set": "number (optional)",
  "status": "string (optional)",
  "priority": "number (optional)",
  "start_time": "timestamp (optional)",
  "end_time": "timestamp (optional)",
  "total_time": "number (optional)"
}
```

Response:

* Success (200 OK): `{ "massage":"Record upload successfully" }`

* Error (400 Bad Request): `{ "err": "Record upload fail"}`
* Error (400 Bad Request): `{"err":"No such execise id"}`
* Error (400 Bad Request): `{"err":"some error happen"}`

----------------------------------------------------------

### 5.2 Get Record
Endpoint: ~/api/record
Method: GET
Description: Retrieves user record information. Requires authentication.

Query Parameters:

* token: User token (required)

Response:

* Success (200 OK): Array of Record
* Error (400 Bad Request): `{"err":"some error happen"}`

----------------------------------------------------------

### 5.3 Update Record
Endpoint: ~/api/record
Method: PUT
Description: Updates user's record. Requires authentication.

Request Body:
```json
{
  "record_id":"number (required)",
  "exercise_id": "number (required)",
  "description": "string (optional)",
  "number_of_set": "number (optional)",
  "status": "string (optional)",
  "priority": "number (optional)",
  "start_time": "timestamp (optional)",
  "end_time": "timestamp (optional)",
  "total_time": "number (optional)"
}
```

Response:

* Success (200 OK): `{ "massage":"Record updated successfully" }`

* Error (400 Bad Request): `{ "err": "Record updated fail"}`
* Error (400 Bad Request): `{"err":"No such execise id"}`
* Error (400 Bad Request): `{"err":"some error happen"}`

----------------------------------------------------------

### 5.4 Delete Record
Endpoint: ~/api/record
Method: DELETE
Description: Deletes user record. Requires authentication.

Query Parameters:

* token: User token (required)
* record_id: delete record id(required)



Response:

* Success (200 OK): `{ "massage":"Record delete successfully" }`
* Error (400 Bad Request): `{ "err": "Record delete fail"}`
* Error (400 Bad Request): `{"err":"some error happen"}`

