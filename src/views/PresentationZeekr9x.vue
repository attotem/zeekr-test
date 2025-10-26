<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>

		<template v-else>
			<div class="custom-navigation">
			<div 
				class="nav-dot" 
				:class="{ active: currentSection === 0 }"
				@click="moveToSection(0)"
			>
				<div class="nav-dot__circle"></div>
			</div>
			<div 
				class="nav-dot" 
				:class="{ active: currentSection === 1 }"
				@click="moveToSection(1)"
			>
				<div class="nav-dot__circle"></div>
			</div>
			<div 
				class="nav-dot" 
				:class="{ active: currentSection === 2 }"
				@click="moveToSection(2)"
			>
				<div class="nav-dot__circle"></div>
			</div>
			<div 
				class="nav-dot" 
				:class="{ active: currentSection === 3 }"
				@click="moveToSection(3)"
			>
				<div class="nav-dot__circle"></div>
			</div>
			<div 
				class="nav-dot" 
				:class="{ active: currentSection === 4 }"
				@click="moveToSection(4)"
			>
				<div class="nav-dot__circle"></div>
			</div>
			</div>
			
			<div id="fullpage" :class="{ 'mobile-scroll': isMobile }">
				<article
					class="section presentation-banner"
					:style="{ backgroundImage: `url(${backgroundImage})` }"
					loading="eager"
				>
				<div class="presentation-banner__content">
					<h1 class="article-1__h article-1__h--1">
						Офіційна презентація 9Х
					</h1>
					<button class="btn btn--orange presentation-banner__button" @click="isRegistrationModalOpened = true">
						Зареєструватися на подію
					</button>
					<div class="presentation-banner__description">
						Компанія СКМ-1 – офіційний дистриб'ютор бренду Zeekr в Україні запрошує на урочисту презентацію з нагоди старту продажів гібриду Zeekr 9Х на території України.
					</div>
				</div>
			</article>

				<article 
					class="section car-showcase"
					:style="{ backgroundImage: `url(${carImage})` }"
					loading="lazy"
				>
				<div class="car-showcase__overlay"></div>
				<div class="car-showcase__content">
					<h2 class="car-showcase__title">КОМУ БУДЕ ЦІКАВА ПОДІЯ</h2>
					<div class="car-showcase__text">
						Новий Zeekr 9X вже в Україні. Він змінює уявлення про гібридні автомобілі. Іноваційний футуристичний дизайн. Три електромотори з високою потужністю. Просторовий та ультразручний салон для шести пасажирів. Zeekr 9X – це поєднання інноваційних гібридних технологій та комфорту бізнес-класу.
					</div>
				</div>
			</article>

				<article 
					class="section program-section"
					:style="{ backgroundImage: `url(${programImage})` }"
					loading="lazy"
				>
				<div class="program-section__overlay"></div>
				<div class="program-section__content">
					<h2 class="program-section__title">ПРОГРАМА</h2>
					<div class="program-section__schedule">
						<div class="schedule-item">
							<div class="schedule-time">10:00 – 10:30</div>
							<div class="schedule-text">Вітальне слово організаторів та партнерів</div>
							<div class="schedule-text">Реєстрація</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">10:30 – 10:50</div>
							<div class="schedule-text">Офіційне відкриття</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">10:50 – 12:00</div>
							<div class="schedule-text">Про офіційного дистриб'ютора</div>
							<div class="schedule-text">Про унікальність гібриду 9Х</div>
							<div class="schedule-text">Демонстрація презентації</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">12:30 – 13:00</div>
							<div class="schedule-text">Перерва на обід</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">13:00 – 14:00</div>
							<div class="schedule-text">Спеціальні гості (панельна дискусія)</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">14:00 – 15:00</div>
							<div class="schedule-text">Спеціальні гості (панельна дискусія)</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">15:00 – 16:00</div>
							<div class="schedule-text">Шоу-програма</div>
						</div>
						
						<div class="schedule-item">
							<div class="schedule-time">16:00 – 17:00</div>
							<div class="schedule-text">Банкет</div>
						</div>
					</div>
				</div>
			</article>

				<article 
					class="section video-section"
					:style="{ backgroundImage: `url(${videoImage})` }"
					loading="lazy"
				>
				<div class="video-section__overlay"></div>
				<video 
					v-if="!isMobile"
					:class="['video-section__background-video', { 'loaded': isVideoLoaded }]"
					autoplay
					muted
					loop
					playsinline
					preload="none"
					@loadeddata="onVideoLoaded"
					@error="onVideoError"
				>
					<source 
						src="https://zeekrlife-oss.zeekrlife.com/frontend/atom/atom_json/JSON-1745306191548/Pc%C3%A9%C2%A6%C2%96%C3%A5%C2%B1%C2%8F%C3%A8%C2%A7%C2%86%C3%A9%C2%A2%C2%91-d0aaf585ca9d1406f84ed7542fa168fe.mp4" 
						type="video/mp4"
					>
				</video>
				<div class="video-section__content">
					<h2 class="video-section__title">ВІДЕО</h2>
				</div>
			</article>

				<article 
					class="section social-section"
					:style="{ backgroundImage: `url(${socialBackground})` }"
					loading="lazy"
				>
				<div class="social-section__overlay"></div>
				<div class="social-section__content">
					<div class="guests-section">
						<h2 class="guests-section__title">СПЕЦІАЛЬНО ЗАПРОШЕНІ ГОСТІ</h2>
						<div class="guests-section__list">
							<div class="guest-item" v-for="n in 6" :key="n">
								<img :src="guestsImage" alt="Guest" class="guest-item__image" loading="lazy" />
							</div>
						</div>
					</div>

					<!-- <div class="partners-section">
						<h2 class="partners-section__title">ПАРТНЕРИ ZEEKR UKRAINE БЛОК</h2>
						<div class="partners-section__list">
							<div class="partner-item" v-for="n in 4" :key="n">
								<img :src="partnerLogo" alt="Partner" class="partner-item__logo" />
							</div>
						</div>
					</div> -->

					<div class="social-links-section">
						<h2 class="social-links-section__title">ПОСИЛАННЯ НА СОЦМЕРЕЖІ</h2>
						<div class="social-links-section__list">
							<a href="https://www.instagram.com/zeekr.ukraine" target="_blank" rel="noopener noreferrer" class="social-link social-link--instagram">
								<div class="social-link__icon">
									<img :src="instagramIcon" alt="Instagram" loading="lazy" />
								</div>
								<div class="social-link__text">zeekr.ukraine</div>
							</a>
							<a href="https://www.facebook.com/people/Zeekr-Ukraine/61565869926215/" target="_blank" rel="noopener noreferrer" class="social-link social-link--facebook">
								<div class="social-link__icon">
									<img :src="facebookIcon" alt="Facebook" loading="lazy" />
								</div>
								<div class="social-link__text">Zeekr Ukraine</div>
							</a>
							<a href="#" class="social-link social-link--telegram">
								<div class="social-link__text social-link__text--with-bg">чат-бот</div>
								<div class="social-link__subtext social-link__subtext--no-bg">TELEGRAM</div>
							</a>
						</div>
					</div>
				</div>
			</article>
			</div>
			
			<RegistrationModal
				:is-opened="isRegistrationModalOpened"
				@close="isRegistrationModalOpened = false"
			/>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import { useLoaderStore } from "@/stores/loader";
import { computed, onMounted, ref, onUnmounted } from "vue";
import fullpage from 'fullpage.js';

import banner2048 from "@/assets/img/9x/2048x1440/1.png";
import car2048 from "@/assets/img/9x/2048x1440/2.png";
import program2048 from "@/assets/img/9x/2048x1440/3.png";
import video2048 from "@/assets/img/9x/2048x1440/4.png";
import social2048 from "@/assets/img/9x/2048x1440/5.png";

import banner1080 from "@/assets/img/9x/1080x836/1.png";
import car1080 from "@/assets/img/9x/1080x836/2.png";
import program1080 from "@/assets/img/9x/1080x836/3.png";
import video1080 from "@/assets/img/9x/1080x836/4.png";
import social1080 from "@/assets/img/9x/1080x836/5.png";

import banner375 from "@/assets/img/9x/375x700/1.png";
import car375 from "@/assets/img/9x/375x700/2.png";
import program375 from "@/assets/img/9x/375x700/3.png";
import video375 from "@/assets/img/9x/375x700/4.png";
import social375 from "@/assets/img/9x/375x700/5.png";

import guestsImage from "@/assets/img/9x/images.jpg";
import partnerLogo from "@/assets/img/9x/_logo_white .png";
import instagramIcon from "@/assets/img/9x/Instagram_white.svg";
import facebookIcon from "@/assets/img/9x/Facebook_white_icon_svg.svg";
import RegistrationModal from "@/components/RegistrationModal.vue";

let isLoading = computed(() => useLoaderStore().isLoading)
let isVideoLoaded = ref(false)
let currentSection = ref(0)
let isRegistrationModalOpened = ref(false)
let screenWidth = ref(window.innerWidth)
let isMobile = computed(() => screenWidth.value <= 768)

const backgroundImage = computed(() => {
	if (screenWidth.value <= 768) return banner375;
	if (screenWidth.value <= 1200) return banner1080;
	return banner2048;
})

const carImage = computed(() => {
	if (screenWidth.value <= 768) return car375;
	if (screenWidth.value <= 1200) return car1080;
	return car2048;
})

const programImage = computed(() => {
	if (screenWidth.value <= 768) return program375;
	if (screenWidth.value <= 1200) return program1080;
	return program2048;
})

const videoImage = computed(() => {
	if (screenWidth.value <= 768) return video375;
	if (screenWidth.value <= 1200) return video1080;
	return video2048;
})

const socialBackground = computed(() => {
	if (screenWidth.value <= 768) return social375;
	if (screenWidth.value <= 1200) return social1080;
	return social2048;
})

const updateScreenWidth = () => {
	screenWidth.value = window.innerWidth;
}

const handleMobileScroll = () => {
	if (!isMobile.value) return;
	
	const sections = document.querySelectorAll('.section');
	const scrollPosition = window.scrollY + window.innerHeight / 2;
	
	sections.forEach((section, index) => {
		const sectionTop = section.offsetTop;
		const sectionBottom = sectionTop + section.offsetHeight;
		
		if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
			currentSection.value = index;
		}
	});
}

const onVideoLoaded = () => {
	isVideoLoaded.value = true;
}

const preloadNextImages = () => {
	if (screenWidth.value <= 768) {
		const nextImages = [car375, program375, video375, social375];
		nextImages.forEach(img => {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = img;
			document.head.appendChild(link);
		});
	} else if (screenWidth.value <= 1200) {
		const nextImages = [car1080, program1080, video1080, social1080];
		nextImages.forEach(img => {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = img;
			document.head.appendChild(link);
		});
	} else {
		const nextImages = [car2048, program2048, video2048, social2048];
		nextImages.forEach(img => {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = img;
			document.head.appendChild(link);
		});
	}
}

const onVideoError = () => {
	console.log('Video failed to load, keeping background image');
}

const moveToSection = (sectionIndex) => {
	if (isMobile.value) {
		const sections = document.querySelectorAll('.section');
		if (sections[sectionIndex]) {
			sections[sectionIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
			currentSection.value = sectionIndex;
		}
	} else if (fullpageInstance) {
		fullpageInstance.moveTo(sectionIndex + 1);
	}
}

let fullpageInstance = null;

onMounted(async () => {
	window.addEventListener('resize', updateScreenWidth);
	
	if (isMobile.value) {
		window.addEventListener('scroll', handleMobileScroll, { passive: true });
	}
	
	setTimeout(() => {
		preloadNextImages();
	}, 2000);
	
	useLoaderStore().isLoading = true;
	setTimeout(() => {
		useLoaderStore().isLoading = false;
		
		if (!isMobile.value) {
			setTimeout(() => {
				fullpageInstance = new fullpage('#fullpage', {
					menu: false,
					lockAnchors: false,
					anchors: ['banner', 'car-showcase', 'program', 'video', 'social'],
					navigation: false,
					navigationPosition: 'right',
					navigationTooltips: ['Баннер', 'Автомобиль', 'Программа', 'Видео', 'Социальные сети'],
					showActiveTooltip: false,
					navigationColor: '#333',
					slidesNavigation: false,
					slidesNavPosition: 'bottom',
					css3: true,
					scrollingSpeed: 1000,
					autoScrolling: true,
					fitToSection: true,
					fitToSectionDelay: 1000,
					scrollBar: false,
					easing: 'easeInOutQuart',
					easingcss3: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					loopBottom: false,
					loopTop: false,
					loopHorizontal: true,
					continuousVertical: false,
					continuousHorizontal: false,
					scrollHorizontally: false,
					interlockedSlides: false,
					dragAndMove: false,
					offsetSections: false,
					resetSliders: false,
					fadingEffect: false,
					normalScrollElements: null,
					scrollOverflow: false,
					scrollOverflowReset: false,
					touchSensitivity: 15,
					bigSectionsDestination: null,
					keyboardScrolling: true,
					animateAnchor: true,
					recordHistory: true,
					controlArrows: true,
					verticalCentered: true,
					sectionsColor: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
					fixedElements: null,
					responsiveWidth: 0,
					responsiveHeight: 0,
					responsiveSlides: false,
					parallax: false,
					parallaxOptions: { type: 'reveal', percentage: 62, property: 'translate' },
					sectionSelector: '.section',
					slideSelector: '.slide',
					onLeave: function(origin, destination, direction) {
						console.log('Leaving section: ' + origin.index);
					},
					afterLoad: function(origin, destination, direction) {
						console.log('After load: ' + destination.index);
						currentSection.value = destination.index;
					},
					afterRender: function() {
						console.log('Fullpage.js initialized');
					},
					afterResize: function(width, height) {
						console.log('Resized to: ' + width + 'x' + height);
					},
					afterResponsive: function(isResponsive) {
						console.log('Responsive mode: ' + isResponsive);
					},
					afterSlideLoad: function(section, origin, destination, direction) {
						console.log('After slide load: ' + destination.index);
					},
					onSlideLeave: function(section, origin, destination, direction) {
						console.log('Leaving slide: ' + origin.index);
					}
				});
			}, 100);
		}
	}, 1000);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateScreenWidth);
	window.removeEventListener('scroll', handleMobileScroll);
	if (fullpageInstance) {
		fullpageInstance.destroy('all');
	}
});
</script>

<style lang="scss" scoped>
#fullpage {
	.section {
		height: 100vh;
		width: 100vw;
		position: relative;
	}
	
	&.mobile-scroll {
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		scroll-behavior: smooth;
		
		.section {
			min-height: 100vh;
			height: auto;
		}
	}
}

.custom-navigation {
	position: fixed;
	top: 50%;
	right: 20px;
	transform: translateY(-50%);
	z-index: 1000;
	display: flex;
	flex-direction: column;
	gap: 20px;
	
	.nav-dot {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.1s ease;
		will-change: transform;
		
		&__circle {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: rgba(100, 100, 100, 0.6);
			border: 1px solid rgba(100, 100, 100, 0.8);
			transition: all 0.1s ease;
			will-change: transform, background-color;
		}
		
		&.active {
			.nav-dot__circle {
				background: #333;
				border-color: #333;
				transform: scale(1.4);
			}
		}
		
		&:hover {
			.nav-dot__circle {
				background: rgba(100, 100, 100, 0.8);
				border-color: rgba(100, 100, 100, 1);
				transform: scale(1.1);
			}
		}
	}
}

.presentation-banner {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 100px 76px 260px 76px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: scroll;
    width: 100vw;
    height: 100vh;
    min-height: 736px;
    transform: translateZ(0);
    will-change: scroll-position;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%);
		z-index: 1;
	}
	
	&__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
        z-index: 2;
        position: relative;
        margin-left: 0;
        padding: 40px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
	}


	&__button {
		margin: 0;
		font-size: 16px;
		font-weight: 500;
		padding: 12px 32px;
	}

	&__description {
		font-size: 16px;
		line-height: 1.5;
		color: #fff;
		max-width: 520px;
		opacity: 0.95;
	}
}

.article-1 {
	&__h {
		&--1 {
			text-align: left;
			margin-bottom: 0;
			font-family: "Tenor Sans";
			font-size: 64px;
			line-height: 1.2;
			font-weight: 400;
			color: #fff;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		}
	}
}

.car-showcase {
	position: relative;
    display: flex;
    align-items: flex-start;
    padding: 80px 76px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: scroll;
    width: 100vw;
    height: 100vh;
    min-height: 736px;
    justify-content: flex-start;
    transform: translateZ(0);
    will-change: scroll-position;

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%);
		z-index: 1;
	}

	&__content {
		position: relative;
		z-index: 2;
		padding: 30px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	&__title {
		font-family: "Tenor Sans";
		font-size: 48px;
		line-height: 1.2;
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		margin-bottom: 24px;
	}

	&__text {
		font-size: 22px;
		line-height: 1.6;
		color: #fff;
		text-align: left;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}
}

.program-section {
	position: relative;
	display: flex;
	align-items: flex-start;
	padding: 80px 76px;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-attachment: scroll;
	width: 100vw;
	height: 100vh;
	min-height: 736px;
	transform: translateZ(0);
	will-change: scroll-position;

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%);
		z-index: 1;
	}

	&__content {
		position: relative;
		z-index: 2;
		max-width: 600px;
		padding: 30px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	&__title {
		font-family: "Tenor Sans";
		font-size: 48px;
		line-height: 1.2;
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		margin-bottom: 40px;
	}

	&__schedule {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.schedule-item {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.schedule-time {
			font-size: 18px;
			font-weight: 600;
			color: #fff;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		}

		.schedule-text {
			font-size: 16px;
			line-height: 1.4;
			color: #fff;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
			margin-left: 0;
		}
	}
}

.video-section {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 80px 76px;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-attachment: scroll;
	width: 100vw;
	height: 100vh;
	min-height: 736px;
	overflow: hidden;
	transform: translateZ(0);
	will-change: scroll-position;

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%);
		z-index: 1;
	}

	&__background-video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;

		&.loaded {
			opacity: 1;
		}
	}

	&__content {
		position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 40px;
        width: 100%;
        height: 100%;
	}

	&__title {
		top: 80px;
		left: 76px;
		font-family: "Tenor Sans";
		font-size: 48px;
		line-height: 1.2;
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		margin-bottom: 0;
		z-index: 3;
	}
}

.social-section {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 80px 76px;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-attachment: scroll;
	width: 100vw;
	height: 100vh;
	min-height: 736px;
	transform: translateZ(0);
	will-change: scroll-position;

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.05) 100%);
		z-index: 1;
	}

	&__content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 60px;
		width: 100%;
		height: 100%;
		padding: 40px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}
}

.guests-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;

	&__title {
		font-family: "Tenor Sans";
		font-size: 48px;
		line-height: 1.2;
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		text-align: center;
	}

	&__list {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.guest-item {
	    width: 230px;
        height: 230px;
		border-radius: 50%;
		overflow: hidden;
		background-color: #F75400;
		display: flex;
		align-items: center;
		justify-content: center;

		&__image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}

.partners-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;

	&__title {
		font-family: "Tenor Sans";
		font-size: 48px;
		line-height: 1.2;
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		text-align: center;
	}

	&__list {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.partner-item {
		width: 150px;
		height: 100px;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		&__logo {
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}
	}
}

.social-links-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;

	&__title {
		font-family: "Tenor Sans";
		font-size: 48px;
		line-height: 1.2;
		font-weight: 400;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		text-align: center;
	}

	&__list {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.social-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px 32px;
		border-radius: 12px;
		text-decoration: none;
		color: #fff;
		transition: all 0.3s ease;
		min-width: 150px;

		&:hover {
			transform: translateY(-2px);
		}

		&--telegram {
			border-radius: 12px;
			min-width: 180px;
			background-color: transparent;
		}

		&__icon {
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			text-decoration: none;
			
			img {
				width: 32px;
				height: 32px;
			}
		}

		&__text {
			font-size: 18px;
			font-weight: 500;
			text-align: center;
			text-decoration: underline;

			&--with-bg {
				padding: 8px 16px;
				border-radius: 6px;
				text-decoration: none;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		&__subtext {
			font-size: 16px;
			opacity: 0.8;
			text-align: center;

			&--no-bg {
				background-color: transparent;
				margin-top: 8px;
			}
		}
	}
}

@media screen and (max-width: 1200px) {
	.presentation-banner {
		padding: 80px 40px 220px 40px;
		
		&__content {
			gap: 28px;
			padding: 30px;
		}
	}

	.article-1 {
		&__h {
			&--1 {
				font-size: 56px;
			}
		}
	}

	.car-showcase,
	.program-section {
		padding: 80px 40px;
		
		&__content {
			padding: 30px;
		}
	}

	.video-section {
		padding: 80px 40px;
		
		&__title {
			left: 40px;
		}
	}

	.social-section {
		padding: 80px 40px;
	}
}

@media screen and (max-width: 992px) {
	.custom-navigation {
		right: 15px;
		gap: 16px;
		
		.nav-dot {
			&__circle {
				width: 7px;
				height: 7px;
			}
		}
	}

	.presentation-banner {
		padding: 70px 32px 180px 32px;
		
		&__content {
			gap: 26px;
			padding: 25px;
		}

		&__button {
			font-size: 15px;
			padding: 11px 28px;
		}

		&__description {
			font-size: 15px;
			max-width: 480px;
		}
	}

	.article-1 {
		&__h {
			&--1 {
				font-size: 50px;
			}
		}
	}

	.car-showcase {
		padding: 70px 32px;

		&__title {
			font-size: 42px;
			margin-bottom: 22px;
		}

		&__text {
			font-size: 20px;
		}
	}

	.program-section {
		padding: 70px 32px;

		&__title {
			font-size: 42px;
			margin-bottom: 35px;
		}

		&__schedule {
			gap: 22px;
		}
	}

	.video-section {
		padding: 70px 32px;
		
		&__title {
			top: 70px;
			left: 32px;
			font-size: 42px;
		}
	}

	.social-section {
		padding: 70px 32px;

		&__content {
			gap: 50px;
		}
	}

	.guests-section {
		gap: 28px;

		&__title {
			font-size: 42px;
		}

		&__list {
			gap: 20px;
		}

		.guest-item {
			width: 180px;
			height: 180px;
		}
	}

	.partners-section {
		gap: 28px;

		&__title {
			font-size: 42px;
		}

		&__list {
			gap: 20px;
		}

		.partner-item {
			width: 130px;
			height: 90px;
		}
	}

	.social-links-section {
		gap: 28px;

		&__title {
			font-size: 42px;
		}

		&__list {
			gap: 20px;
		}
	}
}

@media screen and (max-width: 768px) {
	.custom-navigation {
		right: 12px;
		gap: 14px;
		
		.nav-dot {
			&__circle {
				width: 6px;
				height: 6px;
			}
		}
	}

	.presentation-banner {
		padding: 60px 24px 160px 24px;
		min-height: 600px;
		align-items: center;
		
		&__content {
			align-items: center;
			gap: 24px;
			max-width: 100%;
			padding: 20px;
		}

		&__button {
			font-size: 14px;
			padding: 10px 24px;
			max-width: 280px;
		}

		&__description {
			text-align: center;
			font-size: 14px;
			max-width: 420px;
		}
	}

	.article-1 {
		&__h {
			&--1 {
				text-align: center;
				font-size: 40px;
				line-height: 1.2;
			}
		}
	}

	.car-showcase {
		padding: 80px 24px;
		min-height: 600px;

		&__title {
			font-size: 34px;
			margin-bottom: 20px;
		}

		&__text {
			font-size: 17px;
			line-height: 1.5;
		}
	}

	.program-section {
		padding: 80px 24px;
		min-height: 600px;
		overflow-y: auto;

		&__content {
			max-width: 100%;
		}

		&__title {
			font-size: 34px;
			margin-bottom: 28px;
		}

		&__schedule {
			gap: 18px;
		}

		.schedule-item {
			gap: 6px;

			.schedule-time {
				font-size: 15px;
			}

			.schedule-text {
				font-size: 13px;
				line-height: 1.4;
			}
		}
	}

	.video-section {
		padding: 80px 24px;
		min-height: 600px;

		&__title {
			top: 80px;
			left: 24px;
			font-size: 34px;
		}
	}

	.social-section {
		padding: 80px 24px;
		min-height: 600px;
		overflow-y: auto;

		&__content {
			gap: 35px;
		}
	}

	.guests-section {
		gap: 22px;

		&__title {
			font-size: 30px;
		}

		&__list {
			gap: 14px;
		}

		.guest-item {
			width: 100px;
			height: 100px;
		}
	}

	.partners-section {
		gap: 22px;

		&__title {
			font-size: 30px;
		}

		&__list {
			gap: 14px;
		}

		.partner-item {
			width: 110px;
			height: 75px;
		}
	}

	.social-links-section {
		gap: 22px;

		&__title {
			font-size: 30px;
		}

		&__list {
			gap: 14px;
			flex-wrap: wrap;
		}

		.social-link {
			padding: 14px 24px;
			min-width: 160px;

			&--telegram {
				min-width: 180px;
			}

			&__icon {
				margin-bottom: 10px;
				
				img {
					width: 28px;
					height: 28px;
				}
			}

			&__text {
				font-size: 15px;
			}

			&__subtext {
				font-size: 13px;
			}
		}
	}
}

@media screen and (max-width: 576px) {
	.custom-navigation {
		right: 10px;
		gap: 12px;
		
		.nav-dot {
			&__circle {
				width: 6px;
				height: 6px;
			}
		}
	}

	.presentation-banner {
		padding: 50px 20px 140px 20px;
		min-height: 550px;
		
		&__content {
			gap: 20px;
			padding: 18px;
		}

		&__button {
			width: 100%;
			max-width: 260px;
			font-size: 14px;
		}

		&__description {
			font-size: 13px;
			line-height: 1.4;
			max-width: 340px;
		}
	}

	.article-1 {
		&__h {
			&--1 {
				font-size: 34px;
				line-height: 1.15;
			}
		}
	}

	.car-showcase {
		padding: 80px 20px;
		min-height: 550px;

		&__title {
			font-size: 28px;
			margin-bottom: 18px;
		}

		&__text {
			font-size: 15px;
			line-height: 1.5;
		}
	}

	.program-section {
		padding: 80px 20px;
		min-height: 550px;

		&__title {
			font-size: 28px;
			margin-bottom: 24px;
		}

		&__schedule {
			gap: 16px;
		}

		.schedule-item {
			gap: 5px;

			.schedule-time {
				font-size: 14px;
			}

			.schedule-text {
				font-size: 12px;
			}
		}
	}

	.video-section {
		padding: 80px 20px;
		min-height: 550px;

		&__title {
			top: 80px;
			left: 20px;
			font-size: 28px;
		}
	}

	.social-section {
		padding: 80px 20px;
		min-height: 550px;

		&__content {
			gap: 30px;
		}
	}

	.guests-section {
		gap: 18px;

		&__title {
			font-size: 24px;
		}

		&__list {
			gap: 12px;
		}

		.guest-item {
			width: 70px;
			height: 70px;
		}
	}

	.partners-section {
		gap: 18px;

		&__title {
			font-size: 24px;
		}

		&__list {
			gap: 12px;
		}

		.partner-item {
			width: 90px;
			height: 65px;
		}
	}

	.social-links-section {
		gap: 18px;

		&__title {
			font-size: 24px;
		}

		&__list {
			gap: 12px;
			flex-direction: column;
			align-items: center;
		}

		.social-link {
			padding: 12px 20px;
			min-width: 190px;

			&--telegram {
				min-width: 190px;
			}

			&__icon {
				margin-bottom: 8px;
				
				img {
					width: 24px;
					height: 24px;
				}
			}

			&__text {
				font-size: 14px;
			}

			&__subtext {
				font-size: 12px;
			}
		}
	}
}

@media screen and (max-width: 480px) {
	.custom-navigation {
		right: 8px;
		gap: 10px;
		
		.nav-dot {
			&__circle {
				width: 5px;
				height: 5px;
			}
		}
	}

	.presentation-banner {
		padding: 40px 16px 120px 16px;
		min-height: 500px;
		
		&__content {
			gap: 18px;
			padding: 16px;
		}

		&__button {
			width: 100%;
			max-width: 240px;
			font-size: 13px;
			padding: 10px 20px;
		}

		&__description {
			font-size: 12px;
			line-height: 1.4;
			max-width: 300px;
		}
	}

	.article-1 {
		&__h {
			&--1 {
				font-size: 30px;
				line-height: 1.15;
			}
		}
	}

	.car-showcase {
		padding: 80px 16px;
		min-height: 500px;

		&__title {
			font-size: 24px;
			margin-bottom: 16px;
		}

		&__text {
			font-size: 14px;
			line-height: 1.5;
		}
	}

	.program-section {
		padding: 80px 16px;
		min-height: 500px;

		&__title {
			font-size: 24px;
			margin-bottom: 20px;
		}

		&__schedule {
			gap: 14px;
		}

		.schedule-item {
			gap: 4px;

			.schedule-time {
				font-size: 13px;
			}

			.schedule-text {
				font-size: 11px;
			}
		}
	}

	.video-section {
		padding: 80px 16px;
		min-height: 500px;

		&__title {
			top: 80px;
			left: 16px;
			font-size: 24px;
		}
	}

	.social-section {
		padding: 80px 16px;
		min-height: 500px;

		&__content {
			gap: 24px;
		}
	}

	.guests-section {
		gap: 14px;

		&__title {
			font-size: 20px;
		}

		&__list {
			gap: 10px;
		}

		.guest-item {
			width: 60px;
			height: 60px;
		}
	}

	.partners-section {
		gap: 14px;

		&__title {
			font-size: 20px;
		}

		&__list {
			gap: 10px;
		}

		.partner-item {
			width: 75px;
			height: 55px;
		}
	}

	.social-links-section {
		gap: 14px;

		&__title {
			font-size: 20px;
		}

		&__list {
			gap: 10px;
		}

		.social-link {
			padding: 10px 16px;
			min-width: 170px;

			&--telegram {
				min-width: 170px;
			}

			&__icon {
				margin-bottom: 6px;
				
				img {
					width: 20px;
					height: 20px;
				}
			}

			&__text {
				font-size: 12px;
			}

			&__subtext {
				font-size: 10px;
			}
		}
	}
}

@media screen and (max-width: 360px) {
	.presentation-banner {
		padding: 35px 12px 100px 12px;
		min-height: 480px;
		
		&__content {
			padding: 14px;
		}
		
		&__button {
			max-width: 220px;
			font-size: 12px;
		}

		&__description {
			font-size: 11px;
			max-width: 280px;
		}
	}

	.article-1 {
		&__h {
			&--1 {
				font-size: 26px;
			}
		}
	}

	.car-showcase,
	.program-section,
	.video-section {
		padding: 80px 12px;
		min-height: 480px;
	}

	.car-showcase {
		&__title {
			font-size: 22px;
		}

		&__text {
			font-size: 13px;
		}
	}

	.program-section {
		&__title {
			font-size: 22px;
		}

		.schedule-item {
			.schedule-time {
				font-size: 12px;
			}

			.schedule-text {
				font-size: 10px;
			}
		}
	}

	.video-section {
		&__title {
			top: 80px;
			left: 12px;
			font-size: 22px;
		}
	}

	.social-section {
		padding: 80px 12px;
		min-height: 480px;

		&__content {
			gap: 20px;
		}
	}

	.guests-section,
	.partners-section,
	.social-links-section {
		&__title {
			font-size: 18px;
		}
	}

	.guests-section {
		.guest-item {
			width: 55px;
			height: 55px;
		}
	}

	.partners-section {
		.partner-item {
			width: 70px;
			height: 50px;
		}
	}

	.social-links-section {
		.social-link {
			min-width: 160px;
			padding: 8px 12px;

			&--telegram {
				min-width: 160px;
			}

			&__icon img {
				width: 18px;
				height: 18px;
			}

			&__text {
				font-size: 11px;
			}

			&__subtext {
				font-size: 9px;
			}
		}
	}
}
</style>
