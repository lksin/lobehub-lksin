DROP INDEX IF EXISTS "agents_slug_user_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "agent_eval_benchmarks_identifier_user_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "agent_eval_datasets_identifier_user_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "agent_skills_user_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "documents_slug_user_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_notifications_dedupe";--> statement-breakpoint
DROP INDEX IF EXISTS "slug_user_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "tasks_identifier_idx";--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agents_files" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agents_knowledge_bases" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_bot_providers" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_cron_jobs" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_documents" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_eval_benchmarks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_eval_datasets" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_eval_run_topics" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_eval_runs" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_eval_test_cases" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_operations" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agent_skills" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "ai_models" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "ai_providers" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "async_tasks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "chat_groups" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "chat_groups_agents" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "document_histories" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "knowledge_base_files" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "knowledge_bases" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "generation_batches" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "generation_topics" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "generations" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_chunks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_groups" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_plugins" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_queries" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_query_chunks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_tts" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "message_translates" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "messages_files" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "messenger_account_links" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "chunks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "document_chunks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "unstructured_chunks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "rag_eval_dataset_records" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "rag_eval_datasets" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "rag_eval_evaluations" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "rag_eval_evaluation_records" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "agents_to_sessions" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "file_chunks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "files_to_sessions" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "session_groups" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "briefs" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "task_comments" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "task_dependencies" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "task_documents" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "task_topics" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "topic_documents" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "topic_shares" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_installed_plugins" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_memories" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_memories_activities" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_memories_contexts" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_memories_experiences" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_memories_identities" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
ALTER TABLE "user_memories_preferences" ADD COLUMN IF NOT EXISTS "workspace_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agents_slug_workspace_id_unique" ON "agents" USING btree ("workspace_id","slug") WHERE "agents"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_workspace_id_idx" ON "agents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_files_workspace_id_idx" ON "agents_files" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_knowledge_bases_workspace_id_idx" ON "agents_knowledge_bases" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_bot_providers_workspace_id_idx" ON "agent_bot_providers" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_cron_jobs_workspace_id_idx" ON "agent_cron_jobs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_documents_workspace_id_idx" ON "agent_documents" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_eval_benchmarks_identifier_workspace_id_unique" ON "agent_eval_benchmarks" USING btree ("workspace_id","identifier") WHERE "agent_eval_benchmarks"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_eval_benchmarks_workspace_id_idx" ON "agent_eval_benchmarks" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_eval_datasets_identifier_workspace_id_unique" ON "agent_eval_datasets" USING btree ("workspace_id","identifier") WHERE "agent_eval_datasets"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_eval_datasets_workspace_id_idx" ON "agent_eval_datasets" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_eval_run_topics_workspace_id_idx" ON "agent_eval_run_topics" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_eval_runs_workspace_id_idx" ON "agent_eval_runs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_eval_test_cases_workspace_id_idx" ON "agent_eval_test_cases" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_operations_workspace_id_idx" ON "agent_operations" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_skills_workspace_id_name_unique" ON "agent_skills" USING btree ("workspace_id","name") WHERE "agent_skills"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_skills_workspace_id_idx" ON "agent_skills" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_models_workspace_id_idx" ON "ai_models" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_providers_workspace_id_idx" ON "ai_providers" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_keys_workspace_id_idx" ON "api_keys" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "async_tasks_workspace_id_idx" ON "async_tasks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_groups_workspace_id_idx" ON "chat_groups" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_groups_agents_workspace_id_idx" ON "chat_groups_agents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_histories_workspace_id_idx" ON "document_histories" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "documents_slug_workspace_id_unique" ON "documents" USING btree ("workspace_id","slug") WHERE "documents"."workspace_id" IS NOT NULL AND "documents"."slug" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_workspace_id_idx" ON "documents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_workspace_id_idx" ON "files" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowledge_base_files_workspace_id_idx" ON "knowledge_base_files" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowledge_bases_workspace_id_idx" ON "knowledge_bases" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "generation_batches_workspace_id_idx" ON "generation_batches" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "generation_topics_workspace_id_idx" ON "generation_topics" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "generations_workspace_id_idx" ON "generations" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chunks_workspace_id_idx" ON "message_chunks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_groups_workspace_id_idx" ON "message_groups" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_plugins_workspace_id_idx" ON "message_plugins" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_queries_workspace_id_idx" ON "message_queries" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_query_chunks_workspace_id_idx" ON "message_query_chunks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_tts_workspace_id_idx" ON "message_tts" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_translates_workspace_id_idx" ON "message_translates" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_workspace_id_idx" ON "messages" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_files_workspace_id_idx" ON "messages_files" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messenger_account_links_workspace_id_idx" ON "messenger_account_links" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notifications_workspace" ON "notifications" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_notifications_dedupe_workspace" ON "notifications" USING btree ("workspace_id","user_id","dedupe_key") WHERE "notifications"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chunks_workspace_id_idx" ON "chunks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_chunks_workspace_id_idx" ON "document_chunks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddings_workspace_id_idx" ON "embeddings" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unstructured_chunks_workspace_id_idx" ON "unstructured_chunks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rag_eval_dataset_records_workspace_id_idx" ON "rag_eval_dataset_records" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rag_eval_datasets_workspace_id_idx" ON "rag_eval_datasets" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rag_eval_evaluations_workspace_id_idx" ON "rag_eval_evaluations" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rag_eval_evaluation_records_workspace_id_idx" ON "rag_eval_evaluation_records" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_to_sessions_workspace_id_idx" ON "agents_to_sessions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_chunks_workspace_id_idx" ON "file_chunks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_to_sessions_workspace_id_idx" ON "files_to_sessions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_groups_workspace_id_idx" ON "session_groups" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_slug_workspace_id_unique" ON "sessions" USING btree ("workspace_id","slug") WHERE "sessions"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_workspace_id_idx" ON "sessions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "briefs_workspace_id_idx" ON "briefs" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_comments_workspace_id_idx" ON "task_comments" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_dependencies_workspace_id_idx" ON "task_dependencies" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_documents_workspace_id_idx" ON "task_documents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_topics_workspace_id_idx" ON "task_topics" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tasks_identifier_workspace_id_unique" ON "tasks" USING btree ("identifier","workspace_id") WHERE "tasks"."workspace_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_workspace_id_idx" ON "tasks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "threads_workspace_id_idx" ON "threads" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_documents_workspace_id_idx" ON "topic_documents" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_shares_workspace_id_idx" ON "topic_shares" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topics_workspace_id_idx" ON "topics" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_installed_plugins_workspace_id_idx" ON "user_installed_plugins" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_memories_workspace_id_index" ON "user_memories" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_memories_activities_workspace_id_index" ON "user_memories_activities" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_memories_contexts_workspace_id_index" ON "user_memories_contexts" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_memories_experiences_workspace_id_index" ON "user_memories_experiences" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_memories_identities_workspace_id_index" ON "user_memories_identities" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_memories_preferences_workspace_id_index" ON "user_memories_preferences" USING btree ("workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agents_slug_user_id_unique" ON "agents" USING btree ("slug","user_id") WHERE "agents"."workspace_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_eval_benchmarks_identifier_user_id_unique" ON "agent_eval_benchmarks" USING btree ("identifier","user_id") WHERE "agent_eval_benchmarks"."workspace_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_eval_datasets_identifier_user_id_unique" ON "agent_eval_datasets" USING btree ("identifier","user_id") WHERE "agent_eval_datasets"."workspace_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "agent_skills_user_name_idx" ON "agent_skills" USING btree ("user_id","name") WHERE "agent_skills"."workspace_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "documents_slug_user_id_unique" ON "documents" USING btree ("slug","user_id") WHERE "documents"."workspace_id" IS NULL AND "documents"."slug" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_notifications_dedupe" ON "notifications" USING btree ("user_id","dedupe_key") WHERE "notifications"."workspace_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_user_id_unique" ON "sessions" USING btree ("slug","user_id") WHERE "sessions"."workspace_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tasks_identifier_idx" ON "tasks" USING btree ("identifier","created_by_user_id") WHERE "tasks"."workspace_id" IS NULL;