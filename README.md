# Cloud Backend

## Dependencies

Install all the dependencies below on your local machine:

- Node.js 18.x
- PostgreSQL15

## Pattern

### Top-down

1. App calls route index
2. Route calls controllers, grouped by each functionality
3. Controllers handle HTTP stuff and call services (if needed)
4. Services are an interface to the database
5. Models are declared inside `/prisma/schema.prisma` (TODO atomize model declarations)

### Testing

1. **PRIORITIZE** feature over unit tests
2. A Feature test handles domains whereas a unit test handles singular functionality
3. Testing should be done as real as possible (database mocking is already handled)

### DevOps (TODO)

1. Auto-tag version
2. Containerization

## First time setup

- run `npm install`
- run `npm install -g prisma`
- add your own `.env` file in the root directory, refer to `.env.example`

## To start the server

- run `npm run dev`

## To test

- run `npm test` or `npm run test`

## References

- Prisma ORM - https://www.prisma.io/
- ExpressJS - https://expressjs.com/
- Jest - https://jestjs.io/
- Trunk Based Development - https://trunkbaseddevelopment.com/
