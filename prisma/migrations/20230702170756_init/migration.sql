/*
  Warnings:

  - You are about to drop the column `usesLeft` on the `Token` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "remaining" INTEGER NOT NULL DEFAULT 5
);
INSERT INTO "new_Token" ("platform", "token") SELECT "platform", "token" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
