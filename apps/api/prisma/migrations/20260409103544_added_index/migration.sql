/*
  Warnings:

  - A unique constraint covering the columns `[userId,word]` on the table `user_words` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_words_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "user_words_userId_word_key" ON "user_words"("userId", "word");
