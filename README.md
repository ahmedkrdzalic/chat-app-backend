This is the backend part of the chat app.
I am using Node.js, Express.js, Socket.io and MongoDB for the main technologies.

Some of the late notices form my side and what I would do differently if I had more time:

- I would use TypeScript instead of JavaScript
- I would consider using the Socket.io for everything instead of using REST API for some parts
- I would use Yup or some other validation library for the validation of the data
- I would consider using some other library for the authentication and authorization (session-express with Redis for example)
- It was too late that I realised that the auth for the Socket.io is different, I thouhgt that i can use tokens in headers
- I would use some library (or even build my custom logging into the MongoDB) for the logging
- I would store JWTs in Redis to manage how many devices is user using and to be able to log out from all devices
