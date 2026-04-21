# Frontend API guide

Single source for GitHub/Jira/Linear connection and config: **Integrations only**.

## Where to connect

Use only the Integrations API:

- `POST /api/v1/integrations/github/connect`
- `POST /api/v1/integrations/jira/connect`
- `POST /api/v1/integrations/linear/connect`

Request bodies are unchanged (e.g. GitHub: `installation_id` + `org`; Jira: `base_url`, `email_or_user`, `api_token`, `project_keys`; Linear: `api_key`).

## Where to list

- `GET /api/v1/integrations` — list all integrations for the current tenant.  
  Connect and list return **redacted** `metadata_json` (e.g. `••••` for secrets). The UI only needs to show “connected” state and optional non-sensitive metadata.

## What not to use

- **Do not** call any “tenant credentials” or separate credentials API for GitHub/Jira/Linear.
- **Do not** use `POST /tenants/<id>/credentials` or similar; that path is not exposed.  
  All tokens are stored in integration metadata via the connect endpoints above.

## Runs

- Still use `run_id` from `POST /api/v1/projects/<project_id>/runs` for run detail and links.
- Run/workflow config is built by the backend from `IntegrationService.list_integrations(tenant_id)` and each integration’s `metadata_json`; no separate credentials layer.

## Summary

| Topic              | Guidance                                                                 |
|--------------------|--------------------------------------------------------------------------|
| Where to connect   | Only Integrations: `POST .../integrations/{github,jira,linear}/connect` |
| Where to list      | Only `GET /api/v1/integrations`                                         |
| Credentials API    | Do not use; remove any such calls if present                             |
| Request/response   | Unchanged; responses may be redacted                                    |
| Runs               | No change; use `run_id` from `POST .../runs` for detail                  |

One place for tokens = **Integrations only**.
