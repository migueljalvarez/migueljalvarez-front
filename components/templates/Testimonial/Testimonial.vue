<script lang="ts" setup>
  import type { Testimonial } from '~/types/common'
  import { Carousel, Section } from '~/components/organisms'
  import { AvatarCard, Blockquote, Card } from '~/components/molecules'

  defineProps<{ testimonials: Testimonial[] }>()
</script>
<template>
  <Section id="testimonial" background-image="/testimonial-bg.webp" class="flex max-h-auto">
    <Carousel show-arrow :items="testimonials" title="Ellos han trabajado conmigo">
      <template #card="{ item }">
        <Card v-if="item">
          <div class="w-full py-4 md:p-8 max-w-[600px] my-5 mx-auto lg:mx-8">
            <Blockquote :text="item.testimonial" />
            <div class="flex flex-col items-center gap-2 px-4 pt-4 md:flex-row">
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
