| table_name       | column_name         | data_type                | is_nullable |
| ---------------- | ------------------- | ------------------------ | ----------- |
| survey_responses | id                  | uuid                     | NO          |
| survey_responses | user_id             | text                     | NO          |
| survey_responses | session_start       | timestamp with time zone | YES         |
| survey_responses | session_end         | timestamp with time zone | YES         |
| survey_responses | psychology_profile  | jsonb                    | YES         |
| survey_responses | indifference_points | jsonb                    | YES         |
| survey_responses | demographics        | jsonb                    | YES         |
| survey_responses | staircase_data      | jsonb                    | YES         |
| survey_responses | created_at          | timestamp with time zone | YES         |


| schemaname | tablename        | policyname                   | permissive | roles    | cmd    | qual                                                            | with_check                                                                         |
| ---------- | ---------------- | ---------------------------- | ---------- | -------- | ------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| public     | survey_responses | Allow anonymous insert       | PERMISSIVE | {public} | INSERT | null                                                            | true                                                                               |
| public     | survey_responses | Allow anonymous read         | PERMISSIVE | {public} | SELECT | true                                                            | null                                                                               |
| public     | survey_responses | Allow survey response insert | PERMISSIVE | {public} | INSERT | null                                                            | ((user_id IS NOT NULL) AND (length(user_id) > 10) AND (session_start IS NOT NULL)) |
| public     | survey_responses | Allow aggregated data read   | PERMISSIVE | {public} | SELECT | ((created_at IS NOT NULL) AND (psychology_profile IS NOT NULL)) | null                                                                               |

| schemaname | tablename        | rowsecurity |
| ---------- | ---------------- | ----------- |
| public     | survey_responses | true        |