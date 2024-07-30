
# 2FA

This project implements a Two-Factor Authentication (2FA) system using TypeScript and Node.js. It leverages various packages such as express, mongoose, bcrypt, and otpauth to provide a secure and scalable 2FA solution.


## Features

- User authentication with password hashing
- Generation of 2FA secret keys
- Generation of QR codes for easy 2FA setup
- Verification of 2FA tokens

## Upcoming Features

- 2FA using passkey, biometrics, physical devices, SMS/Emails

Feel free to raise a pull request if you would like to contribute. 


## API Reference

#### Register user

```http
  POST /api/v1/user/createUser
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userFirstName` | `string` | **Required**.|
| `userLastName` | `string` | **Required**. |
| `userPassword` | `string` | **Required**. |
| `userEmail` | `string` | **Required**.  |


#### Login

```http
  POST /api/v1/user/verify2FA
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userEmail`  | `string` | **Required**.  |
| `userPassword`   | `string` | **Required**. |


#### Enable 2FA

```http
  POST /api/v1/user/enable2FA
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. |



#### Verify 2FA

```http
  POST /api/v1/user/verify2FA
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`  | `string` | **Required**.  |
| `token`   | `string` | **Required**. generated TOTP |


## Run in development mode

To deploy this project run

```bash
  npm run install
```

Add .env file

```bash
    npm run dev
```

The server will be live on http://localhost:3000