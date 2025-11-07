/*
  Warnings:

  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Member` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "networkId" TEXT NOT NULL,
    CONSTRAINT "Member_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("networkId") ON DELETE CASCADE ON UPDATE CASCADE
);
-- populate the new id column for existing rows by composing a stable id
-- using memberId + '_' + networkId so we keep the association unique per network
INSERT INTO "new_Member" ("id", "description", "memberId", "name", "networkId")
  SELECT ("memberId" || '_' || "networkId") as id, "description", "memberId", "name", "networkId" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE UNIQUE INDEX "Member_memberId_networkId_key" ON "Member"("memberId", "networkId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
