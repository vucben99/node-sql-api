-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "usesLeft" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
