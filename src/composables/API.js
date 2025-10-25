import { useLangStore } from "@/stores/lang";

let lastLang = null;

class Models {
	models = null;
	modelById = null;

	async get() {
		if (!this.models || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_car_models_page?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.models = body;
			lastLang = useLangStore().activeLang;
		}

		return this.models;
	}

	modelByIdMap = {};

	async getByURL(url = null) {
		const response = await fetch(
			`${path}/get_car_model_page/?url=${url}&?lang_code=${
				useLangStore().activeLang
			}`,
			{
				headers: {
					accept: "application/json",
				},
			}
		);

		if (!response.ok) {
			console.error(
				`[API] Error loading model: ${response.status} - ${response.statusText}`
			);
			return null;
		}

		try {
			const body = await response.json();
			lastLang = useLangStore().activeLang;
			return body;
		} catch (e) {
			console.error("[API] Failed to parse JSON:", e);
			return null;
		}
	}
}

class News {
	news = [];
	id = null;

	async get(offset = 0, limit = 9) {
		let resp = await fetch(
			`${path}/get_news_page?lang_code=${
				useLangStore().activeLang
			}&offset=${offset}&limit=${limit}`,
			{
				headers: {
					accept: "application/json",
				},
			}
		);
		let body = await resp.json();
		this.news = body;
		lastLang = useLangStore().activeLang;

		return this.news;
	}

	async getById(id, lang_code = useLangStore().activeLang) {
		let resp = await fetch(
			`${path}/get_detailed_news_page/?lang_code=${lang_code}&id=${id}`,
			{
				headers: {
					accept: "application/json",
				},
			}
		);
		let body = await resp.json();
		this.id = body;
		lastLang = useLangStore().activeLang;

		return this.id;
	}
}

class HomePage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_homepage/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class ServicePage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_service_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class ContactsPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_contacts_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class FinancialServicesPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_financial_services_page/?lang_code=${
					useLangStore().activeLang
				}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class GuaranteePage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_guarantee_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class AboutTOVPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_about_tov_company_page/?lang_code=${
					useLangStore().activeLang
				}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class PrivacyPolicyPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_privacy_policy_page/?lang_code=${
					useLangStore().activeLang
				}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class DiagnosticsPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_diagnostics_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class LeasingPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_leasing_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class LendingPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_lending_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class AboutCompanyPage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_about_company_page/?lang_code=${
					useLangStore().activeLang
				}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class InsurancePage {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_insurance_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class Footer {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_footer/?lang=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class BecomeADealer {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_become_dealer_page/?lang=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class BecomeAPartner {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_become_partner_page/?lang=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class Accessories {
	data = null;

	async get() {
		if (!this.data || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_accessories_page/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.data = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.data;
	}
}

class CarsInStock {
	data = null;
	id = null;
	filters = null;

	async get(filters) {
		let resp = await fetch(
			`${path}/get_cars_in_stock/?lang_code=${useLangStore().activeLang}${
				filters ? "&" + filters : ""
			}`,
			{
				headers: {
					accept: "application/json",
				},
			}
		);
		let body = await resp.json();
		this.data = body;
		console.log(body);
		lastLang = useLangStore().activeLang;
		return this.data;
	}

	async getFilters() {
		if (!this.filters || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_filters/?lang_code=${useLangStore().activeLang}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.filters = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.filters;
	}

	async getById(id) {
		if (!this.id || useLangStore().activeLang !== lastLang) {
			let resp = await fetch(
				`${path}/get_car_in_stock/?id=${id}&lang_code=${
					useLangStore().activeLang
				}`,
				{
					headers: {
						accept: "application/json",
					},
				}
			);
			let body = await resp.json();
			this.id = body;
			console.log(body);
			lastLang = useLangStore().activeLang;
		}
		return this.id;
	}
}

class Mail {
	/**

	* @param {*} page 'test_drive' | 'order' | 'signup_for_service' | 'financial_service' | 'event_registration'
	 */
	async send({ type, name, phone, page, email, city, isZeekrOwner }) {
		let body = {
			email_type: type,
			client_name: name,
			client_phone: phone,
			popup_page: page,
		};

		// Добавляем дополнительные поля если они есть
		if (email) body.client_email = email;
		if (city) body.client_city = city;
		if (isZeekrOwner !== undefined) body.is_zeekr_owner = isZeekrOwner;

		let resp = await fetch(`${path}/send_email/`, {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		let responseBody = await resp.json();
		return responseBody;
	}
}

let path = "https://zeekr-back.xyz/api",
	ngrokHeader = {
		"ngrok-skip-browser-warning": "69420",
	};

const API = {
	Models: new Models(),
	News: new News(),
	HomePage: new HomePage(),
	ServicePage: new ServicePage(),
	ContactsPage: new ContactsPage(),
	FinancialServicesPage: new FinancialServicesPage(),
	GuaranteePage: new GuaranteePage(),
	AboutTOVPage: new AboutTOVPage(),
	PrivacyPolicyPage: new PrivacyPolicyPage(),
	DiagnosticsPage: new DiagnosticsPage(),
	LeasingPage: new LeasingPage(),
	LendingPage: new LendingPage(),
	AboutCompanyPage: new AboutCompanyPage(),
	InsurancePage: new InsurancePage(),
	Footer: new Footer(),
	Mail: new Mail(),
	BecomeADealer: new BecomeADealer(),
	BecomeAPartner: new BecomeAPartner(),
	Accessories: new Accessories(),
	CarsInStock: new CarsInStock(),
};

export default API;
