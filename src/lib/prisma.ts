import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;

// // /lib/prisma.ts
// import { PrismaClient } from '@prisma/client';

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// export default prisma;
