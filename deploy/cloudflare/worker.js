/**
 * Cloudflare Worker: fronts the InvoiceInk Cloud Run service.
 *
 * Why a Worker rather than a proxied CNAME:
 *
 *  1. Cloud Run routes by hostname. A request arriving with
 *     `Host: invoiceink.claritytech.io` matches no service and 404s. The Host
 *     must say the *.run.app name. Cloudflare's built-in Host header override
 *     (Origin Rules) is Enterprise-only — but fetch() derives Host from the URL
 *     it is given, so requesting the run.app URL sets it correctly by
 *     construction. Nothing to override.
 *
 *  2. The zone runs in Flexible SSL mode, meaning Cloudflare reaches origins
 *     over plaintext HTTP. Cloud Run serves HTTPS only and 301s plaintext
 *     requests, which with Flexible produces an infinite redirect loop. A
 *     Worker makes its own HTTPS request, so the zone-wide SSL mode does not
 *     apply to it — and does not have to be changed, which would have affected
 *     every other site on claritytech.io.
 *
 * See docs/cloud_run_deployment_plan.md §9.4
 */

export default {
  async fetch(request, env) {
    // Cloud Run service hostname, no scheme or trailing slash. Set once with
    // `bunx wrangler secret put ORIGIN_HOST`.
    if (!env.ORIGIN_HOST) {
      return new Response("ORIGIN_HOST is not configured", { status: 500 });
    }

    const incoming = new URL(request.url);

    // Same path, same query string, different host.
    const target = new URL(request.url);
    target.protocol = "https:";
    target.hostname = env.ORIGIN_HOST;
    target.port = "";

    // Copies method, body, and headers. Host is taken from `target`, not from
    // the original request, which is the whole point.
    const proxied = new Request(target, request);

    // Laravel trusts all proxies (bootstrap/app.php:23), so these determine what
    // it believes about the client. Without them every visitor would appear to
    // come from a Cloudflare address over the origin's own scheme.
    proxied.headers.set("X-Forwarded-Host", incoming.host);
    proxied.headers.set("X-Forwarded-Proto", "https");

    const clientIp = request.headers.get("CF-Connecting-IP");

    if (clientIp) {
      proxied.headers.set("X-Forwarded-For", clientIp);
    }

    // Redirects are returned to the browser rather than followed here: Laravel
    // generates them against APP_URL (the public domain), so the browser must
    // act on them. Following them inside the Worker would rewrite them to the
    // run.app host and leak it into the address bar.
    return fetch(proxied, { redirect: "manual" });
  },
};
