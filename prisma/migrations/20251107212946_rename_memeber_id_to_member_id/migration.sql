/*
  Warnings:

  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `memeberId` on the `Member` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "networkId" TEXT NOT NULL,
    CONSTRAINT "Member_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("networkId") ON DELETE CASCADE ON UPDATE CASCADE
);
-- copy old primary key values into the new memberId column
INSERT INTO "new_Member" ("memberId", "description", "name", "networkId") SELECT "memeberId", "description", "name", "networkId" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
