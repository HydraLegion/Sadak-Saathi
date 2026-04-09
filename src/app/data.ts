export interface City {
  name: string;
  count: number;
  color: string;
  percent: number;
}

export interface StateEntry {
  id: string;
  name: string;
  total: number;
  badgeColor: string;
  textColor: string;
  cities: City[];
}

export const stateData: StateEntry[] = [
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    total: 3420,
    badgeColor: 'bg-red-600',
    textColor: 'text-red-600',
    cities: [
      { name: 'Lucknow', count: 820, color: 'bg-red-500', percent: 86 },
      { name: 'Kanpur', count: 640, color: 'bg-red-400', percent: 67 },
      { name: 'Agra', count: 510, color: 'bg-orange-500', percent: 54 },
      { name: 'Varanasi', count: 430, color: 'bg-orange-400', percent: 45 },
    ],
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    total: 2980,
    badgeColor: 'bg-orange-600',
    textColor: 'text-orange-600',
    cities: [
      { name: 'Mumbai', count: 910, color: 'bg-orange-500', percent: 90 },
      { name: 'Pune', count: 680, color: 'bg-orange-400', percent: 72 },
      { name: 'Nagpur', count: 490, color: 'bg-yellow-500', percent: 52 },
      { name: 'Nashik', count: 310, color: 'bg-yellow-400', percent: 33 },
    ],
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    total: 2540,
    badgeColor: 'bg-yellow-600',
    textColor: 'text-yellow-600',
    cities: [
      { name: 'Bhopal', count: 720, color: 'bg-yellow-500', percent: 80 },
      { name: 'Indore', count: 590, color: 'bg-yellow-400', percent: 66 },
      { name: 'Gwalior', count: 430, color: 'bg-amber-500', percent: 48 },
      { name: 'Jabalpur', count: 380, color: 'bg-amber-400', percent: 42 },
    ],
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    total: 2210,
    badgeColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    cities: [
      { name: 'Jaipur', count: 680, color: 'bg-amber-500', percent: 78 },
      { name: 'Jodhpur', count: 510, color: 'bg-amber-400', percent: 58 },
      { name: 'Udaipur', count: 360, color: 'bg-lime-500', percent: 41 },
      { name: 'Kota', count: 290, color: 'bg-lime-400', percent: 33 },
    ],
  },
  {
    id: 'CG',
    name: 'Chhattisgarh',
    total: 1870,
    badgeColor: 'bg-green-600',
    textColor: 'text-green-700',
    cities: [
      { name: 'Raipur', count: 620, color: 'bg-green-500', percent: 82 },
      { name: 'Bhilai', count: 440, color: 'bg-green-400', percent: 59 },
      { name: 'Bilaspur', count: 340, color: 'bg-teal-500', percent: 45 },
      { name: 'Korba', count: 260, color: 'bg-teal-400', percent: 35 },
    ],
  },
  {
    id: 'BR',
    name: 'Bihar',
    total: 1650,
    badgeColor: 'bg-blue-600',
    textColor: 'text-blue-600',
    cities: [
      { name: 'Patna', count: 530, color: 'bg-blue-500', percent: 75 },
      { name: 'Gaya', count: 370, color: 'bg-blue-400', percent: 53 },
      { name: 'Muzaffarpur', count: 290, color: 'bg-indigo-400', percent: 41 },
      { name: 'Bhagalpur', count: 220, color: 'bg-indigo-300', percent: 31 },
    ],
  },
];
