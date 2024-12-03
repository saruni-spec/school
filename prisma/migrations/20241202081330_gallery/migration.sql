-- CreateTable
CREATE TABLE "gallery" (
    "gallery_id" SERIAL NOT NULL,
    "created_for" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("gallery_id")
);

-- CreateTable
CREATE TABLE "picture" (
    "picture_id" SERIAL NOT NULL,
    "picture_location" VARCHAR(50) NOT NULL,
    "taken_by" INTEGER NOT NULL,
    "about" VARCHAR(150) NOT NULL,
    "taken_for" INTEGER NOT NULL,
    "gallery_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "picture_pkey" PRIMARY KEY ("picture_id")
);

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("gallery_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_taken_by_fkey" FOREIGN KEY ("taken_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
