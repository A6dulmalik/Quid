//! Guardian / emergency controls (extension point).
//!
//! Not implemented yet. `quid-store` has no contract-wide admin today; mission
//! owners pause their own missions with `pause_mission`. A guardian role
//! (global pause, freeze a mission) goes here. The role must be set once at
//! deploy time, not first-caller-wins like the current `set_treasury`.
