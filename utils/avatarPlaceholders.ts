import Avatars from '@dicebear/avatars'
import GridyAvatars from '@dicebear/avatars-gridy-sprites'
import Svg2DataUrl from 'svg-to-dataurl'

export const adorable = (hash: string, size = 200) => `https://api.adorable.io/avatars/${size}/${hash}.png`
export const gravatar = (hash: string, size = 200) => `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`
export const dicebear = (hash: string, size = 200) => `https://avatars.dicebear.com/v2/gridy/${hash}.svg`

export const dicebearOffline = (hash: string) => {
  const avatars = new Avatars(GridyAvatars({ colorful: true }))
  return Svg2DataUrl(avatars.create(hash))
}

export default dicebearOffline
