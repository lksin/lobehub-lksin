-- Extend the RBAC tables with a workspace scope. The new `workspace_id`
-- column is nullable: NULL means a global / system-level role (e.g.
-- super_admin), non-NULL means the role / grant lives inside a single
-- workspace. Uniqueness rules switch from plain `(name)` and
-- `(user_id, role_id)` to expression-based unique indexes that treat NULL as
-- a literal "global" bucket via COALESCE.
ALTER TABLE "rbac_roles" DROP CONSTRAINT IF EXISTS "rbac_roles_name_unique";--> statement-breakpoint
ALTER TABLE "rbac_user_roles" DROP CONSTRAINT IF EXISTS "rbac_user_roles_user_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "rbac_roles" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "rbac_user_roles" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "rbac_roles" DROP CONSTRAINT IF EXISTS "rbac_roles_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "rbac_roles" ADD CONSTRAINT "rbac_roles_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rbac_user_roles" DROP CONSTRAINT IF EXISTS "rbac_user_roles_workspace_id_workspaces_id_fk";--> statement-breakpoint
ALTER TABLE "rbac_user_roles" ADD CONSTRAINT "rbac_user_roles_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rbac_roles_name_scope_unique" ON "rbac_roles" USING btree ("name",COALESCE("workspace_id", ''));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rbac_roles_workspace_id_idx" ON "rbac_roles" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rbac_user_roles_user_role_scope_unique" ON "rbac_user_roles" USING btree ("user_id","role_id",COALESCE("workspace_id", ''));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rbac_user_roles_workspace_id_idx" ON "rbac_user_roles" USING btree ("workspace_id");
