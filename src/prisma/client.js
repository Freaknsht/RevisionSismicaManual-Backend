import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

// Some generated Prisma clients expect a truthy options object when
// constructed in certain runtime builds. Passing an empty options
// object prevents the constructor validation error.
const prisma = new PrismaClient({});

export default prisma;