/**
 * Public entry point for `@yearn/deposit`.
 *
 * The package is consumed as TypeScript source: apps list it in
 * `transpilePackages` rather than importing a build artifact.
 *
 * Server routes are not re-exported here. They are reached through the
 * `./server/*` subpath so that app-side route handlers stay a one-line
 * re-export and never pull client code into the server bundle.
 */

export {}
