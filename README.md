# demo for user account with creative-tim frontend (reactjs)
>
## Technologies used:
### 1. Backend
- Nodejs
- ExpressJs
- MongoDb

## Dependency install
```
npm install --save
```
Dependencies are:
> express, bcryptjs, helmet, cors, jsonwebtoken, mongoose, dotenv, cookie-parser, passport, passport-jwt, nodemailer

## Dev Dependency install
```
npm install --save-dev
```
Dev Dependency is:
> nodemon

## Run Project
```
npm run devStart
```
Or
```
nodemon server.js
```

## Environment Variables
```
PORT=?
DATABASE_URI=?
SECRET_KEY=?
SECRET_SITE_EMAIL=? -> for email verification server
SECRET_SITE_EMAIL_PASSWORD=?
SITE_HOST=?
```


## API Endpoints
#### RegisterAPI
##### example
```rest
POST http://localhost:4000/api/signup
Content-Type: application/json

{
    "name": "your name",
    "email": "your email",
    "password": "your password"
}
```
##### Login
```rest
POST http://localhost:4000/api/login
Content-Type: application/json

{
    "email": "your email",
    "password": "your password"
}
```

##### reading user data
```rest
GET http://localhost:4000/api/read-profile
```

