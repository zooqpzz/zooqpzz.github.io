// 스마트 몰입 학습 대시보드 v2.0 - 핵심 비즈니스 로직

// 과목 메타데이터 정의
const SUBJECTS = {
  all: { name: '전체', emoji: '📌', color: '#ffffff', glow: 'rgba(255, 255, 255, 0.15)' },
  korean: { name: '국어', emoji: '🇰🇷', color: '#ff6b6b', glow: 'rgba(255, 107, 107, 0.25)' },
  math: { name: '수학', emoji: '📐', color: '#4d96ff', glow: 'rgba(77, 150, 255, 0.25)' },
  english: { name: '영어', emoji: '🔤', color: '#6bcb77', glow: 'rgba(107, 203, 119, 0.25)' },
  science: { name: '과학', emoji: '🔬', color: '#9d4edd', glow: 'rgba(157, 78, 221, 0.25)' },
  social: { name: '사회', emoji: '🌍', color: '#ff923c', glow: 'rgba(255, 146, 60, 0.25)' },
  history: { name: '역사', emoji: '📜', color: '#e0a96d', glow: 'rgba(224, 169, 109, 0.25)' }
};

// 동기부여 명언 데이터
const QUOTES = [
  "오늘 흘린 땀은 내일의 확실한 결과가 된다.",
  "성공은 영원하지 않고, 실패는 치명적이지 않다. 중요한 것은 계속 나아가는 용기다.",
  "배움은 결코 마음을 고갈시키지 않는다. — 레오나르도 다 빈치",
  "할 수 있다고 믿는 사람은 결국 해내고, 할 수 없다고 믿는 사람은 결국 해내지 못한다.",
  "천재는 1%의 영감과 99%의 노력으로 이루어진다. — 토마스 에디슨",
  "오늘의 노력이 내일의 당신을 만든다.",
  "포기하는 것은 언제나 가장 쉬운 선택이다. 하지만 끝까지 버텨낸 자만이 달콤한 열매를 맛본다.",
  "지식을 얻기 위해서는 공부를 해야 하고, 지혜를 얻기 위해서는 관찰을 해야 한다.",
  "최고의 복수는 보란 듯이 성공하는 것이다.",
  "몰입이란 내가 가진 모든 에너지를 한곳에 쏟아붓는 가장 순수한 몰아의 상태이다."
];

// 애플리케이션 상태 (State)
let state = {
  todos: [],
  activeTab: 'all',
  dday: {
    title: '중요한 시험',
    date: ''
  },
  youtubeUrl: '',
  timer: {
    minutes: 25,
    seconds: 0,
    initialMinutes: 25,
    initialSeconds: 0,
    isRunning: false,
    intervalId: null,
    mode: 'work' // 'work', 'break', 'custom'
  }
};

// DOM 요소 캐싱
const ddaySection = document.getElementById('ddaySection');
const ddayTitle = document.getElementById('ddayTitle');
const ddayDays = document.getElementById('ddayDays');
const openDdayModalBtn = document.getElementById('openDdayModalBtn');
const ddayModal = document.getElementById('ddayModal');
const closeDdayModal = document.getElementById('closeDdayModal');
const cancelDdayModal = document.getElementById('cancelDdayModal');
const saveDdayModal = document.getElementById('saveDdayModal');
const inputDdayTitle = document.getElementById('inputDdayTitle');
const inputDdayDate = document.getElementById('inputDdayDate');

const quoteText = document.getElementById('quoteText');
const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');

const tabButtons = document.querySelectorAll('.tab-btn');

const timerStatusBadge = document.getElementById('timerStatusBadge');
const timerDisplay = document.getElementById('timerDisplay');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerPauseBtn = document.getElementById('timerPauseBtn');
const timerResetBtn = document.getElementById('timerResetBtn');
const timerModeButtons = document.querySelectorAll('.mode-btn');

const timerModal = document.getElementById('timerModal');
const closeTimerModal = document.getElementById('closeTimerModal');
const cancelTimerModal = document.getElementById('cancelTimerModal');
const saveTimerModal = document.getElementById('saveTimerModal');
const inputTimerMin = document.getElementById('inputTimerMin');
const inputTimerSec = document.getElementById('inputTimerSec');

const subjectProgressLabel = document.getElementById('subjectProgressLabel');
const subjectProgressVal = document.getElementById('subjectProgressVal');
const subjectProgressBar = document.getElementById('subjectProgressBar');
const totalProgressVal = document.getElementById('totalProgressVal');
const totalProgressBar = document.getElementById('totalProgressBar');

const todoSubjectTitle = document.getElementById('todoSubjectTitle');
const todoCounter = document.getElementById('todoCounter');
const todoForm = document.getElementById('todoForm');
const todoSubjectSelect = document.getElementById('todoSubjectSelect');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

const bgmUrlInput = document.getElementById('bgmUrlInput');
const bgmPlayBtn = document.getElementById('bgmPlayBtn');
const presetButtons = document.querySelectorAll('.preset-btn');
const youtubeEmbedArea = document.getElementById('youtubeEmbedArea');

// --- 초기화 로직 ---
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initDday();
  initQuotes();
  initTabs();
  initTimer();
  initTodos();
  initBgmPlayer();
  
  // D-Day & Timer 모달 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === ddayModal) closeDdayModalFunc();
    if (e.target === timerModal) closeTimerModalFunc();
  });
});

// 로컬 스토리지로부터 상태 로드
function loadState() {
  const storedTodos = localStorage.getItem('study_dashboard_todos');
  const storedDday = localStorage.getItem('study_dashboard_dday');
  const storedBgm = localStorage.getItem('study_dashboard_bgm');
  
  if (storedTodos) {
    state.todos = JSON.parse(storedTodos);
  } else {
    // 기본 투두 샘플 제공
    state.todos = [
      { id: 1, subject: 'korean', text: '문학 지문 분석 완료하기', completed: false },
      { id: 2, subject: 'math', text: '수학 기출 오답노트 정리', completed: true },
      { id: 3, subject: 'english', text: '영어 수능단어 Day 12 암기', completed: false },
      { id: 4, subject: 'history', text: '조선 왕조 건국 과정 연표 그리기', completed: false }
    ];
    saveTodos();
  }
  
  if (storedDday) {
    state.dday = JSON.parse(storedDday);
  } else {
    // 오늘 기준 30일 뒤를 기본 D-Day 설정
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    state.dday = {
      title: '중요한 시험',
      date: thirtyDaysLater.toISOString().split('T')[0]
    };
    saveDday();
  }
  
  if (storedBgm) {
    state.youtubeUrl = storedBgm;
    bgmUrlInput.value = storedBgm;
  }
}

// 로컬 스토리지 저장 헬퍼
function saveTodos() {
  localStorage.setItem('study_dashboard_todos', JSON.stringify(state.todos));
}

function saveDday() {
  localStorage.setItem('study_dashboard_dday', JSON.stringify(state.dday));
}

function saveBgm(url) {
  localStorage.setItem('study_dashboard_bgm', url);
}

// --- D-Day 로직 ---
function initDday() {
  updateDdayUI();
  
  ddaySection.addEventListener('click', openDdayModalFunc);
  openDdayModalBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // 부모클릭 이벤트 방지
    openDdayModalFunc();
  });
  closeDdayModal.addEventListener('click', closeDdayModalFunc);
  cancelDdayModal.addEventListener('click', closeDdayModalFunc);
  saveDdayModal.addEventListener('click', saveDdaySettings);
}

function updateDdayUI() {
  ddayTitle.textContent = state.dday.title;
  
  if (!state.dday.date) {
    ddayDays.textContent = 'D-Day';
    return;
  }
  
  const targetDate = new Date(state.dday.date + 'T00:00:00');
  const today = new Date();
  
  // 시간 정보 제거 후 날짜 차이만 비교
  today.setHours(0,0,0,0);
  targetDate.setHours(0,0,0,0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    ddayDays.textContent = 'D-Day';
    ddayDays.style.color = '#ff6b6b';
  } else if (diffDays > 0) {
    ddayDays.textContent = `D-${diffDays}`;
    ddayDays.style.color = '#ff6b6b';
  } else {
    ddayDays.textContent = `D+${Math.abs(diffDays)}`;
    ddayDays.style.color = '#94a3b8'; // 지난 날짜는 흐리게 표시
  }
}

function openDdayModalFunc() {
  inputDdayTitle.value = state.dday.title;
  inputDdayDate.value = state.dday.date;
  ddayModal.classList.add('active');
}

function closeDdayModalFunc() {
  ddayModal.classList.remove('active');
}

function saveDdaySettings() {
  const newTitle = inputDdayTitle.value.trim() || '중요한 시험';
  const newDate = inputDdayDate.value;
  
  if (!newDate) {
    alert('날짜를 입력해 주세요!');
    return;
  }
  
  state.dday = { title: newTitle, date: newDate };
  saveDday();
  updateDdayUI();
  closeDdayModalFunc();
}

// --- 명언 로직 ---
function initQuotes() {
  // 초기 명언 로드
  refreshQuote();
  
  refreshQuoteBtn.addEventListener('click', refreshQuote);
}

function refreshQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  quoteText.textContent = QUOTES[randomIndex];
  
  // 간단한 페이드인 애니메이션
  quoteText.style.opacity = 0;
  setTimeout(() => {
    quoteText.style.opacity = 1;
  }, 50);
}

// --- 탭 필터링 로직 ---
function initTabs() {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 액티브 클래스 교체
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const subject = btn.dataset.subject;
      state.activeTab = subject;
      
      // To-Do 타이틀 및 투두 필터링 목록 업데이트
      updateTodoList();
      
      // 탭 전환 시 할 일 추가 폼의 과목 선택 드롭다운 상태를 토글
      if (subject === 'all') {
        todoSubjectSelect.style.display = 'block';
      } else {
        todoSubjectSelect.style.display = 'none';
      }
    });
  });
}

// --- To-Do 리스트 로직 ---
function initTodos() {
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
  });
  
  updateTodoList();
}

function updateTodoList() {
  // 필터링된 투두 계산
  const filtered = state.activeTab === 'all' 
    ? state.todos 
    : state.todos.filter(t => t.subject === state.activeTab);
    
  // 1. 헤더 갱신
  const subMeta = SUBJECTS[state.activeTab];
  todoSubjectTitle.innerHTML = `<span class="emoji">${subMeta.emoji}</span> [${subMeta.name}] 오늘의 공부 목표`;
  
  const completedCount = filtered.filter(t => t.completed).length;
  const totalCount = filtered.length;
  todoCounter.textContent = `${completedCount} / ${totalCount}`;
  
  // 2. 리스트 드로잉
  todoList.innerHTML = '';
  
  if (filtered.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.className = 'no-video-placeholder';
    emptyMsg.style.padding = '2rem';
    emptyMsg.innerHTML = '<i class="fa-solid fa-clipboard-question" style="font-size:1.5rem; opacity:0.2;"></i><p style="font-size:0.8rem; margin-top:0.4rem; color:var(--text-muted);">할 일이 없습니다. 새로 등록해 보세요!</p>';
    todoList.appendChild(emptyMsg);
  } else {
    filtered.forEach(todo => {
      const todoItem = document.createElement('li');
      todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      
      const subInfo = SUBJECTS[todo.subject] || SUBJECTS['all'];
      todoItem.style.setProperty('--subject-color', subInfo.color);
      todoItem.style.setProperty('--subject-glow', subInfo.glow);
      
      // 내부 템플릿 생성
      todoItem.innerHTML = `
        <div class="todo-left">
          <label class="todo-checkbox-wrapper">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
            <span class="todo-checkmark"></span>
          </label>
          <span class="todo-item-text">${escapeHTML(todo.text)}</span>
        </div>
        ${state.activeTab === 'all' ? `<span class="todo-subject-tag">${subInfo.name}</span>` : ''}
        <button class="delete-todo-btn" data-id="${todo.id}" title="삭제"><i class="fa-solid fa-trash-can"></i></button>
      `;
      
      // 이벤트 처리: 체크박스 변경
      const chk = todoItem.querySelector('input[type="checkbox"]');
      chk.addEventListener('change', () => toggleTodo(todo.id));
      
      // 이벤트 처리: 삭제 버튼
      const delBtn = todoItem.querySelector('.delete-todo-btn');
      delBtn.addEventListener('click', () => deleteTodo(todo.id, todoItem));
      
      todoList.appendChild(todoItem);
    });
  }
  
  // 3. 이중 달성률 프로그레스 바 갱신
  updateProgressBars();
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  
  // 선택될 과목 결정 (전체 탭일 땐 select 값 사용, 아닐 땐 현재 active 탭 사용)
  const subject = state.activeTab === 'all' ? todoSubjectSelect.value : state.activeTab;
  
  const newTodo = {
    id: Date.now(),
    subject: subject,
    text: text,
    completed: false
  };
  
  state.todos.push(newTodo);
  saveTodos();
  todoInput.value = '';
  
  updateTodoList();
}

function toggleTodo(id) {
  state.todos = state.todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  updateTodoList();
}

function deleteTodo(id, todoElement) {
  // 삭제 애니메이션 효과
  todoElement.style.opacity = 0;
  todoElement.style.transform = 'translateX(20px)';
  
  setTimeout(() => {
    state.todos = state.todos.filter(todo => todo.id !== id);
    saveTodos();
    updateTodoList();
  }, 250);
}

// 이중 달성률 프로그레스 바 업데이트
function updateProgressBars() {
  // 1. 선택 과목 달성률 계산
  const currentSubMeta = SUBJECTS[state.activeTab];
  const filtered = state.activeTab === 'all'
    ? state.todos
    : state.todos.filter(t => t.subject === state.activeTab);
    
  const subCompleted = filtered.filter(t => t.completed).length;
  const subTotal = filtered.length;
  const subPercent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;
  
  subjectProgressLabel.textContent = `선택 과목 달성률 (${currentSubMeta.name})`;
  subjectProgressVal.textContent = `${subPercent}%`;
  subjectProgressBar.style.width = `${subPercent}%`;
  
  // 선택 과목의 고유 색상 및 그림자 glow 동적 매핑
  subjectProgressBar.style.backgroundColor = currentSubMeta.color;
  subjectProgressBar.style.boxShadow = `0 0 10px ${currentSubMeta.glow}`;
  
  // 2. 전체 통합 달성률 계산
  const totalCompleted = state.todos.filter(t => t.completed).length;
  const totalCount = state.todos.length;
  const totalPercent = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
  
  totalProgressVal.textContent = `${totalPercent}%`;
  totalProgressBar.style.width = `${totalPercent}%`;
}

// --- 포모도로 타이머 로직 ---
function initTimer() {
  // 타이머 모드 탭 전환 이벤트
  timerModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.timer.isRunning) {
        if (!confirm('타이머가 작동 중입니다. 모드를 바꾸고 초기화하시겠습니까?')) {
          return;
        }
      }
      
      timerModeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const mode = btn.dataset.mode;
      state.timer.mode = mode;
      
      resetTimerByMode(mode);
    });
  });
  
  timerStartBtn.addEventListener('click', startTimer);
  timerPauseBtn.addEventListener('click', pauseTimer);
  timerResetBtn.addEventListener('click', resetTimer);
  
  // 커스텀 타이머 모달 이벤트
  closeTimerModal.addEventListener('click', closeTimerModalFunc);
  cancelTimerModal.addEventListener('click', closeTimerModalFunc);
  saveTimerModal.addEventListener('click', saveCustomTimer);
}

function resetTimerByMode(mode) {
  stopTimerInterval();
  
  if (mode === 'work') {
    state.timer.minutes = 25;
    state.timer.seconds = 0;
    state.timer.initialMinutes = 25;
    state.timer.initialSeconds = 0;
    timerStatusBadge.textContent = '집중 모드';
    timerStatusBadge.className = 'timer-status-badge';
    updateTimerDisplay();
  } else if (mode === 'break') {
    state.timer.minutes = 5;
    state.timer.seconds = 0;
    state.timer.initialMinutes = 5;
    state.timer.initialSeconds = 0;
    timerStatusBadge.textContent = '휴식 모드';
    timerStatusBadge.className = 'timer-status-badge break-mode';
    updateTimerDisplay();
  } else if (mode === 'custom') {
    openTimerModalFunc();
  }
}

function openTimerModalFunc() {
  inputTimerMin.value = state.timer.initialMinutes;
  inputTimerSec.value = state.timer.initialSeconds;
  timerModal.classList.add('active');
}

function closeTimerModalFunc() {
  timerModal.classList.remove('active');
  // 커스텀에서 취소하면 집중(Work) 모드로 되돌림
  if (state.timer.mode === 'custom' && state.timer.minutes === 25 && state.timer.seconds === 0) {
    timerModeButtons.forEach(b => {
      b.classList.remove('active');
      if (b.dataset.mode === 'work') b.classList.add('active');
    });
    state.timer.mode = 'work';
  }
}

function saveCustomTimer() {
  const min = parseInt(inputTimerMin.value) || 25;
  const sec = parseInt(inputTimerSec.value) || 0;
  
  if (min <= 0 && sec <= 0) {
    alert('최소 1초 이상의 시간을 입력해 주세요!');
    return;
  }
  
  state.timer.minutes = min;
  state.timer.seconds = sec;
  state.timer.initialMinutes = min;
  state.timer.initialSeconds = sec;
  
  timerStatusBadge.textContent = '지정 타이머';
  timerStatusBadge.className = 'timer-status-badge';
  
  updateTimerDisplay();
  closeTimerModalFunc();
}

function startTimer() {
  if (state.timer.isRunning) return;
  
  state.timer.isRunning = true;
  timerDisplay.classList.add('running');
  
  timerStartBtn.disabled = true;
  timerPauseBtn.disabled = false;
  
  state.timer.intervalId = setInterval(() => {
    if (state.timer.seconds === 0) {
      if (state.timer.minutes === 0) {
        // 타이머 만료!
        timerComplete();
        return;
      }
      state.timer.minutes--;
      state.timer.seconds = 59;
    } else {
      state.timer.seconds--;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (!state.timer.isRunning) return;
  
  stopTimerInterval();
  timerDisplay.classList.remove('running');
  
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
}

function resetTimer() {
  stopTimerInterval();
  timerDisplay.classList.remove('running');
  
  state.timer.minutes = state.timer.initialMinutes;
  state.timer.seconds = state.timer.initialSeconds;
  
  updateTimerDisplay();
  
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
}

function stopTimerInterval() {
  state.timer.isRunning = false;
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }
}

function updateTimerDisplay() {
  const m = String(state.timer.minutes).padStart(2, '0');
  const s = String(state.timer.seconds).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
}

function timerComplete() {
  stopTimerInterval();
  timerDisplay.classList.remove('running');
  
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
  
  // 알림음 재생
  playNotificationSound();
  
  // 토스트 메시지 / 알림 표시
  const modeKor = state.timer.mode === 'work' ? '집중 시간' : '휴식 시간';
  alert(`🎉 ${modeKor}이 완료되었습니다! 고생하셨습니다.`);
  
  // 다음 모드로 자동 스위칭 제안
  if (state.timer.mode === 'work') {
    // 휴식 모드로 스위칭
    timerModeButtons.forEach(b => {
      b.classList.remove('active');
      if (b.dataset.mode === 'break') b.classList.add('active');
    });
    state.timer.mode = 'break';
    resetTimerByMode('break');
  } else if (state.timer.mode === 'break') {
    // 집중 모드로 스위칭
    timerModeButtons.forEach(b => {
      b.classList.remove('active');
      if (b.dataset.mode === 'work') b.classList.add('active');
    });
    state.timer.mode = 'work';
    resetTimerByMode('work');
  }
}

// Web Audio API를 활용한 알림벨 소리 합성 재생
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // 이중 맑은 알림음 재생 함수
    const playTone = (freq, time, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration - 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
    };
    
    const now = ctx.currentTime;
    // C5 (도, 523Hz) & E5 (미, 659Hz) 조합의 맑은 울림음
    playTone(523.25, now, 0.4);
    playTone(659.25, now + 0.15, 0.5);
  } catch (e) {
    console.error('AudioContext 재생 오류:', e);
  }
}

// --- YouTube BGM Player 로직 ---
function initBgmPlayer() {
  bgmPlayBtn.addEventListener('click', () => {
    const url = bgmUrlInput.value.trim();
    if (!url) {
      alert('유튜브 영상 또는 플레이리스트 주소를 입력하세요.');
      return;
    }
    loadYoutubeEmbed(url);
  });
  
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const url = btn.dataset.url;
      bgmUrlInput.value = url;
      loadYoutubeEmbed(url);
    });
  });
  
  // 로드된 음악 URL이 존재하면 초기 부팅 시 로딩
  if (state.youtubeUrl) {
    loadYoutubeEmbed(state.youtubeUrl, false); // 오토플레이를 하지 않음으로써 브라우저 차단 우려 최소화
  }
}

function parseYoutubeUrl(url) {
  if (!url) return null;
  
  let playlistId = null;
  const playlistRegex = /[&?]list=([^&]+)/;
  const playlistMatch = url.match(playlistRegex);
  if (playlistMatch) {
    playlistId = playlistMatch[1];
  }

  let videoId = null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    videoId = match[2];
  } else {
    // Shorts 지원
    const shortsReg = /\/shorts\/([^#\&\?]+)/;
    const shortsMatch = url.match(shortsReg);
    if (shortsMatch) {
      videoId = shortsMatch[1];
    }
  }

  return { videoId, playlistId };
}

function loadYoutubeEmbed(url, autoplay = true) {
  const parsed = parseYoutubeUrl(url);
  
  if (!parsed || (!parsed.videoId && !parsed.playlistId)) {
    alert('올바르지 않은 유튜브 주소 형식입니다. 주소를 다시 확인해 주세요!');
    return;
  }
  
  state.youtubeUrl = url;
  saveBgm(url);
  
  // URL 매칭되는 프리셋 버튼 활성화 상태 표시
  presetButtons.forEach(b => {
    if (b.dataset.url === url) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  
  let embedSrc = '';
  const ap = autoplay ? '1' : '0';
  
  if (parsed.playlistId) {
    // 플레이리스트 임베드 주소
    embedSrc = `https://www.youtube.com/embed/videoseries?list=${parsed.playlistId}&autoplay=${ap}&mute=0&rel=0`;
  } else {
    // 일반 비디오 임베드 주소 (자동 루프 포함)
    embedSrc = `https://www.youtube.com/embed/${parsed.videoId}?autoplay=${ap}&mute=0&loop=1&playlist=${parsed.videoId}&rel=0`;
  }
  
  youtubeEmbedArea.innerHTML = `
    <iframe 
      src="${embedSrc}" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  `;
}

// --- 유틸리티 함수 ---
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
