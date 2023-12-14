<template>
  <v-combobox
    variant="underlined"
    v-model="selectedLanguage"
    :items="languageItems"
    item-title="name"
    item-value="code"
    label="Select Language"
    return-object
    :filter="customFilter"
    auto-select-first="exact"
  ></v-combobox>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch } from 'vue'

const emit = defineEmits(['language-selected'])

const LANGUAGES = {
  af: 'Afrikaans',
  am: 'Amharic',
  ar: 'Arabic',
  az: 'Azerbaijani',
  be: 'Belarusian',
  bg: 'Bulgarian',
  bn: 'Bengali',
  bo: 'Tibetan',
  br: 'Breton',
  bs: 'Bosnian',
  ca: 'Catalan',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  et: 'Estonian',
  eu: 'Basque',
  fa: 'Persian',
  fi: 'Finnish',
  fr: 'French',
  gl: 'Galician',
  gu: 'Gujarati',
  ha: 'Hausa',
  he: 'Hebrew',
  hi: 'Hindi',
  haw: 'Hawaiian',
  hr: 'Croatian',
  hu: 'Hungarian',
  hy: 'Armenian',
  id: 'Indonesian',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  jw: 'Javanese',
  ka: 'Georgian',
  kk: 'Kazakh',
  kn: 'Kannada',
  ko: 'Korean',
  la: 'Latin',
  lb: 'Luxembourgish',
  ln: 'Lingala',
  lo: 'Lao',
  lt: 'Lithuanian',
  lv: 'Latvian',
  mg: 'Malagasy',
  mi: 'Maori',
  mk: 'Macedonian',
  ml: 'Malayalam',
  mn: 'Mongolian',
  mr: 'Marathi',
  ms: 'Malay',
  mt: 'Maltese',
  my: 'Myanmar',
  ne: 'Nepali',
  nl: 'Dutch',
  nn: 'Nynorsk',
  no: 'Norwegian',
  oc: 'Occitan',
  pa: 'Punjabi',
  pl: 'Polish',
  ps: 'Pashto',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sa: 'Sanskrit',
  sd: 'Sindhi',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  sn: 'Shona',
  sq: 'Albanian',
  sr: 'Serbian',
  su: 'Sundanese',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  tg: 'Tajik',
  th: 'Thai',
  tl: 'Tagalog',
  tk: 'Turkmen',
  tr: 'Turkish',
  tt: 'Tatar',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  yue: 'Cantonese',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zh: 'Chinese'
}

// Initialize with the code for English
const selectedLanguage = ref({ name: 'English', code: 'en' })

const languageItems = computed(() => {
  return Object.entries(LANGUAGES).map(([code, name]) => ({ name, code }))
})

watch(selectedLanguage, (newLang) => {
  emit('language-selected', newLang)
})

const customFilter = (item, queryText, itemText) => {
  const text = itemText.toLowerCase()
  const query = queryText.toLowerCase()
  return text.indexOf(query) > -1
}
</script>
