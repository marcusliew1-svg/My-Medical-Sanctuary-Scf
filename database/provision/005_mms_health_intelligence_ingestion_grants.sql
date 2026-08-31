begin;

grant select,insert,update on table mms_commercial.source_connectors to mms_commercial_app;
grant select,insert,update on table mms_commercial.observation_import_batches to mms_commercial_app;
grant select,insert,update on table mms_commercial.observation_import_rows to mms_commercial_app;

drop policy if exists source_connectors_runtime_access on mms_commercial.source_connectors;
create policy source_connectors_runtime_access on mms_commercial.source_connectors
  for all to mms_commercial_app using (true) with check (true);

revoke all on table mms_commercial.source_connectors from public,anon,authenticated;
revoke all on table mms_commercial.observation_import_batches from public,anon,authenticated;
revoke all on table mms_commercial.observation_import_rows from public,anon,authenticated;

commit;
