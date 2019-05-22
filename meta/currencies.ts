import union from 'lodash/union'
export interface Currency {
  cc: string
  symbol: string
  name: string
  locale?: string | string[]
}

export const currencies: Currency[] = [
  { cc: 'AED', symbol: 'د.إ;', name: 'UAE dirham', locale: 'ar-AE' },
  { cc: 'AFN', symbol: 'Afs', name: 'Afghan afghani', locale: 'ps-AF' },
  { cc: 'ALL', symbol: 'L', name: 'Albanian lek', locale: 'sq-AL' },
  { cc: 'AMD', symbol: 'AMD', name: 'Armenian dram', locale: 'hy-AM' },
  { cc: 'ANG', symbol: 'NAƒ', name: 'Netherlands Antillean gulden', locale: 'nl-CW' },
  { cc: 'AOA', symbol: 'Kz', name: 'Angolan kwanza', locale: 'ln-AO' },
  { cc: 'ARS', symbol: '$', name: 'Argentine peso', locale: 'es-AR' },
  { cc: 'AUD', symbol: '$', name: 'Australian dollar', locale: 'en-AU' },
  { cc: 'AWG', symbol: 'ƒ', name: 'Aruban florin', locale: 'nl-AW' },
  { cc: 'AZN', symbol: 'AZN', name: 'Azerbaijani manat', locale: 'az-AZ' },
  { cc: 'BAM', symbol: 'KM', name: 'Bosnia and Herzegovina konvertibilna marka', locale: 'bs-BA' },
  { cc: 'BBD', symbol: 'Bds$', name: 'Barbadian dollar', locale: 'en-BB' },
  { cc: 'BDT', symbol: '৳', name: 'Bangladeshi taka', locale: 'bn-BD' },
  { cc: 'BGN', symbol: 'BGN', name: 'Bulgarian lev', locale: 'bg-BG' },
  { cc: 'BHD', symbol: '.د.ب', name: 'Bahraini dinar', locale: 'ar-BH' },
  { cc: 'BIF', symbol: 'FBu', name: 'Burundi franc', locale: 'rn-BI' },
  { cc: 'BMD', symbol: 'BD$', name: 'Bermudian dollar', locale: 'en-BM' },
  { cc: 'BND', symbol: 'B$', name: 'Brunei dollar', locale: 'ms-BN' },
  { cc: 'BOB', symbol: 'Bs.', name: 'Bolivian boliviano', locale: 'es-BO' },
  { cc: 'BRL', symbol: 'R$', name: 'Brazilian real', locale: 'pt-BR' },
  { cc: 'BSD', symbol: 'B$', name: 'Bahamian dollar', locale: 'en-BS' },
  { cc: 'BTN', symbol: 'Nu.', name: 'Bhutanese ngultrum', locale: 'dz-BT' },
  { cc: 'BWP', symbol: 'P', name: 'Botswana pula', locale: 'en-BW' },
  { cc: 'BYR', symbol: 'Br', name: 'Belarusian ruble', locale: 'ru-BY' },
  { cc: 'BZD', symbol: 'BZ$', name: 'Belize dollar', locale: 'en-BZ' },
  { cc: 'CAD', symbol: '$', name: 'Canadian dollar', locale: 'fr-CA' },
  { cc: 'CDF', symbol: 'F', name: 'Congolese franc', locale: 'lu-CD' },
  { cc: 'CHF', symbol: 'Fr.', name: 'Swiss franc', locale: 'rm-CH' },
  { cc: 'CLP', symbol: '$', name: 'Chilean peso', locale: 'es-CL' },
  { cc: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { cc: 'COP', symbol: 'Col$', name: 'Colombian peso', locale: 'es-CO' },
  { cc: 'CRC', symbol: '₡', name: 'Costa Rican colon', locale: 'es-CR' },
  { cc: 'CUC', symbol: '$', name: 'Cuban peso' },
  { cc: 'CVE', symbol: 'Esc', name: 'Cape Verdean escudo', locale: 'pt-CV' },
  { cc: 'CZK', symbol: 'Kč', name: 'Czech koruna', locale: 'en-CZ' },
  { cc: 'DJF', symbol: 'Fdj', name: 'Djiboutian franc', locale: 'ar-DJ' },
  { cc: 'DKK', symbol: 'Kr', name: 'Danish krone', locale: 'da-DK' },
  { cc: 'DOP', symbol: 'RD$', name: 'Dominican peso', locale: 'es-DO' },
  { cc: 'DZD', symbol: 'د.ج', name: 'Algerian dinar', locale: 'kab-DZ' },
  { cc: 'EEK', symbol: 'KR', name: 'Estonian kroon' },
  { cc: 'EGP', symbol: '£', name: 'Egyptian pound', locale: 'ar-EG' },
  { cc: 'ERN', symbol: 'Nfa', name: 'Eritrean nakfa', locale: 'ar-ER' },
  { cc: 'ETB', symbol: 'Br', name: 'Ethiopian birr', locale: 'om-ET' },
  { cc: 'EUR', symbol: '€', name: 'European Euro', locale: 'en-DE' },
  { cc: 'FJD', symbol: 'FJ$', name: 'Fijian dollar', locale: 'en-FJ' },
  { cc: 'FKP', symbol: '£', name: 'Falkland Islands pound', locale: 'en-FK' },
  { cc: 'GBP', symbol: '£', name: 'British pound', locale: 'en-GB' },
  { cc: 'GEL', symbol: 'GEL', name: 'Georgian lari', locale: 'ka-GE' },
  { cc: 'GHS', symbol: 'GH₵', name: 'Ghanaian cedi', locale: 'ak-GH' },
  { cc: 'GIP', symbol: '£', name: 'Gibraltar pound', locale: 'en-GI' },
  { cc: 'GMD', symbol: 'D', name: 'Gambian dalasi', locale: 'en-GM' },
  { cc: 'GNF', symbol: 'FG', name: 'Guinean franc', locale: 'fr-GN' },
  { cc: 'GQE', symbol: 'CFA', name: 'Central African CFA franc' },
  { cc: 'GTQ', symbol: 'Q', name: 'Guatemalan quetzal', locale: 'es-GT' },
  { cc: 'GYD', symbol: 'GY$', name: 'Guyanese dollar', locale: 'en-GY' },
  { cc: 'HKD', symbol: 'HK$', name: 'Hong Kong dollar', locale: 'zh-HK' },
  { cc: 'HNL', symbol: 'L', name: 'Honduran lempira', locale: 'es-HN' },
  { cc: 'HRK', symbol: 'kn', name: 'Croatian kuna', locale: 'hr-HR' },
  { cc: 'HTG', symbol: 'G', name: 'Haitian gourde', locale: 'fr-HT' },
  { cc: 'HUF', symbol: 'Ft', name: 'Hungarian forint', locale: 'en-HU' },
  { cc: 'IDR', symbol: 'Rp', name: 'Indonesian rupiah', locale: 'id-ID' },
  { cc: 'ILS', symbol: '₪', name: 'Israeli new sheqel', locale: 'ar-IL' },
  { cc: 'INR', symbol: '₹', name: 'Indian rupee', locale: 'kok-IN' },
  { cc: 'IQD', symbol: 'د.ع', name: 'Iraqi dinar', locale: 'ar-IQ' },
  { cc: 'IRR', symbol: 'IRR', name: 'Iranian rial', locale: 'fa-IR' },
  { cc: 'ISK', symbol: 'kr', name: 'Icelandic króna', locale: 'en-IS' },
  { cc: 'JMD', symbol: 'J$', name: 'Jamaican dollar', locale: 'en-JM' },
  { cc: 'JOD', symbol: 'JOD', name: 'Jordanian dinar', locale: 'ar-JO' },
  { cc: 'JPY', symbol: '¥', name: 'Japanese yen', locale: 'ja' },
  { cc: 'KES', symbol: 'KSh', name: 'Kenyan shilling', locale: 'saq-KE' },
  { cc: 'KGS', symbol: 'сом', name: 'Kyrgyzstani som', locale: 'ru-KG' },
  { cc: 'KHR', symbol: '៛', name: 'Cambodian riel', locale: 'km-KH' },
  { cc: 'KMF', symbol: 'KMF', name: 'Comorian franc', locale: 'ar-KM' },
  { cc: 'KPW', symbol: 'W', name: 'North Korean won', locale: 'ko-KP' },
  { cc: 'KRW', symbol: 'W', name: 'South Korean won', locale: 'ko-KR' },
  { cc: 'KWD', symbol: 'KWD', name: 'Kuwaiti dinar', locale: 'ar-KW' },
  { cc: 'KYD', symbol: 'KY$', name: 'Cayman Islands dollar', locale: 'en-KY' },
  { cc: 'KZT', symbol: 'T', name: 'Kazakhstani tenge', locale: 'kk-KZ' },
  { cc: 'LAK', symbol: 'KN', name: 'Lao kip', locale: 'lo-LA' },
  { cc: 'LBP', symbol: '£', name: 'Lebanese lira', locale: 'ar-LB' },
  { cc: 'LKR', symbol: 'Rs', name: 'Sri Lankan rupee', locale: 'ta-LK' },
  { cc: 'LRD', symbol: 'L$', name: 'Liberian dollar', locale: 'vai-LR' },
  { cc: 'LSL', symbol: 'M', name: 'Lesotho loti', locale: 'en-LS' },
  { cc: 'LTL', symbol: 'Lt', name: 'Lithuanian litas', locale: 'en-LT' },
  { cc: 'LVL', symbol: 'Ls', name: 'Latvian lats', locale: 'en-LV' },
  { cc: 'LYD', symbol: 'LD', name: 'Libyan dinar', locale: 'ar-LY' },
  { cc: 'MAD', symbol: 'MAD', name: 'Moroccan dirham', locale: 'ar-MA' },
  { cc: 'MDL', symbol: 'MDL', name: 'Moldovan leu', locale: 'ru-MD' },
  { cc: 'MGA', symbol: 'FMG', name: 'Malagasy ariary', locale: 'mg-MG' },
  { cc: 'MKD', symbol: 'MKD', name: 'Macedonian denar', locale: 'sq-MK' },
  { cc: 'MMK', symbol: 'K', name: 'Myanma kyat', locale: 'my-MM' },
  { cc: 'MNT', symbol: '₮', name: 'Mongolian tugrik', locale: 'mn-MN' },
  { cc: 'MOP', symbol: 'P', name: 'Macanese pataca', locale: 'zh-MO' },
  { cc: 'MRO', symbol: 'UM', name: 'Mauritanian ouguiya', locale: 'ar-MR' },
  { cc: 'MUR', symbol: 'Rs', name: 'Mauritian rupee', locale: 'en-MU' },
  { cc: 'MVR', symbol: 'Rf', name: 'Maldivian rufiyaa' },
  { cc: 'MWK', symbol: 'MK', name: 'Malawian kwacha', locale: 'en-MW' },
  { cc: 'MXN', symbol: '$', name: 'Mexican peso', locale: 'es-MX' },
  { cc: 'MYR', symbol: 'RM', name: 'Malaysian ringgit', locale: 'ms-MY' },
  { cc: 'MZM', symbol: 'MTn', name: 'Mozambican metical' },
  { cc: 'NAD', symbol: 'N$', name: 'Namibian dollar', locale: 'naq-NA' },
  { cc: 'NGN', symbol: '₦', name: 'Nigerian naira', locale: 'ha-NG' },
  { cc: 'NIO', symbol: 'C$', name: 'Nicaraguan córdoba', locale: 'es-NI' },
  { cc: 'NOK', symbol: 'kr', name: 'Norwegian krone', locale: 'nn-NO' },
  { cc: 'NPR', symbol: 'NRs', name: 'Nepalese rupee', locale: 'ne-NP' },
  { cc: 'NZD', symbol: 'NZ$', name: 'New Zealand dollar', locale: 'en-NZ' },
  { cc: 'OMR', symbol: 'OMR', name: 'Omani rial', locale: 'ar-OM' },
  { cc: 'PAB', symbol: 'B./', name: 'Panamanian balboa', locale: 'es-PA' },
  { cc: 'PEN', symbol: 'S/.', name: 'Peruvian nuevo sol', locale: 'es-PE' },
  { cc: 'PGK', symbol: 'K', name: 'Papua New Guinean kina', locale: 'en-PG' },
  { cc: 'PHP', symbol: '₱', name: 'Philippine peso', locale: 'es-PH' },
  { cc: 'PKR', symbol: 'Rs.', name: 'Pakistani rupee', locale: 'pa-PK' },
  { cc: 'PLN', symbol: 'zł', name: 'Polish zloty', locale: 'en-PL' },
  { cc: 'PYG', symbol: '₲', name: 'Paraguayan guarani', locale: 'es-PY' },
  { cc: 'QAR', symbol: 'QR', name: 'Qatari riyal', locale: 'ar-QA' },
  { cc: 'RON', symbol: 'L', name: 'Romanian leu', locale: 'en-RO' },
  { cc: 'RSD', symbol: 'din.', name: 'Serbian dinar', locale: 'sr-RS' },
  { cc: 'RUB', symbol: 'R', name: 'Russian ruble', locale: 'ru-RU' },
  { cc: 'SAR', symbol: 'SR', name: 'Saudi riyal', locale: 'ar-SA' },
  { cc: 'SBD', symbol: 'SI$', name: 'Solomon Islands dollar', locale: 'en-SB' },
  { cc: 'SCR', symbol: 'SR', name: 'Seychellois rupee', locale: 'en-SC' },
  { cc: 'SDG', symbol: 'SDG', name: 'Sudanese pound', locale: 'ar-SD' },
  { cc: 'SEK', symbol: 'kr', name: 'Swedish krona', locale: 'sv-SE' },
  { cc: 'SGD', symbol: 'S$', name: 'Singapore dollar', locale: 'ms-SG' },
  { cc: 'SHP', symbol: '£', name: 'Saint Helena pound', locale: 'en-SH' },
  { cc: 'SLL', symbol: 'Le', name: 'Sierra Leonean leone', locale: 'en-SL' },
  { cc: 'SOS', symbol: 'Sh.', name: 'Somali shilling', locale: 'ar-SO' },
  { cc: 'SRD', symbol: '$', name: 'Surinamese dollar', locale: 'nl-SR' },
  { cc: 'SYP', symbol: 'LS', name: 'Syrian pound', locale: 'ar-SY' },
  { cc: 'SZL', symbol: 'E', name: 'Swazi lilangeni', locale: 'en-SZ' },
  { cc: 'THB', symbol: '฿', name: 'Thai baht', locale: 'th-TH' },
  { cc: 'TJS', symbol: 'TJS', name: 'Tajikistani somoni', locale: 'tg-TJ' },
  { cc: 'TMT', symbol: 'm', name: 'Turkmen manat', locale: 'tk-TM' },
  { cc: 'TND', symbol: 'DT', name: 'Tunisian dinar', locale: 'ar-TN' },
  { cc: 'TRY', symbol: 'TRY', name: 'Turkish new lira', locale: 'tr-TR' },
  { cc: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago dollar', locale: 'en-TT' },
  { cc: 'TWD', symbol: 'NT$', name: 'New Taiwan dollar', locale: 'zh-TW' },
  { cc: 'TZS', symbol: 'TZS', name: 'Tanzanian shilling', locale: 'sw-TZ' },
  { cc: 'UAH', symbol: 'UAH', name: 'Ukrainian hryvnia', locale: 'ru-UA' },
  { cc: 'UGX', symbol: 'USh', name: 'Ugandan shilling', locale: 'teo-UG' },
  { cc: 'USD', symbol: 'US$', name: 'United States dollar', locale: 'en' },
  { cc: 'UYU', symbol: '$U', name: 'Uruguayan peso', locale: 'es-UY' },
  { cc: 'UZS', symbol: 'UZS', name: 'Uzbekistani som', locale: 'uz-UZ' },
  { cc: 'VEB', symbol: 'Bs', name: 'Venezuelan bolivar' },
  { cc: 'VND', symbol: '₫', name: 'Vietnamese dong', locale: 'vi-VN' },
  { cc: 'VUV', symbol: 'VT', name: 'Vanuatu vatu', locale: 'en-VU' },
  { cc: 'WST', symbol: 'WS$', name: 'Samoan tala', locale: 'en-WS' },
  { cc: 'XAF', symbol: 'CFA', name: 'Central African CFA franc' },
  { cc: 'XCD', symbol: 'EC$', name: 'East Caribbean dollar' },
  { cc: 'XDR', symbol: 'SDR', name: 'Special Drawing Rights' },
  { cc: 'XOF', symbol: 'CFA', name: 'West African CFA franc' },
  { cc: 'XPF', symbol: 'F', name: 'CFP franc' },
  { cc: 'YER', symbol: 'YER', name: 'Yemeni rial', locale: 'ar-YE' },
  { cc: 'ZAR', symbol: 'R', name: 'South African rand', locale: 'en-LS' },
  { cc: 'ZMK', symbol: 'ZK', name: 'Zambian kwacha' },
  { cc: 'ZWR', symbol: 'Z$', name: 'Zimbabwean dollar' },
]

export const commonCurrencyCodes = [
  'USD',
  'EUR',
  'TWD',
  'CNY',
  'JPY',
]

export function localeMatch(localeA: string, localeB: string) {
  return localeA.toLocaleLowerCase() === localeB.toLocaleLowerCase()
}

export function localeContains(locales: string[], locale: string) {
  for (const i of locales) {
    if (localeMatch(locale, i))
      return true
  }
  return false
}

export function getCommonCurrencyCodes(locale: string, recents: string[] = [], take = 5) {
  const list = currencies
    .filter((c) => {
      if (!c.locale)
        return false
      if (Array.isArray(c.locale))
        return localeContains(c.locale, locale)

      return localeMatch(c.locale, locale)
    })
    .map(c => c.cc)
  return union(list, recents, commonCurrencyCodes).slice(0, take)
}

export function getLocaleCurrencies(locale: string, locales?: string[]) {
  return currencies
    .filter((c) => {
      if (!locales)
        return true
      return locales.includes(c.cc)
    })
    .map((c) => {
      let name = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: c.cc,
        currencyDisplay: 'name',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(0)
        .replace('0', '')
        .trim()
      if (!name || name === c.cc)
        name = c.name
      return {
        ...c,
        name,
      }
    })
}
