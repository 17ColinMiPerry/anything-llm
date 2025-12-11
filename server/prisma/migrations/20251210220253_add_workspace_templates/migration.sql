-- CreateTable
CREATE TABLE "workspace_templates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "config" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_templates_slug_key" ON "workspace_templates"("slug");
