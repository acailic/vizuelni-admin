/**
 * Serbian Administrative Units Data
 * Hierarchy: Country → Provinces (3) → Districts (26) → Municipalities (174)
 */

import { Province, District, Municipality } from './types';

// ============================================================
// PROVINCES DATA
// ============================================================

export const PROVINCES: Province[] = [
  {
    code: 'RS00',
    name: {
      en: 'Central Serbia',
      sr: 'Централна Србија',
      srLat: 'Centralna Srbija',
    },
    level: 'province',
    population: 5186669,
    area: 34843,
    districts: [
      'RS01',
      'RS02',
      'RS03',
      'RS04',
      'RS05',
      'RS06',
      'RS07',
      'RS08',
      'RS09',
      'RS10',
      'RS11',
      'RS12',
      'RS13',
      'RS14',
      'RS15',
      'RS16',
      'RS17',
      'RS18',
    ],
  },
  {
    code: 'RS25',
    name: { en: 'Vojvodina', sr: 'Војводина', srLat: 'Vojvodina' },
    level: 'province',
    population: 1862621,
    area: 21506,
    districts: ['RS26', 'RS27', 'RS28', 'RS29', 'RS30', 'RS31', 'RS32'],
  },
  {
    code: 'RSKM',
    name: {
      en: 'Kosovo and Metohija',
      sr: 'Косово и Метохија',
      srLat: 'Kosovo i Metohija',
    },
    level: 'province',
    population: 0,
    area: 10887,
    districts: ['RSKM01', 'RSKM02', 'RSKM03', 'RSKM04', 'RSKM05'],
  },
];

// ============================================================
// DISTRICTS DATA (26 total)
// ============================================================

export const DISTRICTS: District[] = [
  // Central Serbia
  {
    code: 'RS01',
    name: { en: 'City of Belgrade', sr: 'Град Београд', srLat: 'Grad Beograd' },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS02',
    name: { en: 'Bor District', sr: 'Борски округ', srLat: 'Borski okrug' },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS03',
    name: {
      en: 'Braničevo District',
      sr: 'Браничевски округ',
      srLat: 'Braničevski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS04',
    name: {
      en: 'Jablanica District',
      sr: 'Јабланички округ',
      srLat: 'Jablanički okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS05',
    name: {
      en: 'Kolubara District',
      sr: 'Колубарски округ',
      srLat: 'Kolubarski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS06',
    name: {
      en: 'Mačva District',
      sr: 'Мачвански округ',
      srLat: 'Mačvanski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS07',
    name: {
      en: 'Morava District',
      sr: 'Моравички округ',
      srLat: 'Moravički okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS08',
    name: {
      en: 'Nišava District',
      sr: 'Нишавски округ',
      srLat: 'Nišavski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS09',
    name: {
      en: 'Pčinja District',
      sr: 'Пчињски округ',
      srLat: 'Pčinjski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS10',
    name: {
      en: 'Pirot District',
      sr: 'Пиротски округ',
      srLat: 'Pirotski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS11',
    name: {
      en: 'Podunavlje District',
      sr: 'Подунавски округ',
      srLat: 'Podunavski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS12',
    name: {
      en: 'Pomoravlje District',
      sr: 'Поморавски округ',
      srLat: 'Pomoravski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS13',
    name: {
      en: 'Rasina District',
      sr: 'Расински округ',
      srLat: 'Rasinski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS14',
    name: { en: 'Raška District', sr: 'Рашки округ', srLat: 'Raški okrug' },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS15',
    name: {
      en: 'Šumadija District',
      sr: 'Шумадијски округ',
      srLat: 'Šumadijski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS16',
    name: {
      en: 'Toplica District',
      sr: 'Топлички округ',
      srLat: 'Toplički okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS17',
    name: {
      en: 'Zaječar District',
      sr: 'Зајечарски округ',
      srLat: 'Zaječarski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  {
    code: 'RS18',
    name: {
      en: 'Zlatibor District',
      sr: 'Златиборски округ',
      srLat: 'Zlatiborski okrug',
    },
    level: 'district',
    provinceCode: 'RS00',
    municipalities: [],
  },
  // Vojvodina
  {
    code: 'RS26',
    name: {
      en: 'North Bačka',
      sr: 'Севернобачки округ',
      srLat: 'Severnobački okrug',
    },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
  {
    code: 'RS27',
    name: {
      en: 'West Bačka',
      sr: 'Западнобачки округ',
      srLat: 'Zapadnobački okrug',
    },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
  {
    code: 'RS28',
    name: {
      en: 'South Bačka',
      sr: 'Јужнобачки округ',
      srLat: 'Južnobački okrug',
    },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
  {
    code: 'RS29',
    name: {
      en: 'North Banat',
      sr: 'Севернобанатски округ',
      srLat: 'Severnobanatski okrug',
    },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
  {
    code: 'RS30',
    name: {
      en: 'Central Banat',
      sr: 'Средњебанатски округ',
      srLat: 'Srednjobanatski okrug',
    },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
  {
    code: 'RS31',
    name: {
      en: 'South Banat',
      sr: 'Јужнобанатски округ',
      srLat: 'Južnobanatski okrug',
    },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
  {
    code: 'RS32',
    name: { en: 'Srem', sr: 'Сремски округ', srLat: 'Sremski okrug' },
    level: 'district',
    provinceCode: 'RS25',
    municipalities: [],
  },
];

// ============================================================
// MAJOR MUNICIPALITIES (Sample - 15 largest cities)
// ============================================================

export const SAMPLE_MUNICIPALITIES: Municipality[] = [
  {
    code: 'RS001',
    name: { en: 'Belgrade', sr: 'Београд', srLat: 'Beograd' },
    level: 'municipality',
    districtCode: 'RS01',
    type: 'city',
    population: 1389663,
  },
  {
    code: 'RS002',
    name: { en: 'Novi Sad', sr: 'Нови Сад', srLat: 'Novi Sad' },
    level: 'municipality',
    districtCode: 'RS28',
    type: 'city',
    population: 250439,
  },
  {
    code: 'RS003',
    name: { en: 'Niš', sr: 'Ниш', srLat: 'Niš' },
    level: 'municipality',
    districtCode: 'RS08',
    type: 'city',
    population: 183164,
  },
  {
    code: 'RS004',
    name: { en: 'Kragujevac', sr: 'Крагујевац', srLat: 'Kragujevac' },
    level: 'municipality',
    districtCode: 'RS15',
    type: 'city',
    population: 146315,
  },
  {
    code: 'RS005',
    name: { en: 'Subotica', sr: 'Суботица', srLat: 'Subotica' },
    level: 'municipality',
    districtCode: 'RS26',
    type: 'city',
    population: 97910,
  },
  {
    code: 'RS006',
    name: { en: 'Leskovac', sr: 'Лесковац', srLat: 'Leskovac' },
    level: 'municipality',
    districtCode: 'RS04',
    type: 'city',
    population: 60488,
  },
  {
    code: 'RS007',
    name: { en: 'Kruševac', sr: 'Крушевац', srLat: 'Kruševac' },
    level: 'municipality',
    districtCode: 'RS13',
    type: 'city',
    population: 58745,
  },
  {
    code: 'RS008',
    name: { en: 'Pančevo', sr: 'Панчево', srLat: 'Pančevo' },
    level: 'municipality',
    districtCode: 'RS31',
    type: 'city',
    population: 57562,
  },
  {
    code: 'RS009',
    name: { en: 'Zrenjanin', sr: 'Зрењанин', srLat: 'Zrenjanin' },
    level: 'municipality',
    districtCode: 'RS30',
    type: 'city',
    population: 54539,
  },
  {
    code: 'RS010',
    name: { en: 'Čačak', sr: 'Чачак', srLat: 'Čačak' },
    level: 'municipality',
    districtCode: 'RS07',
    type: 'city',
    population: 54221,
  },
  {
    code: 'RS011',
    name: { en: 'Novi Pazar', sr: 'Нови Пазар', srLat: 'Novi Pazar' },
    level: 'municipality',
    districtCode: 'RS14',
    type: 'city',
    population: 51763,
  },
  {
    code: 'RS012',
    name: { en: 'Kraljevo', sr: 'Краљево', srLat: 'Kraljevo' },
    level: 'municipality',
    districtCode: 'RS14',
    type: 'city',
    population: 50979,
  },
  {
    code: 'RS013',
    name: { en: 'Smederevo', sr: 'Смедерево', srLat: 'Smederevo' },
    level: 'municipality',
    districtCode: 'RS11',
    type: 'city',
    population: 49754,
  },
  {
    code: 'RS014',
    name: { en: 'Valjevo', sr: 'Ваљево', srLat: 'Valjevo' },
    level: 'municipality',
    districtCode: 'RS05',
    type: 'city',
    population: 49135,
  },
  {
    code: 'RS015',
    name: { en: 'Šabac', sr: 'Шабац', srLat: 'Šabac' },
    level: 'municipality',
    districtCode: 'RS06',
    type: 'city',
    population: 48656,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getProvinceByCode(code: string): Province | undefined {
  return PROVINCES.find((p) => p.code === code);
}

export function getDistrictByCode(code: string): District | undefined {
  return DISTRICTS.find((d) => d.code === code);
}

export function getMunicipalityByCode(code: string): Municipality | undefined {
  return SAMPLE_MUNICIPALITIES.find((m) => m.code === code);
}

export function getDistrictsByProvince(provinceCode: string): District[] {
  return DISTRICTS.filter((d) => d.provinceCode === provinceCode);
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ćč]/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]/g, '');
}
