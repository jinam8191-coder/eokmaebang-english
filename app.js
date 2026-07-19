const initialStudents = [
  {name:'김도윤',school:'온수초',grade:'초등 6학년',phone:'010-2451-1032',className:'초6 심화반',homework:76,attendance:'출석',payment:'완료',color:'blue'},
  {name:'이서아',school:'온수초',grade:'초등 6학년',phone:'010-8832-2041',className:'초6 심화반',homework:100,attendance:'결석',payment:'미납',color:'orange'},
  {name:'박지후',school:'부일중',grade:'중등 2학년',phone:'010-5341-8670',className:'중2 A반',homework:64,attendance:'출석',payment:'미납',color:'purple'},
  {name:'최하윤',school:'부천초',grade:'초등 4학년',phone:'010-4077-2219',className:'초4 A반',homework:92,attendance:'출석',payment:'완료',color:'green'},
  {name:'정민재',school:'동곡초',grade:'초등 5학년',phone:'010-7712-9304',className:'초5 기본반',homework:88,attendance:'지각',payment:'완료',color:'orange'},
  {name:'강시우',school:'역곡중',grade:'중등 1학년',phone:'010-1823-4471',className:'중1 개념반',homework:95,attendance:'출석',payment:'완료',color:'blue'},
  {name:'윤아린',school:'온수초',grade:'초등 4학년',phone:'010-6240-3517',className:'초4 A반',homework:82,attendance:'출석',payment:'완료',color:'purple'},
  {name:'한서진',school:'오류중',grade:'중등 3학년',phone:'010-9350-6284',className:'중3 내신반',homework:71,attendance:'출석',payment:'완료',color:'green'}
];

let students = JSON.parse(localStorage.getItem('onsuhak_students') || 'null') || initialStudents;
students = students.map((student,index)=>({...student,id:student.id||`student-${index}-${String(student.phone||'').replace(/\D/g,'')||'none'}`}));
const classStudents = {
  elementary6: [
    {name:'김도윤',grade:'초6',color:'blue',attendance:'present',homework:'partial',progress:'최상위 4단원 p.72–75',attitude:'집중',makeup:'없음',memo:'계산 실수 확인'},
    {name:'이서아',grade:'초6',color:'orange',attendance:'present',homework:'done',progress:'최상위 4단원 p.72–75',attitude:'매우 좋음',makeup:'없음',memo:''},
    {name:'전하린',grade:'초6',color:'purple',attendance:'late',homework:'done',progress:'최상위 4단원 p.72–74',attitude:'보통',makeup:'없음',memo:'10분 지각'},
    {name:'고시온',grade:'초6',color:'green',attendance:'absent',homework:'missing',progress:'',attitude:'미입력',makeup:'필요',memo:'보호자 연락 완료'}
  ],
  middle2: [
    {name:'박지후',grade:'중2',color:'purple',attendance:'present',homework:'missing',progress:'연립방정식 p.88–92',attitude:'보통',makeup:'없음',memo:'숙제 상담 필요'},
    {name:'강민성',grade:'중2',color:'blue',attendance:'present',homework:'done',progress:'연립방정식 p.88–92',attitude:'매우 좋음',makeup:'없음',memo:''},
    {name:'윤지우',grade:'중2',color:'orange',attendance:'present',homework:'partial',progress:'연립방정식 p.88–90',attitude:'집중',makeup:'없음',memo:''}
  ],
  middle3: [
    {name:'한서진',grade:'중3',color:'green',attendance:'present',homework:'done',progress:'이차함수 학교별 기출',attitude:'매우 좋음',makeup:'없음',memo:''},
    {name:'문지율',grade:'중3',color:'blue',attendance:'present',homework:'done',progress:'이차함수 학교별 기출',attitude:'집중',makeup:'없음',memo:''},
    {name:'신재윤',grade:'중3',color:'orange',attendance:'late',homework:'partial',progress:'이차함수 학교별 기출',attitude:'보통',makeup:'없음',memo:'오답노트 재검사'}
  ]
};

const pageMeta = {
  dashboard:{title:'안녕하세요, 원장님!',eyebrow:'2026년 7월 5일 일요일'},daily:{title:'오늘 수업',eyebrow:'출석부터 진도까지 한 번에 기록하세요'},students:{title:'원생 관리',eyebrow:'원생 정보와 학습 이력을 한곳에서 관리하세요'},homework:{title:'숙제·출석',eyebrow:'놓치기 쉬운 학습 습관을 확인하세요'},billing:{title:'수납 관리',eyebrow:'월별 수강료와 미납 현황을 확인하세요'},makeup:{title:'보강 관리',eyebrow:'결석부터 보강 완료까지 빠짐없이 관리하세요'},reports:{title:'통계·보고서',eyebrow:'기록이 쌓일수록 학원 운영이 선명해집니다'},settings:{title:'학원 설정',eyebrow:'온수학의 기본 정보와 운영 환경을 관리하세요'}
};

function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page]').forEach(n=>n.classList.toggle('active',n.dataset.page===name));
  document.getElementById(`${name}-page`)?.classList.add('active');
  document.getElementById('pageTitle').textContent=pageMeta[name].title;
  document.getElementById('pageEyebrow').textContent=pageMeta[name].eyebrow;
  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.page)));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>{showPage(btn.dataset.go);if(btn.dataset.action==='add')setTimeout(openStudentModal,120)}));
document.getElementById('mobileMenu').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function saveStudents(){localStorage.setItem('onsuhak_students',JSON.stringify(students))}
function renderStudents(list=students){
  const body=document.getElementById('studentTableBody');
  body.innerHTML=list.map(s=>`<tr data-student-id="${escapeHtml(s.id)}"><td><input type="checkbox" /></td><td><div class="student-cell"><div class="mini-avatar ${s.color}-bg">${escapeHtml(s.name[0])}</div><div><strong>${escapeHtml(s.name)}</strong><small>재원생</small></div></div></td><td><b>${escapeHtml(s.school)}</b><small>${escapeHtml(s.grade)}</small></td><td>${escapeHtml(s.phone)}</td><td><span class="badge blue">${escapeHtml(s.className)}</span></td><td><span class="progress"><i style="width:${Number(s.homework)||0}%"></i></span>${Number(s.homework)||0}%</td><td class="${s.attendance==='출석'?'status-ok':s.attendance==='결석'?'status-bad':'status-wait'}">${escapeHtml(s.attendance)}</td><td><span class="badge ${s.payment==='완료'?'green':'red'}">${s.payment==='완료'?'납부 완료':'미납'}</span></td><td><div class="row-actions"><button class="table-action edit-student" data-id="${escapeHtml(s.id)}">수정</button><button class="table-action delete-student" data-id="${escapeHtml(s.id)}">삭제</button></div></td></tr>`).join('');
  document.getElementById('studentListCount').textContent=list.length;
  document.getElementById('elementaryCount').textContent=students.filter(s=>s.grade.startsWith('초등')).length;
  document.getElementById('middleCount').textContent=students.filter(s=>s.grade.startsWith('중등')).length;
  document.getElementById('totalStudentCount').innerHTML=`${students.length+37}<small>명</small>`;
}

function filterStudents(){
  const query=document.getElementById('studentSearch').value.trim().toLowerCase();
  const grade=document.getElementById('gradeFilter').value;
  renderStudents(students.filter(s=>(!query||s.name.toLowerCase().includes(query)||s.school.toLowerCase().includes(query))&&(grade==='all'||s.grade===grade)));
}
document.getElementById('studentSearch').addEventListener('input',filterStudents);
document.getElementById('gradeFilter').addEventListener('change',filterStudents);
document.getElementById('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){showPage('students');document.getElementById('studentSearch').value=e.target.value;filterStudents()}});

function statusOptions(type,current){
  const options=type==='attendance'?[['present','출석'],['late','지각'],['absent','결석'],['early','조퇴']]:[['done','완료'],['partial','일부 완료'],['missing','미제출'],['none','숙제 없음']];
  return options.map(([v,t])=>`<option value="${v}" ${v===current?'selected':''}>${t}</option>`).join('');
}
function renderClassRecords(key='elementary6'){
  const names={elementary6:'초등 6학년 심화반',middle2:'중등 2학년 A반',middle3:'중등 3학년 내신반'};
  document.getElementById('recordClassTitle').textContent=names[key];
  document.getElementById('classRecordBody').innerHTML=classStudents[key].map((s,i)=>`<tr data-index="${i}"><td><div class="student-cell"><div class="mini-avatar ${s.color}-bg">${s.name[0]}</div><div><strong>${s.name}</strong><small>${s.grade}</small></div></div></td><td><select class="status-select" data-type="attendance" data-state="${s.attendance}">${statusOptions('attendance',s.attendance)}</select></td><td><select class="status-select" data-type="homework" data-state="${s.homework}">${statusOptions('homework',s.homework)}</select></td><td><input class="progress-input" value="${s.progress}" placeholder="교재·페이지" /></td><td><select><option ${s.attitude==='매우 좋음'?'selected':''}>매우 좋음</option><option ${s.attitude==='집중'?'selected':''}>집중</option><option ${s.attitude==='보통'?'selected':''}>보통</option><option ${s.attitude==='주의 필요'?'selected':''}>주의 필요</option><option ${s.attitude==='미입력'?'selected':''}>미입력</option></select></td><td><select><option ${s.makeup==='없음'?'selected':''}>없음</option><option ${s.makeup==='필요'?'selected':''}>필요</option><option ${s.makeup==='예약됨'?'selected':''}>예약됨</option></select></td><td><input value="${s.memo}" placeholder="메모 입력" /></td></tr>`).join('');
  document.querySelectorAll('.status-select').forEach(select=>select.addEventListener('change',()=>select.dataset.state=select.value));
}

document.getElementById('classTabs').addEventListener('click',e=>{const btn=e.target.closest('button[data-class]');if(!btn)return;document.querySelectorAll('#classTabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderClassRecords(btn.dataset.class)});
document.getElementById('applyAllHomework').addEventListener('click',()=>{document.querySelectorAll('select[data-type="homework"]').forEach(s=>{s.value='done';s.dataset.state='done'});toast('모든 학생의 숙제를 완료로 표시했습니다.')});
function saveClass(){localStorage.setItem('onsuhak_last_save',new Date().toISOString());toast('오늘 수업 기록을 안전하게 저장했습니다.')}
document.getElementById('saveClass').addEventListener('click',saveClass);document.getElementById('saveClassBottom').addEventListener('click',saveClass);

const modal=document.getElementById('studentModal');
const deleteModal=document.getElementById('deleteModal');
const studentForm=document.getElementById('studentForm');
let editingStudentId=null;
let pendingDeleteId=null;
function showStudentModal(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');setTimeout(()=>studentForm.elements.name.focus(),100)}
function openStudentModal(){
  editingStudentId=null;
  studentForm.reset();
  document.getElementById('studentModalKicker').textContent='NEW STUDENT';
  document.getElementById('studentModalTitle').textContent='새 원생 등록';
  document.getElementById('studentSubmit').textContent='원생 등록하기';
  showStudentModal();
}
function openEditStudentModal(id){
  const student=students.find(item=>item.id===id);
  if(!student)return;
  editingStudentId=id;
  studentForm.elements.name.value=student.name||'';
  studentForm.elements.school.value=student.school||'';
  studentForm.elements.grade.value=student.grade||'';
  studentForm.elements.className.value=student.className||'개별 지정';
  studentForm.elements.phone.value=student.phone==='미등록'?'':student.phone||'';
  studentForm.elements.parentPhone.value=student.parentPhone||'';
  studentForm.elements.memo.value=student.memo||'';
  document.getElementById('studentModalKicker').textContent='EDIT STUDENT';
  document.getElementById('studentModalTitle').textContent='원생 정보 수정';
  document.getElementById('studentSubmit').textContent='수정 내용 저장';
  showStudentModal();
}
function closeStudentModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');editingStudentId=null}
document.getElementById('openStudentModal').addEventListener('click',openStudentModal);
document.querySelector('.modal-close').addEventListener('click',closeStudentModal);document.querySelector('.modal-cancel').addEventListener('click',closeStudentModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeStudentModal()});
studentForm.addEventListener('submit',e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.target));
  if(editingStudentId){
    const index=students.findIndex(student=>student.id===editingStudentId);
    if(index!==-1)students[index]={...students[index],name:data.name,school:data.school,grade:data.grade,phone:data.phone||'미등록',parentPhone:data.parentPhone,className:data.className,memo:data.memo};
    saveStudents();filterStudents();closeStudentModal();toast(`${data.name} 원생 정보를 수정했습니다.`);
  }else{
    students.unshift({id:`student-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name:data.name,school:data.school,grade:data.grade,phone:data.phone||'미등록',parentPhone:data.parentPhone,className:data.className,memo:data.memo,homework:100,attendance:'출석',payment:'미납',color:['blue','orange','green','purple'][students.length%4]});
    saveStudents();filterStudents();closeStudentModal();e.target.reset();toast(`${data.name} 원생을 등록했습니다.`);
  }
});
document.getElementById('studentTableBody').addEventListener('click',e=>{
  const editButton=e.target.closest('.edit-student');
  const deleteButton=e.target.closest('.delete-student');
  if(editButton)openEditStudentModal(editButton.dataset.id);
  if(deleteButton){
    const student=students.find(item=>item.id===deleteButton.dataset.id);
    if(!student)return;
    pendingDeleteId=student.id;
    document.getElementById('deleteStudentName').textContent=student.name;
    deleteModal.classList.add('open');deleteModal.setAttribute('aria-hidden','false');
  }
});
function closeDeleteModal(){deleteModal.classList.remove('open');deleteModal.setAttribute('aria-hidden','true');pendingDeleteId=null}
document.getElementById('cancelDelete').addEventListener('click',closeDeleteModal);
deleteModal.addEventListener('click',e=>{if(e.target===deleteModal)closeDeleteModal()});
document.getElementById('confirmDelete').addEventListener('click',()=>{
  const student=students.find(item=>item.id===pendingDeleteId);
  if(!student)return closeDeleteModal();
  students=students.filter(item=>item.id!==pendingDeleteId);
  saveStudents();filterStudents();closeDeleteModal();toast(`${student.name} 원생을 삭제했습니다.`);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeStudentModal();closeDeleteModal()}});

function toast(message){const el=document.getElementById('toast');el.querySelector('p').textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
document.querySelectorAll('.pay-now').forEach(b=>b.addEventListener('click',e=>{e.target.closest('tr').querySelector('.badge').className='badge green';e.target.closest('tr').querySelector('.badge').textContent='납부 완료';e.target.replaceWith(document.createTextNode('처리됨'));toast('수납 완료로 처리했습니다.')}));
document.getElementById('billingAdd').addEventListener('click',()=>toast('수납 등록 기능을 열었습니다.'));
document.querySelectorAll('.schedule-makeup').forEach(b=>b.addEventListener('click',()=>toast('보강 일정 입력을 시작합니다.')));
document.querySelectorAll('.complete-makeup').forEach(b=>b.addEventListener('click',e=>{e.target.textContent='완료됨';e.target.disabled=true;toast('보강을 완료 처리했습니다.')}));
document.getElementById('saveSettings').addEventListener('click',()=>toast('학원 설정을 저장했습니다.'));
document.querySelectorAll('.period').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.period').forEach(x=>x.classList.remove('active'));b.classList.add('active');toast(`${b.textContent} 통계로 변경했습니다.`)}));

renderStudents();renderClassRecords();
