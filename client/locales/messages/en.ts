/*
TRANSLATION GUIDE: TODO:

Translated by: Original
*/

export default {
  appname: 'Splitoast',

  css: {
    /* The font names of this locale, separated by comma. */
    /* English fonts will be warpped automatically */
    font_of_locale: '',

    /* Keep this empty unless you want to override the whole font-family setting */
    /* When it's set, the 'font-locale' option will be ignored. */
    font_family: '',
  },

  ui: {
    language: 'Language',
    settings: 'Settings',
    sign_in: 'Sign in',
    about: 'About',
    advance: 'Advance',
    homepage: 'Homepage',

    button_new_group: 'Create A New Group',
    button_new_member: 'Add member',

    user: {
      guest: 'Guest',
    },
    group_editing: {
      new_group: 'New Group',
      enter_group_name: 'Enter group\'s name',
      default_group_name: 'Untitled Group',
    },
    tabs: {
      settle_up: 'Settle Up',
      expenses: 'Expenses',
      members: 'Members',
      summary: 'Summary',
      activities: 'Activities',
    },
    speed_dials: {
      new_expense: 'New Expense',
      new_member: 'New Member',
      settle_up: 'Settle up',
    },
  },

  prompt: {
    are_you_sure: 'Are you sure?',
  },

  /* Categories */
  cats: {
    transport: {
      display: 'Transport',
      /* This field is used for CategorySense */
      /* Do not translate this field. Instead, put the locale keywords of this category */
      keywords: 'uber,grab,transport,mrt,lrt,bus,taxi,ship,airplane,flight,car',
    },
    lodging: {
      display: 'Lodging',
      keywords: 'hotel',
    },
    travel: {
      display: 'Travel',
    },
    food: {
      display: 'Food',
      keywords: 'food,drink,meal,breakfast,lunch,dinner',
    },
    transfer: {
      display: 'Transfer',
    },
    other: {
      display: 'Other',
    },
  },
}
