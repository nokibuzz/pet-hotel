This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting started

Initialize node_modules by running next command

```bash
npm install
```

First, run the development server:

```bash
# run locally
npm run dev
# build pre push
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Dummy

## Prisma

https://authjs.dev/getting-started/adapters/prisma

### Generate prisma clients for postgres and mongo

```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/mongo.schema.prisma
```

!!!Always add schema to npx prisma commands!!!

```bash
--schema=prisma/schema.prisma
--schema=prisma/mongo.schema.prisma
```

### Crating and migrating to prod

On .env file change schema to prod (instead of dev) and run next commands:

```bash
npx prisma migrate dev --name <name_of_migration> --schema=prisma/schema.prisma
```

```bash
npx prisma migrate deploy --schema=prisma/schema.prisma
```

### Creating db migration file for dev

```bash
npx prisma migrate dev --name <name_of_migration> --schema=prisma/schema.prisma
```

```bash
npx prisma db push --schema=prisma/schema.prisma
```

Create index on listing for the location.
