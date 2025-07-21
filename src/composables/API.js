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

	async get() {
		/*
    if (!this.news) {
      let resp = await fetch(`${path}/news`)
      let body = await resp.json()
    }
    */

		this.news = [
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 1",
				},
				date: 1739217920592,
				id: 1,
			},
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 2",
				},
				date: 1739218920592,
				id: 2,
			},
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 3",
				},
				date: 1739219920592,
				id: 3,
			},
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 4",
				},
				date: 1739220920592,
				id: 4,
			},
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 5",
				},
				date: 1739230920592,
				id: 5,
			},
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 6",
				},
				date: 1739240920592,
				id: 6,
			},
			{
				image: "https://cdn-icons-png.flaticon.com/256/2555/2555013.png",
				text: {
					en: "Stunning, powerful, sophisticated",
				},
				price: "1 339 000 UAH",
				heading: {
					en: "News article 6",
				},
				date: 1739250920592,
				id: 7,
			},
		];

		lastLang = useLangStore().activeLang;
		return this.news;
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

class Mail {
	/**
	 * https://docs.google.com/document/d/1LEm10dwbKTMEciKYhXuH5HHV75vqz65mZiaIk0y2e-o/edit?tab=t.0
	 * @param {*} page 'test_drive' | 'order' | 'signup_for_service' | 'financial_service'
	 */
	async send({ type, name, phone, page }) {
		let resp = await fetch(`${path}/send_email/`, {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email_type: type,
				client_name: name,
				client_phone: phone,
				popup_page: page,
			}),
		});
		let body = await resp.json();
		return body;
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
};

export default API;
