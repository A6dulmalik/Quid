//! Protocol fee helpers (extension point).
//!
//! Fee quoting and forwarding currently live in `lib.rs`
//! (`quote_protocol_fee`, `forward_fee`) and call out to `quid-fee-collector`.
//! New fee logic (tiers, per-token caps, fee-on-payout) goes here as
//! `pub(crate)` functions. Keep public entrypoints in the `#[contractimpl]`
//! block in `lib.rs` and have them call into this module.
