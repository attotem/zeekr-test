import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Models from "@/views/Models.vue";
import Car from "@/views/Car.vue";
import Service from "@/views/Service.vue";
import Diagnostics from "@/views/Diagnostics.vue";
import Guarantee from "@/views/Guarantee.vue";
import FinancialServices from "@/views/FinancialServices.vue";
import Lending from "@/views/Lending.vue";
import Leasing from "@/views/Leasing.vue";
import Insure from "@/views/Insure.vue";
import About from "@/views/About.vue";
import Stock from "@/views/Stock.vue";
import Contacts from "@/views/Contacts.vue";
import NotFound from "@/views/NotFound.vue";
import AboutTOV from "@/views/AboutTOV.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import NearestDealers from "@/views/NearestDealers.vue";
import BecomeADealer from "@/views/BecomeADealer.vue";
import BecomeAPartner from "@/views/BecomeAPartner.vue";
import Accessories from "@/views/Accessories.vue";
import News from "@/views/News.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
		},
		{
			path: "/models",
			name: "models",
			component: Models,
		},
		{
			path: "/:childId",
			name: "car",
			component: Car,
		},
		{
			path: "/service",
			name: "service",
			component: Service,
		},
		{
			path: "/diagnostics",
			name: "diagnostics",
			component: Diagnostics,
		},
		{
			path: "/guarantee",
			name: "guarantee",
			component: Guarantee,
		},
		{
			path: "/financial-services",
			name: "financial-services",
			component: FinancialServices,
		},
		{
			path: "/lending",
			name: "lending",
			component: Lending,
		},
		{
			path: "/leasing",
			name: "leasing",
			component: Leasing,
		},
		{
			path: "/insure",
			name: "insure",
			component: Insure,
		},
		{
			path: "/about",
			name: "about",
			component: About,
		},
		{
			path: "/stock",
			name: "stock",
			component: Stock,
		},
		{
			path: "/contacts",
			name: "contacts",
			component: Contacts,
		},
		{
			path: "/privacy-policy",
			name: "privacy-policy",
			component: PrivacyPolicy,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			component: NotFound,
		},
		{
			path: "/404",
			name: "NotFound",
			component: NotFound,
		},
		{
			path: "/about-tov",
			name: "about-tov",
			component: AboutTOV,
		},
		{
			path: "/nearest-dealers",
			name: "nearest-dealers",
			component: NearestDealers,
		},
		{
			path: "/become-dealer",
			name: "become-dealer",
			component: BecomeADealer,
		},
		{
			path: "/become-partner",
			name: "become-partner",
			component: BecomeAPartner,
		},
		{
			path: "/accessories",
			name: "accessories",
			component: Accessories,
		},
		{
			path: "/news",
			name: "news",
			component: News,
		},
	],
});

export default router;
