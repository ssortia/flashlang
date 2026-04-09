-- CreateTable
CREATE TABLE "texts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_words" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "textId" TEXT,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "knowledgeLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_sets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "word_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word_on_set" (
    "wordId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_word_on_set_pkey" PRIMARY KEY ("wordId","setId")
);

-- CreateIndex
CREATE INDEX "texts_userId_idx" ON "texts"("userId");

-- CreateIndex
CREATE INDEX "texts_createdAt_idx" ON "texts"("createdAt");

-- CreateIndex
CREATE INDEX "user_words_userId_idx" ON "user_words"("userId");

-- CreateIndex
CREATE INDEX "user_words_userId_knowledgeLevel_idx" ON "user_words"("userId", "knowledgeLevel");

-- CreateIndex
CREATE INDEX "user_words_createdAt_idx" ON "user_words"("createdAt");

-- CreateIndex
CREATE INDEX "word_sets_userId_idx" ON "word_sets"("userId");

-- AddForeignKey
ALTER TABLE "texts" ADD CONSTRAINT "texts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_textId_fkey" FOREIGN KEY ("textId") REFERENCES "texts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_sets" ADD CONSTRAINT "word_sets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_on_set" ADD CONSTRAINT "user_word_on_set_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "user_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_on_set" ADD CONSTRAINT "user_word_on_set_setId_fkey" FOREIGN KEY ("setId") REFERENCES "word_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
