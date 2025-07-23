<template>
	<TransitionGroup name="loading">
		<div
			class="loading-spinner"
			v-if="isLoading"
		>
			<Logo />
		</div>
		<template v-if="data">
			<article
				class="article-1-guarantee"
				:style="{ backgroundImage: `url(${data?.banner_image})` }"
			>
				<h1 class="article-1__h article-1__h--1">
					{{ data?.banner_title }}
				</h1>
				<h2 class="article-1__h article-1__h--2">
					{{ data?.banner_subtitle }}
				</h2>
			</article>

			<article class="guarantee">
				<div
					class="guide__text_warranty"
					v-html="data?.text_block"
				></div>

				<h3 class="guarantee__h">
					{{ i18n.pages.guarantee.conditions?.[langStore.activeLang] }}
				</h3>
				<div class="guarantee__text">
					<ul v-if="!isMobile">
						<li
							v-for="text in data?.guarantee_clauses"
							v-html="text.value.title"
							:key="text.id"
						></li>
					</ul>
					<ul
						class="guarantee-accordion"
						v-else
					>
						<li
							v-for="(text, idx) in data?.guarantee_clauses"
							:key="text.id"
							:class="{ 'accordion--active': openIndexes.includes(idx) }"
						>
							<div
								class="accordion__heading dropdown-icon--outer"
								@click="toggleAccordion(idx)"
							>
								<span v-html="getAccordionTitle(text.value.title)"></span>
								<Dropdown />
							</div>
							<div
								class="accordion__dropdown"
								v-show="openIndexes.includes(idx)"
							>
								<div v-html="getAccordionBody(text.value.title)"></div>
							</div>
						</li>
					</ul>
				</div>
			</article>

			<div class="pdf-container">
				<iframe
					:src="isAndroid ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` : pdfUrl"
					class="pdf-frame"
				/>
				<div class="pdf-actions">
					<a
						:href="'/warranty.pdf.p7s'"
						download
						class="btn btn--orange"
					>
						Завантажити підписаний файл
					</a>
					<a
						href="https://czo.gov.ua/verify"
						target="_blank"
						rel="noopener"
						class="btn btn--orange"
					>
						Перевірити підпис
					</a>
				</div>
			</div>

			<div
				class="guide__text_warranty waranrty-padding"
				v-html="data?.archive_block_text"
			>
			</div>

			<article v-if="data?.guarantee_versions?.length" class="guarantee-archive">
				<div class="guarantee-archive__header dropdown-icon--outer" @click="toggleArchive">
					<span class="guarantee-archive__header-text">
						<h3 class="guarantee__h">Архів гарантійних політик</h3>
						<Dropdown :class="{ 'dropdown-icon--active': isArchiveOpen }" />
					</span>
				</div>
				<div class="guarantee-archive__content" v-show="isArchiveOpen">
					<ul class="guarantee-archive__list">
						<li
							v-for="version in data.guarantee_versions"
							:key="version.id"
							class="guarantee-archive__item"
						>
							<span class="guarantee-archive__link">
								<a
									:href="version.value.document.url"
									target="_blank"
									rel="noopener"
									class="archive-text-link"
									title="Відкрити у новому вікні"
								>
									Гарантійна Політика {{ version.value.title }}
								</a>
								<DownloadIcon class="download-icon" @click.prevent="downloadFile(version.value.document.url)" />
							</span>
						</li>
					</ul>
				</div>
			</article>

			<article
				class="guide"
				v-if="models"
			>
				<h3 class="guide__h">
					{{ i18n.pages.guarantee.userGuide?.[langStore.activeLang] }}
				</h3>
				<div class="guide__models">
					<a
						class="model"
						v-for="model in data?.auto_cards"
						:key="model.id"
						href="#"
						@click.prevent="openPdf(model.value.document.url)"
					>
						<img
							class="model__image"
							:src="model.value.image.url"
						/>
						<div class="model__name">{{ model.value.title }}</div>
						<div class="model__learn">{{ data.learn_more_button_text }}</div>
					</a>
				</div>
			</article>
		</template>
	</TransitionGroup>
</template>

<script setup>
import Logo from "@/components/icons/logo.vue";
import API from "@/composables/API";
import { useLangStore } from "@/stores/lang";
import { useLoaderStore } from "@/stores/loader";
import { computed, onMounted, ref, watch } from "vue";
import Dropdown from '@/components/icons/dropdown.vue';
import DownloadIcon from '@/components/icons/download.vue';

let models = ref([]),
  data = ref({})

let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

watch(() => langStore.activeLang, async () => {
  data.value = await API.GuaranteePage.get();
  models.value = (await API.Models.get()).car_models;
})

const showPdf = ref(false)
const pdfUrl = ref("https://zeekr.com.ua/garantee.pdf");

const isAndroid = computed(() => /android/i.test(navigator.userAgent));

function openPdf(url) {
  pdfUrl.value = url;
  showPdf.value = true;
}

const openIndexes = ref([]);
const isMobile = ref(false);
const isArchiveOpen = ref(false);

function toggleAccordion(idx) {
  if (openIndexes.value.includes(idx)) {
    openIndexes.value = openIndexes.value.filter(i => i !== idx);
  } else {
    openIndexes.value.push(idx);
  }
}

function toggleArchive() {
  isArchiveOpen.value = !isArchiveOpen.value;
}

async function downloadFile(url) {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit' 
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = getFileNameFromUrl(url); 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Error downloading file:', err);
  }
}

function getFileNameFromUrl(url) {
  return decodeURIComponent(url.split('/').pop().split('?')[0]);
}


onMounted(async () => {
  useLoaderStore().isLoading = true
  data.value = await API.GuaranteePage.get();
  models.value = (await API.Models.get()).car_models;
  useLoaderStore().isLoading = false
});

onMounted(() => {
  isMobile.value = window.innerWidth <= 876;
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 876;
  });
});

function getAccordionTitle(html) {
  const match = html.match(/<p[^>]*>.*?<\/p>/);
  return match ? match[0] : html;
}
function getAccordionBody(html) {
  return html.replace(/<p[^>]*>.*?<\/p>/, "");
}
</script>

<style lang="scss" scoped>


.guide__text_warranty {
  font-size: 28px;
  line-height: 1.25;
  text-align: center;
}

.guide {
  margin: 60px 76px;

  &__text {
    font-size: 28px;
    line-height: 1.25;
    text-align: center;
    margin-bottom: 60px;
  }

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
    text-align: center;
    margin-bottom: 24px;
  }

  &__models {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 40px 20px;
  }

  .model {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc((100% - (20px * 3)) / 4);

    &:hover {
      .model__learn {
        text-decoration: underline;
      }
    }

    &__image {
      width: 100%;
      aspect-ratio: 307/173;
      object-fit: contain;
    }

    &__name {
      font-family: Tenor Sans;
      font-size: 28px;
      line-height: 1.2;
      text-align: center;
    }

    &__learn {
      margin-top: 8px;
      font-size: 16px;
      line-height: 1.15;
      color: #69514B;
    }
  }
}



.article-1-guarantee {
  width: 100dvw;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-size: cover;
  background-position: center;
}
.pdf-frame {
  width: calc(100% - 152px);
  height: 80vh;
  border: none;
  background: #fff;
  margin: 30px 76px;
}

.pdf-actions {
  display: flex;
  gap: 16px;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}

@media screen and (min-width: 877px) {
  .article-1-guarantee {
    height: 300px;
  }
}

@media screen and (max-width: 876px) {

  .guide {
    margin: 50px 16px;

    &__text {
      font-size: 18px;
    }


    &__h {
      margin-top: 5px;
      margin-bottom: 16px;
      font-size: 36px;
    }

    &__models {
      gap: 20px 15px;
    }

    .model {
      width: calc((100% - 15px) / 2);

      &__image {
        aspect-ratio: 165/83;
      }

      &__name {
        font-size: 20px;
      }

      &__learn {
        font-size: 14px;
      }
    }
  }

  .guarantee {
    margin: 50px 16px;

    &__h {
      font-size: 36px;
      text-align: center;
    }

    &__text {
      columns: 1 !important;
    }
  }
  .guarantee__text {
    columns: 1 !important;
    ul{
      gap: 0 !important;
    }
  }


  .pdf-frame{
    margin: 10px 16px;
    width: calc(100% - 32px);
  }

.pdf-actions {
  display: flex;
  gap: 16px;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}

  .guarantee-accordion {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      border-bottom: 1px solid #eee;
      margin: 0;
      padding: 0px;
      &.accordion--active .dropdown-icon {
        transform: rotate(180deg);
      }
    }
    .accordion__heading {
      cursor: pointer;
      padding: 8px 0;

      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;

    }
    .dropdown-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url('data:image/svg+xml;utf8,<svg ...>') center/contain no-repeat;
      transition: transform 0.2s;
    }
    .accordion__dropdown {
      padding: 4px 0 8px 0;

      font-size: 15px;
      color: #444;

    }
  }
  .guarantee-accordion .accordion__heading {
    min-height: 48px;
    // height: 48px;
    font-size: 18px;
    align-items: center;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
  }

.guarantee-accordion .accordion__heading span {
  display: block;
  flex: 1 1 auto;
  vertical-align: middle;
  line-height: 1.2;
  max-width: 95%;
}

.guarantee-accordion .dropdown-icon--outer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}
}

.guarantee-accordion ul li {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
.guarantee-accordion .accordion__dropdown p {
  margin: 0 !important;
}

.guarantee__text .guarantee-accordion ul li {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.guarantee-archive {
  margin: 60px 76px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    transition: color 0.2s;

    &:hover {
      color: #ff6600;
    }

    .guarantee__h {
      margin: 0;
      cursor: pointer;
      font-size: 24px;
      text-align: left;
    }
  }

  &__content {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 12px;
  }

  &__link {
    text-decoration: underline;
    cursor: pointer;
    font-size: 16px;
    color: #69514B;
    transition: color 0.2s;

    &:hover {
      // color: #ff6600;
      text-decoration: underline;
    }
  }
}

.guarantee-archive__content,
.guarantee-archive__list {
  text-align: left;
  display: block;
}
.guarantee-archive__list {
  margin-left: 0;
}
.guarantee-archive__item {
  text-align: left;
}
.guarantee-archive__link {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}
.archive-text-link {
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
}
.download-icon-link {
  display: flex;
  align-items: center;
  margin-left: 6px;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.download-icon:hover {
  color: #ff6600;
}
.download-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

@media screen and (max-width: 876px) {
  .guarantee-archive {
    margin: 20px 16px;

    &__header {
      .guarantee__h {
        font-size: 20px;
        text-align: left;
      }
    }

    &__link {
      font-size: 14px;
    }
  }

  .guide__text_warranty.waranrty-padding {
    font-size: 14px;
    line-height: 1.3;
  }
}

.waranrty-padding {
  padding: 10px;
}

.guarantee-archive__header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s;

  .guarantee-archive__header-text {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .guarantee__h {
    margin: 0;
    cursor: pointer;
    font-size: 24px;
    text-align: left;
  }
}

</style>
