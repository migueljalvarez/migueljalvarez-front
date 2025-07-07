import type { SocialMediaType } from '~/types/common'
import type { AvatarProps } from '../atoms/atom'

export type AvatarCardProps = AvatarProps & {
  subTitle: string
  type: string
  socialMedia: SocialMediaType[]
}
