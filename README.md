
# Rate My Course RESTful API

## Setup and Run
- Install [NodeJS](https://nodejs.org/en/)
- Install [PostgreSQL with pgAdmin](https://www.postgresql.org/download/)
	- When installing PostgreSQL, use the default settings and take note of the password you use for it. The password will be used as an environment variable for connecting to your local PostgreSQL database server.
	 - After installation, make sure the PostgresSQL service is running.
		 - On Windows, you can check by going to Task Manager > Services

- Clone the repository 
- Run `npm i` to install all the required packages.
- In the main directory of the project create a **.env** file with this content:
    ```
    PORT=3000
    PGHOST=localhost
    PGUSER=postgres
    PGDATABASE=postgres
    PGPASSWORD=***REPLACE_WITH_POSTGRES_PASSWORD***
    PGPORT=5432
    RMCDATABASE=rmc
    ```
- Create the database (same name as .env's RMCDATABASE):
    `node node_modules/db-migrate/bin/db-migrate db:create rmc`
    - To delete the database:
    `node node_modules/db-migrate/bin/db-migrate db:drop rmc`
- Setup and seed the database:
	`node node_modules/db-migrate/bin/db-migrate up -e rmc`
	- To undo the seeding:
		`node node_modules/db-migrate/bin/db-migrate down -e rmc`
- For development, run: `nodemon`
-  Otherwise, run: `node app.js`

- To directly query the database, open pgAdmin and login and connect to your local PostgreSQL server.
