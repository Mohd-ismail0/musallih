-- AlterTable: Add firebase_uid to User for Firebase Auth linking
ALTER TABLE "User" ADD COLUMN "firebase_uid" TEXT;

CREATE UNIQUE INDEX "User_firebase_uid_key" ON "User"("firebase_uid");
