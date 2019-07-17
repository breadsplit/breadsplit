import md5 from 'blueimp-md5'
import Avatars from '@dicebear/avatars'
import JdenticonAvatars from '@dicebear/avatars-jdenticon-sprites'
import Svg2DataUrl from 'svg-to-dataurl'
import { Member } from '~/types'

export const adorable = (hash: string, size = 200) => `https://api.adorable.io/avatars/${size}/${hash}.png`
export const gravatar = (hash: string, size = 200) => `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`
export const dicebear = (hash: string, size = 200) => `https://avatars.dicebear.com/v2/gridy/${hash}.svg`

export const dicebearOffline = (hash: string, dark?: boolean) => {
  const avatars = new Avatars(JdenticonAvatars({ padding: 0.1, background: dark ? '#555' : '#eeeeee' }))
  return Svg2DataUrl(avatars.create(hash))
}

export const avatarProvider = dicebearOffline

export function GetMemberAvatarUrl (member: Member, dark?: boolean) {
  const key = (member.uid || '').trim().toLowerCase()
  const hash = md5(key).toString()
  return avatarProvider(hash, dark)
}
