//! Contract upgrade path (extension point).
//!
//! Not implemented yet. Home for an admin-gated
//! `env.deployer().update_current_contract_wasm(hash)` helper and any storage
//! migration that has to run after an upgrade. Depends on an admin or guardian
//! role existing first (see `guardian.rs`).
