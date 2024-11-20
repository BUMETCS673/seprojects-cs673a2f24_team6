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
    "name": "string (required)",
    "start_date": "string (required)",
    "frequency_type": "string (required)",
    "frequency_value": "number (required)",
    "description": "string (optional)",
    "end_date": "string (optional)",
    "target_sets": "number (optional)",
    "target_reps": "number (optional)",
    "target_duration": "number (optional)",
    "days_of_week": "string (optional)",
    "preferred_time": "string (optional)",
    "priority": "number (optional)"
}
```

Response:
• Success (200 OK): { "msg": "Plan created successfully", "data": result.rows }
• Error (400 Bad Request): { "err": "Missing required field: [field]" }

----------------------------------------------------------

### 3.2 Get All User Plans
Endpoint: ~/api/plan
Method: GET
Description: Retrieves all user's workout plans. Requires authentication.

Response:
• Success (200 OK): Array of workout plans
• Error (400 Bad Request): { "err": error_message }

----------------------------------------------------------

### 3.3 Get Active Plans
Endpoint: ~/api/plan/active
Method: GET
Description: Retrieves user's active workout plans. Requires authentication.

Query Parameters:
• date: Target date (optional, defaults to current date)

Response:
• Success (200 OK): Array of active plans
• Error (400 Bad Request): { "err": error_message }

----------------------------------------------------------

### 3.4 Get Plans by Frequency
Endpoint: ~/api/plan/frequency/:frequency_type
Method: GET
Description: Retrieves plans by frequency type. Requires authentication.

Path Parameters:
• frequency_type: "daily", "weekly", "monthly", or "custom"

Response:
• Success (200 OK): Array of matching plans
• Error (400 Bad Request): { "err": "Invalid frequency type" }

----------------------------------------------------------

### 3.5 Get Specific Plan
Endpoint: ~/api/plan/:id
Method: GET
Description: Retrieves specific workout plan. Requires authentication.

Path Parameters:
• id: Plan ID

Response:
• Success (200 OK): Plan object
• Error (403 Forbidden): { "err": "Access denied" }
• Error (404 Not Found): { "err": "Plan not found" }

----------------------------------------------------------

### 3.6 Update Plan
Endpoint: ~/api/plan/:id
Method: PUT
Description: Updates workout plan. Requires authentication.

Path Parameters:
• id: Plan ID

Request Body: Same as Create Plan (all fields optional)

Response:
• Success (200 OK): { "msg": "Plan updated successfully" }
• Error (404 Not Found): { "err": "Plan not found" }

----------------------------------------------------------

### 3.7 Update Plan Status
Endpoint: ~/api/plan/:id/status
Method: PATCH
Description: Updates plan status. Requires authentication.

Path Parameters:
• id: Plan ID

Request Body:
```json
{
    "status": "string (required)"
}
```

Response:
• Success (200 OK): { "msg": "Plan status updated successfully" }
• Error (400 Bad Request): { "err": "Status is required" }

----------------------------------------------------------

### 3.8 Delete Plan
Endpoint: ~/api/plan/:id
Method: DELETE
Description: Deletes workout plan. Requires authentication.

Path Parameters:
• id: Plan ID

Response:
• Success (200 OK): { "msg": "Plan deleted successfully" }
• Error (404 Not Found): { "err": "Plan not found" }


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

