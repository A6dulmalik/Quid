//! Streamed / vested payouts (extension point).
//!
//! Not implemented yet. Home for time-based release of an approved reward
//! instead of a single `payout_participant` transfer. Put new storage keys in
//! `types::DataKey` (persistent tier, with `extend_ttl`) and keep the release
//! math here as `pub(crate)` functions.
