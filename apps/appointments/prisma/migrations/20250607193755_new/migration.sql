/*
  Warnings:

  - Added the required column `price` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('IN_PERSON', 'VIDEO');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "type" "AppointmentType" NOT NULL;
