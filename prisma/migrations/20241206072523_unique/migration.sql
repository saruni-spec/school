/*
  Warnings:

  - A unique constraint covering the columns `[role_id,resource,scope,can_admin,can_create,can_delete,can_read,can_update]` on the table `permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "permission_role_id_resource_department_id_school_id_class_i_key";

-- CreateIndex
CREATE UNIQUE INDEX "permission_role_id_resource_scope_can_admin_can_create_can__key" ON "permission"("role_id", "resource", "scope", "can_admin", "can_create", "can_delete", "can_read", "can_update");
