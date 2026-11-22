import { Module } from '@nestjs/common';

/**
 * Extension point for webhook subscriptions and inbound webhook handling.
 *
 * Registered in AppModule but intentionally empty. Outbound alert delivery
 * already lives in notifications/webhook.channel.ts; this module is for
 * user-managed subscriptions, signing secrets and inbound receivers. See
 * ./README.md for scope.
 */
@Module({
  providers: [],
  exports: [],
})
export class WebhooksModule {}
