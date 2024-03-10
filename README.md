# Family Tree Application

## Setup

### Docker

1. Install Docker
2. Run `docker compose up` in the root directory
3. Make sure to update the database from the API by running `dotnet ef database update` in the FamTreeApi folder
4. The API will be available at `http://localhost:8081`, and the database will be available at `http://localhost:5123`

### Backend

Note that the API is currently set up to run in a docker container. If you want to run the API locally, you will need to
update the connection string in the `appsettings.json` file to point to the local database.

1. Install dotnet
2. Navigate to FamTreeApi folder
3. Run `dotnet ef database update` to create the database.
4. Run `dotnet run` to start the API
5. The API will be available at `http://localhost:5000`

### Frontend

1. Install node
2. Navigate to FamilyTreeApp folder
3. Run `npm install` to install the dependencies
4. Run `npm start` to start the frontend
5. The frontend will be available at `http://localhost:3000`