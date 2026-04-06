/**
 * Сортує `car_models` з `get_car_models_page` за порядком китайського сайту.
 * Кожен елемент має `model_page.url.child` на кшталт `zeekr-7x`, `zeekr-001`, `zeekr-007gt` тощо.
 */
const HEADER_MODEL_ORDER = [
	"8x",
	"7x",
	"001",
	"9x",
	"007gt",
	"001-fr",
	"009",
	"009-grand",
	"007",
	"mix",
	"x",
];

function normalizeHeaderModelKey(model) {
	let child = (model?.model_page?.url?.child || "").toLowerCase();
	child = child.replace(/^zeekr-/, "").replace(/^car-/, "");
	if (child === "007-gt" || child === "007_gt") return "007gt";
	if (child === "001fr" || child === "001_fr") return "001-fr";
	if (child === "009grand" || child === "009_grand") return "009-grand";
	return child;
}

export function sortCarModelsForHeader(models) {
	if (!Array.isArray(models)) return models;
	return models
		.map((m, i) => ({ m, i }))
		.sort((a, b) => {
			const ka = normalizeHeaderModelKey(a.m);
			const kb = normalizeHeaderModelKey(b.m);
			const ia = HEADER_MODEL_ORDER.indexOf(ka);
			const ib = HEADER_MODEL_ORDER.indexOf(kb);
			const ra = ia === -1 ? 1000 + a.i : ia;
			const rb = ib === -1 ? 1000 + b.i : ib;
			return ra - rb;
		})
		.map(({ m }) => m);
}
