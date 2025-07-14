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
					<ul class="guarantee-accordion" v-else>
						<li
							v-for="(text, idx) in data?.guarantee_clauses"
							:key="text.id"
							:class="{ 'accordion--active': openIndexes.includes(idx) }"
						>
							<div class="accordion__heading dropdown-icon--outer" @click="toggleAccordion(idx)">
								<span v-html="getAccordionTitle(text.value.title)"></span>
								<Dropdown :class="{ 'dropdown-icon--active': openIndexes.includes(idx) }" />
							</div>
							<div class="accordion__dropdown" v-show="openIndexes.includes(idx)">
								<div v-html="getAccordionBody(text.value.title)"></div>
							</div>
						</li>
					</ul>
				</div>
			</article>

      <div class="pdf-container">
        <iframe :src="pdfUrl" class="pdf-frame" />
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

			<article
				class="guide"
				v-if="models"
			>
				<div
					class="guide__text"
					v-html="data?.text_block"
				></div>
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
import { computed, onMounted, ref } from "vue";
import Dropdown from '@/components/icons/dropdown.vue';

let models = ref([]),
  data = ref({})

let langStore = useLangStore()
let isLoading = computed(() => useLoaderStore().isLoading)

const showPdf = ref(false)
const pdfUrl = ref("/garantee.pdf");

function openPdf(url) {
  pdfUrl.value = url;
  showPdf.value = true;
}

const openIndexes = ref([]);
const isMobile = ref(false);

function toggleAccordion(idx) {
  if (openIndexes.value.includes(idx)) {
    openIndexes.value = openIndexes.value.filter(i => i !== idx);
  } else {
    openIndexes.value.push(idx);
  }
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
    // 20px here for parent h-gap
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
      span {
        margin: -16px 0
       
      }
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
      div{
        margin: -16px 0;
      }
    }
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


</style>
