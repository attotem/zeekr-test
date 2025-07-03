import { nextTick } from "vue";
import isMobile from "./isMobile";

export default function addDropdown(id, isLangs = false, isQuestion = false) {
	let parent = document.querySelector(
			`#${id}${!isLangs && !isQuestion && isMobile() ? "-mobile" : ""}`
		),
		dropdown = document.querySelector(
			`#${id}-dropdown${!isLangs && !isQuestion && isMobile() ? "-mobile" : ""}`
		),
		header = document.querySelector(".header");

	nextTick(() => {
		if (!parent || !dropdown) {
			console.warn(`[addDropdown] Missing elements for id="${id}"`);
			return;
		}

		if (!isQuestion) {
			if (isLangs || !isMobile()) {
				parent.addEventListener("mouseenter", () => {
					dropdown.style.maxHeight = dropdown.scrollHeight + "px";
					if (id === "models") header?.classList.add("header--black");
					parent
						.querySelector(".dropdown-icon")
						?.classList.add("dropdown-icon--active");
				});

				if (id !== "models") {
					parent.addEventListener("mouseleave", () => {
						dropdown.style.maxHeight = 0;
						parent
							.querySelector(".dropdown-icon")
							?.classList.remove("dropdown-icon--active");
					});
				} else {
					dropdown.addEventListener("mouseleave", (e) => {
						if (e.clientY <= header?.getClientRects()[0]?.height) return;
						dropdown.style.maxHeight = 0;
						header?.classList.remove("header--black");
						parent
							.querySelector(".dropdown-icon")
							?.classList.remove("dropdown-icon--active");
					});
				}
			} else {
				parent
					.querySelector(".dropdown-icon--outer")
					?.addEventListener("click", (e) => {
						e.preventDefault();
						e.stopImmediatePropagation();

						if (
							dropdown.style.maxHeight &&
							dropdown.style.maxHeight !== "0px"
						) {
							dropdown.style.maxHeight = 0;
							parent
								.querySelector(".dropdown-icon")
								?.classList.remove("dropdown-icon--active");
						} else {
							dropdown.style.maxHeight = dropdown.scrollHeight + "px";
							parent
								.querySelector(".dropdown-icon")
								?.classList.add("dropdown-icon--active");
						}
					});
			}
		} else {
			let activeQuestion = null;

			parent.addEventListener("click", () => {
				if (activeQuestion === id) {
					dropdown.style.maxHeight = 0;
					parent
						.querySelector(".dropdown-icon")
						?.classList.remove("dropdown-icon--active");
					activeQuestion = null;
				} else {
					dropdown.style.maxHeight = dropdown.scrollHeight + "px";
					parent
						.querySelector(".dropdown-icon")
						?.classList.add("dropdown-icon--active");
					activeQuestion = id;
				}
			});
		}
	});
}
