/*
  Warnings:

  - Added the required column `patientName` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "patientName" TEXT NOT NULL;
