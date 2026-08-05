/**
 * Package version, sent in the User-Agent header on every request.
 *
 * NOT updated automatically: semantic-release rewrites `package.json` only, so
 * this must be bumped by hand alongside a release. It had drifted to 0.2.5
 * while npm was already on 1.19.0, mislabelling all SDK traffic in telemetry.
 */
export const VERSION = '1.19.0';
