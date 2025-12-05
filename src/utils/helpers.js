// 유틸리티 함수들

export const currencyMap = {
  '일본': { symbol: '¥', name: '엔' }, '도쿄': { symbol: '¥', name: '엔' }, '오사카': { symbol: '¥', name: '엔' }, 
  '교토': { symbol: '¥', name: '엔' }, '후쿠오카': { symbol: '¥', name: '엔' }, '삿포로': { symbol: '¥', name: '엔' },
  '미국': { symbol: '$', name: '달러' }, '뉴욕': { symbol: '$', name: '달러' }, 'LA': { symbol: '$', name: '달러' },
  '로스앤젤레스': { symbol: '$', name: '달러' }, '샌프란시스코': { symbol: '$', name: '달러' },
  '프랑스': { symbol: '€', name: '유로' }, '파리': { symbol: '€', name: '유로' },
  '런던': { symbol: '£', name: '파운드' }, '영국': { symbol: '£', name: '파운드' },
  '독일': { symbol: '€', name: '유로' }, '베를린': { symbol: '€', name: '유로' },
  '이탈리아': { symbol: '€', name: '유로' }, '로마': { symbol: '€', name: '유로' },
  '스페인': { symbol: '€', name: '유로' }, '바르셀로나': { symbol: '€', name: '유로' },
  '한국': { symbol: '₩', name: '원' }, '서울': { symbol: '₩', name: '원' }, '부산': { symbol: '₩', name: '원' },
  '중국': { symbol: '¥', name: '위안' }, '베이징': { symbol: '¥', name: '위안' }, '상하이': { symbol: '¥', name: '위안' },
  '태국': { symbol: '฿', name: '바트' }, '방콕': { symbol: '฿', name: '바트' },
  '베트남': { symbol: '₫', name: '동' }, '하노이': { symbol: '₫', name: '동' }, '호치민': { symbol: '₫', name: '동' },
  '싱가포르': { symbol: 'S$', name: '달러' }, '호주': { symbol: 'A$', name: '달러' }, '시드니': { symbol: 'A$', name: '달러' }
};

export const categories = [
  { id: 'landmark', label: '명소', icon: '🎯' },
  { id: 'culture', label: '문화', icon: '🏛️' },
  { id: 'food', label: '식당', icon: '🍽️' },
  { id: 'cafe', label: '카페', icon: '☕' },
  { id: 'shopping', label: '쇼핑', icon: '🛍️' },
  { id: 'nature', label: '자연', icon: '🌳' },
  { id: 'activity', label: '액티비티', icon: '🎢' },
  { id: 'nightlife', label: '야경', icon: '🌃' }
];

export const getCurrency = (city) => currencyMap[city] || { symbol: '$', name: '달러' };

export const getCategoryConfig = (id) => categories.find(c => c.id === id) || categories[0];

export const calculateDDay = (date) => {
  if (!date) return null;
  return Math.ceil((new Date(date) - new Date()) / 86400000);
};

export const getTripDays = (trip) => {
  if (!trip) return 1;
  return Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1;
};

export const calculateDayTransportSummary = (places) => {
  if (!places?.length) return null;
  const transports = places.filter(p => p.transport);
  if (!transports.length) return null;
  
  const totalDuration = transports.reduce((s, p) => s + (parseInt(p.transport.duration) || 0), 0);
  const totalCost = transports.reduce((s, p) => s + (parseInt(p.transport.cost?.replace(/[^0-9]/g, '')) || 0), 0);
  const types = {};
  transports.forEach(p => types[p.transport.type] = (types[p.transport.type] || 0) + 1);
  const costStr = transports[0].transport.cost || '';
  const currencySymbol = costStr.replace(/[0-9]/g, '').trim() || '$';
  
  return { totalDuration, totalCost, transportTypes: types, currency: currencySymbol };
};

export const openGoogleImages = (placeName, city) => {
  const searchQuery = `${placeName} ${city} photo`;
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`,
    'imagePopup',
    'width=1200,height=900,scrollbars=yes,resizable=yes'
  );
};

export const openGoogleMaps = (placeName, city) => {
  window.open(
    `https://www.google.com/maps/search/${encodeURIComponent(placeName + ' ' + city)}`,
    '_blank'
  );
};

export const openWikipedia = (placeName) => {
  window.open(
    `https://ko.wikipedia.org/wiki/${encodeURIComponent(placeName)}`,
    '_blank'
  );
};