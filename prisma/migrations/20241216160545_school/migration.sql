-- CreateTable
CREATE TABLE "school_leader" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "staff_id" INTEGER,
    "leader_code" VARCHAR(15),
    "current_role" "role_type",
    "academic_year_id" INTEGER,
    "date_removed" DATE,
    "reason_removed" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "school_leader_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "school_leader_staff_id_academic_year_id_idx" ON "school_leader"("staff_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_leader_staff_id_academic_year_id_school_id_key" ON "school_leader"("staff_id", "academic_year_id", "school_id");

-- AddForeignKey
ALTER TABLE "school_leader" ADD CONSTRAINT "school_leader_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_leader" ADD CONSTRAINT "school_leader_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_leader" ADD CONSTRAINT "school_leader_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
