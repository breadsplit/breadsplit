export const adorable = (hash: string, size = 200) => `https://api.adorable.io/avatars/${size}/${hash}.png`
export const gravatar = (hash: string, size = 200) => `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`
export const dicebear = (hash: string, size = 200) => `https://avatars.dicebear.com/v2/gridy/${hash}.svg`

export default dicebear
