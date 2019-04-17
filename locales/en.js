/*
TRANSLATION GUIDE: TODO:

Translated by: Original
*/

export default {
  appname: 'MoneyFlow',

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
    user: {
      guest: 'Guest',
    },
    book_editing: {
      new_book: 'New Book',
      enter_book_name: 'Enter book\'s name',
      default_book_name: 'Untitled Book',
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
