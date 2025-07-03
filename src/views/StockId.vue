<template>
  <div class="back">
    <Back />
    Назад
  </div>

  <div class="page">
    <main class="main">
      <Slider :slider-type="1">
        <!--
        <article
          class="slide"
          v-for="slide in sliderData.media_content"
          :style="{ backgroundImage: `url(${slide.value.image_url || slide.value.video_url})` }"
        >
          <div class="article-1__h article-1__h--1">
            {{ sliderData.banner_title }}
          </div>
          <div class="article-1__h article-1__h--2">
            {{ sliderData.banner_subtitle }}
          </div>
        </article>
        -->
      </Slider>

      <div class="main__h">Zeekr 001</div>
      <div class="main__underh">Новий автомобіль</div>
      <div class="block characteristics">
        <div class="block__h">Базові характеристики</div>
        <div class="characteristics__inner">
          <div
            class="characteristic"
            v-for="char in 6"
          >
            {{ char }}
          </div>
        </div>
      </div>

      <div class="main__divider"></div>

      <div class="block">
        <div class="block__h">Description</div>
        <div class="block__text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
          <br /><br />
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
          <br /><br />
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
        </div>
      </div>

      <div class="main__divider"></div>

      <div class="block">
        <div class="block__h">Technical characteristics</div>
        <div class="techs">
          <div
            class="tech"
            v-for="tech in 10"
          >
            {{ tech }}
            <div class="tech__divider"></div>
            {{ tech }}
          </div>
        </div>
        <a
          class="show"
          target="_blank"
        >Show all characteristics</a>
      </div>
    </main>

    <aside class="aside">
      <div class="block">
        <img
          class="block__img"
          src=""
        />
        <div class="block__overlay">
          <Video />
          Video review
        </div>
      </div>

      <div class="block">
        <img
          class="block__img"
          src=""
        />
        <div class="block__overlay">
          <Video />
          Interior
        </div>
      </div>

      <div class="block">
        <div class="block__price">
          1 904 364 UAH
          <div class="block__price--additional">45 800$</div>
        </div>

        <div class="block__divider"></div>

        <div class="block__h">Zeekr центр Поділ (Київ)</div>

        <div class="block__text">
          <div>
            <Phone />
            +38 (067)-619-87-66
          </div>
          <div>
            вул. Набережно-лугова 4, Київ, 02000
          </div>
          <div>
            Складський номер: 0445
          </div>
        </div>

        <div class="btn btn--orange">
          Contact with dealer
          <Phone />
        </div>
      </div>
    </aside>

    <div
      class="article-2 recommend"
      v-if="false"
    >
      <div class="article-2__h">You may also be interested in</div>
      <Slider
        :slider-type="2"
        :count="models?.length"
      >
        <article
          class="slide"
          v-for="article in models"
          :key="article.id"
        >
          <img
            class="slide__image"
            :src="article.image"
          />
          <div class="slide__name">Zeekr 001</div>
          <div class="slide__price">
            1 904 365 UAH
            <div class="slide__price--additional">45 800 $</div>
          </div>
        </article>
      </Slider>
    </div>
  </div>

  <!--
  TODO add modal for images
  -->
</template>

<script setup>
import Back from '@/components/icons/back.vue';
import Phone from '@/components/icons/phone.vue';
import Video from '@/components/icons/video.vue';
import Modal from '@/components/Modal.vue';
import Slider from '@/components/Slider.vue';

</script>

<style lang="scss" scoped></style>