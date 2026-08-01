/// <reference types="next" />
/// <reference types="next/image-types/global" />

// The stable half of what Next writes into `next-env.d.ts`. That file is
// gitignored because Next rewrites its routes import between `.next/dev/types`
// and `.next/types` on every dev/build switch, which churned the tree.
//
// These two references never change, and without them a fresh clone loses
// Next's ambient types until someone runs dev or build — so a static image
// import would fail `tsc` in a pre-commit hook with a confusing error. Keeping
// them here means type checking is correct from a clean checkout.
