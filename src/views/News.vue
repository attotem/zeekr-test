<template>
  <div class="news">
    <div class="news__h">news</div>

    <div class="items">
      <div
        class="item"
        v-for="item in 6"
      >
        <img
          class="item__image"
          src="@/assets/img/home1.jpg"
        />
        <div class="item__date">12.11.2024</div>
        <div class="item__text">Item</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.news {
  padding: 114px 76px 80px;
  background-color: #F6F6F6;

  &__h {
    font-family: Tenor Sans;
    font-size: 56px;
    line-height: 1.15;
  }

  .items {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px 20px;

    .item {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &__image {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
      }

      &__date {
        margin-bottom: 4px;
        font-size: 16px;
        line-height: 1.25;
      }

      &__text {
        font-weight: 500;
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        transition: .3s ease-in-out;
      }

      &:hover .item__text {
        color: #69514B;
        text-decoration: underline;
      }
    }
  }
}

@media screen and (max-width: 876px) {
  .news {
    padding: 96px 16px 50px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__h {
      font-size: 42px;
    }

    .items {
      grid-template-columns: 1fr;
      gap: 24px;

      .item {
        gap: 8px;

        &__date {
          font-size: 14px;
        }

        &__text {
          font-size: 16px;
        }
      }
    }
  }
}
</style>