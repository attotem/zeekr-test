/**
 * PDF/медіа з бекенду відкриваються як URL поточного сайту (наприклад zeekr.com.ua/media/...),
 * щоб у браузері не показувався хост zeekr-back.xyz. У проді nginx має проксувати /media на бекенд.
 * Локально — proxy у vite.config.js.
 */
function backendOrigin() {
	const raw = import.meta.env.VITE_API_ORIGIN || "https://zeekr-back.xyz";
	const normalized = raw.replace(/\/$/, "");
	try {
		return new URL(normalized.startsWith("http") ? normalized : `https://${normalized}`).origin;
	} catch {
		return "https://zeekr-back.xyz";
	}
}

export function sameOriginMediaUrl(url) {
	if (typeof window === "undefined" || url == null || String(url).trim() === "") {
		return url ?? "";
	}
	const str = String(url).trim();
	try {
		const parsed = new URL(str);
		if (parsed.origin !== backendOrigin()) return str;
		return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
	} catch {
		return str;
	}
}
