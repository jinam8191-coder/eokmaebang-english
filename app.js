const names = ['김민준','이서윤','박도윤','최하은','정시우','한지아','윤서준','송예린','오지호','강채원','임현우','조수아','신유준','권나은','황도현','안서아','문지훈','백다인','유건우','고예은','서준혁','장하린','노태윤','홍지우','전민재','배서현','성우진','양지민','류시안','차예나'];
const schools = ['해솔초','푸른초','새봄초','한빛초','늘봄초'];
const colors = ['blue','orange','green','purple'];
const students = names.map((name, index) => {
  const gradeNumber = (index % 6) + 1;
  const base = 72 + ((index * 7) % 24);
  return {
    id: index + 1,
    name,
    school: schools[index % schools.length],
    grade: `초등 ${gradeNumber}학년`,
    className: gradeNumber <= 2 ? 'Starter' : gradeNumber <= 4 ? 'Grow' : 'Jump',
    word: base,
    reading: Math.min(98, base + ((index % 3) - 1) * 3),
    listening: Math.min(99, base + ((index % 4) - 1) * 2),
    speaking: Math.max(65, base - 5 + (index % 5)),
    attendance: index === 7 || index === 22 ? '결석' : index === 14 ? '지각' : '출석',
    color: colors[index % colors.length]
  };
});

const pageMeta = {
  dashboard: ['안녕하세요, 원장님!', '초등 1~6학년 영어 학습 현황'],
  students: ['학생 관리', '예시 학생 30명의 기본 정보와 학습 상태'],
  attendance: ['출결 관리', '오늘 출석·지각·결석을 한눈에 확인하세요'],
  learning: ['영어 학습 관리', '단어·리딩·리스닝·스피킹 변화를 기록하세요'],
  counseling: ['상담 및 알림', '학부모 상담 기록과 안내문을 관리하세요'],
  reports: ['AI 학습보고서', '학생 학습정보로 학부모용 보고서를 준비하세요'],
  settings: ['학원 설정', '억매방의 기본 정보를 확인하세요']
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(item => item.classList.toggle('active', item.dataset.page === name));
  document.getElementById(`${name}-page`)?.classList.add('active');
  document.getElementById('pageTitle').textContent = pageMeta[name][0];
  document.getElementById('pageEyebrow').textContent = pageMeta[name][1];
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.go)));
document.getElementById('mobileMenu').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

function renderStudents(list = students) {
  document.getElementById('studentTableBody').innerHTML = list.map(student => `<tr>
    <td><div class="student-cell"><div class="mini-avatar ${student.color}-bg">${student.name[0]}</div><div><strong>${student.name}</strong><small>재원생</small></div></div></td>
    <td><b>${student.school}</b><small>${student.grade}</small></td>
    <td><span class="badge blue">${student.className}</span></td>
    <td><strong>${student.word}</strong>점</td><td>${student.reading}점</td><td>${student.listening}점</td><td>${student.speaking}점</td>
    <td class="${student.attendance === '출석' ? 'status-ok' : student.attendance === '결석' ? 'status-bad' : 'status-wait'}">${student.attendance}</td>
  </tr>`).join('');
  document.getElementById('studentListCount').textContent = list.length;
}

function filterStudents() {
  const query = document.getElementById('studentSearch').value.trim().toLowerCase();
  const grade = document.getElementById('gradeFilter').value;
  renderStudents(students.filter(student => (!query || student.name.toLowerCase().includes(query) || student.school.toLowerCase().includes(query)) && (grade === 'all' || student.grade === grade)));
}

document.getElementById('studentSearch').addEventListener('input', filterStudents);
document.getElementById('gradeFilter').addEventListener('change', filterStudents);
document.getElementById('globalSearch').addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  showPage('students');
  document.getElementById('studentSearch').value = event.target.value;
  filterStudents();
});

document.getElementById('attendanceBody').innerHTML = students.map(student => `<tr><td><b>${student.name}</b></td><td>${student.grade}</td><td><select class="attendance-select"><option ${student.attendance === '출석' ? 'selected' : ''}>출석</option><option ${student.attendance === '지각' ? 'selected' : ''}>지각</option><option ${student.attendance === '결석' ? 'selected' : ''}>결석</option></select></td><td><input class="progress-input" placeholder="메모 입력" /></td></tr>`).join('');
document.getElementById('learningBody').innerHTML = students.map(student => `<tr><td><b>${student.name}</b><small>${student.grade}</small></td><td>${student.word}점</td><td>${student.reading}점</td><td>${student.listening}점</td><td>${student.speaking}점</td><td>${student.className === 'Starter' ? '파닉스와 기초 문장' : student.className === 'Grow' ? '리딩 지문과 핵심 어휘' : '발표와 문장 쓰기'}</td></tr>`).join('');

document.getElementById('counselingList').innerHTML = students.slice(0, 5).map((student, index) => `<button class="todo-item"><span class="todo-icon ${student.color}">${student.name[0]}</span><div><strong>${student.name} 학부모</strong><p>${index % 2 ? '학습 태도와 숙제 습관 상담' : '이번 달 영어 성장 안내'}</p></div><span>›</span></button>`).join('');

const reportStudent = document.getElementById('reportStudent');
reportStudent.innerHTML = students.map(student => `<option value="${student.id}">${student.name} · ${student.grade}</option>`).join('');

function reportMarkup(student, template, memo) {
  const title = template === 'story' ? '성장 스토리' : template === 'weekly' ? '주간 체크' : '클래식 리포트';
  const content = template === 'story'
    ? `<div class="story-flow"><div><small>지난달</small><strong>${student.word - 4}점</strong><p>기초 어휘를 꾸준히 익혔어요.</p></div><b>→</b><div><small>이번 달</small><strong>${student.word}점</strong><p>리딩과 말하기 자신감이 자랐어요.</p></div><b>→</b><div><small>다음 목표</small><strong>${Math.min(100, student.word + 5)}점</strong><p>완전한 문장으로 말하기에 도전해요.</p></div></div>`
    : template === 'weekly'
      ? `<div class="score-grid"><div><span>단어</span><strong>${student.word}</strong></div><div><span>리딩</span><strong>${student.reading}</strong></div><div><span>리스닝</span><strong>${student.listening}</strong></div><div><span>스피킹</span><strong>${student.speaking}</strong></div></div>`
      : `<div class="classic-copy"><p><b>점수 변화</b> 단어 점수가 지난달보다 4점 올랐습니다.</p><p><b>학습 내용</b> ${student.className === 'Starter' ? '파닉스와 기초 문장' : student.className === 'Grow' ? '리딩 지문과 핵심 어휘' : '발표와 문장 쓰기'}</p><p><b>선생님 코멘트</b> ${memo || '수업에 성실하게 참여하며 영어 자신감을 키우고 있습니다.'}</p></div>`;
  return `<span class="section-kicker">${title}</span><h2>${student.name} 학생 영어 학습보고서</h2><p class="report-date">억매방 · ${student.grade} · 이번 달</p>${content}<div class="teacher-comment"><strong>선생님 한마디</strong><p>${memo || '꾸준한 노력으로 좋은 변화를 만들고 있어요. 다음 달도 함께 힘내요!'}</p></div><div class="report-actions"><button class="secondary-button" data-export="image">이미지 저장</button><button class="secondary-button" data-export="pdf">PDF 저장</button><button class="primary-button" data-export="share">휴대폰 공유</button></div>`;
}

document.getElementById('generateReport').addEventListener('click', () => {
  const student = students.find(item => item.id === Number(reportStudent.value));
  const template = document.querySelector('input[name="template"]:checked').value;
  document.getElementById('reportPreview').innerHTML = reportMarkup(student, template, document.getElementById('teacherMemo').value.trim());
  toast('예시 보고서 미리보기를 만들었습니다. AI 연결은 3단계에서 진행합니다.');
});

document.addEventListener('click', event => {
  if (!event.target.matches('[data-export]')) return;
  toast('저장과 공유 기능은 OpenAI API 연결 후 3단계에서 완성합니다.');
});
document.getElementById('saveAttendance').addEventListener('click', () => toast('예시 출결 기록을 이 기기에 저장했습니다.'));
document.getElementById('noticeDraft').addEventListener('click', () => toast('안내문 AI 생성은 3단계에서 연결합니다.'));

function toast(message) {
  const element = document.getElementById('toast');
  element.querySelector('p').textContent = message;
  element.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
}

renderStudents();
