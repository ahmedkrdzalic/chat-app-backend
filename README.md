This is the backend part of the chat app.
I am using Node.js, Express.js, Socket.io and MongoDB for the main technologies.

Note: If using this app, open it with Chrome. I didn't test it on other browsers.
Links:

- [Frontend](https://chat-app-frontend-ak-c3cf052f8812.herokuapp.com/)
- [Backend](https://chat-app-backend-ak-23709ad0c006.herokuapp.com/)

Run this app:

Dockerized:

1. Clone this repository
2. Make sure that you added ENV variables for the MongoDB connection and JWT secret (add your IP address in the MongoDB Atlas whitelist if using it)
3. Install Docker and Docker Compose
4. Run `docker-compose up --build` in the root folder

Not Dockerized:

1. Clone this repository
2. Run `npm install` in the backend folder
3. Make sure that you added ENV variables for the MongoDB connection and JWT secret (add your IP address in the MongoDB Atlas whitelist if using it)
4. Install Redis (Linux)
   `sudo apt-get update`
   `sudo apt-get install redis`
5. Start Redis (Linux)
   `redis-server`
6. Run `npm run dev` in the backend folder

Some of the late notices from my side and what I would do differently if I had more time:

- I would use TypeScript instead of JavaScript
- I would consider using the Socket.io for everything instead of using REST API for some parts
- I would use Yup or some other validation library for the validation of the data
- I would consider using some other library for the authentication and authorization (session-express with Redis for example)
- It was too late that I realised that the auth for the Socket.io is different, I thouhgt that i can use tokens in headers like in the REST API
- I would use some library (or build my custom logging into the MongoDB) for the logging
- I would store JWTs in Redis to manage how many devices is user using and to be able to log out from all devices at once
- add rate limiting on login and register too, where I would use ip address as a key
- I would add some tests
- I would add even more comments (but it is pretty simple app so I think that it is not necessary, and variable names are pretty self-explanatory)
- I would add some more error handling
- I would use API keys for the mongo and redis connection URIs
- At the end, the deployment of the app made me change a logic of socket.io auth and it is not the best solution, but it works for this occasion (I would definitely consider different approach for the real app)

Note:

- contact me if you have any questions regarding the setup or anything else (ahmed.krdzalic@gmail.com)
