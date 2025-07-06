import { ref, onMounted } from 'vue'
import type { SocialMediaType } from '~/types/common/index'

const socials = ref<(SocialMediaType & { isHovered: boolean })[] | null>(null)

export const useSocialMedia = () => {
  const loadSocials = async () => {
    if (!socials.value) {
      const data = await $fetch<SocialMediaType[]>('/api/socialMedia')
      socials.value = data.map(item => ({
        ...item,
        isHovered: false
      }))
    }
  }

  onMounted(() => {
    loadSocials()
  })

  return { socials, loadSocials }
}
