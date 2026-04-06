function backendOrigin() {
	const raw = import.meta.env.VITE_API_ORIGIN || "https://zeekr-back.xyz";
	const normalized = raw.replace(/\/$/, "");
	try {
		return new URL(normalized.startsWith("http") ? normalized : `https://${normalized}`).origin;
	} catch {
		return "https://zeekr-back.xyz";
	}
}


function shouldRewriteToCurrentOrigin() {
	if (import.meta.env.DEV) return true;
	if (import.meta.env.VITE_MEDIA_SAME_ORIGIN === "false") return false;
	return true;
}

export function sameOriginMediaUrl(url) {
	if (typeof window === "undefined" || url == null || String(url).trim() === "") {
		return url ?? "";
	}
	const str = String(url).trim();
	try {
		const parsed = new URL(str);
		if (parsed.origin !== backendOrigin()) return str;
		if (!shouldRewriteToCurrentOrigin()) return str;
		return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
	} catch {
		return str;
	}
}
