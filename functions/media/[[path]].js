/**
 * Cloudflare Pages: /media/* → MEDIA_PROXY_ORIGIN (за замовчуванням zeekr-back.xyz).
 * Змінна MEDIA_PROXY_ORIGIN у Pages → Settings → Environment variables (опційно).
 */

export async function onRequest(context) {
	const { request, env } = context;
	const url = new URL(request.url);

	if (request.method !== "GET" && request.method !== "HEAD") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	const base = String(env.MEDIA_PROXY_ORIGIN || "https://zeekr-back.xyz").replace(/\/$/, "");
	const target = `${base}${url.pathname}${url.search}`;

	const upstream = await fetch(target, {
		method: request.method,
		redirect: "follow",
		headers: {
			"User-Agent": request.headers.get("User-Agent") || "ZeekrPagesProxy/1.0",
			Accept: request.headers.get("Accept") || "*/*",
		},
	});

	const headers = new Headers(upstream.headers);
	headers.delete("set-cookie");

	return new Response(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers,
	});
}
