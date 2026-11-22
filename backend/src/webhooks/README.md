# webhooks/

Webhook **subscriptions** and **inbound** webhook receivers. Not built yet.

## Where webhook code goes

| Concern | Location |
|---------|----------|
| Sending one alert to the global `NOTIFICATION_WEBHOOK_URL` | `../notifications/webhook.channel.ts` (exists) |
| Per-creator subscriptions (URL, events, signing secret) | here |
| HMAC signing of outbound payloads, retries, delivery log | here |
| Inbound receivers (e.g. SEP-24 anchor callbacks) | here, under `/api/webhooks/*` |

## Conventions

- Add providers and controllers to `webhooks.module.ts`. It's already
  registered in `app.module.ts`.
- New tables need a Prisma migration in `../../prisma/migrations/`.
- Inbound routes must verify a signature before touching the database.
