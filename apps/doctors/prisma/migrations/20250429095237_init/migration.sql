-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL,
    "license_number" TEXT NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_records" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "shared_with" TEXT NOT NULL,
    "shared_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_records_pkey" PRIMARY KEY ("id")
);
