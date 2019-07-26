import MaterialColors from 'vuetify/lib/util/colors'

const mains: (keyof typeof MaterialColors)[] = [
  'red',
  'pink',
  'purple',
  'deepPurple',
  'indigo',
  'blue',
  'lightBlue',
  'cyan',
  'teal',
  'green',
  'lightGreen',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deepOrange',
  'brown',
  'blueGrey',
  'grey',
]

const variations = [
  // 'lighten5',
  // 'lighten4',
  // 'lighten3',
  'lighten2',
  'lighten1',
  'base',
  'darken1',
  'darken2',
  'darken3',
  'darken4',
]

export const BaseIndex = 2

const colors: string[][] = mains
  .map(name => variations
    .map(v => MaterialColors[name][v])
  )

export default colors
