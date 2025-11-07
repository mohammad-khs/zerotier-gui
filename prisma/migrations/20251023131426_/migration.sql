-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "memeberId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "networkId" TEXT NOT NULL,
    CONSTRAINT "Member_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("networkId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("description", "memeberId", "name", "networkId") SELECT "description", "memeberId", "name", "networkId" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
