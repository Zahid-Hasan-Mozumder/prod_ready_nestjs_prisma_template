#!/bin/sh
set -e

echo "Populating the database..."
npx prisma migrate deploy

echo "Generating the prisma client..."
npx prisma generate

echo "Executing the execution command..."
exec npm run start:dev
