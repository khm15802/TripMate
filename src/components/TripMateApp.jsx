import React, { useState, useEffect } from 'react';
import { Home, Map, Search, Clock, X, Trash2, RefreshCw, Sparkles, ArrowRight, Train, Bus, Car, Footprints, Plane, Edit2 } from 'lucide-react';

export default function TripMateApp() {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showTripForm, setShowTripForm] = useState(false);
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [newTrip, setNewTrip] = useState({ name: '', destinations: [], startDate: '' });
  const [destinationInput, setDestinationInput] = useState('');
  const [cityDaysInput, setCityDaysInput] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [selectedDayForAdd, setSelectedDayForAdd] = useState(1);
  const [budgetInput, setBudgetInput] = useState({ name: '', amount: '' });

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedTrips = localStorage.getItem('tripmate_trips');
    const savedCurrentTrip = localStorage.getItem('tripmate_current_trip');
    if (savedTrips) setTrips(JSON.parse(savedTrips));
    if (savedCurrentTrip) setCurrentTrip(JSON.parse(savedCurrentTrip));
  }, []);

  // trips 저장
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('tripmate_trips', JSON.stringify(trips));
    }
  }, [trips]);

  // currentTrip 저장
  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem('tripmate_current_trip', JSON.stringify(currentTrip));
    }
  }, [currentTrip]);

  const categories = [
    { id: 'landmark', label: '명소', icon: '🎯' },
    { id: 'culture', label: '문화', icon: '🏛️' },
    { id: 'food', label: '식당', icon: '🍽️' },
    { id: 'cafe', label: '카페', icon: '☕' },
    { id: 'shopping', label: '쇼핑', icon: '🛍️' },
    { id: 'nature', label: '자연', icon: '🌳' },
    { id: 'activity', label: '액티비티', icon: '🎢' },
    { id: 'nightlife', label: '야경', icon: '🌃' }
  ];

  const transportIcons = {
    subway: { icon: Train, label: '지하철', color: 'text-blue-400' },
    bus: { icon: Bus, label: '버스', color: 'text-green-400' },
    taxi: { icon: Car, label: '택시', color: 'text-yellow-400' },
    walk: { icon: Footprints, label: '도보', color: 'text-purple-400' },
    plane: { icon: Plane, label: '비행기', color: 'text-cyan-400' }
  };

  const currencyMap = {
    '일본': { symbol: '¥', name: '엔' }, '도쿄': { symbol: '¥', name: '엔' }, '오사카': { symbol: '¥', name: '엔' }, '교토': { symbol: '¥', name: '엔' },
    '후쿠오카': { symbol: '¥', name: '엔' }, '삿포로': { symbol: '¥', name: '엔' },
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

  const getCurrency = (city) => currencyMap[city] || { symbol: '$', name: '달러' };
  const getTransportIcon = (type) => transportIcons[type] || transportIcons.subway;
  const getCategoryConfig = (id) => categories.find(c => c.id === id) || categories[0];
  const toggleCategory = (id) => setSelectedCategories(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const addDestination = () => {
    if (destinationInput.trim() && !newTrip.destinations.includes(destinationInput.trim())) {
      setNewTrip({ ...newTrip, destinations: [...newTrip.destinations, destinationInput.trim()] });
      setCityDaysInput({ ...cityDaysInput, [destinationInput.trim()]: '3' });
      setDestinationInput('');
    }
  };

  const calculateEndDate = () => {
    if (!newTrip.startDate || newTrip.destinations.length === 0) return '';
    let totalDays = 0;
    newTrip.destinations.forEach(dest => {
      totalDays += parseInt(cityDaysInput[dest]) || 3;
    });
    const startDate = new Date(newTrip.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays - 1);
    return endDate.toISOString().split('T')[0];
  };

  const handleCreateTrip = () => {
    if (!newTrip.name || !newTrip.destinations.length || !newTrip.startDate) {
      alert('여행 이름, 목적지, 시작일을 모두 입력해주세요!');
      return;
    }
    
    const endDate = calculateEndDate();
    const totalDays = Math.ceil((new Date(endDate) - new Date(newTrip.startDate)) / 86400000) + 1;
    let citySchedule = {};
    let currentDay = 1;
    
    newTrip.destinations.forEach(dest => {
      const days = parseInt(cityDaysInput[dest]) || 3;
      for (let i = 0; i < days; i++) {
        citySchedule[currentDay] = dest;
        currentDay++;
      }
    });
    
    const trip = {
      id: Date.now(),
      ...newTrip,
      endDate,
      destination: newTrip.destinations.join(' → '),
      citySchedule,
      places: [],
      checklist: [
        { id: 1, text: '여권 확인', completed: false },
        { id: 2, text: '항공권 확인', completed: false },
        { id: 3, text: '숙소 예약', completed: false },
        { id: 4, text: '환전', completed: false },
        { id: 5, text: '여행자 보험', completed: false },
        { id: 6, text: '짐 싸기', completed: false }
      ],
      budget: { spent: 0, items: [] }
    };
    
    setTrips([...trips, trip]);
    setCurrentTrip(trip);
    setShowTripForm(false);
    setActiveTab('trip');
    setActiveSubTab('places');
    setNewTrip({ name: '', destinations: [], startDate: '' });
    setCityDaysInput({});
    
    setTimeout(() => {
      if (window.confirm('🤖 AI가 자동으로 일정을 추천해드릴까요?\n(하루 2끼 식사 포함)')) {
        generateAutoRoute(trip);
      }
    }, 500);
  };

  const addPlace = (place) => {
    if (!currentTrip) return;
    const newPlace = { id: Date.now(), ...place, day: selectedDayForAdd, time: '09:00', notes: '' };
    const updatedTrip = {
      ...currentTrip,
      places: [...currentTrip.places, newPlace].sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time))
    };
    setCurrentTrip(updatedTrip);
    setTrips(trips.map(t => t.id === currentTrip.id ? updatedTrip : t));
    setShowPlaceSearch(false);
    alert(`✅ ${selectedDayForAdd}일차에 추가되었습니다!`);
  };

  const removePlace = (id, e) => {
    e?.stopPropagation();
    if (!currentTrip || !window.confirm('이 장소를 삭제하시겠어요?')) return;
    const updatedTrip = { ...currentTrip, places: currentTrip.places.filter(p => p.id !== id) };
    setCurrentTrip(updatedTrip);
    setTrips(trips.map(t => t.id === currentTrip.id ? updatedTrip : t));
  };

  const updatePlace = (id, updates) => {
    if (!currentTrip) return;
    const updatedTrip = {
      ...currentTrip,
      places: currentTrip.places.map(p => p.id === id ? { ...p, ...updates } : p)
    };
    setCurrentTrip(updatedTrip);
    setTrips(trips.map(t => t.id === currentTrip.id ? updatedTrip : t));
    setEditingPlace(null);
  };

  const generateAutoRoute = async (trip = currentTrip) => {
    if (!trip) return;
    setIsGeneratingRoute(true);
    setGenerationProgress(0);
    setGenerationStatus('생성 중...');
    
    try {
      const days = getTripDays(trip);
      const allPlaces = [];
      
      for (let day = 1; day <= days; day++) {
        setGenerationStatus(`${day}일차 생성 중...`);
        setGenerationProgress((day / days) * 100);
        
        const city = trip.citySchedule?.[day] || trip.destinations[0];
        const currency = getCurrency(city);
        
       const response = await fetch('http://172.16.107.30:3001/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [{
              role: 'user',
              content: `${city}의 ${day}일차 일정 추천 (필수: 점심 1곳 + 저녁 1곳 + 관광지 2-3곳)

교통정보:
- type: subway/bus/taxi/walk
- duration: "15분"
- cost: "${currency.symbol}240"
- route: "긴자선 시부야역 3번출구 → 아사쿠사역 1번출구"

[{"name":"장소","category":"landmark/culture/food/cafe/shopping/nature/activity/nightlife","time":"1-2시간","rating":4.5,"description":"설명","transport":{"type":"subway","duration":"15분","cost":"${currency.symbol}240","route":"상세경로"}}]

첫 장소는 transport null. JSON만.`
            }]
          })
        });

        const data = await response.json();
        const text = data.content?.find(i => i.type === 'text')?.text;
        if (text) {
          try {
            const places = JSON.parse(text.replace(/```json|```/g, '').trim());
            places.forEach((p, i) => {
              allPlaces.push({
                ...p,
                id: Date.now() + allPlaces.length + Math.random(),
                day,
                city,
                distance: `${Math.floor(Math.random() * 10) + 1}km`,
                transport: p.transport || (i === 0 ? null : {
                  type: 'subway',
                  duration: `${Math.floor(Math.random() * 20) + 5}분`,
                  cost: `${currency.symbol}${Math.floor(Math.random() * 300) + 200}`,
                  route: '상세 경로'
                })
              });
            });
          } catch (e) {
            console.error('파싱 오류:', e);
          }
        }
        
        if (day < days) await new Promise(r => setTimeout(r, 1000));
      }
      
      const updatedTrip = { ...trip, places: allPlaces };
      setCurrentTrip(updatedTrip);
      setTrips(trips.map(t => t.id === trip.id ? updatedTrip : t));
      alert(`✨ ${days}일 일정 생성 완료! (${allPlaces.length}개)`);
    } catch (e) {
      alert('AI 루트 생성 오류: ' + e.message);
    } finally {
      setTimeout(() => {
        setIsGeneratingRoute(false);
        setGenerationProgress(0);
      }, 1000);
    }
  };

  const searchPlaces = async (query) => {
    if (!currentTrip) return;
    const city = searchCity || currentTrip.destinations?.[0] || currentTrip.destination || '';
    if (!city && !query.trim()) return alert('도시를 선택하거나 검색어를 입력해주세요!');
    
    setIsSearching(true);
    try {
      const response = await fetch('http://172.16.107.30:3001/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: `${city}에서 "${query || '인기 장소'}" 추천. [{"name":"장소","category":"landmark/culture/food/cafe/shopping/nature/activity/nightlife","time":"1-2시간","rating":4.5,"description":"설명"}] 10개. JSON만.` }]
        })
      });
      
      const data = await response.json();
      const text = data.content?.find(i => i.type === 'text')?.text;
      if (text) {
        const places = JSON.parse(text.replace(/```json|```/g, '').trim());
        setSearchResults(places.map((p, i) => ({ 
          ...p, 
          id: Date.now() + i, 
          distance: `${Math.floor(Math.random() * 15) + 1}km`
        })));
      }
    } catch (e) {
      alert('검색 오류: ' + e.message);
    } finally {
      setIsSearching(false);
    }
  };

  const openImagePopup = (place) => {
    const searchQuery = `${place.name} ${place.city} photo`;
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`,
      'imagePopup',
      'width=1200,height=900,scrollbars=yes,resizable=yes'
    );
  };

  const calculateDDay = (date) => date ? Math.ceil((new Date(date) - new Date()) / 86400000) : null;
  const getTripDays = (trip = currentTrip) => trip ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1 : 1;
  
  const getPlacesByDay = () => {
    if (!currentTrip) return {};
    const grouped = {};
    for (let i = 1; i <= getTripDays(); i++) {
      grouped[i] = currentTrip.places.filter(p => p.day === i);
    }
    return grouped;
  };

  const getCityForDay = (day) => currentTrip?.citySchedule?.[day] || currentTrip?.destinations?.[0] || currentTrip?.destination || '';

  const calculateDayTransportSummary = (places) => {
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

  const toggleChecklist = (id) => {
    if (!currentTrip) return;
    const updatedTrip = {
      ...currentTrip,
      checklist: currentTrip.checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    };
    setCurrentTrip(updatedTrip);
    setTrips(trips.map(t => t.id === currentTrip.id ? updatedTrip : t));
  };

  const addBudgetItem = () => {
    if (!currentTrip || !budgetInput.amount) return;
    const item = { id: Date.now(), name: budgetInput.name || '항목', amount: parseFloat(budgetInput.amount) };
    const updatedTrip = {
      ...currentTrip,
      budget: { items: [...currentTrip.budget.items, item], spent: currentTrip.budget.spent + item.amount }
    };
    setCurrentTrip(updatedTrip);
    setTrips(trips.map(t => t.id === currentTrip.id ? updatedTrip : t));
    setBudgetInput({ name: '', amount: '' });
  };

  const dDay = currentTrip ? calculateDDay(currentTrip.startDate) : null;
  const calculatedEndDate = calculateEndDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-sky-800 to-blue-900 pb-20">
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50 px-4 py-4">
        <h1 className="text-2xl font-bold text-white">✈️ TripMate</h1>
        <p className="text-sm text-white/70">스마트한 여행 플래너</p>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/30 to-sky-500/30 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-white font-bold text-2xl mb-3">다음 여행을 계획하세요</h2>
              <button onClick={() => setShowTripForm(true)} className="bg-white text-sky-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl">
                + 새 여행 시작
              </button>
            </div>
            {trips.length > 0 && (
              <div>
                <h3 className="text-white font-bold text-xl mb-4">내 여행</h3>
                {trips.map(trip => {
                  const tripDDay = calculateDDay(trip.startDate);
                  return (
                    <div key={trip.id} onClick={() => { setCurrentTrip(trip); setActiveTab('trip'); }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 mb-3 shadow-2xl cursor-pointer hover:scale-105 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-bold text-lg">{trip.name}</h4>
                          <p className="text-white/70 text-sm">📍 {trip.destination}</p>
                        </div>
                        {tripDDay !== null && (
                          <div className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-2 rounded-xl font-bold">
                            {tripDDay > 0 ? `D-${tripDDay}` : 'D-Day'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'trip' && currentTrip && (
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/30 to-sky-500/30 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-white font-bold text-2xl mb-2">{currentTrip.name}</h2>
                  <p className="text-white/80">📍 {currentTrip.destination}</p>
                </div>
                {dDay !== null && (
                  <div className="bg-white/20 text-white px-5 py-3 rounded-2xl font-bold text-xl">
                    {dDay > 0 ? `D-${dDay}` : 'D-Day'}
                  </div>
                )}
              </div>
              
              {currentTrip.destinations?.length > 1 && (
                <div className="bg-white/10 rounded-2xl p-4 mt-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {currentTrip.destinations.map((dest, idx) => (
                      <React.Fragment key={idx}>
                        <div className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-2 rounded-xl font-bold text-sm">{dest}</div>
                        {idx < currentTrip.destinations.length - 1 && <ArrowRight className="text-white/60" size={20} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-2 shadow-2xl">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'overview', label: '개요', icon: '📊' },
                  { id: 'places', label: '일정', icon: '🗺️' },
                  { id: 'checklist', label: '준비', icon: '✅' },
                  { id: 'budget', label: '예산', icon: '💰' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`py-3 rounded-2xl font-semibold text-sm transition-all ${activeSubTab === tab.id ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg' : 'text-white/60'}`}
                  >
                    <div className="text-xl mb-1">{tab.icon}</div>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeSubTab === 'overview' && (
              <div className="grid grid-cols-3 gap-3">
                <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/30 to-sky-400/30 border border-white/20 rounded-2xl p-4 shadow-xl text-center">
                  <div className="text-3xl mb-2">📍</div>
                  <div className="text-2xl font-bold text-white">{currentTrip.places.length}</div>
                  <div className="text-white/70 text-xs">방문지</div>
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-white/20 rounded-2xl p-4 shadow-xl text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-lg font-bold text-white">₩{(currentTrip.budget.spent / 10000).toFixed(0)}만</div>
                  <div className="text-white/70 text-xs">지출</div>
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-white/20 rounded-2xl p-4 shadow-xl text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-lg font-bold text-white">{currentTrip.places.reduce((s, p) => s + (parseInt(p.time?.split('-')?.[0]) || 1), 0)}시간</div>
                  <div className="text-white/70 text-xs">예상</div>
                </div>
              </div>
            )}

            {activeSubTab === 'places' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowPlaceSearch(true)} className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2">
                    <Search size={20} />추가
                  </button>
                  <button onClick={() => generateAutoRoute()} disabled={isGeneratingRoute} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden">
                    {isGeneratingRoute ? (
                      <>
                        <div className="absolute inset-0 bg-white/20" style={{ width: `${generationProgress}%`, transition: 'width 0.3s' }} />
                        <RefreshCw size={20} className="animate-spin relative z-10" />
                        <span className="relative z-10">{Math.round(generationProgress)}%</span>
                      </>
                    ) : (
                      <><Sparkles size={20} />AI 추천</>
                    )}
                  </button>
                </div>
                
                {currentTrip.places.length === 0 ? (
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
                    {isGeneratingRoute ? (
                      <>
                        <div className="text-6xl mb-4 animate-bounce">🤖</div>
                        <p className="text-white font-bold text-lg mb-3">AI가 일정을 만들고 있어요</p>
                        <div className="bg-white/10 rounded-full h-4 mb-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all" style={{ width: `${generationProgress}%` }} />
                        </div>
                        <p className="text-white/70 text-sm">{generationStatus}</p>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl mb-4">🗺️</div>
                        <p className="text-white font-bold text-lg mb-2">일정을 만들어보세요!</p>
                        <p className="text-white/60 text-sm mb-4">하루 2끼 식사 포함</p>
                        <div className="flex gap-3 justify-center mt-4">
                          <button onClick={() => generateAutoRoute()} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold">
                            ✨ AI 추천
                          </button>
                          <button onClick={() => setShowPlaceSearch(true)} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold border border-white/20">
                            직접 추가
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(getPlacesByDay()).map(([day, places]) => {
                      const cityForDay = getCityForDay(parseInt(day));
                      const summary = calculateDayTransportSummary(places);
                      
                      return (
                        <div key={day} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-2 rounded-xl font-bold">{day}일차</span>
                              <span className="bg-white/20 text-white px-3 py-1 rounded-xl text-sm">📍 {cityForDay}</span>
                              <span className="text-white/60 text-sm">{places.length}개</span>
                            </div>
                          </div>

                          {summary && (
                            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4">
                              <h4 className="text-white font-semibold text-sm mb-3">🚇 오늘의 이동</h4>
                              <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                  <div className="text-cyan-400 font-bold text-lg">{summary.totalDuration}분</div>
                                  <div className="text-white/60 text-xs">이동시간</div>
                                </div>
                                <div>
                                  <div className="text-emerald-400 font-bold text-lg">{summary.currency}{summary.totalCost}</div>
                                  <div className="text-white/60 text-xs">교통비</div>
                                </div>
                                <div>
                                  <div className="flex gap-1 justify-center mb-1">
                                    {Object.entries(summary.transportTypes).map(([type, count]) => {
                                      const { icon: Icon, color } = getTransportIcon(type);
                                      return <div key={type} className="flex items-center gap-0.5"><Icon className={color} size={16} /><span className="text-white/80 text-xs">{count}</span></div>;
                                    })}
                                  </div>
                                  <div className="text-white/60 text-xs">이동수단</div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-3">
                            {places.map((place, idx) => {
                              const cat = getCategoryConfig(place.category);
                              const transport = place.transport ? getTransportIcon(place.transport.type) : null;
                              const isEditing = editingPlace === place.id;
                              
                              return (
                                <div key={place.id}>
                                  {idx > 0 && place.transport && (
                                    <div className="flex items-center justify-center my-3">
                                      <div className="flex-1 h-px bg-white/20"></div>
                                      <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 mx-3 max-w-full">
                                        <div className="flex items-center gap-3">
                                          {transport && <transport.icon className={transport.color} size={18} />}
                                          <div className="text-xs min-w-0">
                                            <div className="text-white font-semibold">{transport?.label} • {place.transport.duration}</div>
                                            <div className="text-white/60 text-xs">{place.transport.cost}</div>
                                            <div className="text-white/50 text-xs truncate">{place.transport.route}</div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex-1 h-px bg-white/20"></div>
                                    </div>
                                  )}

                                  <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden relative">
                                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-cyan-500/20 to-sky-500/20">
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-6xl">{cat.icon}</div>
                                      </div>
                                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1">
                                        <span className="text-base">{cat.icon}</span>
                                        {cat.label}
                                      </div>
                                    </div>
                                    <div className="p-4">
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className="bg-gradient-to-br from-cyan-500 to-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                                          <h4 className="text-white font-bold">{place.name}</h4>
                                        </div>
                                        <div className="flex gap-2">
                                          <button onClick={() => setEditingPlace(place.id)} className="bg-blue-500/90 text-white p-1.5 rounded-lg">
                                            <Edit2 size={14} />
                                          </button>
                                          <button onClick={(e) => removePlace(place.id, e)} className="bg-red-500/90 text-white p-1.5 rounded-lg">
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                      
                                      {isEditing ? (
                                        <div className="space-y-2 mt-3">
                                          <input
                                            type="time"
                                            value={place.time}
                                            onChange={(e) => updatePlace(place.id, { time: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm"
                                          />
                                          <textarea
                                            placeholder="메모 추가"
                                            value={place.notes || ''}
                                            onChange={(e) => updatePlace(place.id, { notes: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-3 py-2 rounded-lg text-sm"
                                            rows="2"
                                          />
                                          <button onClick={() => setEditingPlace(null)} className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold">
                                            완료
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex gap-3 text-xs text-white/60 mb-3">
                                            <span className="flex items-center gap-1"><Clock size={12} />{place.time}</span>
                                            <span className="text-yellow-400">⭐ {place.rating}</span>
                                          </div>
                                          
                                          <div className="grid grid-cols-3 gap-2 mb-2">
                                            <button
                                              onClick={() => openImagePopup(place)}
                                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                            >
                                              🖼️ 사진
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://www.google.com/maps/search/${encodeURIComponent(place.name + ' ' + place.city)}`, '_blank');
                                              }}
                                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                            >
                                              🗺️ 지도
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://ko.wikipedia.org/wiki/${encodeURIComponent(place.name)}`, '_blank');
                                              }}
                                              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                            >
                                              ℹ️ 정보
                                            </button>
                                          </div>
                                          
                                          {place.description && <p className="text-white/70 text-sm mb-2">{place.description}</p>}
                                          {place.notes && <p className="text-white/70 text-sm mt-2 bg-white/5 p-2 rounded-lg">📝 {place.notes}</p>}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'checklist' && (
              <div className="space-y-3">
                {currentTrip.checklist.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`backdrop-blur-xl border-2 rounded-2xl p-5 shadow-xl cursor-pointer transition-all ${item.completed ? 'bg-emerald-500/20 border-emerald-400/40' : 'bg-white/10 border-white/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-7 h-7 rounded-full border-3 flex items-center justify-center ${item.completed ? 'bg-emerald-500 border-emerald-400' : 'border-white/50'}`}>
                        {item.completed && <span className="text-white text-lg">✓</span>}
                      </div>
                      <span className={`font-medium ${item.completed ? 'text-white/70 line-through' : 'text-white'}`}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSubTab === 'budget' && (
              <div className="space-y-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-white/20 rounded-3xl p-6 shadow-2xl text-center">
                  <div className="text-white/70 text-sm mb-2">총 지출</div>
                  <div className="text-white font-bold text-4xl">₩{currentTrip.budget.spent.toLocaleString()}</div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl">
                  <h4 className="text-white font-bold text-lg mb-4">💳 지출 내역</h4>
                  
                  {currentTrip.budget.items.length === 0 ? (
                    <p className="text-white/50 text-center py-8">아직 지출 내역이 없어요</p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {currentTrip.budget.items.map(item => (
                        <div key={item.id} className="bg-white/10 border border-white/20 rounded-2xl p-4 flex justify-between items-center">
                          <div>
                            <div className="text-white font-semibold">{item.name}</div>
                            <div className="text-emerald-400 font-bold text-lg">₩{item.amount.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => {
                              if (!window.confirm('삭제하시겠어요?')) return;
                              const updatedTrip = {
                                ...currentTrip,
                                budget: { items: currentTrip.budget.items.filter(i => i.id !== item.id), spent: currentTrip.budget.spent - item.amount }
                              };
                              setCurrentTrip(updatedTrip);
                              setTrips(trips.map(t => t.id === currentTrip.id ? updatedTrip : t));
                            }}
                            className="bg-red-500/90 text-white p-2 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-white/20">
                    <input type="text" placeholder="항목명" value={budgetInput.name} onChange={(e) => setBudgetInput({ ...budgetInput, name: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-xl" />
                    <div className="flex gap-2">
                      <input type="number" placeholder="금액" value={budgetInput.amount} onChange={(e) => setBudgetInput({ ...budgetInput, amount: e.target.value })} className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-xl" />
                      <button onClick={addBudgetItem} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold">추가</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/10 border-t border-white/20 px-4 py-3">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {[{ id: 'home', label: '홈', icon: Home }, { id: 'trip', label: '내 여행', icon: Map }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.id === 'trip' && !currentTrip}
              className={`py-3 rounded-2xl font-semibold transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-2xl' : 'text-white/60'} ${tab.id === 'trip' && !currentTrip ? 'opacity-40' : ''}`}
            >
              <tab.icon size={24} className="mx-auto mb-1" />
              <div className="text-xs">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {showTripForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl mx-auto my-8">
            <h3 className="text-white font-bold text-2xl mb-6">✈️ 새 여행 만들기</h3>
            <div className="space-y-4">
              <input type="text" placeholder="여행 이름 (예: 일본 여행)" value={newTrip.name} onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-4 rounded-2xl" />
              
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">📍 목적지</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="도시 입력 (예: 도쿄)" value={destinationInput} onChange={(e) => setDestinationInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addDestination()} className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-4 rounded-2xl" />
                  <button onClick={addDestination} className="bg-cyan-500 text-white px-6 py-4 rounded-2xl font-bold">추가</button>
                </div>
                
                {newTrip.destinations.length > 0 && (
                  <div className="space-y-3">
                    {newTrip.destinations.map((dest, idx) => (
                      <div key={idx} className="bg-white/10 border border-white/20 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">{dest}</span>
                          <button onClick={() => {
                            setNewTrip({ ...newTrip, destinations: newTrip.destinations.filter(d => d !== dest) });
                            const newInput = { ...cityDaysInput };
                            delete newInput[dest];
                            setCityDaysInput(newInput);
                          }} className="text-red-400 hover:text-red-300">
                            <X size={20} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            placeholder="3"
                            value={cityDaysInput[dest] || ''}
                            onChange={(e) => setCityDaysInput({ ...cityDaysInput, [dest]: e.target.value })}
                            className="w-20 bg-white/10 border border-white/20 text-white placeholder-white/50 px-3 py-2 rounded-xl text-center"
                          />
                          <span className="text-white/70 text-sm">일 체류 (기본 3일)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-white font-semibold text-sm mb-2 block">시작일</label>
                <input type="date" value={newTrip.startDate} onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })} className="w-full bg-white/10 border border-white/20 text-white px-4 py-4 rounded-2xl" />
              </div>

              {calculatedEndDate && (
                <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-2xl p-4">
                  <div className="text-white/70 text-sm mb-1">📅 자동 계산된 종료일</div>
                  <div className="text-white font-bold text-lg">{calculatedEndDate}</div>
                  <div className="text-white/60 text-xs mt-1">총 {newTrip.destinations.reduce((sum, dest) => sum + (parseInt(cityDaysInput[dest]) || 3), 0)}일</div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowTripForm(false); setCityDaysInput({}); setNewTrip({ name: '', destinations: [], startDate: '' }); }} className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-bold">취소</button>
              <button onClick={handleCreateTrip} className="flex-1 bg-gradient-to-r from-cyan-500 to-sky-500 text-white py-4 rounded-2xl font-bold shadow-2xl">만들기</button>
            </div>
          </div>
        </div>
      )}

      {showPlaceSearch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-2xl">🔍 장소 검색</h3>
              <button onClick={() => setShowPlaceSearch(false)} className="text-white/70 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl"
              >
                <option value="">도시 선택</option>
                {currentTrip?.destinations?.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="검색어 (예: 카페, 레스토랑)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPlaces(searchQuery)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-xl"
              />

              <select
                value={selectedDayForAdd}
                onChange={(e) => setSelectedDayForAdd(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl"
              >
                {Array.from({ length: getTripDays() }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}일차에 추가</option>
                ))}
              </select>

              <button
                onClick={() => searchPlaces(searchQuery)}
                disabled={isSearching}
                className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map(place => {
                  const cat = getCategoryConfig(place.category);
                  return (
                    <div key={place.id} className="bg-white/10 border border-white/20 rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-bold flex items-center gap-2">
                            <span className="text-xl">{cat.icon}</span>
                            {place.name}
                          </h4>
                          <p className="text-white/60 text-xs">{cat.label}</p>
                        </div>
                        <span className="text-yellow-400 text-sm">⭐ {place.rating}</span>
                      </div>
                      <p className="text-white/70 text-sm mb-3">{place.description}</p>
                      <button
                        onClick={() => addPlace(place)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 rounded-lg font-bold"
                      >
                        + 추가하기
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}