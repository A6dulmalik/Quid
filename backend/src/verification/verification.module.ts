import { Module } from '@nestjs/common';

/**
 * Extension point for on-chain Proof-of-Test verification.
 *
 * This module is registered in AppModule but intentionally empty. Wave PRs add
 * providers and controllers here (Soroban RPC reads, proof hashing, verify
 * routes) without editing app.module.ts. See ./README.md for scope.
 */
@Module({
  providers: [],
  exports: [],
})
export class VerificationModule {}
