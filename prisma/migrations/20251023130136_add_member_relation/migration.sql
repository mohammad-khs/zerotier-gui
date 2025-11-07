-- CreateTable
CREATE TABLE "Member" (
    "memeberId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    CONSTRAINT "Member_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("networkId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Network" (
    "networkId" TEXT NOT NULL PRIMARY KEY
);
