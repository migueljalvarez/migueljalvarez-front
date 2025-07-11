<script lang="ts" setup>
  import type { Testimonial } from '~/types/common'
  import { Carousel, Section } from '~/components/organisms'
  import { AvatarCard, Blockquote, Card } from '~/components/molecules'

  defineProps<{ testimonials: Testimonial[] }>()
</script>
<template>
  <Section id="testimonial" background-image="/testimonial-bg.webp" class="flex min-h-[400px]">
    <Carousel show-arrow :items="testimonials" title="Ellos Confian en Mi">
      <template #card="{ item }">
        <Card v-if="item">
          <div class="w-full py-4 md:p-8 max-w-[600px] my-5 mx-auto lg:mx-8">
            <Blockquote :text="item.description" />
            <div class="flex flex-col gap-2 px-4 pt-4 md:flex-row">
              <AvatarCard
                :image="item.image"
                :name="item.name"
                :social-media="item.socialMedia"
                :sub-title="item.position"
                :type="item.type"
              />
            </div>
          </div>
        </Card>
      </template>
    </Carousel>
  </Section>
</template>

<style></style>
