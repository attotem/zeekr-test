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
				const iconOuter = parent.querySelector(".dropdown-icon--outer");
				console.log("[addDropdown] iconOuter:", iconOuter);
				iconOuter?.addEventListener("click", (e) => {
					console.log("[addDropdown] CLICK on iconOuter for id:", id);
					e.preventDefault();
					e.stopImmediatePropagation();

					if (dropdown.style.maxHeight && dropdown.style.maxHeight !== "0px") {
						dropdown.style.maxHeight = 0;
						parent
							.querySelector(".dropdown-icon")
							?.classList.remove("dropdown-icon--active");
						console.log("[addDropdown] CLOSE", id);
					} else {
						dropdown.style.maxHeight = dropdown.scrollHeight + "px";
						parent
							.querySelector(".dropdown-icon")
							?.classList.add("dropdown-icon--active");
						console.log("[addDropdown] OPEN", id);
					}
				});
			}
		} else {
			let activeQuestion = null;

			parent.addEventListener("click", () => {
				console.log("[addDropdown] FAQ CLICK", id);
				if (activeQuestion === id) {
					dropdown.style.maxHeight = 0;
					parent
						.querySelector(".dropdown-icon")
						?.classList.remove("dropdown-icon--active");
					activeQuestion = null;
					console.log("[addDropdown] FAQ CLOSE", id);
				} else {
					dropdown.style.maxHeight = dropdown.scrollHeight + "px";
					parent
						.querySelector(".dropdown-icon")
						?.classList.add("dropdown-icon--active");
					activeQuestion = id;
					console.log("[addDropdown] FAQ OPEN", id);
				}
			});
		}
	});
}
