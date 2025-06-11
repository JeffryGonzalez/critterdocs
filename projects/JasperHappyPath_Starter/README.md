# The Courses Demo

This API implements a naive Backend-For-Frontend (BFF) pattern for a course management system. It provides endpoints to manage courses, including creating,  deleting, and retrieving course information, as well as assigning instructors.

If you are running this API locally, make sure you have a container runtime installed and do a `docker compose up -d` to start the required services.

Run it using the `https` launch profile for doing backend work.

> This uses the static compiled Angular app in the `wwwroot` folder of the project.

## If you want to iterate on the frontend:

The frontend is an Angular 20 application. It is in the `frontend` folder.

- Enter the `frontend` folder.
- Run `npm install` to install the dependencies.
- Run `npm start` to start the frontend application.
- In the Courses.Api project, run the API using the `Courses.Api: frontend` launch profile.

> This will proxy the requests that aren't part of the API (the `/app/' prefix) to the Angular frontend, while the API requests will be handled by the API itself.
