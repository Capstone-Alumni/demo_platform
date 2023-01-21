## Prerequisites
- Node 16 or above
- PostgreSQL

## Running Locally

1. Install dependencies: `yarn`
2. Start the dev server: `yarn dev`

## Setting up database

1. Create PostgreSQL database
* Create database with name `high_school_alumni`
```bash
  CREATE DATABASE high_school_alumni;
```
* Reference: https://www.postgresql.org/docs/current/sql-createdatabase.html

2. Create PostgreSQL user with password
* Using `psql`
```bash
  CREATE USER <<your_user_name>> WITH PASSWORD <<your_password>>;
```
* After create new user, add new options to the new role
```bash
  ALTER ROLE <<your_user_name>> WITH LOGIN SUPERUSER CREATEDB CREATEROLE;
```
* Reference: https://www.postgresql.org/docs/8.0/sql-createuser.html
* Reference if using pgAdmin: https://chartio.com/learn/postgresql/create-a-user-with-pgadmin/
3. Update owner of database
```bash
ALTER DATABASE high_school_alumni OWNER TO alumni;
```
* Reference: https://www.postgresql.org/docs/current/sql-alterdatabase.html

## Setup env
* Copy file `.env.example` to file `.env`, replace `<<YOUR_USER_NAME/YOUR_PASSWORD>>` by your database's username and password*

* Reference: https://vercel.com/guides/nextjs-prisma-postgres

## Integrating database with your development environment
1. Install new packages:
* Run this command
```bash
yarn
```
2. Run this command to init Prisma
```bash
yarn prisma init
```
3. Migrate database
- After creating/updating/deleting somethings in file `schema.prisma`, should run this command:
```bash
yarn prisma migrate dev --name <your_title>
```
- After running this command, prisma will auto generate a `*.sql` file for tracking changes in your database.

