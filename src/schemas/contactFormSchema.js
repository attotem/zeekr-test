import { z } from "zod";

export function isUaPhoneMasked(value) {
	const digits = String(value ?? "").replace(/\D/g, "");
	return digits.length === 12 && digits.startsWith("380");
}

/**
 * @param {string} lang — 'uk' | 'en' | ін.
 */
export function createContactFormSchema(lang) {
	const en = lang === "en";
	const t = (uk, e) => (en ? e : uk);

	return z.object({
		name: z
			.string()
			.trim()
			.min(1, t("Введіть ім’я", "Enter your name"))
			.max(120, t("Занадто довге ім’я", "Name is too long")),
		city: z
			.string()
			.trim()
			.min(1, t("Введіть місто", "Enter your city"))
			.max(120, t("Занадто довга назва міста", "City name is too long")),
		phone: z
			.string()
			.refine(isUaPhoneMasked, t("Введіть повний номер у форматі +380", "Enter a full number in +380 format")),
		email: z
			.string()
			.trim()
			.superRefine((val, ctx) => {
				if (val === "") return;
				const r = z.string().email().safeParse(val);
				if (!r.success) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t(
							"Введіть коректну електронну пошту (наприклад, name@example.com)",
							"Enter a valid email (e.g. name@example.com)",
						),
					});
				}
			}),
	});
}
