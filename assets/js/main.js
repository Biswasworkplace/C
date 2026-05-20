
function safeGetStorage(key){
  try{return localStorage.getItem(key)}catch{return null}
}
function safeSetStorage(key,value){
  try{localStorage.setItem(key,value)}catch{}
}
const savedTheme=safeGetStorage('organo-theme');
document.addEventListener('click',e=>{
  const item=e.target.closest&&e.target.closest('.syllabus-item');
  if(!item) return;
  const strong=item.querySelector('strong');
  const match=strong&&strong.textContent.match(/^(\d+)\./);
  if(match){
    e.preventDefault();
    showMasterTopicDetail(Number(match[1]));
  }
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!==' ') return;
  const item=e.target.closest&&e.target.closest('.syllabus-item');
  if(!item) return;
  const strong=item.querySelector('strong');
  const match=strong&&strong.textContent.match(/^(\d+)\./);
  if(match){
    e.preventDefault();
    showMasterTopicDetail(Number(match[1]));
  }
});
if(savedTheme==='light'){
  document.body.classList.add('light-mode');
}
const themeToggle=document.getElementById('themeToggle');
function syncThemeToggle(){
  const isLight=document.body.classList.contains('light-mode');
  if(themeToggle){
    themeToggle.setAttribute('aria-label',isLight?'Switch to dark mode':'Switch to light mode');
    themeToggle.setAttribute('title',isLight?'Switch to dark mode':'Switch to light mode');
  }
}
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    document.body.classList.toggle('light-mode');
    safeSetStorage('organo-theme',document.body.classList.contains('light-mode')?'light':'dark');
    syncThemeToggle();
  });
  syncThemeToggle();
}
// ═══════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════
window.addEventListener('scroll', () => {
  const p = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress').style.width = p + '%';
});

const atlasPages=[
  'goc','stereochemistry-page','functional-groups','redox-agents','rearrangements',
  'couplings','named-reactions','analytical-practical','pharma-industrial','advanced-concepts',
  'interview-prep','structure-editor','alcohols','mechanisms','spectroscopy'
];
function activatePage(){
  if(document.body.dataset.multiPage==='true'){
    document.body.classList.remove('page-open');
    document.querySelectorAll('.atlas-page').forEach(page=>page.classList.add('active'));
    return;
  }
  const requested=(window.location.hash||'#home').replace('#','');
  const isPage=atlasPages.includes(requested);
  document.body.classList.toggle('page-open',isPage);
  atlasPages.forEach(id=>{
    const page=document.getElementById(id);
    if(page) page.classList.toggle('active',id===requested);
  });
  document.querySelectorAll('.floating-toc a').forEach(a=>{
    a.classList.toggle('active',a.dataset.section===requested);
  });
  if(isPage) window.scrollTo({top:0,behavior:'auto'});
}
window.addEventListener('hashchange',activatePage);
activatePage();

// ═══════════════════════════════════════════
// HEADER STUDY TOOLS
// ═══════════════════════════════════════════
const corePartTools=[
  {id:'goc',num:'01',name:'General Organic Chemistry',keys:'goc bonding hybridization inductive resonance acidity basicity carbocation carbanion aromaticity solvent'},
  {id:'stereochemistry-page',num:'02',name:'Stereochemistry',keys:'stereochemistry isomerism chirality enantiomer diastereomer ez rs optical activity conformations'},
  {id:'functional-groups',num:'03',name:'Functional Group Chemistry',keys:'functional groups alkane alkene alkyne arene alkyl halide alcohol phenol carbonyl amine acid ester amide'},
  {id:'redox-agents',num:'04',name:'Oxidation & Reduction',keys:'oxidation reduction pcc kmno4 lialh4 nabh4 dibal swern lindlar birch hydrogenation'},
  {id:'rearrangements',num:'05',name:'Rearrangement Reactions',keys:'rearrangement wagner meerwein pinacol beckmann hofmann curtius baeyer villiger fries claisen'},
  {id:'couplings',num:'06',name:'Coupling Reactions',keys:'coupling suzuki heck sonogashira stille negishi wurtz glaser buchwald ullmann palladium copper'},
  {id:'named-reactions',num:'07',name:'Named Reactions',keys:'named reactions grignard aldol wittig diels alder sn1 sn2 friedel crafts finkelstein elimination oxidation reduction'},
  {id:'analytical-practical',num:'08',name:'Analytical & Practical Organic',keys:'analytical practical tlc column chromatography distillation spectroscopy ir nmr ms uv purification'},
  {id:'pharma-industrial',num:'09',name:'Industrial & Pharma Organic Chemistry',keys:'pharma industrial api impurity gti nitrosamine scale up optimization green chemistry process solvent'},
  {id:'advanced-concepts',num:'10',name:'Advanced Concepts',keys:'advanced pericyclic organometallic retrosynthesis protecting groups asymmetric synthesis woodward hoffmann'},
];
const extraStudyTools=[
  {id:'interview-prep',num:'IV',name:'Interview Preparation',keys:'interview questions answers pharma r&d qa process analytical tricky'},
  {id:'structure-editor',num:'SE',name:'Online Structure Editor',keys:'structure editor sketcher draw molecule chemical smiles inchi sdf png pubchem export'},
  {id:'alcohols',num:'A1',name:'Alcohol Deep Dive',keys:'alcohol primary secondary tertiary oxidation dehydration esterification lucas test'},
  {id:'mechanisms',num:'M1',name:'Mechanisms',keys:'mechanism electron movement eas substitution elimination intermediate'},
  {id:'spectroscopy',num:'S1',name:'Spectroscopy',keys:'spectroscopy ir nmr mass uv peaks splitting chemical shift'},
];
const headerSearchItems=[...corePartTools,...extraStudyTools];
const headerSearch=document.getElementById('headerSearch');
const headerSearchResults=document.getElementById('headerSearchResults');
function renderHeaderSearch(query=''){
  if(!headerSearchResults) return;
  const q=query.trim().toLowerCase();
  const matches=headerSearchItems.filter(item=>!q || `${item.num} ${item.name} ${item.keys}`.toLowerCase().includes(q)).slice(0,8);
  headerSearchResults.innerHTML=matches.map(item=>`<a href="#${item.id}"><span>${item.num}</span>${item.name}</a>`).join('') ||
    '<div class="nav-dropdown-note">No match found. Try reagent, reaction, NMR, TLC, or pharma.</div>';
}
if(headerSearch){
  renderHeaderSearch();
  headerSearch.addEventListener('input',e=>renderHeaderSearch(e.target.value));
}

function openRandomTopic(){
  const pool=[
    ...corePartTools,
    {id:'named-reactions',num:'Rxn',name:'Grignard / Aldol / Wittig revision'},
    {id:'redox-agents',num:'Reag',name:'PCC, KMnO4, LiAlH4 and NaBH4'},
    {id:'structure-editor',num:'Draw',name:'Draw and export a chemical structure'},
    {id:'spectroscopy',num:'Spec',name:'IR and NMR interpretation'},
    {id:'pharma-industrial',num:'API',name:'Impurity and scale-up chemistry'},
    {id:'interview-prep',num:'QA',name:'Interview question practice'}
  ];
  const pick=pool[Math.floor(Math.random()*pool.length)];
  window.location.hash=pick.id;
}
document.getElementById('randomTopicBtn')?.addEventListener('click',openRandomTopic);
document.querySelectorAll('[data-random-topic]').forEach(btn=>btn.addEventListener('click',openRandomTopic));

const progressKey='organo-part-progress';
function getPartProgress(){
  try{return JSON.parse(localStorage.getItem(progressKey)||'[]')}catch{return []}
}
function setPartProgress(done){
  localStorage.setItem(progressKey,JSON.stringify(done));
}
function currentCorePartId(){
  const hash=(window.location.hash||'').replace('#','');
  return corePartTools.some(p=>p.id===hash)?hash:null;
}
function renderPartProgress(){
  const done=getPartProgress();
  const count=corePartTools.filter(p=>done.includes(p.id)).length;
  const btn=document.getElementById('progressMenuBtn');
  if(btn) btn.textContent=`${count}/10 Done`;
  const list=document.getElementById('progressList');
  if(list){
    list.innerHTML=corePartTools.map(part=>{
      const isDone=done.includes(part.id);
      return `<button type="button" class="progress-row ${isDone?'done':''}" data-progress-id="${part.id}">
        <span><span>${part.num}</span>${part.name}</span><span class="progress-check"></span>
      </button>`;
    }).join('');
    list.querySelectorAll('[data-progress-id]').forEach(row=>{
      row.addEventListener('click',()=>{
        const id=row.dataset.progressId;
        const next=getPartProgress();
        const index=next.indexOf(id);
        if(index>=0) next.splice(index,1); else next.push(id);
        setPartProgress(next);
        renderPartProgress();
      });
    });
  }
}
document.getElementById('markCurrentDone')?.addEventListener('click',()=>{
  const id=currentCorePartId();
  if(!id) return;
  const done=getPartProgress();
  if(!done.includes(id)) done.push(id);
  setPartProgress(done);
  renderPartProgress();
});
window.addEventListener('hashchange',renderPartProgress);
renderPartProgress();

// ═══════════════════════════════════════════
// PARTICLE BACKGROUND
// ═══════════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [], W, H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);
function Particle(){
  this.x=Math.random()*W;this.y=Math.random()*H;
  this.vx=(Math.random()-0.5)*0.3;this.vy=(Math.random()-0.5)*0.3;
  this.r=Math.random()*1.5+0.5;
  this.color=Math.random()>0.5?'rgba(0,229,255,':'rgba(124,58,237,';
  this.a=Math.random()*0.5+0.1;
}
for(let i=0;i<100;i++)particles.push(new Particle());
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.color+p.a+')';ctx.fill();
  });
  // Draw connections
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){
        ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(0,229,255,${0.06*(1-d/100)})`;ctx.lineWidth=0.5;ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ═══════════════════════════════════════════
// ACCORDION
// ═══════════════════════════════════════════
function toggleAcc(id){
  const item=document.getElementById(id);
  const body=item.querySelector('.accordion-body');
  const isOpen=item.classList.contains('open');
  item.classList.toggle('open',!isOpen);
  body.classList.toggle('open',!isOpen);
}

// ═══════════════════════════════════════════
// REACTION MATRIX
// ═══════════════════════════════════════════
const reactions=[
  {n:'Grignard',y:'1900',cat:'add',cl:'cat-add'},{n:'Aldol',y:'1872',cat:'add',cl:'cat-add'},
  {n:'Wittig',y:'1953',cat:'add',cl:'cat-add'},{n:'Diels-Alder',y:'1928',cat:'cyclo',cl:'cat-cyclo'},
  {n:'Michael',y:'1887',cat:'add',cl:'cat-add'},{n:'Reformatsky',y:'1887',cat:'add',cl:'cat-add'},
  {n:'Mannich',y:'1912',cat:'add',cl:'cat-add'},{n:'Knoevenagel',y:'1896',cat:'add',cl:'cat-add'},
  {n:'Perkin',y:'1868',cat:'add',cl:'cat-add'},{n:'Henry (Nitroaldol)',y:'1895',cat:'add',cl:'cat-add'},
  {n:'Claisen',y:'1881',cat:'add',cl:'cat-add'},{n:'Robinson Annul.',y:'1935',cat:'add',cl:'cat-add'},
  {n:'SN2',y:'1935',cat:'sub',cl:'cat-sub'},{n:'SN1',y:'1935',cat:'sub',cl:'cat-sub'},
  {n:'Friedel-Crafts',y:'1877',cat:'sub',cl:'cat-sub'},{n:'Sandmeyer',y:'1884',cat:'sub',cl:'cat-sub'},
  {n:'Finkelstein',y:'1910',cat:'sub',cl:'cat-sub'},{n:'Menschutkin',y:'1890',cat:'sub',cl:'cat-sub'},
  {n:'Gabriel',y:'1887',cat:'sub',cl:'cat-sub'},{n:'Mitsunobu',y:'1967',cat:'sub',cl:'cat-sub'},
  {n:'Balz-Schiemann',y:'1927',cat:'sub',cl:'cat-sub'},{n:'Buchwald-Hartwig',y:'1994',cat:'coup',cl:'cat-coup'},
  {n:'E2 Elimination',y:'1927',cat:'elim',cl:'cat-elim'},{n:'E1 Elimination',y:'1927',cat:'elim',cl:'cat-elim'},
  {n:'Cope Elim.',y:'1949',cat:'elim',cl:'cat-elim'},{n:'Hofmann Elim.',y:'1851',cat:'elim',cl:'cat-elim'},
  {n:'Chugaev',y:'1899',cat:'elim',cl:'cat-elim'},{n:'Zaitsev Rule',y:'1875',cat:'elim',cl:'cat-elim'},
  {n:'Clemmensen',y:'1913',cat:'red',cl:'cat-red'},{n:'Wolff-Kishner',y:'1912',cat:'red',cl:'cat-red'},
  {n:'Birch Reduction',y:'1944',cat:'red',cl:'cat-red'},{n:'Lindlar',y:'1952',cat:'red',cl:'cat-red'},
  {n:'NaBH4 Reduction',y:'1953',cat:'red',cl:'cat-red'},{n:'LiAlH4',y:'1947',cat:'red',cl:'cat-red'},
  {n:'DIBAL-H',y:'1956',cat:'red',cl:'cat-red'},{n:'Meerwein-Ponndorf-Verley',y:'1925',cat:'red',cl:'cat-red'},
  {n:'Swern Oxidation',y:'1978',cat:'ox',cl:'cat-ox'},{n:'Jones Reagent',y:'1946',cat:'ox',cl:'cat-ox'},
  {n:'PCC Oxidation',y:'1975',cat:'ox',cl:'cat-ox'},{n:'Dess-Martin',y:'1983',cat:'ox',cl:'cat-ox'},
  {n:'Baeyer-Villiger',y:'1899',cat:'ox',cl:'cat-ox'},{n:'Wacker',y:'1959',cat:'ox',cl:'cat-ox'},
  {n:'Ozonolysis',y:'1840',cat:'ox',cl:'cat-ox'},{n:'Sharpless Epox.',y:'1980',cat:'ox',cl:'cat-ox'},
  {n:'OsO4 Dihydrox.',y:'1912',cat:'ox',cl:'cat-ox'},{n:'KMnO4',y:'1870',cat:'ox',cl:'cat-ox'},
  {n:'Pinacol Rearr.',y:'1859',cat:'rearr',cl:'cat-rearr'},{n:'Beckmann',y:'1886',cat:'rearr',cl:'cat-rearr'},
  {n:'Cope Rearr.',y:'1940',cat:'rearr',cl:'cat-rearr'},{n:'Claisen Rearr.',y:'1912',cat:'rearr',cl:'cat-rearr'},
  {n:'Fries Rearr.',y:'1908',cat:'rearr',cl:'cat-rearr'},{n:'Curtius',y:'1894',cat:'rearr',cl:'cat-rearr'},
  {n:'Hofmann Rearr.',y:'1881',cat:'rearr',cl:'cat-rearr'},{n:'Schmidt',y:'1923',cat:'rearr',cl:'cat-rearr'},
  {n:'Wagner-Meerwein',y:'1902',cat:'rearr',cl:'cat-rearr'},{n:'Bamford-Stevens',y:'1952',cat:'rearr',cl:'cat-rearr'},
  {n:'Suzuki',y:'1979',cat:'coup',cl:'cat-coup'},{n:'Heck',y:'1972',cat:'coup',cl:'cat-coup'},
  {n:'Sonogashira',y:'1975',cat:'coup',cl:'cat-coup'},{n:'Negishi',y:'1977',cat:'coup',cl:'cat-coup'},
  {n:'Stille',y:'1978',cat:'coup',cl:'cat-coup'},{n:'Kumada',y:'1972',cat:'coup',cl:'cat-coup'},
  {n:'Ullmann',y:'1901',cat:'coup',cl:'cat-coup'},{n:'Glaser',y:'1869',cat:'coup',cl:'cat-coup'},
  {n:'[4+2] Diels-Alder',y:'1928',cat:'cyclo',cl:'cat-cyclo'},{n:'[2+2] Cycloadd.',y:'1905',cat:'cyclo',cl:'cat-cyclo'},
  {n:'Huisgen 1,3-dipolar',y:'1963',cat:'cyclo',cl:'cat-cyclo'},{n:'Paterno-Büchi',y:'1954',cat:'cyclo',cl:'cat-cyclo'},
  {n:'Corey-Chaykovsky',y:'1962',cat:'add',cl:'cat-add'},{n:'Julia Olefination',y:'1973',cat:'elim',cl:'cat-elim'},
  {n:'HWE Reaction',y:'1958',cat:'elim',cl:'cat-elim'},{n:'Peterson Olefin.',y:'1968',cat:'elim',cl:'cat-elim'},
  {n:'Stork Enamine',y:'1954',cat:'sub',cl:'cat-sub'},{n:'Hydroboration',y:'1956',cat:'add',cl:'cat-add'},
  {n:'Paal-Knorr',y:'1885',cat:'add',cl:'cat-add'},{n:'Hantzsch Pyridine',y:'1882',cat:'add',cl:'cat-add'},
  {n:'Biginelli',y:'1893',cat:'add',cl:'cat-add'},{n:'Dakin Reaction',y:'1909',cat:'ox',cl:'cat-ox'},
];
const matrix=document.getElementById('reactionMatrix');
if(matrix){
  reactions.forEach(r=>{
    const div=document.createElement('div');
    div.className=`matrix-cell ${r.cl}`;
    div.innerHTML=`<div class="mc-cat">${r.cat}</div><div class="mc-name">${r.n}</div><div class="mc-year">${r.y}</div><span class="mc-add">+</span>`;
    div.onclick=()=>showReactionDetail(r.n);
    matrix.appendChild(div);
  });
}

function filterReactions(q){
  if(!matrix) return;
  const cells=matrix.querySelectorAll('.matrix-cell');
  cells.forEach(c=>{
    const name=c.querySelector('.mc-name').textContent.toLowerCase();
    c.style.display=q===''||name.includes(q.toLowerCase())?'':'none';
  });
}

// ═══════════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════════
const reactionDetails={
  'bonding':{title:'Chemical Bonding',sub:'Covalent, Ionic, Sigma & Pi',body:`
    <div class="detail-section"><div class="detail-section-title">COVALENT BONDING</div>
    <p class="detail-text">Covalent bonds form when atoms share electron pairs. In organic molecules, carbon forms 4 covalent bonds. Bond strength increases: single < double < triple. Bond length decreases: single > double > triple.</p>
    <div class="detail-eq">Bond order ∝ Bond strength ∝ 1/Bond length</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">SIGMA vs PI BONDS</div>
    <p class="detail-text">sigma (sigma) bonds: head-on orbital overlap, cylindrically symmetric, free rotation possible. pi (pi) bonds: side-on p-orbital overlap, restrict rotation, responsible for reactivity in alkenes/alkynes. Single bonds = 1sigma. Double bonds = 1sigma + 1pi. Triple bonds = 1sigma + 2pi.</p>
    </div>
  `},
  'grignard_primary':{title:'Grignard + Formaldehyde',sub:'Synthesis of Primary Alcohols',body:`
    <div class="detail-section"><div class="detail-section-title">REACTION</div>
    <p class="detail-text">Grignard reagents (RMgX) add to formaldehyde (HCHO) to give primary alcohols after aqueous workup. Formaldehyde is unique - its carbonyl carbon bears two H atoms, so addition of any Grignard gives a primary alcohol (one more carbon than the Grignard).</p>
    <div class="detail-eq">RMgX + HCHO -> [R-CH2-OMgX] -> H3O+ -> R-CH2-OH (1 deg alcohol)</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>
    <div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Preparation: R-X + Mg -> R-MgX (in dry diethyl ether, anhydrous conditions)</div></div>
    <div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Nucleophilic addition: Carbon of R-MgX attacks carbonyl carbon of HCHO (delta+). Mg coordinates to oxygen.</div></div>
    <div class="mechanism-step"><div class="step-num">3</div><div class="step-text">Hydrolysis: Addition of NH4Cl(aq) or dilute H3O+ breaks Mg-O bond to reveal primary alcohol.</div></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">EXAMPLES</div>
    <table class="chem-table"><thead><tr><th>Grignard</th><th>+ HCHO</th><th>Product</th></tr></thead>
    <tbody>
    <tr><td>CH3MgBr</td><td>HCHO</td><td>CH3CH2OH (ethanol)</td></tr>
    <tr><td>C2H5MgBr</td><td>HCHO</td><td>C2H5CH2OH (1-propanol)</td></tr>
    <tr><td>PhMgBr</td><td>HCHO</td><td>PhCH2OH (benzyl alcohol)</td></tr>
    </tbody></table>
    </div>
  `},
  'grignard_ketone':{title:'Grignard + Ketone',sub:'Synthesis of Tertiary Alcohols',body:`
    <div class="detail-section"><div class="detail-section-title">REACTION</div>
    <p class="detail-text">Addition of Grignard reagent to any ketone gives, after hydrolysis, a tertiary alcohol. The carbon skeleton has three carbon substituents around the carbinol carbon. This is the most general and important route to tertiary alcohols.</p>
    <div class="detail-eq">RMgX + R'COR'' -> R-C(OMgX)(R')(R'') -> H3O+ -> R-C(OH)(R')(R'')</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">KEY EXAMPLES</div>
    <table class="chem-table"><thead><tr><th>Grignard</th><th>Ketone</th><th>Tertiary Alcohol</th></tr></thead>
    <tbody>
    <tr><td>CH3MgBr (2×)</td><td>Ethyl acetate (ester)</td><td>2-methyl-2-propanol (t-BuOH)</td></tr>
    <tr><td>PhMgBr</td><td>Acetone</td><td>2-phenyl-2-propanol</td></tr>
    <tr><td>CH3MgBr</td><td>Benzophenone</td><td>Triphenylcarbinol... wait -> 1,1-diphenylethanol</td></tr>
    <tr><td>EtMgBr</td><td>Cyclohexanone</td><td>1-ethylcyclohexanol (3 deg)</td></tr>
    </tbody></table>
    </div>
  `},
  'hc_hydroboration':{title:'Hydroboration-Oxidation',sub:'Anti-Markovnikov Primary Alcohol Synthesis',body:`
    <div class="detail-section"><div class="detail-section-title">OVERVIEW</div>
    <p class="detail-text">Discovered by H.C. Brown (Nobel 1979). BH3·THF adds to alkene via concerted four-centered transition state: boron goes to less hindered (terminal) carbon, H to more substituted carbon - opposite of Markovnikov. Then H2O2/NaOH oxidizes C-B to C-OH with retention of configuration.</p>
    <div class="detail-eq">R-CH=CH2 + BH3·THF -> R-CH(B)-CH3 -> H2O2/NaOH -> R-CH(OH)-CH3... NO!</div>
    <div class="detail-eq">CH2=CHR + BH3·THF (syn, anti-Markov) -> H2O2/NaOH -> R-CH2-CH2OH (primary!)</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>
    <div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Syn addition: Concerted 4-centered TS. B attacks less hindered carbon (anti-Markovnikov). H and B add to SAME face (syn addition).</div></div>
    <div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Oxidation: H2O2 in basic solution oxidizes C-B bond with RETENTION of configuration. Boron replaced by OH.</div></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">KEY FEATURES</div>
    <p class="detail-text">• Anti-Markovnikov regiochemistry (OH ends up on terminal C for terminal alkenes)<br>• syn stereochemistry (H and OH on same face)<br>• No rearrangements<br>• Internal alkenes -> racemic mixture at both carbons</p>
    </div>
  `},
};

function showDetail(key){
  const d=reactionDetails[key];
  const content=document.getElementById('detailContent');
  if(d){
    content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>${d.body}`;
  } else {
    const title=key.replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    content.innerHTML=`<div class="detail-title">${title}</div><div class="detail-subtitle">Book Chapter Style Notes</div>
      <div class="detail-section"><div class="detail-section-title">INTRODUCTION</div><p class="detail-text">${title} is an important organic chemistry topic that should be studied through structure, reactivity, mechanism, and application. Understanding the logic behind the topic is more useful than memorizing isolated facts.</p></div>
      <div class="detail-section"><div class="detail-section-title">CORE IDEA</div><p class="detail-text">Start by identifying the functional group or reactive center. Then analyze electronic effects, steric effects, solvent, reagent strength, leaving group ability, and possible intermediates. These factors usually decide the major product and reaction pathway.</p></div>
      <div class="detail-section"><div class="detail-section-title">WHAT TO STUDY</div><ul class="checklist-bullets"><li>Definition and key terms</li><li>General structure or reaction pattern</li><li>Important examples and exceptions</li><li>Mechanism or electron-flow logic</li><li>Applications in synthesis and pharma R&D</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">INTERVIEW NOTE</div><p class="detail-text">For a strong interview answer, give the definition first, then one example, then explain the reason using mechanism, stability, selectivity, or practical limitation.</p></div>
      <div class="detail-section"><div class="detail-section-title">SUMMARY</div><p class="detail-text">Revise ${title} as a concept-based chapter: definition, mechanism, examples, limitations, and applications. This makes the topic useful for exams, synthesis planning, and problem solving.</p></div>`;
  }
  openDetailPanel();
}

const reactionCategoryDetails={
  add:{sub:'Addition and C-C bond formation',eq:'Nucleophile or pi partner + electrophile -> addition product',conditions:'Often base, acid, Lewis acid, or organometallic reagent; exclude water when strong organometallics are used.',mech:['Generate the reactive nucleophile, enol/enolate, ylide, or pi partner.','Attack the electrophilic carbonyl, imine, alkene, or activated pi system.','Protonation, dehydration, or workup gives the isolated product.'],select:'Regiochemistry and stereochemistry depend on sterics, electronics, and whether the pathway is concerted or stepwise.',limit:'Competing self-condensation, proton transfer, and over-addition are common checks.'},
  sub:{sub:'Substitution and functional group exchange',eq:'R-LG + Nu -> R-Nu + LG',conditions:'Good leaving group, suitable nucleophile, and solvent chosen for SN1, SN2, or aromatic substitution.',mech:['Activate or ionize the leaving group.','Nucleophile replaces the leaving group directly or after an intermediate forms.','Workup removes salts, catalyst, or acid/base additives.'],select:'SN2 gives inversion; SN1 may racemize; aromatic reactions follow directing effects.',limit:'Steric hindrance, poor leaving groups, and competing elimination can dominate.'},
  elim:{sub:'Elimination and alkene formation',eq:'Substrate with beta H + base/heat -> alkene',conditions:'Strong base or heat; bulky bases shift products toward less substituted alkenes.',mech:['Base or heat activates the substrate.','A beta hydrogen and leaving group are removed.','The double bond forms, often under Zaitsev or Hofmann control.'],select:'Anti-periplanar geometry is crucial for E2; E1 is less stereospecific.',limit:'Substitution, rearrangement, and alkene isomer mixtures are frequent side reactions.'},
  red:{sub:'Reduction',eq:'Functional group + hydride/H2/electrons -> reduced product',conditions:'Choose NaBH4, LiAlH4, H2/catalyst, dissolving metal, or transfer hydrogenation based on strength needed.',mech:['The substrate accepts hydride, hydrogen atoms, or electrons.','An anion, radical, metal-bound, or alcoholate intermediate forms.','Protonation/workup releases the reduced product.'],select:'Chemoselectivity depends strongly on reagent strength and functional group tolerance.',limit:'Over-reduction and incompatibility with water, acid, or reducible groups must be checked.'},
  ox:{sub:'Oxidation',eq:'Substrate + oxidant -> higher oxidation-state product',conditions:'Mild oxidants for selectivity; stronger chromium, permanganate, ozone, or peroxide systems for deep oxidation.',mech:['Oxidant activates the alcohol, alkene, arene, or carbonyl derivative.','Electron transfer, oxygen transfer, or rearrangement changes oxidation state.','Hydrolysis or workup reveals the product.'],select:'Water content and workup often decide aldehyde versus acid or diol versus cleavage.',limit:'Strong oxidants can be nonselective and damage sensitive groups.'},
  rearr:{sub:'Rearrangement',eq:'Activated substrate -> migrated skeleton or functional group isomer',conditions:'Acid, heat, Lewis acid, base, or azide/nitrene conditions depending on reaction.',mech:['Activation creates a cation, oxime, acyl azide, nitrene, or cyclic transition state.','A hydride, alkyl, aryl, or acyl group migrates with its bonding pair.','Capture, hydrolysis, or tautomerization gives product.'],select:'Migratory aptitude and antiperiplanar/orbital alignment decide the major product.',limit:'Mixtures occur when more than one migration or rearrangement path is possible.'},
  cyclo:{sub:'Cycloaddition and ring construction',eq:'Pi systems or dipoles -> cyclic product',conditions:'Heat, light, Lewis acid, or metal catalyst depending on orbital symmetry.',mech:['Reactive partners align their frontier orbitals.','Two new sigma bonds form concertedly or stepwise.','The cyclic product retains much of the starting stereochemical information.'],select:'Endo/exo preference, regioselectivity, and stereospecificity are central.',limit:'Wrong conformation, poor electronics, or photochemical side reactions reduce yield.'},
  coup:{sub:'Metal-catalysed coupling',eq:'Organic halide/pseudohalide + organometallic/partner -> coupled product',conditions:'Pd, Ni, or Cu catalyst with ligand, base, and dry or aqueous solvent as required.',mech:['Oxidative addition places the electrophile on the metal.','Transmetalation, insertion, or ligand exchange adds the second partner.','Reductive elimination forms the new bond and regenerates catalyst.'],select:'Ligand, halide, base, and partner electronics control rate and selectivity.',limit:'Air/water sensitivity, homocoupling, beta-hydride elimination, or toxic reagents may matter.'}
};

const reactionSpecifics={
  'Grignard':['Organomagnesium addition','R-X + Mg -> R-MgX; then C=O -> alcohol','Dry ether/THF, anhydrous glassware, acidic workup','Strong carbon nucleophile adds to aldehydes, ketones, esters, CO2, or epoxides.','Carbonyl attack gives alkoxide; H3O+ gives alcohol.','Water, alcohols, acids, and amines destroy the reagent.'],
  'Aldol':['Enolate carbonyl addition','enolate + aldehyde/ketone -> beta-hydroxy carbonyl -> enone','NaOH, NaOEt, LDA, or acid; control crossed partners','Builds beta-hydroxy carbonyls and alpha,beta-unsaturated carbonyls.','Enolate formation, carbonyl addition, protonation, then optional dehydration.','Mixed aldols give mixtures unless one partner is controlled.'],
  'Wittig':['Phosphorus ylide olefination','Ph3P=CHR + carbonyl -> alkene + Ph3P=O','Phosphonium salt plus strong base, THF/ether/DMSO','Converts aldehydes and ketones to alkenes with predictable carbon placement.','Ylide addition gives oxaphosphetane; collapse forms alkene.','Unstabilized ylides favor Z; stabilized ylides often favor E.'],
  'Diels-Alder':['Thermal [4+2] cycloaddition','s-cis diene + dienophile -> cyclohexene','Heat or Lewis acid; electron-rich diene plus electron-poor dienophile','Concerted six-electron reaction that rapidly builds six-membered rings.','One cyclic transition state forms two sigma bonds and one pi bond.','Endo kinetic product is common; diene must access s-cis.'],
  'Michael':['1,4-conjugate addition','soft Nu + enone/enoate -> beta-substituted carbonyl','Enolates, amines, thiols, cuprates, organocatalysts','Adds nucleophiles to the beta carbon of activated alkenes.','Nucleophile attacks beta carbon, enolate forms, protonation restores carbonyl.','Hard organometallics may give 1,2-addition instead.'],
  'Reformatsky':['Zinc enolate addition','alpha-halo ester + Zn + carbonyl -> beta-hydroxy ester','Zn in dry ether/THF; iodine or Cu salts can activate','Mild organozinc route to beta-hydroxy esters.','Zinc inserts into C-X; zinc enolate adds to carbonyl; workup protonates.','Very hindered carbonyls and wet conditions reduce reliability.'],
  'Mannich':['Aminomethylation','enolizable carbonyl + aldehyde + amine -> beta-aminocarbonyl','Amine, formaldehyde/aldehyde, mild acid','Installs aminomethyl groups alpha to carbonyls through iminium ions.','Iminium formation, enol attack, deprotonation.','Over-alkylation and aldol competition are possible.'],
  'Knoevenagel':['Active methylene condensation','aldehyde + malonate/cyanoacetate -> electron-poor alkene','Piperidine, pyridine, ammonium acetate, weak amine base','Condenses aldehydes with acidic methylene compounds.','Carbanion addition to carbonyl followed by dehydration.','Ketones are slower; E alkene usually dominates.'],
  'Perkin':['Aromatic aldehyde condensation','Ar-CHO + acid anhydride -> cinnamic acid derivative','Anhydride plus sodium/potassium carboxylate, heat','Prepares cinnamic acids from aromatic aldehydes.','Anhydride enolate adds, eliminates, then hydrolyzes.','Best with aromatic aldehydes; aliphatic substrates give side reactions.'],
  'Henry (Nitroaldol)':['Nitroaldol addition','nitroalkane + carbonyl -> beta-nitro alcohol','Base or organocatalyst, low to room temperature','Makes beta-nitro alcohols and nitroalkenes.','Nitronate attacks carbonyl; protonation gives alcohol; dehydration optional.','Retro-Henry and dehydration compete under harsh conditions.'],
  'Claisen':['Ester enolate condensation','ester + ester -> beta-keto ester','Matching alkoxide base, then acid workup','Couples esters through acyl substitution.','Ester enolate attacks ester; alkoxide leaves; acidic workup.','Requires alpha hydrogens and can scramble if alkoxide mismatches.'],
  'Robinson Annul.':['Michael plus aldol annulation','enolate + enone -> cyclohexenone','Base or amine in protic solvent, controlled heat','Builds cyclohexenone rings from carbonyl/enone partners.','Michael addition, intramolecular aldol, dehydration.','Polymerization and over-annulation can occur.'],
  'SN2':['Backside substitution','Nu- + R-LG -> R-Nu','Strong nucleophile, polar aprotic solvent','Concerted substitution strongest for methyl and primary substrates.','Backside attack and leaving-group departure occur together.','Inversion at stereocenter; tertiary centers fail.'],
  'SN1':['Carbocation substitution','R-LG -> R+ -> R-Nu','Polar protic solvent, weak nucleophile, good leaving group','Stepwise substitution favored by tertiary, allylic, or benzylic substrates.','Ionization, nucleophile attack, deprotonation.','Racemization, rearrangement, and E1 elimination compete.'],
  'Friedel-Crafts':['Electrophilic aromatic substitution','Ar-H + RCl/RCOCl + AlCl3 -> Ar-R/Ar-COR','Anhydrous AlCl3, FeCl3, or BF3','Alkylates or acylates activated aromatic rings.','Electrophile generation, sigma complex formation, deprotonation.','Deactivated rings fail; alkylations rearrange and polyalkylate.'],
  'Sandmeyer':['Diazonium replacement','Ar-N2+ + CuX -> Ar-X + N2','NaNO2/HX at 0-5 C, then CuCl/CuBr/CuCN','Converts anilines into aryl halides or nitriles via diazonium salts.','Diazotization, copper-mediated radical/ligand transfer, nitrogen loss.','Diazonium salts are temperature-sensitive.'],
  'Finkelstein':['Halide exchange','R-Cl/R-Br + NaI -> R-I','NaI in dry acetone','SN2 exchange driven by precipitation of NaCl/NaBr.','Iodide backside attack displaces chloride or bromide.','Best for primary substrates; tertiary gives elimination or no SN2.'],
  'Menschutkin':['Quaternary ammonium formation','R3N + R-X -> R4N+ X-','Polar solvent, alkyl iodide/tosylate, heat if needed','Alkylates tertiary amines to ammonium salts.','Amine performs SN2 attack on alkyl electrophile.','Hindered halides react slowly and may eliminate.'],
  'Gabriel':['Primary amine synthesis','phthalimide anion + R-X -> R-NH2 after cleavage','K phthalimide then hydrazine or hydrolysis','Makes primary amines without over-alkylation.','SN2 N-alkylation followed by imide cleavage.','Aryl, vinyl, tertiary, and hindered halides are poor.'],
  'Mitsunobu':['Alcohol substitution inversion','ROH + HNu + PPh3 + DIAD -> R-Nu','PPh3, DEAD/DIAD, acidic pronucleophile','Converts alcohols into substituted products under mild conditions.','Oxyphosphonium formation, SN2 attack, phosphine oxide formation.','Secondary alcohols invert; tertiary alcohols fail.'],
  'Balz-Schiemann':['Aryl fluoride synthesis','Ar-N2+ BF4- -> Ar-F + BF3 + N2','Diazotize in HBF4, isolate salt, heat','Replaces diazonium groups by fluorine.','Thermal diazonium tetrafluoroborate decomposition gives aryl fluoride.','Requires careful diazonium salt handling.'],
  'Buchwald-Hartwig':['Pd C-N coupling','Ar-X + amine -> Ar-NR2','Pd ligand, strong or carbonate base, toluene/dioxane','Forms aryl amines from aryl halides and amines.','Oxidative addition, amido-Pd formation, reductive elimination.','Base-sensitive substrates need tuned ligands/conditions.'],
  'E2 Elimination':['Concerted beta elimination','base + R-CH2-CH(LG)-R -> alkene','Strong base, heat; bulky bases for Hofmann product','One-step beta-H removal and leaving-group loss.','Anti-periplanar C-H and C-LG bonds break as C=C forms.','Competes with SN2 on primary substrates.'],
  'E1 Elimination':['Carbocation elimination','R-LG -> carbocation -> alkene','Weak base, polar protic solvent, heat','Stepwise elimination through a carbocation.','Ionization, beta deprotonation, alkene formation.','Rearrangements and SN1 substitution compete.'],
  'Cope Elim.':['Amine oxide syn elimination','amine oxide -> alkene + hydroxylamine','Oxidize tertiary amine, then heat','Neutral thermal elimination of amine oxides.','Five-membered cyclic transition state removes syn beta H.','Requires accessible syn beta hydrogen.'],
  'Hofmann Elim.':['Ammonium elimination','R4N+OH- -> least substituted alkene','Exhaustive methylation, Ag2O/H2O, heat','Gives Hofmann alkene from quaternary ammonium salts.','Quaternary salt forms hydroxide; E2 elimination on heating.','Often gives mixtures when beta hydrogens are similar.'],
  'Chugaev':['Xanthate pyrolysis','alcohol -> xanthate -> alkene','CS2/base, MeI, heat','Dehydrates alcohols by syn elimination under neutral conditions.','Xanthate forms; cyclic transition state eliminates to alkene.','Sulfur byproducts and extra steps are drawbacks.'],
  'Zaitsev Rule':['Elimination selectivity','elimination -> more substituted alkene','Small bases or acid-catalysed equilibrating conditions','Predicts the more substituted alkene as major product.','Product/transition-state stability favors substituted C=C.','Bulky bases and ammonium leaving groups often violate it.'],
  'Clemmensen':['Acidic carbonyl reduction','aldehyde/ketone -> methylene','Zn(Hg), concentrated HCl, heat','Reduces carbonyls to hydrocarbons under acidic conditions.','Metal-surface electron/proton transfers remove oxygen.','Acid-sensitive groups are incompatible.'],
  'Wolff-Kishner':['Basic carbonyl reduction','aldehyde/ketone + NH2NH2/base -> methylene','Hydrazine, KOH, heat; Huang-Minlon variant','Reduces carbonyls to hydrocarbons under basic conditions.','Hydrazone formation, base-promoted N2 loss, protonation.','Heat/base-sensitive molecules suffer.'],
  'Birch Reduction':['Arene partial reduction','arene + Na/NH3/ROH -> 1,4-cyclohexadiene','Na/Li/K in liquid NH3 with alcohol','Converts aromatic rings into unconjugated dienes.','Electron transfer, protonation, second electron transfer, protonation.','Substituents control regioselectivity; reducible groups may not survive.'],
  'Lindlar':['Alkyne to cis alkene','alkyne + H2/Lindlar -> Z-alkene','H2, poisoned Pd/CaCO3, quinoline','Partially hydrogenates alkynes to cis alkenes.','Syn hydrogen addition on poisoned metal surface.','Over-reduction occurs if catalyst is not poisoned/monitored.'],
  'NaBH4 Reduction':['Mild carbonyl reduction','aldehyde/ketone -> alcohol','NaBH4 in MeOH/EtOH/water/THF','Selective hydride reduction of aldehydes and ketones.','Hydride attack gives alkoxide; protonation gives alcohol.','Usually too mild for esters, acids, and amides.'],
  'LiAlH4':['Strong hydride reduction','esters/acids/amides/carbonyls -> alcohols/amines','Dry ether/THF, careful aqueous workup','Powerful reducer for many polar functional groups.','Hydride transfer, collapse/repeated reduction, protonation on workup.','Violently water-reactive and often nonselective.'],
  'DIBAL-H':['Controlled partial reduction','ester/nitrile -> aldehyde','DIBAL-H at -78 C, then careful quench','Stops ester or nitrile reductions at aldehydes when cold.','Hydride addition forms aluminum-bound intermediate; hydrolysis releases aldehyde.','Excess reagent or warmth over-reduces.'],
  'Meerwein-Ponndorf-Verley':['Transfer hydrogenation','carbonyl + i-PrOH -> alcohol + acetone','Al(O-i-Pr)3 in isopropanol','Mild, chemoselective carbonyl reduction.','Six-membered transition state transfers hydride from isopropoxide.','Equilibrium and sterics can slow reaction.'],
  'Swern Oxidation':['Mild alcohol oxidation','1 alcohol -> aldehyde; 2 alcohol -> ketone','DMSO, oxalyl chloride, Et3N, -78 C','Chromium-free oxidation of alcohols.','Activated DMSO forms alkoxysulfonium salt; base eliminates.','Dimethyl sulfide odor; temperature control matters.'],
  'Jones Reagent':['Strong chromic oxidation','1 alcohol -> acid; 2 alcohol -> ketone','CrO3/H2SO4 in acetone-water','Oxidizes alcohols strongly, often to acids for primary alcohols.','Chromate ester formation and elimination; aldehyde hydrates over-oxidize.','Not aldehyde-selective and uses toxic chromium.'],
  'PCC Oxidation':['Anhydrous chromium oxidation','1 alcohol -> aldehyde; 2 alcohol -> ketone','PCC in CH2Cl2, dry conditions','Stops primary alcohol oxidation at aldehydes.','Chromate ester formation followed by elimination to carbonyl.','Acidic chromium waste and sensitive groups are concerns.'],
  'Dess-Martin':['Hypervalent iodine oxidation','alcohol -> aldehyde/ketone','Dess-Martin periodinane, CH2Cl2, room temperature','Very mild oxidation of primary and secondary alcohols.','Alcohol forms alkoxyiodinane; elimination gives carbonyl.','Moisture and reagent handling require care.'],
  'Baeyer-Villiger':['Ketone oxygen insertion','ketone + peracid -> ester/lactone','mCPBA or peracid; sometimes H2O2/Lewis acid','Inserts oxygen next to carbonyl, expanding cyclic ketones to lactones.','Criegee intermediate rearranges with migration to oxygen.','Migratory aptitude controls product; peracids can epoxidize alkenes.'],
  'Wacker':['Alkene to ketone oxidation','terminal alkene -> methyl ketone','PdCl2, CuCl, O2, water/DMF','Markovnikov oxidation of alkenes.','Pd-alkene complex, water attack, beta-hydride elimination, Pd reoxidation.','Internal alkenes may give mixtures.'],
  'Ozonolysis':['Alkene cleavage','alkene + O3 -> carbonyl fragments','O3 at low temperature; Me2S/Zn or H2O2 workup','Cleaves double bonds into aldehydes, ketones, or acids.','Molozonide formation, ozonide rearrangement, workup cleavage.','Ozonides are hazardous; workup determines oxidation level.'],
  'Sharpless Epox.':['Asymmetric epoxidation','allylic alcohol -> chiral epoxy alcohol','Ti(OiPr)4, TBHP, (+)/(-)-DET, sieves','Enantioselective epoxidation of allylic alcohols.','Titanium-tartrate complex delivers oxygen to one alkene face.','Requires allylic alcohol coordination.'],
  'OsO4 Dihydrox.':['Syn dihydroxylation','alkene -> cis-1,2-diol','Catalytic OsO4 with NMO/H2O2','Adds two OH groups to the same face of an alkene.','Cyclic osmate ester forms, then hydrolysis gives diol.','OsO4 is highly toxic.'],
  'KMnO4':['Permanganate oxidation','cold dilute -> cis diol; hot strong -> cleavage','Cold dilute basic or hot concentrated KMnO4','Condition-dependent alkene oxidation.','Cyclic manganate ester gives diol; harsher conditions cleave.','Strong, nonselective oxidant.'],
  'Pinacol Rearr.':['Diol to carbonyl rearrangement','vicinal diol + acid -> ketone/aldehyde','Strong acid or Lewis acid','Turns 1,2-diols into carbonyls by 1,2-shift.','Water loss creates cation; group migrates; carbonyl forms.','Migratory aptitude can give mixtures.'],
  'Beckmann':['Oxime to amide','ketoxime -> amide/lactam','Acid, PCl5, SOCl2, TsCl/base, PPA','Rearranges oximes to amides; cyclic oximes give lactams.','Anti group migrates as activated oxime loses leaving group.','Oxime E/Z mixture gives product mixture.'],
  'Cope Rearr.':['[3,3] sigmatropic rearrangement','1,5-diene -> rearranged 1,5-diene','Heat; oxy-Cope can be anion-accelerated','Concerted rearrangement through a six-membered transition state.','Six electrons shift in a chair-like transition state.','Needs suitable diene geometry and thermal stability.'],
  'Claisen Rearr.':['Allyl vinyl ether rearrangement','allyl vinyl ether -> unsaturated carbonyl','Heat; Johnson/Ireland variants','[3,3] rearrangement forming C-C bond and carbonyl.','Chair-like transition state, then enol-to-carbonyl tautomerization.','Requires allyl vinyl ether precursor.'],
  'Fries Rearr.':['Aryl ester acyl migration','Ar-O-COR -> o/p-HO-Ar-COR','AlCl3 or BF3, heat','Moves acyl group from oxygen to aromatic ring.','Lewis acid generates acylium character; ring acylates o/p.','Harsh Lewis acids limit sensitive groups.'],
  'Curtius':['Acyl azide rearrangement','RCON3 -> RNCO -> amine/carbamate/urea','Acyl azide heat or DPPA/base','Converts acid derivatives to isocyanates with N2 loss.','Acyl azide loses N2; R migrates to nitrogen; nucleophile traps isocyanate.','Azides/isocyanates require care.'],
  'Hofmann Rearr.':['Amide degradation','RCONH2 + Br2/NaOH -> RNH2','Br2/NaOH or NaOCl/NaOH','Primary amide to amine with one fewer carbon.','N-bromoamide, rearrangement to isocyanate, hydrolysis/decarboxylation.','Only primary amides fit the classic reaction.'],
  'Schmidt':['Azide carbonyl rearrangement','carbonyl + HN3/acid -> amide/amine products','Hydrazoic acid or safer azide variants in acid','Rearranges acids/ketones using azide chemistry.','Azide addition, N2 loss, migration, hydrolysis.','HN3 is highly hazardous.'],
  'Wagner-Meerwein':['Carbocation skeletal shift','carbocation -> rearranged carbocation','Acid, Lewis acid, solvolysis conditions','Hydride or alkyl shifts make more stable cations.','Cation forms; 1,2-shift occurs; capture/elimination follows.','Multiple rearrangements can scramble skeletons.'],
  'Bamford-Stevens':['Tosylhydrazone olefination','tosylhydrazone + base -> alkene + N2','Strong base; solvent controls ionic/carbene path','Converts aldehydes/ketones to alkenes via tosylhydrazones.','Deprotonation, diazo formation, N2 loss, alkene formation.','Strong base and diazo chemistry limit scope.'],
  'Suzuki':['Pd cross-coupling','Ar-X + Ar-B(OH)2 -> Ar-Ar','Pd catalyst, base, aqueous organic solvent','Couples organoboron reagents with aryl/vinyl halides.','Oxidative addition, transmetalation, reductive elimination.','Protodeboronation and aryl chlorides need optimization.'],
  'Heck':['Pd alkene arylation','Ar-X + alkene -> substituted alkene','Pd catalyst, base, heat','Couples aryl/vinyl halides with alkenes.','Oxidative addition, alkene insertion, beta-hydride elimination.','Often gives E alkene; regioisomers possible.'],
  'Sonogashira':['Pd/Cu alkyne coupling','Ar-X + terminal alkyne -> Ar-C#C-R','Pd catalyst, CuI, amine base','Forms aryl/vinyl alkynes.','Oxidative addition, copper acetylide transmetalation, reductive elimination.','Copper can cause Glaser homocoupling.'],
  'Negishi':['Organozinc coupling','R-ZnX + R-X -> R-R','Pd or Ni catalyst, THF/DMF','Couples organozinc reagents with halides.','Oxidative addition, zinc transmetalation, reductive elimination.','Organozincs are moisture sensitive.'],
  'Stille':['Organotin coupling','R-SnBu3 + R-X -> R-R','Pd catalyst, often LiCl/CuI additives','Reliable coupling with organostannanes.','Oxidative addition, tin transmetalation, reductive elimination.','Organotin toxicity and purification are major drawbacks.'],
  'Kumada':['Grignard coupling','R-MgX + R-X -> R-R','Ni or Pd catalyst in ether/THF','Cross-coupling using Grignard reagents.','Oxidative addition, transmetalation, reductive elimination.','Poor functional group tolerance.'],
  'Ullmann':['Copper aryl coupling','Ar-X + Cu -> Ar-Ar or Ar-heteroatom','Copper, heat; modern ligand variants milder','Copper-mediated aryl-aryl or aryl-heteroatom bond formation.','Aryl copper species form and combine/substitute.','Classical conditions are harsh.'],
  'Glaser':['Oxidative alkyne coupling','2 terminal alkynes + O2/Cu -> diyne','Cu salt, amine, oxygen','Homocouples terminal alkynes to diynes.','Copper acetylide formation and oxidative coupling.','Unsymmetrical cross-coupling is difficult.'],
  '[4+2] Diels-Alder':['[4+2] cycloaddition','diene + dienophile -> cyclohexene','Heat or Lewis acid','Six-electron ring construction with stereospecificity.','Concerted orbital overlap forms two sigma bonds.','Endo selectivity common; s-cis diene needed.'],
  '[2+2] Cycloadd.':['Cyclobutane formation','alkene + alkene -> cyclobutane','UV light or sensitizer; ketenes can react thermally','Forms four-membered rings by photochemical cycloaddition.','Excited alkene adds, then ring closes.','Photochemical mixtures are common.'],
  'Huisgen 1,3-dipolar':['1,3-dipolar cycloaddition','azide + alkyne -> triazole','Heat, or Cu(I) for click reaction','Builds five-membered heterocycles from dipoles and dipolarophiles.','Concerted cycloaddition forms two sigma bonds.','Uncatalysed reactions are slow and regioisomeric.'],
  'Paterno-Büchi':['Photochemical oxetane synthesis','carbonyl + alkene + hv -> oxetane','UV light, often sensitizer','Forms oxetanes from excited carbonyls and alkenes.','Excited carbonyl adds to alkene; diradical closes.','Norrish and regioisomer side reactions occur.'],
  'Corey-Chaykovsky':['Sulfur ylide reaction','carbonyl + sulfur ylide -> epoxide','Sulfonium/sulfoxonium salt plus base','Makes epoxides or cyclopropanes from sulfur ylides.','Ylide addition followed by intramolecular displacement.','Hindered or acidic substrates are difficult.'],
  'Julia Olefination':['Sulfone olefination','sulfone anion + aldehyde -> alkene','Strong base; Kocienski variant milder','Forms alkenes from sulfones and carbonyls.','Sulfone anion addition then elimination/reductive fragmentation.','Classical versions may need extra steps.'],
  'HWE Reaction':['Phosphonate olefination','phosphonate anion + carbonyl -> alkene','NaH, NaOMe, KHMDS, or DBU','Wittig-like route, often E-selective for enoates/enones.','Carbanion addition and phosphate elimination.','Ketones react more slowly.'],
  'Peterson Olefin.':['Silyl olefination','alpha-silyl carbanion + carbonyl -> alkene','Organosilane anion then acid or base','Acid/base-controlled alkene synthesis from beta-hydroxysilanes.','Addition makes beta-hydroxysilane; elimination gives alkene.','Requires organosilicon precursor.'],
  'Stork Enamine':['Enamine alkylation','ketone -> enamine -> alpha-substituted carbonyl','Secondary amine, electrophile, hydrolysis','Controlled enolate equivalent for alpha functionalization.','Enamine formation, electrophile attack, iminium hydrolysis.','SN2 limitations apply to alkylation partner.'],
  'Hydroboration':['Anti-Markovnikov hydration','alkene + BH3; H2O2/NaOH -> alcohol','BH3.THF or 9-BBN, then peroxide/base','Hydrates alkenes without carbocation rearrangement.','Concerted syn hydroboration then oxidation with retention.','Use bulky boranes for selectivity.'],
  'Paal-Knorr':['Five-membered heterocycle synthesis','1,4-dicarbonyl -> pyrrole/furan/thiophene','Amine, acid, or sulfur reagent','Makes pyrroles, furans, and thiophenes from 1,4-dicarbonyls.','Condensation, cyclization, dehydration/aromatization.','Needs a suitable 1,4-dicarbonyl.'],
  'Hantzsch Pyridine':['Dihydropyridine synthesis','aldehyde + 2 beta-ketoesters + NH3 -> DHP','Ammonium acetate, ethanol, heat','Multicomponent route to dihydropyridines/pyridines.','Enamine and Knoevenagel partners combine, cyclize, dehydrate.','Unsymmetrical variants can give mixtures.'],
  'Biginelli':['Dihydropyrimidinone synthesis','aldehyde + beta-ketoester + urea -> DHPM','Acid catalyst, ethanol or solvent-free heat','Three-component synthesis of DHPM heterocycles.','Iminium formation, enol addition, cyclization/dehydration.','Aldehyde electronics strongly affect rate.'],
  'Dakin Reaction':['Aryl carbonyl to phenol oxidation','o/p-hydroxy aryl aldehyde + H2O2/base -> phenol','H2O2 with base or buffer','Oxidizes activated aryl aldehydes/ketones to phenols.','Peroxide addition, aryl migration, ester hydrolysis.','Requires ortho/para donating OH or NH2 activation.']
};

const reactionAliases={
  'NaBH4 Reduction':'NaBH4 Reduction',
  'LiAlH4':'LiAlH4',
  'OsO4 Dihydrox.':'OsO4 Dihydrox.',
  'KMnO4':'KMnO4'
};

const reactionDiagrams={
  'Grignard':{file:'Grignard reaction scheme.svg',source:'Wikimedia Commons',license:'Public domain / Commons file page'},
  'Aldol':{file:'Simple aldol reaction.svg',source:'Wikimedia Commons',license:'Commons file page'},
  'Wittig':{file:'Wittig Reaktion.svg',source:'Wikimedia Commons',license:'Commons file page'},
  'Diels-Alder':{file:'Diels-Alder.svg',source:'Wikimedia Commons',license:'CC BY-SA 3.0 / GFDL'},
  '[4+2] Diels-Alder':{file:'Diels-Alder.svg',source:'Wikimedia Commons',license:'CC BY-SA 3.0 / GFDL'},
  'Heck':{file:'Heck reaction (example).svg',source:'Wikimedia Commons',license:'Public domain / Commons file page'},
  'Sonogashira':{file:'Sonogashira Catalytic Cycle.svg',source:'Wikimedia Commons',license:'Commons file page'},
  'Suzuki':{file:'Microreactor 2 Suzuki.svg',source:'Wikimedia Commons',license:'Commons file page'}
};

function commonsFileUrl(file){
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;
}
function commonsPageUrl(file){
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ','_'))}`;
}
function renderReactionDiagram(diagram){
  if(!diagram) return '';
  const src=commonsFileUrl(diagram.file);
  const page=commonsPageUrl(diagram.file);
  return `<div class="detail-section"><div class="detail-section-title">SVG REACTION SCHEME</div>
    <div class="reaction-diagram"><img src="${src}" alt="${diagram.file}" loading="lazy">
    <div class="diagram-credit">Source: <a href="${page}" target="_blank" rel="noopener">${diagram.source}: ${diagram.file}</a> · ${diagram.license}</div></div></div>`;
}

function buildReactionDetail(name){
  const key=reactionAliases[name]||name;
  const base=reactions.find(r=>r.n===name)||{};
  const cat=reactionCategoryDetails[base.cat]||reactionCategoryDetails.add;
  const s=reactionSpecifics[key];
  if(!s){
    return {sub:cat.sub,eq:cat.eq,conditions:cat.conditions,overview:'A named reaction used for '+cat.sub.toLowerCase()+'.',mech:cat.mech,select:cat.select,limit:cat.limit};
  }
  return {sub:s[0],eq:s[1],conditions:s[2],overview:s[3],mech:[s[4],cat.mech[1],cat.mech[2]],select:s[5],limit:cat.limit};
}

function showReactionDetail(name){
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const d=buildReactionDetail(name);
  const diagram=renderReactionDiagram(reactionDiagrams[name]||reactionDiagrams[reactionAliases[name]]);
  const steps=d.mech.map((step,i)=>`<div class="mechanism-step"><div class="step-num">${i+1}</div><div class="step-text">${step}</div></div>`).join('');
  content.innerHTML=`<div class="detail-title">${name}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">REACTION</div><div class="detail-eq">${d.eq}</div><p class="detail-text">${d.overview}</p></div>
    ${diagram}
    <div class="detail-section"><div class="detail-section-title">COMMON CONDITIONS</div><p class="detail-text">${d.conditions}</p></div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>${steps}</div>
    <div class="detail-section"><div class="detail-section-title">STEREOCHEMISTRY / SELECTIVITY</div><p class="detail-text">${d.select}</p></div>
    <div class="detail-section"><div class="detail-section-title">LIMITATIONS</div><p class="detail-text">${d.limit}</p></div>`;
  openDetailPanel();
}
function openDetailPanel(){
  const panel=document.getElementById('detailPanel');
  ensureDetailPrintButton();
  panel.scrollTop=0;
  panel.classList.add('open');
  document.getElementById('backdrop').classList.add('open');
  document.body.classList.add('detail-open');
}
function closeDetail(){
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
  document.body.classList.remove('detail-open');
}

function ensureDetailPrintButton(){
  const content=document.getElementById('detailContent');
  if(!content||content.querySelector('.detail-print-actions')) return;
  const actions=document.createElement('div');
  actions.className='detail-print-actions';
  actions.innerHTML='<button class="detail-print-button" type="button">Print to PDF</button>';
  actions.querySelector('button').addEventListener('click',()=>window.print());
  content.appendChild(actions);
}

const masterTopicDetails={
  1:['Basic Concepts','Organic compounds are carbon-based molecules whose properties come from covalent bonding, carbon catenation, functional groups, and molecular shape.','Know classification by chain/ring, saturated/unsaturated, aliphatic/aromatic, homocyclic/heterocyclic, and functional group priority.','Interview focus: hybridization, bond angle, bond length, polarity, and why carbon forms stable chains.'],
  2:['Electronic Effects','Electronic effects explain how electrons shift through sigma and pi frameworks and control acidity, stability, and reactivity.','Inductive effect works through sigma bonds; mesomeric/resonance works through pi conjugation; hyperconjugation stabilizes electron-deficient centers; electromeric effect is temporary under reagent attack.','Use this to predict carbocation stability, directing effects, nucleophilicity, acidity, and product selectivity.'],
  3:['Acid-Base Chemistry','Organic acid-base chemistry is mostly about conjugate base stability and electron availability.','Lower pKa means stronger acid. Acidity increases with electronegativity, resonance, inductive withdrawal, hybridization s-character, and solvation. Basicity decreases when the lone pair is delocalized or poorly solvated.','Classic comparisons: carboxylic acid > phenol > alcohol; terminal alkyne more acidic than alkene/alkane.'],
  4:['Reaction Intermediates','Reactive intermediates are short-lived species that connect mechanism to product.','Carbocations are electron-poor and rearrange; carbanions are electron-rich and basic/nucleophilic; radicals have one unpaired electron; carbenes and nitrenes are neutral electron-deficient species.','Stability usually follows resonance, hyperconjugation, substitution, and inductive effects.'],
  5:['Reaction Mechanism Fundamentals','Mechanisms describe electron flow, bond breaking, bond making, and energy changes.','Arrow pushing starts from electron-rich sites and ends at electron-poor sites. Transition states are energy maxima. Kinetic products form faster; thermodynamic products are more stable. Hammond postulate relates transition-state structure to nearby intermediates.','Mechanism thinking is more powerful than memorizing reagents.'],
  6:['Types of Organic Reactions','Most reactions fit into substitution, elimination, addition, rearrangement, oxidation, reduction, or coupling patterns.','SN1 involves carbocation; SN2 is backside concerted attack; E1 is carbocation elimination; E2 is anti-periplanar concerted elimination; addition adds across pi bonds; rearrangement changes skeleton.','Identify substrate, reagent, solvent, temperature, and leaving group first.'],
  7:['Stability Concepts','Stability decides which intermediate, alkene, conformer, or product dominates.','Intermediates stabilize by resonance, hyperconjugation, inductive donation/withdrawal, aromaticity, and solvation. Alkene stability increases with substitution and conjugation; trans often beats cis due to sterics.','Stability is the logic behind Markovnikov addition, rearrangements, and thermodynamic control.'],
  8:['Aromaticity','Aromatic systems are cyclic, planar, fully conjugated, and follow Huckel 4n+2 pi electron rule.','Aromatic compounds are unusually stable; antiaromatic systems follow 4n pi electrons and are destabilized; non-aromatic systems fail planarity or conjugation.','Benzene prefers electrophilic substitution over addition because substitution preserves aromaticity.'],
  9:['Solvent Effects','Solvents can change mechanism, rate, and product ratio.','Polar protic solvents stabilize ions and help SN1/E1; polar aprotic solvents strengthen nucleophiles and favor SN2; non-polar solvents suit radical/pericyclic or neutral pathways.','For SN2 choose DMSO/DMF/acetone/MeCN; for SN1 choose water/alcohol/acetic acid type media.'],
  10:['Intermolecular Forces','Physical properties come from molecular attractions.','Hydrogen bonding raises boiling point and solubility; dipole-dipole interactions affect polarity; London dispersion increases with size/surface area.','Use IMF to explain extraction, crystallization, distillation, TLC movement, and formulation behavior.'],
  11:['Isomerism','Isomers have the same formula but different arrangement.','Structural isomers differ in connectivity; stereoisomers differ in spatial arrangement. Chain, position, functional, metameric, tautomeric, geometrical, optical, conformational types are key.','In pharma, isomers can have different potency, toxicity, metabolism, and patents.'],
  12:['Conformational Analysis','Conformations interconvert by rotation around single bonds.','Ethane shows staggered/eclipsed; butane shows anti/gauche; cyclohexane shows chair, axial/equatorial and ring flips.','Bulky groups prefer equatorial positions; anti conformations are usually lower energy.'],
  13:['Configurational Isomerism','Configurational isomers cannot interconvert without bond breaking.','Geometrical isomerism uses E/Z or cis/trans. Optical isomerism arises from chirality and non-superimposable mirror images.','E/Z assignment follows CIP priority, not simply largest group by size.'],
  14:['Chirality','A chiral molecule is not superimposable on its mirror image.','Chiral centers, enantiomers, diastereomers, meso compounds, and stereogenic axes/planes are common sources.','Enantiomers behave differently in chiral biological systems, making this crucial for drugs.'],
  15:['Optical Activity','Optically active compounds rotate plane-polarized light.','Specific rotation depends on compound, concentration, path length, solvent, temperature and wavelength. Racemic mixtures show zero net rotation. Enantiomeric excess measures optical purity.','R/S configuration does not predict + or - rotation.'],
  16:['Configuration Rules','Cahn-Ingold-Prelog rules assign R/S and E/Z configurations.','Priority follows atomic number, then next atoms; multiple bonds are treated as duplicated atoms. Orient lowest priority away, then read 1-2-3 clockwise or anticlockwise.','Always assign priorities before trusting a drawing.'],
  17:['Hydrocarbons','Hydrocarbons contain only carbon and hydrogen.','Alkanes undergo radical substitution/combustion; alkenes undergo electrophilic addition/oxidation; alkynes undergo addition and terminal alkyne alkylation; arenes undergo EAS.','They are the backbone for functional group installation.'],
  18:['Alkyl Halides','Alkyl halides are key electrophiles for substitution and elimination.','Reactivity depends on substrate class, leaving group, nucleophile/base, solvent, and temperature. I > Br > Cl > F as leaving group ability.','Primary favors SN2; tertiary favors SN1/E1 or E2 with strong base.'],
  19:['Alcohols & Phenols','Alcohols and phenols are oxygen nucleophiles/acids with broad synthetic utility.','Alcohols undergo oxidation, substitution, esterification, dehydration, and protection. Phenols are more acidic due to resonance-stabilized phenoxide.','Convert OH to tosylate/mesylate when a better leaving group is needed.'],
  20:['Aldehydes & Ketones','Carbonyl compounds undergo nucleophilic addition at electrophilic carbonyl carbon.','Aldehydes are more reactive than ketones. Reactions include hydride reduction, Grignard addition, imine/enamine formation, acetal protection, aldol chemistry, and oxidation.','Carbonyl planarity often creates racemic alcohols after attack.'],
  21:['Carboxylic Acids','Carboxylic acids are acidic acyl compounds and precursors to acid derivatives.','They form acid chlorides, esters, amides, anhydrides and salts. Reduction usually needs LiAlH4 or borane. Fischer esterification and amide coupling are core reactions.','Acid derivative reactivity: acid chloride > anhydride > ester/acid > amide.'],
  22:['Amines & Amides','Amines are basic/nucleophilic; amides are resonance-stabilized and weakly basic.','Amines undergo alkylation, acylation, salt formation, diazotization and coupling. Amides undergo hydrolysis/reduction under stronger conditions.','Aromatic amines are less basic than aliphatic amines due to resonance.'],
  23:['Heterocycles','Heterocycles contain N, O, or S in rings and dominate medicinal chemistry.','Pyridine-like nitrogens are basic; pyrrole-like nitrogens contribute to aromaticity and are less basic. Five- and six-membered heteroaromatics are common drug scaffolds.','Heterocycles control polarity, binding, metabolism, and patent diversity.'],
  24:['Oxidation Reactions','Oxidation increases bonds to electronegative atoms or decreases C-H bonds.','Alcohols oxidize to aldehydes/ketones/acids; alkenes oxidize to diols or cleaved carbonyls; benzylic side chains oxidize to acids; sulfides oxidize to sulfoxides/sulfones.','Mild versus strong oxidant choice controls product stage.'],
  25:['Oxidising Agents','Oxidants differ in strength, selectivity, toxicity and functional group tolerance.','PCC/Swern/DMP stop primary alcohols at aldehydes; Jones/KMnO4 push primary alcohols to acids; OsO4 gives syn diols; O3 cleaves alkenes; mCPBA epoxidizes alkenes and performs Baeyer-Villiger oxidation.','In R&D, avoid harsh/toxic oxidants when a cleaner mild alternative works.'],
  26:['Reduction Reactions','Reduction decreases heteroatom bond order or adds hydrogen.','Aldehydes/ketones reduce to alcohols; nitro groups to amines; alkenes to alkanes; nitriles/amides to amines; carbonyls to methylene by Clemmensen or Wolff-Kishner.','Chemoselectivity is the main question.'],
  27:['Reducing Agents','Reducers range from mild hydrides to strong hydrides and catalytic hydrogenation.','NaBH4 reduces aldehydes/ketones; LiAlH4 reduces esters/acids/amides/nitriles too; DIBAL-H can stop esters/nitriles at aldehydes; H2/Pd reduces alkenes/nitro groups; Clemmensen and Wolff-Kishner remove C=O.','Choose reagent by functional group tolerance and workup safety.'],
  28:['Carbocation Rearrangements','Carbocation rearrangements form more stable cations by hydride or alkyl shifts.','Wagner-Meerwein rearrangement includes 1,2-hydride shift, methyl shift and ring expansion. Rearranged cation is then trapped by nucleophile or loses proton.','Always check rearrangement whenever a carbocation is formed.'],
  29:['Nitrogen Rearrangements','Nitrogen rearrangements involve migration to electron-deficient nitrogen.','Hofmann converts primary amides to amines with one fewer carbon; Curtius converts acyl azides to isocyanates; Schmidt uses azide under acid to give amide/amine derivatives.','Migration usually occurs with retention at migrating carbon.'],
  30:['Oxygen Rearrangements','Oxygen rearrangements include oxygen insertion and diol-to-carbonyl shifts.','Baeyer-Villiger oxidizes ketones to esters/lactones; Pinacol rearrangement converts vicinal diols to carbonyls after water loss and 1,2-shift.','Migratory aptitude decides major product.'],
  31:['Pericyclic Rearrangements','Pericyclic rearrangements are concerted reactions governed by orbital symmetry.','Cope rearranges 1,5-dienes; Claisen rearranges allyl vinyl ethers to unsaturated carbonyl compounds. Chair-like transition states often predict stereochemistry.','They are stereospecific and do not need ionic intermediates.'],
  32:['Cross-Coupling Reactions','Cross-couplings join two fragments using transition metals.','Suzuki uses boronic acids; Heck uses alkenes; Sonogashira uses terminal alkynes; Stille uses organotin; Negishi uses organozinc. Common cycle: oxidative addition, transmetalation/insertion, reductive elimination.','Ligand, base, halide and solvent drive optimization.'],
  33:['Homo Coupling','Homo coupling joins two identical or similar partners.','Wurtz couples alkyl halides with sodium; Glaser oxidatively couples terminal alkynes to diynes.','Useful sometimes, but in cross-coupling it can be an impurity pathway.'],
  34:['C-N / C-O Coupling','C-N and C-O couplings install heteroatoms on aryl systems.','Buchwald-Hartwig uses Pd/ligand/base for aryl amines; Ullmann uses copper systems for aryl amines/ethers and related bonds.','These are core medicinal chemistry methods for aryl amine and aryl ether synthesis.'],
  35:['Carbon-Carbon Formation','C-C bond formation builds the carbon skeleton of target molecules.','Aldol, Claisen, Wittig, Grignard, Michael, Mannich, Knoevenagel, Suzuki and related reactions are key.','Retrosynthesis often starts by identifying which C-C bond is easiest to disconnect.'],
  36:['Substitution Reactions','Named substitution reactions exchange groups with predictable scope.','Sandmeyer replaces diazonium groups; Finkelstein exchanges halides; Gabriel makes primary amines; Mitsunobu replaces alcohol OH with inversion.','Substrate class and leaving group decide pathway.'],
  37:['Oxidation / Reduction','Named redox reactions are reliable shortcuts in synthesis planning.','Swern and Dess-Martin oxidize alcohols mildly; Birch reduces arenes; Clemmensen and Wolff-Kishner reduce carbonyls to methylene; Rosenmund reduces acid chlorides to aldehydes.','Pick acidic/basic/mild conditions based on substrate stability.'],
  38:['Cyclization / Pericyclic','Cyclization and pericyclic reactions rapidly build rings.','Diels-Alder creates cyclohexenes; Paal-Knorr makes pyrroles/furans/thiophenes; Hantzsch makes dihydropyridines; Biginelli makes DHPMs; Huisgen makes triazoles.','Ring construction is often the strategic step in complex synthesis.'],
  39:['TLC','Thin-layer chromatography monitors reaction progress and checks purity quickly.','Rf depends on compound polarity, stationary phase, solvent polarity, and visualization method. More polar compounds usually travel less on silica.','Use co-spotting to compare starting material, product and reaction mixture.'],
  40:['Column Chromatography','Column chromatography separates compounds by differential adsorption.','Silica gel is polar; non-polar compounds elute first in normal phase. Solvent gradients increase eluting strength. Fractions are monitored by TLC.','Good loading and solvent choice matter more than brute force.'],
  41:['Distillation Techniques','Distillation separates liquids by volatility.','Simple distillation suits large boiling point differences; fractional distillation suits close boiling points; vacuum distillation lowers boiling point; steam distillation handles water-immiscible volatile compounds.','Useful for solvent removal, purification and scale-up.'],
  42:['Spectroscopy','Spectroscopy proves structure and purity.','IR identifies functional groups; NMR gives proton/carbon environments, integration, splitting and connectivity; MS gives molecular weight and fragmentation.','Use all spectra together, not one technique alone.'],
  43:['Impurity Profiling','Impurity profiling identifies, controls and justifies unwanted components.','Impurities can be process-related, degradation-related, residual solvents, reagents, catalysts or carryover. Purge and fate studies explain control strategy.','Critical for regulatory filings and robust process development.'],
  44:['GTI & Nitrosamine Risk','GTIs and nitrosamines require special risk assessment because of high toxicity at low levels.','Watch alkyl halides, sulfonates, epoxides, hydrazines, azides, nitrosating agents, secondary/tertiary amines and acidic nitrite conditions.','Risk control uses route design, purge, analytical methods and acceptable intake limits.'],
  45:['Reaction Optimization','Optimization improves yield, purity, robustness and scalability.','Variables include solvent, temperature, concentration, stoichiometry, base, catalyst, ligand, order of addition, water, oxygen and time. DoE helps map interactions.','Best condition is not only highest yield; impurity and scale safety matter.'],
  46:['Scale-up Chemistry','Scale-up converts lab chemistry into safe plant chemistry.','Heat transfer, mixing, gas evolution, addition rate, crystallization, filtration, exotherms and safety margins become major issues.','A good process is robust, safe, reproducible, and easy to purify.'],
  47:['Green Chemistry','Green chemistry reduces waste, hazard and energy demand.','Focus on atom economy, catalysis, safer solvents, renewable feedstocks, fewer protecting groups, lower temperature, and easier purification.','Pharma process chemistry increasingly values sustainability metrics.'],
  48:['Pericyclic Reactions','Pericyclic reactions occur through cyclic transition states with concerted electron movement.','Electrocyclic reactions, cycloadditions and sigmatropic shifts follow orbital symmetry rules and thermal/photochemical selection rules.','They are powerful because they are stereospecific and often predictable.'],
  49:['Organometallic Chemistry','Organometallic reagents create highly useful carbon nucleophiles and catalytic cycles.','Grignard, organolithium, organocuprate, organozinc, organoboron and Pd/Ni/Cu complexes are common. Reactivity depends on metal-carbon polarity and ligand environment.','Moisture sensitivity and functional group compatibility are central.'],
  50:['Retrosynthesis','Retrosynthesis plans synthesis backward from target to simple precursors.','Use disconnections, synthons, functional group interconversion, strategic bond selection and protecting group planning.','Good retrosynthesis chooses reliable reactions and minimizes step count and risk.'],
  51:['Protecting Groups','Protecting groups temporarily mask reactive functional groups.','Alcohols use silyl ethers/benzyl/acetal; amines use Boc/Cbz/Fmoc; carbonyls use acetals; acids use esters. Orthogonality means one group can be removed without disturbing another.','Use protecting groups only when they solve a real selectivity problem.'],
  52:['Asymmetric Synthesis','Asymmetric synthesis creates enantioenriched products.','Strategies include chiral pool, chiral auxiliaries, chiral catalysts, asymmetric hydrogenation, Sharpless epoxidation/dihydroxylation and organocatalysis.','In pharma, stereoselective synthesis can improve potency, safety and patent position.']
};

const customMasterChapters={
  1:{title:'Basic Concepts',sub:'General Organic Chemistry - Foundation Chapter',sections:[
    ['1.1 Meaning and Scope of Organic Chemistry','Organic chemistry is the chemistry of carbon compounds, especially molecules containing C-H, C-C, C-O, C-N, C-X, C-S, and related covalent bonds. The subject includes medicines, polymers, dyes, agrochemicals, natural products, fuels, flavors, fragrances, and advanced materials. The special nature of carbon comes from tetravalency, moderate electronegativity, small atomic size, strong covalent bond formation, and the ability to form chains and rings.'],
    ['1.2 Why Carbon Forms So Many Compounds','Carbon forms four strong covalent bonds and bonds with itself repeatedly, a property called catenation. It forms single, double, and triple bonds, and combines with H, O, N, S, P, halogens, metals, and many other atoms. This creates variation in chain length, branching, ring formation, functional groups, stereochemistry, and oxidation level.'],
    ['1.3 Classification of Organic Compounds','Organic compounds are classified as open-chain or cyclic, saturated or unsaturated, aliphatic or aromatic, homocyclic or heterocyclic, and mono-functional or poly-functional. Aromatic compounds contain cyclic conjugated pi systems with special stability. Heterocyclic compounds contain atoms such as N, O, or S within a ring and are extremely important in pharmaceuticals.'],
    ['1.4 Hybridization and Geometry','Carbon commonly uses sp3, sp2, and sp hybridization. sp3 carbon is tetrahedral with bond angle near 109.5 degrees. sp2 carbon is trigonal planar with bond angle near 120 degrees. sp carbon is linear with bond angle 180 degrees. Hybridization controls shape, bond length, bond strength, acidity, and orbital overlap.'],
    ['1.5 Sigma and Pi Bonds','A sigma bond forms by head-on orbital overlap and is usually strong and freely rotatable. A pi bond forms by sideways overlap of p orbitals and restricts rotation. A double bond has one sigma and one pi bond; a triple bond has one sigma and two pi bonds. Pi bonds are more reactive because their electron density is exposed.'],
    ['1.6 Functional Groups','A functional group is the atom or group of atoms that gives a molecule characteristic chemistry. Alcohols contain -OH, aldehydes contain -CHO, ketones contain C=O, carboxylic acids contain -COOH, amines contain nitrogen, and alkyl halides contain C-X. In most reactions, the functional group is the reactive site.'],
    ['1.7 Physical Properties and Structure','Boiling point, melting point, solubility, polarity, and crystallinity depend on molecular size, shape, intermolecular forces, hydrogen bonding, dipole moment, and branching. Larger molecules usually have stronger dispersion forces. Hydrogen bonding increases boiling point and water solubility. Branching often lowers boiling point.'],
    ['1.8 Pharma and R&D Importance','In API research, basic organic concepts explain why a molecule dissolves, crystallizes, reacts, degrades, or forms impurities. Functional group recognition helps predict process hazards and impurity pathways. Hybridization and polarity help explain pKa, salt formation, chromatography, and spectroscopy.'],
    ['1.9 Common Mistakes','Do not memorize functional groups without connecting them to reactivity. Do not treat organic chemistry as a reaction list instead of a system based on electron movement and stability. Do not ignore geometry, because sp3, sp2, and sp centers behave differently.'],
    ['1.10 Summary','Basic concepts form the foundation of organic chemistry. Carbon tetravalency, catenation, hybridization, bonding, functional groups, and molecular structure explain diversity and reactivity. A strong foundation makes acidity, mechanisms, stereochemistry, named reactions, and pharma process chemistry easier.']
  ]},
  2:{title:'Electronic Effects',sub:'How Electron Distribution Controls Organic Reactivity',sections:[
    ['2.1 Introduction','Electronic effects describe how electron density shifts within a molecule. These shifts control acidity, basicity, nucleophilicity, electrophilicity, stability of intermediates, orientation in aromatic substitution, and product selectivity. Most organic explanations begin with one question: where are the electrons, and where can they move?'],
    ['2.2 Inductive Effect','The inductive effect is permanent polarization through sigma bonds due to electronegativity difference. Electron-withdrawing groups show -I effect, such as -NO2, -CN, -COOH, -CHO, -COR, and halogens. Alkyl groups show +I effect. The effect decreases rapidly with distance.'],
    ['2.3 Mesomeric or Resonance Effect','The mesomeric effect operates through pi bonds and lone pairs in conjugated systems. +M groups donate electron density by resonance, such as -OH, -OR, and -NH2. -M groups withdraw electron density, such as -NO2, -CHO, -COR, -COOH, -CN, and -SO3H.'],
    ['2.4 Resonance Stabilization','Resonance does not mean the molecule oscillates between drawings. The real molecule is a resonance hybrid with delocalized electrons. Resonance stabilizes carbocations, carbanions, radicals, aromatic systems, carboxylate ions, amides, and enolates.'],
    ['2.5 Hyperconjugation','Hyperconjugation is delocalization from a sigma C-H or C-C bond into an adjacent empty p orbital, pi bond, or radical center. It stabilizes carbocations, radicals, and substituted alkenes, explaining the high stability of tertiary carbocations and substituted alkenes.'],
    ['2.6 Electromeric Effect','The electromeric effect is a temporary complete shift of pi electrons during attack by a reagent. It explains additions to alkenes, alkynes, and carbonyls, where pi electrons move toward an electrophile or away from a nucleophile.'],
    ['2.7 Steric and Field Effects','Steric effects influence whether electronic effects can operate. Bulky groups can block attack, reduce planarity, or prevent resonance. Field effects operate through space rather than through bonds and matter in conformationally locked systems.'],
    ['2.8 Applications','Electronic effects explain acidity of carboxylic acids, basicity of amines, stability of intermediates, directing effects in electrophilic aromatic substitution, nucleophilicity trends, and carbonyl reactivity. Nitro groups withdraw by -I and -M; alkyl groups donate by +I and hyperconjugation.'],
    ['2.9 Interview Strategy','Define the effect, state whether it donates or withdraws electrons, give one example, and explain one consequence. Example: nitrobenzene is deactivated because -NO2 withdraws electron density by -I and -M effects and directs incoming electrophiles meta.'],
    ['2.10 Summary','Electronic effects are the logic engine of organic chemistry. Inductive effects work through sigma bonds, resonance through pi systems, hyperconjugation through sigma-pi interaction, and electromeric effects during reactions.']
  ]},
  3:{title:'Acid-Base Chemistry',sub:'pKa, Stability, and Proton Transfer Logic',sections:[
    ['3.1 Introduction','Organic acid-base chemistry is the chemistry of proton transfer and electron-pair donation. It controls reaction initiation, reagent compatibility, enolate formation, salt formation, extraction, purification, and biological ionization. Many mechanisms begin with protonation or deprotonation.'],
    ['3.2 Acid-Base Definitions','A Bronsted acid donates a proton and a Bronsted base accepts a proton. A Lewis acid accepts an electron pair and a Lewis base donates an electron pair. Carbonyl oxygens, amines, halides, alkoxides, and organometallic reagents often act as Lewis bases; carbocations and boron reagents act as Lewis acids.'],
    ['3.3 Meaning of pKa','pKa measures acid strength. Lower pKa means stronger acid. The key question is stability of the conjugate base. If the conjugate base is stabilized by resonance, electronegativity, inductive withdrawal, aromaticity, hybridization, or solvation, the acid is stronger.'],
    ['3.4 Factors Affecting Acidity','Acidity increases with electronegativity of the atom bearing negative charge, greater s-character, resonance stabilization, electron-withdrawing groups, and good solvation. Carboxylic acids are more acidic than alcohols because carboxylate ions are resonance stabilized.'],
    ['3.5 Factors Affecting Basicity','Basicity depends on availability of a lone pair. Electron-donating groups increase basicity; electron-withdrawing groups reduce it. Resonance reduces basicity if the lone pair is delocalized, as in amides and anilines. Solvation and solvent also affect apparent basicity.'],
    ['3.6 Common pKa Logic','Carboxylic acids have pKa around 4-5, phenols around 10, alcohols around 16-18, terminal alkynes around 25, and alkanes around 50. Alpha hydrogens beside carbonyls are acidic because enolates are resonance stabilized.'],
    ['3.7 Acid-Base in Mechanisms','Strong bases such as LDA, NaH, and alkoxides form carbanions or enolates. Acids activate carbonyls by protonating oxygen. Protonation can convert poor leaving groups into better leaving groups, such as -OH into water.'],
    ['3.8 Pharma Relevance','pKa controls ionization, solubility, salt formation, permeability, extraction, crystallization, and chromatographic behavior. Many APIs are formulated as salts to improve solubility or stability. Workup pH often decides impurity removal and isolation.'],
    ['3.9 Common Mistakes','Do not confuse acidity with concentration. Do not say a molecule is acidic only because it has hydrogen; the conjugate base must be stable. Do not assume all nitrogens are strongly basic, because amide nitrogen is weakly basic.'],
    ['3.10 Summary','Acid-base chemistry is a stability problem. Stronger acids give more stable conjugate bases, and stronger bases have more available electron pairs. pKa, resonance, inductive effects, hybridization, solvation, and functional group context explain most behavior.']
  ]},
  4:{title:'Reaction Intermediates',sub:'Short-Lived Species That Decide Mechanism and Product',sections:[
    ['4.1 Introduction','Reaction intermediates are short-lived species formed between reactants and products. They are not transition states; intermediates occupy local energy minima and may sometimes be detected or trapped. They decide rearrangements, stereochemistry, rate, and side products.'],
    ['4.2 Carbocations','Carbocations contain electron-deficient carbon with a positive charge and usually an empty p orbital. They are commonly sp2 hybridized and planar. Stability follows benzylic or allylic greater than tertiary greater than secondary greater than primary greater than methyl.'],
    ['4.3 Carbanions','Carbanions contain negatively charged carbon with a lone pair. They act as bases and nucleophiles. Stability increases with resonance, electron-withdrawing groups, and greater s-character. Enolates, acetylides, and organometallic reagents have carbanion-like character.'],
    ['4.4 Free Radicals','Free radicals contain one unpaired electron and are usually neutral. Stability generally follows benzylic or allylic greater than tertiary greater than secondary greater than primary. Radical reactions often proceed by initiation, propagation, and termination.'],
    ['4.5 Carbenes and Nitrenes','Carbenes are neutral divalent carbon species with six valence electrons, existing as singlet or triplet forms. They add to alkenes and insert into bonds. Nitrenes are nitrogen analogs and participate in C-H insertion, aziridination, and rearrangement chemistry.'],
    ['4.6 Arynes','Arynes such as benzyne are highly reactive intermediates containing a strained formal triple bond in an aromatic ring. They are generated from aryl halides under strong basic conditions and react with nucleophiles or dienes.'],
    ['4.7 Rearrangement Tendency','Intermediates often rearrange to more stable structures. Carbocations can undergo hydride shifts, methyl shifts, and ring expansions. Rearrangement is likely when the new intermediate is significantly more stable.'],
    ['4.8 Stereochemical Consequences','Planar carbocations can be attacked from either face, causing racemization or mixtures. Concerted reactions avoid free intermediates and often have stereospecific outcomes. Radical intermediates can also lead to mixtures due to rotation before trapping.'],
    ['4.9 Process Importance','Reactive intermediates may generate impurities, regioisomers, overreaction products, or safety hazards. Process chemists must know whether an intermediate is ionic, radical, or metal-bound to control selectivity and impurity formation.'],
    ['4.10 Summary','Intermediates are hidden decision points in reactions. Carbocations, carbanions, radicals, carbenes, nitrenes, and arynes each have characteristic stability, geometry, and reactivity. Mechanistic thinking starts by asking which intermediate is possible.']
  ]},
  5:{title:'Reaction Mechanism Fundamentals',sub:'Electron Flow, Transition States, and Reaction Pathways',sections:[
    ['5.1 Introduction','A reaction mechanism is a step-by-step description of how reactants become products. It shows bond breaking, bond making, charge movement, intermediates, transition states, and catalysts. Mechanisms are the language of organic chemistry.'],
    ['5.2 Curved Arrow Notation','Curved arrows show electron movement, not atom movement. An arrow begins at an electron source such as a lone pair, pi bond, or sigma bond, and ends at an electron-poor atom or bond-forming position. Fishhook arrows show one-electron radical movement.'],
    ['5.3 Bond Breaking and Formation','Bonds break heterolytically to give ions or homolytically to give radicals. Bond formation occurs when an electron-rich site donates to an electron-poor site. Most polar organic reactions are nucleophile-electrophile combinations.'],
    ['5.4 Transition State vs Intermediate','A transition state is the highest-energy arrangement along a reaction step and cannot be isolated. An intermediate is a real species between steps and may sometimes be detected. Energy diagrams connect activation energy to rate.'],
    ['5.5 Kinetic and Thermodynamic Control','Kinetic products form faster because they have lower activation energy. Thermodynamic products are more stable and dominate under reversible or high-temperature conditions. Product distribution depends on conditions.'],
    ['5.6 Hammond Postulate','The Hammond postulate states that a transition state resembles the species closest to it in energy. Endothermic steps have product-like transition states, while exothermic steps have reactant-like transition states.'],
    ['5.7 Catalysis','A catalyst increases reaction rate by lowering activation energy and is regenerated. Acid catalysts activate electrophiles or leaving groups; base catalysts generate nucleophiles; metal catalysts enable oxidative addition, insertion, transmetalation, and reductive elimination.'],
    ['5.8 Mechanism Validation','Mechanisms are supported by kinetics, isotope labeling, stereochemical outcome, intermediate trapping, substituent effects, and product distribution. A proposed mechanism must explain all observations, not only the major product.'],
    ['5.9 Interview Strategy','When explaining a mechanism, identify nucleophile, electrophile, leaving group, solvent, and rate-determining step. Then describe electron flow. Avoid vague phrases; say which electrons move and why.'],
    ['5.10 Summary','Mechanisms organize organic chemistry into logical steps. Curved arrows, transition states, intermediates, energy diagrams, kinetic control, thermodynamic control, and catalysis explain why reactions happen and what products form.']
  ]},
  6:{title:'Types of Organic Reactions',sub:'The Main Reaction Families',sections:[
    ['6.1 Introduction','Most organic reactions belong to a few major families: substitution, elimination, addition, rearrangement, oxidation, reduction, and coupling. Learning the family first makes individual named reactions much easier.'],
    ['6.2 Substitution','In substitution, one group replaces another. SN1 proceeds through a carbocation and is favored by tertiary substrates and polar protic solvents. SN2 is concerted backside attack and is favored by methyl or primary substrates and polar aprotic solvents.'],
    ['6.3 Elimination','Elimination removes atoms or groups to form a pi bond. E1 proceeds through carbocations and may rearrange. E2 is concerted and requires proper geometry. E1cb occurs when a carbanion forms before leaving group departure.'],
    ['6.4 Addition','Addition reactions add atoms across pi bonds. Alkenes, alkynes, carbonyls, and imines commonly undergo addition. Reagent type decides Markovnikov, anti-Markovnikov, syn, anti, reversible, or irreversible behavior.'],
    ['6.5 Rearrangement','Rearrangements change carbon skeleton or connectivity. They often proceed through carbocations, nitrenes, carbenes, or pericyclic transition states. Migration tendency and intermediate stability are central.'],
    ['6.6 Oxidation and Reduction','Oxidation increases bonds to electronegative atoms or decreases bonds to hydrogen. Reduction does the opposite. Organic redox is often tracked by functional group level: alcohol to aldehyde to acid is oxidation.'],
    ['6.7 Coupling','Coupling joins two fragments, often forming C-C, C-N, or C-O bonds. Metal-catalyzed couplings such as Suzuki, Heck, Sonogashira, Negishi, Stille, and Buchwald-Hartwig are essential in medicinal chemistry.'],
    ['6.8 Choosing a Reaction Type','Identify the starting functional group, desired product, bond to be formed or broken, substrate class, and functional group tolerance. Then choose the reaction family and finally the reagent conditions.'],
    ['6.9 Common Mistakes','Do not memorize reactions without identifying their family. Do not apply SN2 to tertiary substrates or expect SN1 without a stable carbocation. Do not ignore elimination as a side reaction.'],
    ['6.10 Summary','Reaction types are the filing system of organic chemistry. Once you classify a transformation, you can predict mechanism, conditions, side reactions, stereochemistry, and limitations.']
  ]},
  7:{title:'Stability Concepts',sub:'Why Some Structures and Products Are Favored',sections:[
    ['7.1 Introduction','Stability concepts explain why one intermediate, conformer, alkene, radical, ion, or product is favored. Stability controls rate, equilibrium, product distribution, and rearrangement pathways.'],
    ['7.2 Carbocation Stability','Carbocations are stabilized by resonance, hyperconjugation, and electron-donating groups. Benzylic and allylic carbocations are especially stable. Tertiary carbocations are more stable than secondary and primary due to hyperconjugation and inductive donation.'],
    ['7.3 Carbanion Stability','Carbanions are stabilized by electron-withdrawing groups, resonance, and high s-character. Acetylide ions are more stable than vinyl or alkyl carbanions. Enolates are stabilized by resonance between carbon and oxygen.'],
    ['7.4 Radical Stability','Radicals are stabilized by resonance and hyperconjugation. Benzylic and allylic radicals are more stable than simple alkyl radicals. Radical stability influences selectivity in halogenation and radical additions.'],
    ['7.5 Alkene Stability','More substituted alkenes are generally more stable due to hyperconjugation and alkyl donation. Trans alkenes are often more stable than cis alkenes due to reduced steric repulsion. Conjugated alkenes are more stable than isolated alkenes.'],
    ['7.6 Aromatic Stability','Aromatic compounds gain special stabilization from cyclic conjugation and Huckel 4n+2 pi electron count. Antiaromatic compounds are destabilized by cyclic conjugation with 4n pi electrons.'],
    ['7.7 Conformational Stability','Staggered conformations are more stable than eclipsed. In cyclohexane, equatorial substituents are more stable than axial substituents because they avoid 1,3-diaxial interactions.'],
    ['7.8 Kinetic vs Thermodynamic Stability','The most stable product is thermodynamic, but the fastest-forming product is kinetic. A reaction may give different products depending on temperature, reversibility, and reaction time.'],
    ['7.9 Application','Stability explains Markovnikov addition, rearrangements, Zaitsev elimination, resonance preference, conformational analysis, and aromatic substitution. It also predicts degradation and impurity formation.'],
    ['7.10 Summary','Stability is the backbone of prediction. Resonance, hyperconjugation, inductive effects, aromaticity, sterics, solvation, and conformational effects decide which species survives and which pathway dominates.']
  ]},
  8:{title:'Aromaticity',sub:'Special Stability in Cyclic Conjugated Systems',sections:[
    ['8.1 Introduction','Aromaticity is unusual stability shown by certain cyclic, planar, fully conjugated molecules. Aromatic compounds resist addition and prefer substitution because substitution preserves aromatic stabilization.'],
    ['8.2 Conditions for Aromaticity','A molecule is aromatic if it is cyclic, planar, fully conjugated, and contains 4n+2 pi electrons. Benzene has six pi electrons and is aromatic. Continuous p orbital overlap around the ring is essential.'],
    ['8.3 Antiaromatic and Non-Aromatic','Antiaromatic compounds are cyclic, planar, fully conjugated systems with 4n pi electrons and are unusually unstable. Non-aromatic compounds fail one or more requirements and do not receive aromatic stabilization or antiaromatic destabilization.'],
    ['8.4 Counting Pi Electrons','Each pi bond contributes two pi electrons. A negatively charged atom in a p orbital can contribute two. A positively charged atom with an empty p orbital contributes zero but may allow conjugation. Lone pairs count only if part of the pi system.'],
    ['8.5 Heteroaromatic Compounds','Pyridine, pyrrole, furan, thiophene, imidazole, indole, and many drug-like rings are heteroaromatic. Pyridine nitrogen lone pair is not part of the aromatic sextet; pyrrole nitrogen lone pair is part of it.'],
    ['8.6 Aromatic Reactivity','Aromatic rings undergo electrophilic aromatic substitution rather than addition. Substituents activate or deactivate the ring and direct incoming electrophiles to ortho, meta, or para positions.'],
    ['8.7 Aromatic Ions','Cyclopentadienyl anion is aromatic with six pi electrons. Tropylium ion is aromatic with six pi electrons. Cyclobutadiene is antiaromatic with four pi electrons and is highly unstable.'],
    ['8.8 Pharma Importance','Aromatic and heteroaromatic rings are common in APIs because they provide shape, pi-stacking, metabolic stability, and binding interactions. They may also undergo oxidative metabolism or carry impurity risks.'],
    ['8.9 Common Mistakes','Do not count all lone pairs automatically. Do not call every ring aromatic. Planarity and conjugation are required. Do not forget charges when counting pi electrons.'],
    ['8.10 Summary','Aromaticity requires cyclic planarity, continuous conjugation, and 4n+2 pi electrons. It explains stability and substitution chemistry of benzene, heterocycles, aromatic ions, and pharma scaffolds.']
  ]},
  9:{title:'Solvent Effects',sub:'How Medium Controls Mechanism, Rate, and Selectivity',sections:[
    ['9.1 Introduction','Solvents are not passive liquids. They stabilize or destabilize ions, hydrogen-bond with reagents, change nucleophilicity, influence transition states, affect solubility, and control mechanism selection.'],
    ['9.2 Polar and Non-Polar Solvents','Polar solvents stabilize charged species and polar transition states. Non-polar solvents are better for non-polar substrates and radical or pericyclic reactions. Polarity, donor ability, and hydrogen bonding must all be considered.'],
    ['9.3 Protic Solvents','Protic solvents such as water, methanol, ethanol, acetic acid, and ammonia donate hydrogen bonds. They stabilize anions strongly and often reduce nucleophilicity. They favor SN1 by stabilizing carbocations and leaving groups.'],
    ['9.4 Aprotic Solvents','Polar aprotic solvents such as DMSO, DMF, DMAc, acetonitrile, acetone, and NMP solvate cations better than anions. This leaves anions more reactive and enhances SN2 reactions.'],
    ['9.5 SN1 and SN2','SN1 benefits from polar protic solvents because ionization is stabilized. SN2 benefits from polar aprotic solvents because the nucleophile remains strong. Iodide is more nucleophilic in acetone or DMSO than in water.'],
    ['9.6 Elimination','E1 reactions are favored by polar protic solvents and heat. E2 depends on base strength and substrate geometry; solvent affects basicity and ion pairing. Bulky bases can shift products toward Hofmann elimination.'],
    ['9.7 Process Chemistry','Process chemists choose solvents based on reactivity, selectivity, safety, cost, boiling point, toxicity, environmental profile, crystallization behavior, and regulatory limits. A high-yield solvent may still be rejected at scale.'],
    ['9.8 Purification','Solvent affects crystallization, extraction, chromatography, precipitation, and impurity purge. A product may oil out in one solvent but crystallize cleanly in another. Mixed solvent systems are often used.'],
    ['9.9 Common Mistakes','Do not choose solvent only by polarity. Consider protic/aprotic character, boiling point, water content, miscibility, safety, and reagent compatibility. Milligram behavior may not scale directly.'],
    ['9.10 Summary','Solvent controls mechanism, rate, selectivity, isolation, and scale-up. Understanding solvent effects explains SN1/SN2 behavior, elimination, nucleophilicity, salt formation, crystallization, and process robustness.']
  ]},
  10:{title:'Intermolecular Forces',sub:'Physical Properties from Molecular Attraction',sections:[
    ['10.1 Introduction','Intermolecular forces are attractions between molecules. They control boiling point, melting point, viscosity, solubility, volatility, crystallinity, chromatography, and formulation behavior.'],
    ['10.2 London Dispersion Forces','London dispersion forces arise from temporary induced dipoles. They exist in all molecules and increase with molecular size, surface area, and polarizability. Long straight-chain hydrocarbons boil higher than highly branched isomers.'],
    ['10.3 Dipole-Dipole Interactions','Polar molecules attract through permanent dipoles. Carbonyls, nitriles, alkyl halides, sulfoxides, and many heteroatom-containing molecules show dipole interactions. Stronger dipoles generally increase boiling point and affect solubility.'],
    ['10.4 Hydrogen Bonding','Hydrogen bonding occurs when H attached to O, N, or F interacts with lone pairs on electronegative atoms. Alcohols, acids, amines, amides, and phenols can form hydrogen bonds, increasing boiling point and water solubility.'],
    ['10.5 Ionic and Ion-Dipole Interactions','Salts and ionic compounds interact strongly with polar solvents through ion-dipole forces. This is important for extraction, salt formation, API solubility, and crystallization.'],
    ['10.6 Boiling Point Trends','Boiling point increases with molecular weight, surface area, polarity, and hydrogen bonding. Branching usually lowers boiling point. Carboxylic acids often have high boiling points due to dimer formation.'],
    ['10.7 Solubility Trends','Like dissolves like is a useful starting rule. Polar compounds dissolve better in polar solvents, while non-polar compounds dissolve better in non-polar solvents. Ionization can greatly increase water solubility.'],
    ['10.8 Chromatography Connection','Intermolecular forces explain TLC and column chromatography. Polar compounds interact strongly with polar silica and move slowly in normal-phase chromatography. Less polar compounds elute faster.'],
    ['10.9 Pharma Relevance','Intermolecular forces affect crystal form, polymorphism, hygroscopicity, tablet behavior, dissolution rate, permeability, and protein binding. Salt selection and co-crystal design rely on these interactions.'],
    ['10.10 Summary','Intermolecular forces connect structure to physical behavior. Dispersion, dipole-dipole, hydrogen bonding, ionic interactions, and ion-dipole forces explain boiling point, solubility, chromatography, crystallization, and pharmaceutical performance.']
  ]},
  11:{title:'Structural Isomerism',sub:'Same Molecular Formula, Different Connectivity',sections:[
    ['11.1 Introduction','Structural isomerism occurs when compounds have the same molecular formula but different connectivity of atoms. This is the first major reason organic chemistry has enormous diversity: a single formula can represent many different compounds with different physical properties, reactions, spectra, toxicity, and biological activity.'],
    ['11.2 Chain Isomerism','Chain isomers differ in the arrangement of the carbon skeleton. For example, pentane, isopentane, and neopentane all have formula C5H12 but differ in branching. Branching changes boiling point, melting behavior, packing, and sometimes metabolic stability.'],
    ['11.3 Position Isomerism','Position isomers have the same carbon skeleton and functional group but differ in the position of that functional group, multiple bond, or substituent. Examples include 1-propanol and 2-propanol, or o-, m-, and p-disubstituted benzenes. Position changes can alter reactivity and biological binding.'],
    ['11.4 Functional Group Isomerism','Functional group isomers have the same molecular formula but different functional groups. Ethanol and dimethyl ether share formula C2H6O but have very different properties. Aldehydes and ketones, acids and esters, alcohols and ethers, nitriles and isocyanides often show this relationship.'],
    ['11.5 Metamerism','Metamerism occurs when compounds have the same functional group but different alkyl groups on either side of a polyvalent atom or group. Ethers, thioethers, secondary amines, ketones, and esters can show metamerism. This is useful when comparing reactivity and boiling points.'],
    ['11.6 Tautomerism','Tautomerism is dynamic structural isomerism, usually involving proton shift and pi bond shift. Keto-enol tautomerism is the most important example. Tautomerism affects NMR spectra, reactivity, acidity, hydrogen bonding, and biological recognition.'],
    ['11.7 Ring-Chain Isomerism','Ring-chain isomers differ by open-chain versus cyclic structures. Alkenes and cycloalkanes can share molecular formula CnH2n. This difference changes strain, conformation, addition reactions, and physical properties.'],
    ['11.8 How to Solve Isomerism Questions','First calculate degree of unsaturation, then list possible carbon skeletons, then place functional groups, then check position isomers, functional group isomers, and stereoisomers. Avoid duplicate structures by using symmetry.'],
    ['11.9 Pharma Relevance','Structural isomers can have completely different pharmacological effects. Regulatory control also cares about regioisomeric impurities, positional isomers, and tautomeric forms. In synthesis, wrong regioisomer formation can become a major impurity problem.'],
    ['11.10 Summary','Structural isomerism is connectivity-based diversity. Chain, position, functional group, metamerism, tautomerism, and ring-chain isomerism explain how identical formulas can represent different compounds. Always distinguish structural isomers from stereoisomers.']
  ]},
  12:{title:'Conformational Isomerism',sub:'Rotation, Energy, and Molecular Shape',sections:[
    ['12.1 Introduction','Conformational isomerism arises from rotation around single sigma bonds. Conformers interconvert without breaking bonds, but they do not have equal energy. Conformational analysis is essential because molecular shape controls steric strain, reactivity, stereoselectivity, and biological binding.'],
    ['12.2 Ethane Conformations','Ethane has staggered and eclipsed conformations. The staggered form is more stable because bonding electron pairs are farther apart. The eclipsed form has torsional strain due to electron-pair repulsion. Rotation around the C-C bond passes through energy maxima and minima.'],
    ['12.3 Butane Conformations','Butane shows anti, gauche, and eclipsed conformations. The anti conformer is most stable because the two methyl groups are farthest apart. Gauche has some steric strain but is still staggered. Fully eclipsed methyl-methyl interaction is highest in energy.'],
    ['12.4 Cyclohexane Chair Form','Cyclohexane is most stable in the chair conformation because it avoids angle strain and torsional strain. Each carbon has axial and equatorial positions. Ring flip interconverts axial and equatorial positions but does not change up/down relationship.'],
    ['12.5 Axial and Equatorial Preference','Bulky substituents prefer equatorial positions to avoid 1,3-diaxial interactions. Methylcyclohexane is more stable with methyl equatorial. Larger groups such as tert-butyl have very strong equatorial preference and can lock conformation.'],
    ['12.6 Conformation and Reactivity','Conformation can decide whether a reaction occurs. E2 elimination in cyclohexanes requires anti-periplanar geometry, often meaning trans-diaxial arrangement of beta-H and leaving group. Therefore, the most stable conformation is not always the reactive conformation.'],
    ['12.7 Newman and Sawhorse Projections','Newman projections view a molecule down a bond axis and are ideal for comparing staggered and eclipsed conformations. Sawhorse projections show the same relationship at an angle. These drawings help visualize torsional strain and anti/gauche relationships.'],
    ['12.8 Conformation in Biomolecules','Proteins, carbohydrates, nucleosides, and drug molecules depend heavily on conformation. A drug may bind only in one preferred conformation. Conformational restriction can improve potency, selectivity, or metabolic stability in medicinal chemistry.'],
    ['12.9 Common Mistakes','Do not confuse conformers with configurational isomers. Conformers interconvert by rotation; configurational isomers require bond breaking. Do not draw cyclohexane as a flat hexagon when discussing stability or axial/equatorial relationships.'],
    ['12.10 Summary','Conformational isomerism is shape variation through sigma-bond rotation. Staggered forms are usually more stable than eclipsed, anti is more stable than gauche for butane, and cyclohexane prefers chair conformations with bulky groups equatorial.']
  ]},
  13:{title:'Configurational Isomerism',sub:'Stereoisomers That Require Bond Breaking to Interconvert',sections:[
    ['13.1 Introduction','Configurational isomers are stereoisomers that cannot interconvert without breaking bonds. They include geometrical isomers such as cis/trans and E/Z forms, and optical isomers such as enantiomers and diastereomers. This chapter connects structure to fixed three-dimensional identity.'],
    ['13.2 Geometrical Isomerism','Geometrical isomerism occurs when rotation is restricted, usually by C=C double bonds or rings. In alkenes, substituents cannot freely rotate around the pi bond. If similar or priority groups are on the same side, the compound may be cis or Z; if opposite, trans or E.'],
    ['13.3 Cis/Trans Nomenclature','Cis/trans is useful when each alkene carbon has one similar group or in disubstituted rings. Cis means groups are on the same side; trans means opposite sides. However, cis/trans becomes ambiguous for highly substituted alkenes, so E/Z nomenclature is more general.'],
    ['13.4 E/Z Nomenclature','E/Z assignment uses Cahn-Ingold-Prelog priority rules. Assign priority on each alkene carbon based on atomic number. If the higher-priority groups are on the same side, configuration is Z. If they are on opposite sides, configuration is E. E/Z does not mean largest group visually; it means highest CIP priority.'],
    ['13.5 Optical Isomerism','Optical isomerism arises when molecules are chiral and exist as non-superimposable mirror images. These mirror-image forms are enantiomers. Optical isomers rotate plane-polarized light and interact differently with chiral environments such as enzymes, receptors, and chiral catalysts.'],
    ['13.6 Enantiomers and Diastereomers','Enantiomers are non-superimposable mirror images. Diastereomers are stereoisomers that are not mirror images. Enantiomers have identical physical properties in achiral environments except optical rotation, while diastereomers generally have different physical and chemical properties.'],
    ['13.7 Relationship With Chirality','Configurational isomerism often depends on chirality, but not always. E/Z is configurational even without chiral centers. A molecule may contain stereocenters and still be achiral if it has internal symmetry, as in meso compounds.'],
    ['13.8 Separation and Analysis','Diastereomers can often be separated by normal crystallization or chromatography because their physical properties differ. Enantiomers require chiral resolution, chiral chromatography, enzymatic methods, or conversion to diastereomeric derivatives.'],
    ['13.9 Pharma Importance','Configurational identity can decide drug activity, toxicity, metabolism, and patentability. A wrong E/Z isomer or wrong enantiomer can reduce potency or create safety risk. Therefore stereochemical control and analytical proof are critical in API development.'],
    ['13.10 Summary','Configurational isomers require bond breaking for interconversion. Geometrical isomerism uses cis/trans or E/Z, while optical isomerism includes enantiomers and diastereomers. CIP priority, symmetry, and molecular shape are essential for correct assignment.']
  ]}
};

function renderCustomChapter(num,chapter){
  const body=chapter.sections
    .filter(s=>!/common\s+(mistakes|misconceptions)/i.test(s[0]))
    .map(s=>`<div class="detail-section"><div class="detail-section-title">${s[0]}</div><p class="detail-text">${s[1]}</p></div>`)
    .join('');
  return `<div class="detail-title">Chapter ${num}: ${chapter.title}</div><div class="detail-subtitle">${chapter.sub}</div>${body}${renderDeepExpansion(num,[chapter.title,chapter.sections[0]?.[1]||'',chapter.sections.map(s=>s[0]).join('; '),chapter.sub])}`;
}

function chapterFamily(num){
  if(num<=10) return {
    label:'General Organic Chemistry Foundation',
    focus:'structure, bonding, electronic logic, stability, and mechanism prediction',
    use:'This foundation is used every time you predict acidity, basicity, nucleophilicity, product stability, or reaction pathway.',
    examples:['Compare carbocation stability before predicting SN1 or E1 products.','Use pKa and conjugate base stability before choosing a base.','Use solvent and substrate class to separate SN1, SN2, E1, and E2 logic.']
  };
  if(num<=14) return {
    label:'Stereochemistry and Molecular Shape',
    focus:'three-dimensional structure, configuration, conformation, optical behavior, and stereochemical outcome',
    use:'This chapter family matters strongly in pharmaceuticals because biological targets are chiral and shape-selective.',
    examples:['Assign R/S or E/Z before comparing stereoisomers.','Check symmetry before calling a molecule optically active.','Predict inversion, retention, or racemization from the mechanism.']
  };
  if(num<=26) return {
    label:'Functional Group Chemistry',
    focus:'functional group recognition, reactivity patterns, preparation, reactions, and interconversion',
    use:'Functional group logic is the language of synthesis: it tells you which bond reacts, which reagent is compatible, and which impurity may form.',
    examples:['Alcohols oxidize differently depending on 1 degree, 2 degree, or 3 degree structure.','Carbonyl compounds react at electrophilic carbon and at alpha positions.','Amines combine basicity, nucleophilicity, and salt formation behavior.']
  };
  if(num<=38) return {
    label:'Named Reactions and Transformation Strategy',
    focus:'reaction class, mechanism, conditions, selectivity, scope, and limitations',
    use:'A reaction is useful only when you know why it works, what it tolerates, and what side reactions it can produce.',
    examples:['Use Grignard reactions for C-C bond formation but protect acidic protons.','Use Suzuki coupling when boronic acids and aryl halides are compatible.','Use rearrangements only when migration tendency and intermediate stability support them.']
  };
  if(num<=42) return {
    label:'Analytical and Practical Organic Chemistry',
    focus:'monitoring, purification, identification, and proof of structure',
    use:'Practical chemistry decides whether a reaction is actually successful: yield is meaningless without purity and structural confirmation.',
    examples:['Use TLC to compare starting material, product, and reaction mixture.','Use NMR integration, splitting, and chemical shift together.','Use distillation only when volatility differences make separation practical.']
  };
  if(num<=47) return {
    label:'Industrial and Pharma Organic Chemistry',
    focus:'impurity control, safety, robustness, scalability, sustainability, and regulatory thinking',
    use:'Pharma process chemistry values reproducibility, impurity purge, safety margin, and clean isolation as much as chemical yield.',
    examples:['Optimize for impurity profile, not only conversion.','Check nitrosamine risk when amines and nitrosating conditions are possible.','Consider heat transfer and mixing before scaling an exothermic reaction.']
  };
  return {
    label:'Advanced Synthesis Strategy',
    focus:'route design, stereocontrol, organometallic logic, protecting groups, and retrosynthetic planning',
    use:'Advanced organic chemistry turns reaction knowledge into synthesis design and decision-making.',
    examples:['Disconnect the most strategic bond first in retrosynthesis.','Use protecting groups only when chemoselectivity demands them.','Select asymmetric methods based on substrate class, catalyst availability, and desired enantiomeric purity.']
  };
}

function listFromText(text){
  return text.split(/;|\. /).map(s=>s.trim().replace(/\.$/,'')).filter(Boolean).slice(0,6);
}

function topicProfile(num,d){
  const title=d[0].toLowerCase();
  if(num<=10) return {
    principle:'Always start from structure. Identify atoms with high electron density, atoms with electron deficiency, polarized bonds, resonance pathways, and possible stabilizing effects. Most GOC answers become simple when charge stability and orbital overlap are checked first.',
    mechanism:'Use curved arrows from electron-rich centers to electron-poor centers. Bond breaking can be heterolytic, homolytic, or concerted. Compare possible intermediates and transition states before deciding the major pathway.',
    rows:[
      ['Electronic control','Inductive effect, resonance, hyperconjugation, aromaticity, and solvation decide charge distribution.'],
      ['Steric control','Bulky groups slow approach, change conformation, and may switch substitution into elimination.'],
      ['Thermodynamic control','More stable product dominates when reaction is reversible or heated.'],
      ['Kinetic control','Fastest-forming product dominates when reaction is irreversible or cold.']
    ],
    example:'Compare a benzylic carbocation with a primary alkyl carbocation: the benzylic cation is stabilized by resonance, so SN1 or rearrangement-type pathways become much more reasonable.'
  };
  if(num<=16) return {
    principle:'Draw the molecule in three dimensions before assigning names. Stereochemistry depends on spatial arrangement, symmetry, restricted rotation, and the relationship between stereoisomers.',
    mechanism:'For stereochemical outcome, ask whether the reaction is concerted, planar, or stepwise. Concerted backside attack gives inversion, planar carbocations can give racemization, and cyclic transition states can give stereospecific products.',
    rows:[
      ['Configuration','R/S, E/Z, cis/trans: fixed arrangement requiring bond breaking for change.'],
      ['Conformation','Chair, boat, staggered, eclipsed, anti, gauche: changes by bond rotation or ring flip.'],
      ['Enantiomers','Mirror-image non-superimposable pair; identical in achiral media except optical rotation.'],
      ['Diastereomers','Not mirror images; usually different melting point, solubility, and reactivity.']
    ],
    example:'In cyclohexane, a bulky substituent prefers equatorial position because it avoids 1,3-diaxial interactions. This affects both stability and reaction rate.'
  };
  if(num<=27) return {
    principle:'Functional group chemistry is controlled by polarity and oxidation level. Identify the electrophilic atom, nucleophilic atom, acidic proton, leaving group, and any group that can be oxidized, reduced, protected, or converted.',
    mechanism:'Most transformations follow nucleophilic substitution, nucleophilic addition, elimination, acyl substitution, oxidation, or reduction. Decide whether the reagent attacks carbon, removes proton, donates hydride, accepts electrons, or activates a leaving group.',
    rows:[
      ['Alcohols','Oxidation, esterification, substitution after activation, dehydration, protection.'],
      ['Carbonyls','Nucleophilic addition, imine/enamine formation, aldol chemistry, reduction.'],
      ['Acid derivatives','Nucleophilic acyl substitution; leaving group ability controls reactivity.'],
      ['Amines','Basicity, nucleophilicity, salt formation, acylation, diazotization for aryl amines.']
    ],
    example:'Aldehydes react faster than ketones because they are less hindered and more electrophilic. Grignard addition gives alcohols after acidic workup.'
  };
  if(num<=38) return {
    principle:'Named reactions should be studied as transformation patterns, not as isolated names. For each reaction, learn substrate class, reagent system, bond formed or broken, mechanism family, selectivity, and limitation.',
    mechanism:'Map every named reaction into a cycle or sequence: activation, bond formation, intermediate control, and product-forming step. In metal-catalysed reactions, remember oxidative addition, transmetalation or insertion, and reductive elimination.',
    rows:[
      ['C-C formation','Grignard, Aldol, Wittig, Michael, Mannich, Suzuki, Heck, Sonogashira.'],
      ['Rearrangement','Migration occurs when a more stable cation, acyl shift, or concerted pathway is available.'],
      ['Redox named reactions','Swern, DMP, Birch, Clemmensen, Wolff-Kishner, Rosenmund.'],
      ['Cyclization','Diels-Alder, Paal-Knorr, Hantzsch, Biginelli, Huisgen build rings quickly.']
    ],
    example:'In Suzuki coupling, aryl halide and boronic acid form a biaryl product under Pd/base conditions. Base activates boron and the catalyst closes the cycle by reductive elimination.'
  };
  if(num<=42) return {
    principle:'Analytical and practical organic chemistry connects reaction work to evidence. A reaction is complete only when conversion, purity, identity, and isolation are supported by data.',
    mechanism:'Choose technique by question: TLC for progress, column for separation, distillation for volatility, IR for functional group, NMR for environment/connectivity, MS for molecular weight.',
    rows:[
      ['TLC','Fast monitoring; Rf changes with polarity and mobile phase strength.'],
      ['Column','Separation by differential adsorption; gradient improves elution control.'],
      ['Distillation','Depends on vapor pressure and boiling point difference.'],
      ['Spectroscopy','IR + NMR + MS together provide stronger proof than one method alone.']
    ],
    example:'If starting material spot disappears on TLC but NMR shows extra peaks, the reaction may be complete but product is impure; purification and spectral assignment are still needed.'
  };
  if(num<=47) return {
    principle:'Process chemistry optimizes chemistry for safety, purity, reproducibility, and scale. A high-yield lab reaction may still fail if it has poor heat control, difficult filtration, toxic reagents, or impurity risk.',
    mechanism:'Think in terms of input variables and output quality. Solvent, temperature, addition rate, water content, stoichiometry, catalyst loading, mixing, and crystallization can all change impurity profile.',
    rows:[
      ['Impurity control','Identify source, formation pathway, fate, purge, and analytical method.'],
      ['Scale-up','Heat transfer, mixing, gas evolution, exotherm, filtration, and isolation dominate.'],
      ['Safety','Avoid uncontrolled exotherms, pressure buildup, toxic gases, and unstable intermediates.'],
      ['Green metrics','Prefer catalytic, atom-economic, safer-solvent, lower-waste processes.']
    ],
    example:'A cleaner route may be preferred over a higher-yield route if it avoids genotoxic impurities, heavy metals, hazardous reagents, or difficult chromatographic purification.'
  };
  return {
    principle:'Advanced synthesis combines reaction knowledge with route design. The key skill is choosing the disconnection, reagent class, stereochemical strategy, and protecting group plan that reduce total risk.',
    mechanism:'Work backward from the target. Identify strategic bonds, functional group interconversions, latent polarity, stereocenters, and incompatible groups. Then choose forward reactions that are selective and practical.',
    rows:[
      ['Retrosynthesis','Disconnect bonds to simpler, available, and reliable precursors.'],
      ['Organometallics','Use carbon-metal polarity for C-C bond formation or catalytic cycles.'],
      ['Protecting groups','Use only when chemoselectivity cannot be solved directly.'],
      ['Asymmetric synthesis','Choose chiral pool, catalyst, auxiliary, or resolution by substrate and target need.']
    ],
    example:'A target alcohol adjacent to an aryl ring may come from retrosynthetic disconnection to a ketone followed by stereoselective reduction or asymmetric addition.'
  };
}

function renderComparisonRows(rows){
  return rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
}

function encodeSvg(svg){
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function visualProfile(num){
  if(num<=10) return {
    theme:'Electron movement and stability',
    molecules:['benzene','acetone','acetic acid'],
    links:[['Reaction mechanisms category','https://commons.wikimedia.org/wiki/Category:Reaction_mechanisms'],['PubChem structure search','https://pubchem.ncbi.nlm.nih.gov/']],
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260"><rect width="760" height="260" rx="22" fill="#081018"/><path d="M120 130h120M388 130h120" stroke="#38d5f5" stroke-width="4"/><path d="M240 130c48-64 100-64 148 0" stroke="#b6e867" stroke-width="4" fill="none"/><circle cx="112" cy="130" r="22" fill="#2dd4bf"/><circle cx="250" cy="130" r="18" fill="#38d5f5"/><circle cx="510" cy="130" r="22" fill="#2dd4bf"/><text x="72" y="82" fill="#eef9fb" font-family="Arial" font-size="22" font-weight="700">Nu:</text><text x="220" y="82" fill="#eef9fb" font-family="Arial" font-size="22" font-weight="700">E+</text><text x="466" y="82" fill="#eef9fb" font-family="Arial" font-size="22" font-weight="700">Product</text><text x="70" y="204" fill="#9fb3bf" font-family="Arial" font-size="18">Electron-rich site attacks electron-poor center; stability controls pathway.</text></svg>`
  };
  if(num<=16) return {
    theme:'3D stereochemistry and configuration',
    molecules:['lactic acid','2-butanol','tartaric acid'],
    links:[['Stereochemistry diagrams','https://commons.wikimedia.org/wiki/Category:Stereochemistry'],['Chirality resources','https://commons.wikimedia.org/wiki/Category:Chirality']],
    svg:null
  };
  if(num<=27) return {
    theme:'Functional group transformation map',
    molecules:['ethanol','acetaldehyde','benzoic acid'],
    links:[['Organic reactions category','https://commons.wikimedia.org/wiki/Category:Organic_reactions'],['Reagents category','https://commons.wikimedia.org/wiki/Category:Reagents_for_organic_chemistry']],
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260"><rect width="760" height="260" rx="22" fill="#081018"/><rect x="54" y="78" width="150" height="76" rx="14" fill="#102532" stroke="#38d5f5"/><rect x="305" y="78" width="150" height="76" rx="14" fill="#102532" stroke="#38d5f5"/><rect x="556" y="78" width="150" height="76" rx="14" fill="#102532" stroke="#38d5f5"/><text x="88" y="124" fill="#eef9fb" font-family="Arial" font-size="20" font-weight="800">R-CH2OH</text><text x="340" y="124" fill="#eef9fb" font-family="Arial" font-size="20" font-weight="800">R-CHO</text><text x="594" y="124" fill="#eef9fb" font-family="Arial" font-size="20" font-weight="800">R-CO2H</text><path d="M212 116h82M463 116h82" stroke="#b6e867" stroke-width="4"/><text x="64" y="210" fill="#9fb3bf" font-family="Arial" font-size="18">Choose reagent strength to stop at the desired functional group level.</text></svg>`
  };
  if(num<=38) return {
    theme:'Named reaction and bond formation logic',
    molecules:['biphenyl','styrene','aniline'],
    links:[['Organic name reactions','https://commons.wikimedia.org/wiki/Category:Organic_name_reactions'],['Grignard mechanism','https://commons.wikimedia.org/wiki/File:Grignard_reaction_mechanism.svg'],['E2 mechanism','https://commons.wikimedia.org/wiki/File:E2-mechanism.svg']],
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260"><rect width="760" height="260" rx="22" fill="#081018"/><rect x="50" y="70" width="155" height="88" rx="16" fill="#102532" stroke="#2dd4bf"/><rect x="302" y="70" width="155" height="88" rx="16" fill="#102532" stroke="#2dd4bf"/><rect x="555" y="70" width="155" height="88" rx="16" fill="#102532" stroke="#2dd4bf"/><text x="80" y="121" fill="#eef9fb" font-family="Arial" font-size="19" font-weight="800">R-X</text><text x="330" y="121" fill="#eef9fb" font-family="Arial" font-size="19" font-weight="800">R'-M</text><text x="583" y="121" fill="#eef9fb" font-family="Arial" font-size="19" font-weight="800">R-R'</text><path d="M214 115h78M466 115h78" stroke="#38d5f5" stroke-width="4"/><text x="62" y="212" fill="#9fb3bf" font-family="Arial" font-size="18">Map name reactions to substrate, reagent, mechanism and selectivity.</text></svg>`
  };
  if(num<=42) return {
    theme:'Analysis and purification workflow',
    molecules:['caffeine','aspirin','acetone'],
    links:[['Spectroscopy category','https://commons.wikimedia.org/wiki/Category:Spectroscopy'],['Chromatography category','https://commons.wikimedia.org/wiki/Category:Chromatography']],
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260"><rect width="760" height="260" rx="22" fill="#081018"/><polyline points="70,184 150,120 230,146 310,76 390,166 470,105 550,140 650,86" fill="none" stroke="#38d5f5" stroke-width="5"/><text x="78" y="54" fill="#eef9fb" font-family="Arial" font-size="20" font-weight="800">TLC -> HPLC -> NMR -> MS</text><text x="72" y="218" fill="#9fb3bf" font-family="Arial" font-size="18">Use analytical evidence to prove conversion, purity and identity.</text></svg>`
  };
  if(num<=47) return {
    theme:'Process chemistry and impurity control',
    molecules:['benzene','dimethylamine','nitrosodimethylamine'],
    links:[['PubChem PUG REST images','https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest'],['Nitrosamines category','https://commons.wikimedia.org/wiki/Category:Nitrosamines']],
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260"><rect width="760" height="260" rx="22" fill="#081018"/><rect x="58" y="68" width="130" height="78" rx="14" fill="#102532" stroke="#38d5f5"/><rect x="236" y="68" width="130" height="78" rx="14" fill="#102532" stroke="#38d5f5"/><rect x="414" y="68" width="130" height="78" rx="14" fill="#102532" stroke="#38d5f5"/><rect x="592" y="68" width="110" height="78" rx="14" fill="#102532" stroke="#38d5f5"/><text x="82" y="114" fill="#eef9fb" font-family="Arial" font-size="18" font-weight="800">Route</text><text x="258" y="114" fill="#eef9fb" font-family="Arial" font-size="18" font-weight="800">Safety</text><text x="433" y="114" fill="#eef9fb" font-family="Arial" font-size="18" font-weight="800">Purity</text><text x="612" y="114" fill="#eef9fb" font-family="Arial" font-size="18" font-weight="800">Scale</text><text x="70" y="210" fill="#9fb3bf" font-family="Arial" font-size="18">Optimize impurity purge, thermal safety, crystallization and robustness.</text></svg>`
  };
  return {
    theme:'Retrosynthesis and advanced strategy',
    molecules:['benzene','pyridine','indole'],
    links:[['Organic synthesis category','https://commons.wikimedia.org/wiki/Category:Organic_synthesis'],['PubChem','https://pubchem.ncbi.nlm.nih.gov/']],
    svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 260"><rect width="760" height="260" rx="22" fill="#081018"/><rect x="54" y="78" width="170" height="80" rx="14" fill="#102532" stroke="#2dd4bf"/><rect x="300" y="78" width="160" height="80" rx="14" fill="#102532" stroke="#2dd4bf"/><rect x="536" y="78" width="170" height="80" rx="14" fill="#102532" stroke="#2dd4bf"/><text x="90" y="126" fill="#eef9fb" font-family="Arial" font-size="19" font-weight="800">Target</text><text x="326" y="126" fill="#eef9fb" font-family="Arial" font-size="19" font-weight="800">Synthons</text><text x="568" y="126" fill="#eef9fb" font-family="Arial" font-size="19" font-weight="800">Precursors</text><path d="M530 116H470M292 116H232" stroke="#38d5f5" stroke-width="4"/><text x="72" y="214" fill="#9fb3bf" font-family="Arial" font-size="18">Work backward from target, then validate forward route.</text></svg>`
  };
}

function renderVisualResourcePanel(num,d){
  const profile=visualProfile(num);
  const links=profile.links.map(link=>`<a href="${link[1]}" target="_blank" rel="noopener">${link[0]}</a>`).join('');
  const visual=profile.svg?`<img loading="lazy" src="${encodeSvg(profile.svg)}" alt="${profile.theme} diagram">`:'';
  return `<div class="detail-section chapter-visual-section"><div class="detail-section-title">${num}.15 VISUAL MECHANISM / STRUCTURE RESOURCES</div>
    <div class="chapter-visual-card ${profile.svg?'':'no-image'}">${visual}<div><strong>${profile.theme}</strong><p class="detail-text">Use the open resource links below if you want additional mechanism references for <strong>${d[0]}</strong>.</p></div></div>
    <div class="chapter-resource-links">${links}</div>
  </div>`;
}

function renderDeepExpansion(num,d){
  const p=topicProfile(num,d);
  const terms=listFromText(`${d[1]}. ${d[2]}`).slice(0,5).map(x=>`<li>${x}</li>`).join('');
  return `
    <div class="detail-section"><div class="detail-section-title">${num}.9 DETAILED CORE PRINCIPLE</div><p class="detail-text">${p.principle}</p><p class="detail-text">For <strong>${d[0]}</strong>, keep the explanation connected to structure, reactivity, selectivity, and evidence. This makes the topic useful for mechanisms, synthesis planning, analytical interpretation, and process decisions.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.10 MECHANISTIC LOGIC</div><p class="detail-text">${p.mechanism}</p><ul class="checklist-bullets">${terms}</ul></div>
    <div class="detail-section"><div class="detail-section-title">${num}.11 IMPORTANT COMPARISONS</div><table class="chem-table"><thead><tr><th>Point</th><th>Detailed note</th></tr></thead><tbody>${renderComparisonRows(p.rows)}</tbody></table></div>
    <div class="detail-section"><div class="detail-section-title">${num}.12 REPRESENTATIVE EXAMPLE</div><p class="detail-text">${p.example}</p><div class="detail-eq">${d[0]} -> structure -> electronic effect -> mechanism -> product / observation</div></div>
    <div class="detail-section"><div class="detail-section-title">${num}.13 CONDITIONS, SCOPE, AND SELECTIVITY</div><p class="detail-text">Check substrate class, functional group tolerance, solvent, temperature, concentration, reagent strength, pH, water sensitivity, and workup before applying this topic. Selectivity depends on the most favorable pathway, but real reactions can also be controlled by kinetics, sterics, reversibility, and isolation method.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.14 LAB AND PHARMA RELEVANCE</div><p class="detail-text">${d[3]}</p><p class="detail-text">In practical chemistry, the useful answer includes not only the theory but also how it affects yield, purity, impurity formation, purification, spectral confirmation, safety, and scalability.</p></div>
    ${renderVisualResourcePanel(num,d)}`;
}

function buildBookChapter(num,d){
  const family=chapterFamily(num);
  const study=listFromText(d[2]);
  const examples=family.examples.map(x=>`<li>${x}</li>`).join('');
  const studyItems=(study.length?study:['Definition and scope','Important examples','Mechanistic logic','Exceptions and limitations']).map(x=>`<li>${x}</li>`).join('');
  return `<div class="detail-title">Chapter ${num}: ${d[0]}</div><div class="detail-subtitle">${family.label} - Detailed Book Chapter</div>
    <div class="detail-section"><div class="detail-section-title">${num}.1 CHAPTER ORIENTATION</div><p class="detail-text"><strong>${d[0]}</strong> belongs to ${family.label.toLowerCase()}. The purpose of this chapter is to help you understand ${family.focus}. Instead of memorizing isolated lines, study this topic as a decision-making tool: identify the structure, ask what electrons can do, predict the most stable pathway, and then connect the idea to synthesis or analysis.</p><p class="detail-text">${d[1]}</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.2 LEARNING OUTCOMES</div><ul class="checklist-bullets"><li>Define ${d[0]} in precise chemical language.</li><li>Recognize the topic in structures, reactions, mechanisms, or analytical data.</li><li>Explain the reason behind the major trend using electronic, steric, stereochemical, or practical logic.</li><li>Apply the concept to exam questions, pharma interviews, and synthesis planning.</li><li>Identify common exceptions, limitations, and side reactions.</li></ul></div>
    <div class="detail-section"><div class="detail-section-title">${num}.3 CONCEPTUAL FOUNDATION</div><p class="detail-text">${d[1]}</p><p class="detail-text">The deeper logic is that organic molecules do not react randomly. Reactivity is controlled by electron density, orbital overlap, bond polarization, charge stability, steric accessibility, solvent environment, and thermodynamic or kinetic preference. Whenever you study ${d[0]}, connect the definition to these controlling factors.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.4 KEY TERMS AND STUDY MAP</div><ul class="checklist-bullets">${studyItems}</ul><p class="detail-text">Use this map as your revision order: first learn the vocabulary, then the rule, then the exception, then a real example. This is the fastest way to convert theory into problem-solving ability.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.5 MECHANISTIC OR PRACTICAL LOGIC</div><p class="detail-text">${family.use}</p><p class="detail-text">A good explanation should answer four questions: <strong>what is reacting, why is it reactive, what intermediate or transition state is favored, and what product or observation follows?</strong> This format works for written exams, viva answers, and R&D discussions.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.6 REPRESENTATIVE EXAMPLES</div><ul class="checklist-bullets">${examples}</ul><p class="detail-text">When writing notes, add at least one structure or reaction under each example. For best retention, mark the reactive atom, electron movement, and reason for selectivity.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.7 APPLICATION IN SYNTHESIS / ANALYSIS / PHARMA</div><p class="detail-text">${d[3]}</p><p class="detail-text">In pharma R&D, the practical question is not only whether the chemistry works. You also ask whether it is selective, scalable, safe, clean, easy to purify, and compatible with impurity control. This makes ${d[0]} valuable beyond textbook theory.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.8 CHAPTER SUMMARY</div><p class="detail-text">${d[0]} should be revised as a concept-based chapter: definition, key terms, controlling factors, examples, exceptions, and applications. If you can explain the reason behind the trend, you can handle unfamiliar questions without rote memorization.</p></div>
    ${renderDeepExpansion(num,d)}`;
}

function showMasterTopicDetail(num){
  const d=masterTopicDetails[num];
  if(!d) return;
  const content=document.getElementById('detailContent');
  if(customMasterChapters[num]){
    content.innerHTML=renderCustomChapter(num,customMasterChapters[num]);
    openDetailPanel();
    return;
  }
  if(num===14){
    content.innerHTML=`<div class="detail-title">Chapter 14: Chirality</div><div class="detail-subtitle">Stereochemistry - Book Chapter Notes</div>
      <div class="detail-section"><div class="detail-section-title">14.1 INTRODUCTION TO CHIRALITY</div><p class="detail-text">Chirality is a fundamental concept in stereochemistry that describes the geometric property of a molecule being <strong>non-superimposable on its mirror image</strong>. The term chiral is derived from the Greek word <em>cheir</em>, meaning hand, reflecting the classic analogy that the left and right hands are mirror images but cannot be perfectly aligned.</p><p class="detail-text">A molecule that exhibits chirality exists in two forms called <strong>enantiomers</strong>, which are mirror images of each other but differ in spatial arrangement. This difference, although subtle, has profound implications in chemical reactivity and biological interactions.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.2 CONDITIONS FOR CHIRALITY</div><p class="detail-text">For a molecule to be chiral, it must <strong>lack certain symmetry elements</strong>, specifically:</p><ul class="checklist-bullets"><li>Plane of symmetry (&sigma;)</li><li>Center of symmetry (i)</li></ul><p class="detail-text">Molecules possessing these symmetry elements are typically <strong>achiral</strong>, even if they contain stereocenters.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.3 CHIRAL CENTERS / STEREOGENIC CENTERS</div><p class="detail-text">A <strong>chiral center</strong>, also known as a <strong>stereogenic center</strong>, is an atom, commonly carbon, bonded to <strong>four different substituents</strong>, resulting in a tetrahedral arrangement.</p><div class="detail-eq">C* (R1, R2, R3, R4)</div><p class="detail-text"><strong>Example:</strong> Lactic acid, CH3-CHOH-COOH, contains a central carbon attached to -CH3, -OH, -COOH, and -H. Thus, it is a chiral molecule.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.4 ENANTIOMERS</div><p class="detail-text">Enantiomers are <strong>stereoisomers that are mirror images of each other but not superimposable</strong>.</p><ul class="checklist-bullets"><li>Identical physical properties such as melting point, boiling point, and density</li><li>Identical chemical behavior in achiral environments</li><li>Opposite optical rotation</li></ul><p class="detail-text">One enantiomer rotates plane-polarized light clockwise, called <strong>dextrorotatory (+)</strong>, while the other rotates it anticlockwise, called <strong>levorotatory (-)</strong>.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.5 OPTICAL ACTIVITY</div><p class="detail-text">Optical activity is the ability of a chiral molecule to rotate plane-polarized light.</p><ul class="checklist-bullets"><li><strong>Dextrorotatory (+):</strong> Clockwise rotation</li><li><strong>Levorotatory (-):</strong> Anticlockwise rotation</li></ul><p class="detail-text">Optical rotation is experimentally determined and is <strong>not directly related</strong> to the R/S configuration of the molecule.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.6 R AND S CONFIGURATION / CIP RULES</div><p class="detail-text">The absolute configuration of a chiral center is assigned using the <strong>Cahn-Ingold-Prelog (CIP) priority rules</strong>.</p><div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Assign priorities to substituents based on atomic number.</div></div><div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Orient the molecule so that the lowest priority group is directed away.</div></div><div class="mechanism-step"><div class="step-num">3</div><div class="step-text">Trace the path from priority 1 to 2 to 3: clockwise gives <strong>R (Rectus)</strong>, anticlockwise gives <strong>S (Sinister)</strong>.</div></div></div>
      <div class="detail-section"><div class="detail-section-title">14.7 DIASTEREOMERS</div><p class="detail-text">Diastereomers are stereoisomers that are <strong>not mirror images</strong> of each other.</p><ul class="checklist-bullets"><li>Different physical properties</li><li>Different chemical reactivity</li><li>Can be separated by conventional methods</li></ul><p class="detail-text"><strong>Example:</strong> 2,3-dichlorobutane exhibits both enantiomeric and diastereomeric forms.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.8 MESO COMPOUNDS</div><p class="detail-text">Meso compounds contain <strong>two or more chiral centers</strong> but are overall achiral due to an internal plane of symmetry.</p><ul class="checklist-bullets"><li>Optically inactive</li><li>Internal compensation of optical rotation</li><li>Identical substituents arranged symmetrically</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">14.9 NUMBER OF STEREOISOMERS</div><p class="detail-text">The maximum number of stereoisomers possible for a molecule is given by:</p><div class="detail-eq">2^n</div><p class="detail-text">Here, <em>n</em> is the number of chiral centers. This number may be reduced in the presence of <strong>meso forms</strong>, which are superimposable on their mirror images.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.10 CHIRALITY WITHOUT CHIRAL CENTERS</div><p class="detail-text">Not all chiral molecules possess a stereogenic carbon. Chirality can arise from structural features such as:</p><h3 class="sub">14.10.1 Axial Chirality</h3><p class="detail-text">Observed in allenes and substituted biphenyls. Restricted rotation leads to non-superimposable mirror images.</p><h3 class="sub">14.10.2 Planar Chirality</h3><p class="detail-text">Occurs when chirality arises from a plane rather than a center, as seen in cyclophanes and metallocenes.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.11 RACEMIC MIXTURES</div><p class="detail-text">A <strong>racemic mixture</strong> contains equal amounts of both enantiomers. It is optically inactive due to external compensation and is denoted as <strong>(&plusmn;)</strong>.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.12 RESOLUTION OF RACEMIC MIXTURES</div><p class="detail-text">Resolution refers to the separation of enantiomers from a racemic mixture.</p><ul class="checklist-bullets"><li>Formation of diastereomeric salts</li><li>Chiral chromatography</li><li>Enzymatic or biochemical methods</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">14.13 CHIRALITY IN PHARMACEUTICAL SCIENCES</div><p class="detail-text">Chirality plays a critical role in drug design and pharmacology because biological systems are inherently chiral.</p><ul class="checklist-bullets"><li>Enantiomers can show different pharmacological effects</li><li>One enantiomer may be therapeutically active while the other may be inactive or harmful</li></ul><p class="detail-text"><strong>Examples:</strong> Thalidomide showed dramatically different biological effects between enantiomeric forms. Ibuprofen is pharmacologically active mainly as the S-enantiomer.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.14 SUMMARY</div><p class="detail-text">Chirality is a central concept in stereochemistry that influences molecular behavior in both chemical and biological systems. The presence of chirality leads to stereoisomerism, including enantiomers and diastereomers, which differ in spatial arrangement and often in function. Understanding chirality is essential in pharmaceuticals, where enantiomeric purity can determine drug efficacy and safety.</p></div>
      ${renderDeepExpansion(14,d)}`;
    openDetailPanel();
    return;
  }
  content.innerHTML=buildBookChapter(num,d);
  openDetailPanel();
}

const intermediateDetails={
  'carbocation':{
    title:'Carbocation',
    sub:'Electron-deficient carbon intermediate',
    formula:'R3C+',
    points:['Carbon has only 6 electrons and an empty p orbital.','Usually sp2 hybridized and trigonal planar.','Acts as a strong electrophile and is attacked by nucleophiles.','Can rearrange by hydride shift, methyl shift, or ring expansion.'],
    stability:'Benzylic/allylic > 3 deg > 2 deg > 1 deg > methyl, mainly due to resonance and hyperconjugation.',
    examples:'SN1, E1, acid-catalysed alkene hydration, Friedel-Crafts alkylation, Wagner-Meerwein rearrangement.'
  },
  'carbanion':{
    title:'Carbanion',
    sub:'Electron-rich carbon intermediate',
    formula:'R3C-',
    points:['Carbon bears a negative charge and a lone pair.','Usually pyramidal/sp3, but resonance-stabilized carbanions can be planar.','Acts as a base and nucleophile.','Stabilized by electron-withdrawing groups, resonance, and higher s-character.'],
    stability:'Greater s-character stabilizes negative charge: sp > sp2 > sp3. Resonance and -I groups also increase stability.',
    examples:'Enolates, acetylide ions, Grignard-like carbanion character, aldol and Claisen reactions.'
  },
  'free-radical':{
    title:'Free Radical',
    sub:'Neutral species with one unpaired electron',
    formula:'R3C·',
    points:['Contains an unpaired electron and is highly reactive.','Often formed by homolytic bond cleavage using heat, light, or peroxides.','Reacts by chain initiation, propagation, and termination steps.','Can add to pi bonds or abstract hydrogen/halogen atoms.'],
    stability:'Benzylic/allylic > 3 deg > 2 deg > 1 deg > methyl, due to resonance and hyperconjugation.',
    examples:'Alkane halogenation, allylic bromination with NBS, peroxide effect in HBr addition.'
  },
  'carbene':{
    title:'Carbene',
    sub:'Neutral divalent carbon intermediate',
    formula:':CR2',
    points:['Carbon has two bonds and two nonbonding electrons.','Exists as singlet or triplet carbene.','Singlet carbenes add stereospecifically to alkenes; triplet carbenes can be stepwise.','Commonly generated from diazo compounds or haloforms.'],
    stability:'Electron-donating substituents and metal complexes can stabilize carbenes; free carbenes are very reactive.',
    examples:'Cyclopropanation of alkenes, Simmons-Smith reaction, dichlorocarbene formation from CHCl3/base.'
  },
  'nitrene':{
    title:'Nitrene',
    sub:'Neutral monovalent nitrogen intermediate',
    formula:':NR',
    points:['Nitrogen analog of carbene with only 6 valence electrons.','Can exist as singlet or triplet nitrene.','Inserts into C-H bonds or adds to alkenes.','Often generated from azides, isocyanates, or photolysis/thermolysis pathways.'],
    stability:'Electron-withdrawing substituents and metal nitrenoid formation can control reactivity.',
    examples:'Curtius rearrangement, Hofmann rearrangement, aziridination reactions, C-H amination chemistry.'
  }
};

function showIntermediateDetail(key){
  const d=intermediateDetails[key];
  if(!d) return;
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const points=d.points.map((p,i)=>`<div class="mechanism-step"><div class="step-num">${i+1}</div><div class="step-text">${p}</div></div>`).join('');
  content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">GENERAL FORM</div><div class="detail-eq">${d.formula}</div></div>
    <div class="detail-section"><div class="detail-section-title">KEY POINTS</div>${points}</div>
    <div class="detail-section"><div class="detail-section-title">STABILITY ORDER</div><p class="detail-text">${d.stability}</p></div>
    <div class="detail-section"><div class="detail-section-title">WHERE YOU SEE IT</div><p class="detail-text">${d.examples}</p></div>`;
  openDetailPanel();
}

document.querySelectorAll('.syllabus-item').forEach(item=>{
  const strong=item.querySelector('strong');
  const match=strong&&strong.textContent.match(/^(\d+)\./);
  if(match){
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.onclick=()=>showMasterTopicDetail(Number(match[1]));
    item.onkeydown=e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        showMasterTopicDetail(Number(match[1]));
      }
    };
  }
});

document.querySelectorAll('[data-intermediate]').forEach(item=>{
  item.setAttribute('tabindex','0');
  item.setAttribute('role','button');
  item.addEventListener('click',e=>{
    e.stopPropagation();
    showIntermediateDetail(item.dataset.intermediate);
  });
  item.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      e.stopPropagation();
      showIntermediateDetail(item.dataset.intermediate);
    }
  });
});

const couplingDetails={
  suzuki:{
    title:'1. Suzuki Coupling',
    sub:'Pd-catalysed organoboron cross-coupling',
    diagram:'Suzuki',
    reaction:'Ar-X + Ar-B(OH)2 -> Ar-Ar',
    partners:'Aryl/vinyl halide or triflate + boronic acid/boronate ester.',
    conditions:'Pd(PPh3)4, Pd(dppf)Cl2, or modern Pd/ligand systems; K2CO3, Na2CO3, Cs2CO3 or K3PO4; dioxane/water, toluene/EtOH/water, DMF/water.',
    mechanism:['Oxidative addition: Pd(0) inserts into Ar-X bond.','Base activates boronic acid to boronate.','Transmetalation transfers organic group from boron to Pd.','Reductive elimination forms C-C bond and regenerates Pd(0).'],
    notes:'Very common in pharma because boronic acids are relatively low toxicity and tolerate water. Aryl bromides/iodides are easy; aryl chlorides need stronger ligands.',
    limitations:'Protodeboronation, homocoupling, deboronation of heteroaryl boronic acids, and residual Pd control.'
  },
  heck:{
    title:'2. Heck Reaction',
    sub:'Pd-catalysed arylation/vinylation of alkenes',
    diagram:'Heck',
    reaction:'Ar-X + CH2=CHR -> Ar-CH=CHR',
    partners:'Aryl/vinyl halide + alkene.',
    conditions:'Pd(OAc)2 or Pd(PPh3)4, base such as Et3N, carbonate or acetate; DMF, MeCN, toluene; heat.',
    mechanism:['Oxidative addition of Ar-X to Pd(0).','Alkene coordination to aryl-Pd complex.','Migratory insertion into Pd-C bond.','β-hydride elimination gives substituted alkene; base regenerates Pd(0).'],
    notes:'Useful for making styrenes, cinnamates and arylated alkenes. Often gives E/trans alkene.',
    limitations:'Regioisomer issues, β-hydride requirements, alkene isomerization, and high-temperature compatibility.'
  },
  sonogashira:{
    title:'3. Sonogashira Coupling',
    sub:'Pd/Cu-catalysed aryl-alkyne coupling',
    diagram:'Sonogashira',
    reaction:'Ar-X + HC=CR -> Ar-C=CR',
    partners:'Aryl/vinyl halide + terminal alkyne.',
    conditions:'Pd catalyst, CuI co-catalyst, amine base such as Et3N, i-Pr2NH or piperidine; THF/DMF/MeCN; inert atmosphere preferred.',
    mechanism:['Pd oxidative addition into Ar-X.','Base/Cu forms copper acetylide from terminal alkyne.','Transmetalation transfers alkynyl group to Pd.','Reductive elimination forms aryl-alkyne bond.'],
    notes:'Excellent for installing alkynes as SAR handles or linkers. Copper-free variants reduce alkyne homocoupling.',
    limitations:'Glaser homocoupling in presence of oxygen/Cu, terminal alkyne sensitivity, residual metal control.'
  },
  stille:{
    title:'4. Stille Coupling',
    sub:'Pd-catalysed organotin cross-coupling',
    reaction:'R-SnBu3 + R′-X -> R-R′',
    partners:'Organostannane + aryl/vinyl halide or triflate.',
    conditions:'Pd(PPh3)4 or Pd2(dba)3/ligand; toluene, DMF, dioxane; sometimes LiCl or CuI additive.',
    mechanism:['Oxidative addition of organic halide to Pd(0).','Transmetalation from tin to palladium.','Reductive elimination forms C-C bond.'],
    notes:'Broad functional group tolerance and reliable with vinyl/heteroaryl partners.',
    limitations:'Organotin toxicity, difficult tin removal, regulatory burden in pharma manufacturing.'
  },
  negishi:{
    title:'5. Negishi Coupling',
    sub:'Pd/Ni-catalysed organozinc cross-coupling',
    reaction:'R-ZnX + R′-X -> R-R′',
    partners:'Organozinc reagent + aryl/vinyl/alkyl halide.',
    conditions:'Pd or Ni catalyst, THF/DMF/ether solvents, inert atmosphere; organozinc prepared by transmetalation or zinc insertion.',
    mechanism:['Oxidative addition of electrophile to metal catalyst.','Transmetalation from zinc to Pd/Ni.','Reductive elimination creates coupled product.'],
    notes:'More reactive than Suzuki in some difficult couplings and often good for sp³ coupling.',
    limitations:'Organozinc reagents are moisture sensitive; preparation and handling add operational complexity.'
  },
  wurtz:{
    title:'6. Wurtz Reaction',
    sub:'Sodium-mediated alkyl halide homo coupling',
    reaction:'2 R-X + 2 Na -> R-R + 2 NaX',
    partners:'Alkyl halides, usually primary and symmetrical for clean product.',
    conditions:'Sodium metal in dry ether; strictly anhydrous.',
    mechanism:['Single electron transfer from sodium to alkyl halide.','Radical/organosodium character forms.','Coupling gives higher alkane.'],
    notes:'Classical method to prepare symmetrical alkanes.',
    limitations:'Mixtures with unsymmetrical halides, elimination side reactions, poor functional group tolerance, sodium handling hazard.'
  },
  glaser:{
    title:'7. Glaser Coupling',
    sub:'Oxidative homocoupling of terminal alkynes',
    reaction:'2 HC=CR + O2/Cu -> RC=C-C=CR',
    partners:'Terminal alkynes.',
    conditions:'Cu(I)/Cu(II) salts, amine base, oxygen/air; Hay and Eglinton variants modify conditions.',
    mechanism:['Terminal alkyne forms copper acetylide.','Oxidation generates coupled copper acetylide/radical character.','Reductive steps release 1,3-diyne product.'],
    notes:'Useful for symmetrical diynes and conjugated alkyne systems.',
    limitations:'Cross-selective unsymmetrical coupling is difficult; can be unwanted side reaction in Sonogashira.'
  },
  buchwald:{
    title:'8. Buchwald-Hartwig Coupling',
    sub:'Pd-catalysed C-N bond formation',
    reaction:'Ar-X + HNR2 -> Ar-NR2',
    partners:'Aryl halide/pseudohalide + amine, amide or related N-nucleophile.',
    conditions:'Pd catalyst with bulky electron-rich phosphine ligand; NaOtBu, Cs2CO3, K3PO4 or carbonate base; toluene, dioxane, THF.',
    mechanism:['Oxidative addition of Ar-X to Pd(0).','Amine coordination and deprotonation gives amido-Pd complex.','Reductive elimination forms Ar-N bond.'],
    notes:'Core medicinal chemistry reaction for aryl amines, heteroaryl amines and late-stage diversification.',
    limitations:'Ligand/base screening often required; amine coordination, dehalogenation, and residual Pd can be issues.'
  },
  ullmann:{
    title:'9. Ullmann Reaction',
    sub:'Copper-mediated/catalysed aryl C-N, C-O, C-S or C-C coupling',
    reaction:'Ar-X + Nu-H -> Ar-Nu',
    partners:'Aryl halide + amine, phenol, thiol, amide or another aryl partner.',
    conditions:'Cu powder, CuI, CuBr or Cu(OAc)2; ligand such as diamine/proline/phenanthroline; carbonate/phosphate base; heat.',
    mechanism:['Copper activates aryl halide and/or nucleophile.','Aryl-copper or Cu-nucleophile intermediate forms.','C-N/C-O/C-S bond forms through substitution or oxidative/reductive pathway.'],
    notes:'Cost-effective alternative to Pd couplings; useful for aryl ethers and aryl amines.',
    limitations:'Classical conditions are harsh; modern ligand systems improve scope but may still need high temperature.'
  }
};

function showCouplingDetail(key){
  const d=couplingDetails[key];
  if(!d) return;
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const diagram=renderReactionDiagram(reactionDiagrams[d.diagram]);
  const steps=d.mechanism.map((s,i)=>`<div class="mechanism-step"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
  content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">GENERAL REACTION</div><div class="detail-eq">${d.reaction}</div></div>
    ${diagram}
    <div class="detail-section"><div class="detail-section-title">PARTNERS</div><p class="detail-text">${d.partners}</p></div>
    <div class="detail-section"><div class="detail-section-title">COMMON CONDITIONS</div><p class="detail-text">${d.conditions}</p></div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>${steps}</div>
    <div class="detail-section"><div class="detail-section-title">NOTES / R&D USE</div><p class="detail-text">${d.notes}</p></div>
    <div class="detail-section"><div class="detail-section-title">LIMITATIONS</div><p class="detail-text">${d.limitations}</p></div>`;
  openDetailPanel();
}

document.querySelectorAll('[data-coupling]').forEach(item=>{
  item.setAttribute('tabindex','0');
  item.setAttribute('role','button');
  item.addEventListener('click',e=>{
    e.stopPropagation();
    showCouplingDetail(item.dataset.coupling);
  });
  item.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      e.stopPropagation();
      showCouplingDetail(item.dataset.coupling);
    }
  });
});

document.querySelector('.detail-close')?.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){
    e.preventDefault();
    closeDetail();
  }
});

const synthesisBondDetails={
  cc:{
    title:'C-C Bond Formation',
    sub:'Build the carbon skeleton of target molecules',
    rows:[
      ['Grignard addition','RMgX + aldehyde/ketone/ester/epoxide; dry ether or THF; gives alcohols or chain-extended products after workup.'],
      ['Aldol reaction','Enolate + aldehyde/ketone; forms beta-hydroxy carbonyls and can dehydrate to enones.'],
      ['Wittig / HWE','Carbonyl to alkene using phosphorus ylide or phosphonate; useful for alkene installation.'],
      ['Suzuki coupling','Aryl/vinyl halide + boronic acid under Pd/base; common biaryl method in pharma.'],
      ['Heck / Sonogashira','Aryl halide + alkene or terminal alkyne under Pd catalysis; forms arylated alkenes or alkynes.']
    ],
    note:'Key checks: acidic protons, moisture sensitivity, beta-hydride elimination, homocoupling, stereochemistry, and metal residue control.'
  },
  cn:{
    title:'C-N Bond Formation',
    sub:'Amines, amides, anilines and nitrogen heterocycles',
    rows:[
      ['Reductive amination','Aldehyde/ketone + amine + mild reductant; practical route to alkyl amines.'],
      ['Buchwald-Hartwig amination','Aryl halide + amine under Pd/ligand/base; powerful for aryl amines.'],
      ['Gabriel synthesis','Phthalimide anion alkylation followed by deprotection; gives primary amines.'],
      ['Amide coupling','Acid or activated acid derivative + amine; common peptide/API bond formation.'],
      ['Diazotization and coupling','Aromatic amines to diazonium salts; enables substitution or azo coupling.']
    ],
    note:'Key checks: amine basicity, over-alkylation, salt formation, catalyst poisoning, racemization in amide coupling, and residual coupling reagents.'
  },
  co:{
    title:'C-O Bond Formation',
    sub:'Ethers, esters, acetals and oxygenated scaffolds',
    rows:[
      ['Williamson ether synthesis','Alkoxide + primary alkyl halide/tosylate; SN2 pathway to ethers.'],
      ['Fischer esterification','Carboxylic acid + alcohol under acid; equilibrium-driven ester formation.'],
      ['Mitsunobu reaction','Alcohol + acidic nucleophile using PPh3/azodicarboxylate; inversion at alcohol carbon.'],
      ['Acetal formation','Carbonyl + alcohol/diol under acid; protects aldehydes and ketones.'],
      ['Epoxide opening','Nucleophile opens epoxide; regioselectivity depends on acidic or basic conditions.']
    ],
    note:'Key checks: water removal, substrate sterics, competing elimination, acid sensitivity, and whether C-O bond formation is reversible.'
  },
  cs:{
    title:'C-S Bond Formation',
    sub:'Thioethers, thiols, sulfones and sulfonamide chemistry',
    rows:[
      ['Thiol alkylation','Thiolate + alkyl halide; efficient SN2 route to thioethers.'],
      ['Aryl C-S coupling','Aryl halide + thiol under Cu or Pd catalysis; useful for aryl sulfides.'],
      ['Sulfonamide formation','Sulfonyl chloride + amine; forms S-N bond but often used in sulfur-containing API motifs.'],
      ['Oxidation of sulfides','Thioethers to sulfoxides or sulfones using mCPBA, H2O2 or other oxidants.'],
      ['Disulfide formation','Thiols oxidize to disulfides; reversible in redox chemistry.']
    ],
    note:'Key checks: thiol odor/toxicity, oxidation state control, over-oxidation, metal coordination, and impurity carryover.'
  },
  cx:{
    title:'C-Halogen Bond Formation',
    sub:'Install leaving groups and synthetic handles',
    rows:[
      ['Alcohol to halide','SOCl2, PBr3, HBr, or Appel conditions convert alcohols to alkyl halides.'],
      ['Radical halogenation','Alkanes or benzylic/allylic C-H bonds halogenated under light or radical initiators.'],
      ['Aromatic halogenation','EAS using Br2/FeBr3 or Cl2/FeCl3; directing effects control regioselectivity.'],
      ['Sandmeyer halogenation','Diazonium salts converted to aryl chlorides/bromides/cyanides with copper salts.'],
      ['NBS bromination','Selective allylic or benzylic bromination under radical conditions.']
    ],
    note:'Key checks: regioselectivity, radical side products, rearrangement risk, corrosive reagents, and downstream use as coupling/substitution handles.'
  },
  cb:{
    title:'C-B Bond Formation',
    sub:'Boron handles for Suzuki chemistry and oxidation',
    rows:[
      ['Hydroboration','Alkenes to organoboranes; oxidation gives anti-Markovnikov alcohols.'],
      ['Miyaura borylation','Aryl halide/triflate + B2pin2 under Pd/base; gives aryl boronate esters.'],
      ['C-H borylation','Ir-catalyzed direct borylation of arenes; useful late-stage functionalization.'],
      ['Organoboron oxidation','Boronic esters/acids oxidized to alcohols or phenols.'],
      ['Suzuki precursor formation','Boronic acids/esters serve as stable cross-coupling partners.']
    ],
    note:'Key checks: protodeboronation, heteroaryl instability, oxidative workup compatibility, and boron impurity purge.'
  },
  csi:{
    title:'C-Si Bond Formation',
    sub:'Silicon chemistry for enolates, protection and synthetic handles',
    rows:[
      ['Silyl enol ether formation','Carbonyl enolates trapped with TMSCl/TBSCl; useful in Mukaiyama aldol chemistry.'],
      ['Hydrosilylation','Alkenes/alkynes react with silanes under metal catalysis.'],
      ['Silyl protection','Alcohols form Si-O bonds with TBS/TBDPS/TMS groups; not C-Si, but central to silicon strategy.'],
      ['Peterson olefination','Alpha-silyl carbanions react with carbonyls then eliminate to alkenes.'],
      ['Hiyama coupling','Organosilanes can couple with aryl halides under activation and Pd catalysis.']
    ],
    note:'Key checks: fluoride sensitivity, hydrolysis, steric bulk of silyl groups, and orthogonal deprotection strategy.'
  },
  rings:{
    title:'Ring Formation Strategy',
    sub:'Cyclization, annulation and pericyclic construction',
    rows:[
      ['Diels-Alder reaction','Diene + dienophile gives cyclohexene frameworks with predictable stereochemistry.'],
      ['Paal-Knorr synthesis','1,4-dicarbonyls form furans, pyrroles, or thiophenes.'],
      ['Huisgen cycloaddition','Azide + alkyne forms triazoles; click variants use Cu catalysis.'],
      ['Intramolecular SN2/acylation','Tethered nucleophile attacks electrophile to close rings.'],
      ['RCM','Ring-closing metathesis forms cyclic alkenes using Ru catalysts.']
    ],
    note:'Key checks: ring size, concentration, entropy, competing polymerization, stereochemistry, and conformational preorganization.'
  }
};

const synthesisMatrixRows=['H / :','B','C','N','O','Si','P','S','F','Cl','Br','I','Sn','Cycles'];
const synthesisMatrixCols=['B','C','N','O','Si','P','S'];
const synthesisMatrixCells={
  'H / :|C':['C1H'],'H / :|N':['N1H'],'H / :|O':['O1H'],'H / :|P':['P1H'],'H / :|S':['S1H'],
  'B|C':['C1B'],'B|O':['O1B'],'B|Si':['Si1B'],
  'C|B':['C1B'],'C|C':['C1C','C2C','C3C'],'C|N':['C1N','C2N','C3N'],'C|O':['C1O','C2O'],'C|Si':['C1Si'],'C|P':['C1P'],'C|S':['C1S','C2S'],
  'N|C':['C1N','C2N','C3N'],'N|N':['N1N','N2N','N3N'],'N|O':['N1O','N2O'],'N|Si':['N1Si'],'N|P':['N1P','P2N'],'N|S':['N1S','N2S'],
  'O|B':['O1B'],'O|C':['C1O','C2O'],'O|N':['N1O','N2O'],'O|Si':['O1Si'],'O|P':['P1O','P2O'],'O|S':['O1S','O2S'],
  'Si|B':['Si1B'],'Si|C':['C1Si'],'Si|N':['N1Si'],'Si|O':['O1Si'],
  'P|C':['C1P'],'P|N':['N1P','P2N'],'P|O':['P1O'],'P|S':['P1S','P2S'],
  'S|C':['C1S','C2S'],'S|N':['N1S','N2S'],'S|O':['O1S','O2S'],'S|P':['P1S','P2S'],'S|S':['S1S'],
  'F|C':['C1F'],'F|P':['P1F'],'F|S':['S1F'],
  'Cl|C':['C1Cl'],'Cl|N':['Cl1N'],'Cl|S':['Cl1S'],
  'Br|C':['C1Br'],
  'I|C':['C1I'],'I|O':['I1O'],
  'Sn|C':['C1Sn'],
  'Cycles|C':['Carbocycles'],'Cycles|N':['NHeterocycles'],'Cycles|O':['OHeterocycles'],'Cycles|S':['SHeterocycles']
};

const synthesisMatrixDetails={
  C1H:{title:'C-H Functionalization and Formation',sub:'Hydrogen transfer, reduction, hydrocarbon formation',cats:[
    ['Hydrogenation','Alkenes/alkynes/aromatics reduced with H2 and metal catalysts.'],
    ['Hydride reduction','Carbonyls and acid derivatives converted to alcohols, amines, or methylene units.'],
    ['C-H activation','Directed or undirected C-H functionalization using transition metals.'],
    ['Radical hydrogen transfer','Hydrogen atom transfer in radical reductions and chain reactions.']
  ]},
  C1C:{title:'C-C Single Bond Formation',sub:'Carbon skeleton construction',cats:[
    ['Cross-coupling methods','Suzuki, Negishi, Stille, Kumada, Hiyama and related couplings.'],
    ['Organometallic additions','Grignard, organolithium, organozinc and organocuprate additions.'],
    ['Enolate alkylation','Alpha-carbon alkylation of carbonyl derivatives.'],
    ['Conjugate additions','Michael additions and organocuprate 1,4-additions.'],
    ['Chain and ring construction','Intramolecular alkylation, cyclization, annulation and ring expansion.']
  ]},
  C2C:{title:'C=C Double Bond Formation',sub:'Alkenes, enones, dienes, enynes and olefinations',cats:[
    ['Olefination','Wittig, Horner-Wadsworth-Emmons, Julia, Peterson and Tebbe reactions.'],
    ['Elimination','E1, E2, dehydration, dehydrohalogenation, syn and anti eliminations.'],
    ['Metathesis','Cross-metathesis and ring-closing metathesis using Ru catalysts.'],
    ['Reductive alkene formation','Alkyne semireduction, carbonyl deoxygenation routes and coupling routes.'],
    ['Unsaturated carbonyls','Enones, unsaturated esters, nitroalkenes, enol ethers and enamines.']
  ]},
  C3C:{title:'C=C Triple Bond Formation',sub:'Alkynes, nitrile equivalents and acetylenic building blocks',cats:[
    ['Alkyne synthesis','Double elimination from vicinal/geminal dihalides and alkyne homologation.'],
    ['Sonogashira coupling','Terminal alkyne coupling with aryl/vinyl halides.'],
    ['Acetylide alkylation','Terminal alkynes deprotonated and alkylated with primary electrophiles.'],
    ['Diyne formation','Glaser, Hay and Eglinton oxidative couplings.']
  ]},
  C1N:{title:'C-N Single Bond Formation',sub:'Amines, amides, carbamates and nitrogen heterocycles',cats:[
    ['Amines','Reductive amination, alkylation, Gabriel synthesis and Buchwald-Hartwig amination.'],
    ['Amides and lactams','Acid chlorides, activated esters, coupling reagents and intramolecular amidation.'],
    ['Carbamates and ureas','Isocyanates, chloroformates, CDI and carbonyl-transfer chemistry.'],
    ['Azides and hydrazines','Substitution, diazo-transfer, Curtius/Hofmann-related routes.'],
    ['Nitrogen heterocycles','Cyclization routes to pyridines, pyrroles, imidazoles, triazoles and lactams.']
  ]},
  C2N:{title:'C=N Double Bond Formation',sub:'Imines, oximes, hydrazones, amidines and related functions',cats:[
    ['Imines and iminium ions','Carbonyl condensation with amines; key in reductive amination.'],
    ['Oximes and hydrazones','Carbonyl derivatives useful for characterization and rearrangements.'],
    ['Amidines and guanidines','Condensation and activation routes to strongly basic C=N systems.'],
    ['Enamines','Secondary amines + carbonyls; useful nucleophilic enolate equivalents.']
  ]},
  C3N:{title:'C=N Triple Bond Formation',sub:'Nitriles and isocyanides',cats:[
    ['Nitrile substitution','Alkyl halides + cyanide; chain extension by one carbon.'],
    ['Dehydration to nitriles','Aldoximes or amides dehydrated to nitriles.'],
    ['Sandmeyer cyanation','Diazonium salts converted to aryl nitriles.'],
    ['Isocyanides','Formamide dehydration and multicomponent reaction handles.']
  ]},
  C1O:{title:'C-O Single Bond Formation',sub:'Alcohols, ethers, esters, acetals and oxygen heterocycles',cats:[
    ['Alcohol formation','Hydration, hydroboration-oxidation, carbonyl reduction and epoxide opening.'],
    ['Ether formation','Williamson ether synthesis, Mitsunobu reaction and alkoxylation.'],
    ['Ester formation','Fischer esterification, acid chlorides, anhydrides, coupling reagents and transesterification.'],
    ['Acetals and ketals','Carbonyl protection using alcohols or diols under acid.'],
    ['C-O cross-coupling','Ullmann/Buchwald-type aryl ether formation.']
  ]},
  C2O:{title:'C=O Bond Formation',sub:'Aldehydes, ketones, acids, esters, amides and carbonates',cats:[
    ['Alcohol oxidation','PCC, Swern, DMP, Jones and catalytic oxidations.'],
    ['Carbonyl homologation','Olefination/oxidation sequences and acylation chemistry.'],
    ['Acid derivative formation','Carboxylic acids, acid chlorides, esters, amides and anhydrides.'],
    ['Carbonyl insertion','Baeyer-Villiger and carbonylation strategies.']
  ]},
  C1S:{title:'C-S Single Bond Formation',sub:'Thiols, thioethers, thioesters and sulfur heterocycles',cats:[
    ['Thioether synthesis','Thiolate alkylation and aryl C-S coupling.'],
    ['Thiols','Substitution, reduction of disulfides and thioacetate hydrolysis.'],
    ['Thioesters','Acyl transfer using thiols and activated acids.'],
    ['Sulfur heterocycles','Cyclization routes to thiophenes and thiazoles.']
  ]},
  C2S:{title:'C=S Double Bond Formation',sub:'Thiones, thioamides and thiocarbonyl compounds',cats:[
    ['Thionation','Lawesson reagent or P2S5 converts C=O to C=S.'],
    ['Thioamides','Amides converted to thioamides or made from thioacyl equivalents.'],
    ['Thioureas and dithiocarbamates','Carbon disulfide and isothiocyanate chemistry.']
  ]},
  C1B:{title:'C-B Bond Formation',sub:'Organoboron synthesis and Suzuki-ready handles',cats:[
    ['Hydroboration','Alkenes/alkynes to organoboranes; oxidation or coupling follows.'],
    ['Miyaura borylation','Aryl halides/triflates to boronate esters under Pd catalysis.'],
    ['C-H borylation','Ir-catalyzed arene borylation for late-stage diversification.'],
    ['Boronic acid derivatives','Boronic acids, esters and trifluoroborates for cross-coupling.']
  ]},
  C1Si:{title:'C-Si Bond Formation',sub:'Organosilicon reagents, silyl enol ethers and Hiyama handles',cats:[
    ['Silyl enol ethers','Enolate trapping with silyl chlorides; Mukaiyama aldol precursors.'],
    ['Hydrosilylation','Metal-catalyzed Si-H addition across unsaturation.'],
    ['Peterson olefination','Alpha-silyl carbanions give alkenes after elimination.'],
    ['Hiyama coupling','Organosilanes as cross-coupling partners after activation.']
  ]},
  C1P:{title:'C-P Bond Formation',sub:'Phosphonates, ylides and organophosphorus chemistry',cats:[
    ['Phosphonate synthesis','Michaelis-Arbuzov and related P-C bond formation.'],
    ['Wittig reagents','Phosphonium salts and ylides for alkene synthesis.'],
    ['HWE reagents','Phosphonate-stabilized carbanions for E-selective olefination.']
  ]},
  N1H:{title:'N-H Bond Formation',sub:'Amines, amides and nitrogen protonation state control',cats:[
    ['Amine formation','Reductions, substitutions and reductive amination produce N-H containing amines.'],
    ['Amide formation','Acylation of amines gives amides with N-H or N-substitution patterns.'],
    ['Deprotection','Boc, Cbz, Fmoc and sulfonamide deprotections reveal N-H groups.']
  ]},
  O1H:{title:'O-H Bond Formation',sub:'Alcohols, phenols, acids and hydroxyl derivatives',cats:[
    ['Reduction','Carbonyl compounds reduced to alcohols.'],
    ['Hydrolysis','Esters, acetals and activated derivatives reveal O-H groups.'],
    ['Oxidation workups','Hydroboration-oxidation and organoboron oxidation create alcohols/phenols.']
  ]},
  O1B:{title:'O-B Bond Formation',sub:'Borate esters and boron-oxygen chemistry',cats:[
    ['Boronic esters','Alcohols or diols form boronate esters.'],
    ['Protection and purification','Boronate formation can trap diols and aid separation.'],
    ['Suzuki reagent handling','Boron-oxygen speciation affects coupling performance.']
  ]},
  O1Si:{title:'O-Si Bond Formation',sub:'Silyl protection of alcohols and phenols',cats:[
    ['Silyl ethers','TMS, TBS, TES, TBDPS groups protect alcohols.'],
    ['Selective deprotection','Fluoride, acid or controlled hydrolysis removes silyl groups.'],
    ['Orthogonality','Silyl size and stability help selective protection strategies.']
  ]},
  N1N:{title:'N-N Single Bond Formation',sub:'Hydrazines, diazo precursors and N-N frameworks',cats:[
    ['Hydrazines','Alkylation/acylation of hydrazine derivatives.'],
    ['Diazo and azide chemistry','N-N containing intermediates for rearrangements and cycloadditions.'],
    ['Azo derivatives','Oxidative coupling and diazonium chemistry.']
  ]},
  N2N:{title:'N=N Double Bond Formation',sub:'Azo, diazo and diazonium chemistry',cats:[
    ['Azo coupling','Diazonium salts couple with activated aromatics.'],
    ['Diazonium salts','Aromatic amines converted to diazonium intermediates.'],
    ['Diazo compounds','Useful carbene precursors and 1,3-dipoles.']
  ]},
  N3N:{title:'N=N / Diazonium-Type Transformations',sub:'Diazonium and nitrogen-extrusion chemistry',cats:[
    ['Diazonium substitutions','Sandmeyer, Schiemann and hydrodeamination pathways.'],
    ['Nitrogen extrusion','Driving force in Curtius, Wolff and diazo chemistry.']
  ]},
  N1O:{title:'N-O Single Bond Formation',sub:'Oximes, hydroxylamines, N-oxides and nitroso derivatives',cats:[
    ['Oxime formation','Carbonyl + hydroxylamine gives oximes.'],
    ['N-oxides','Tertiary amines oxidized to N-oxides.'],
    ['Hydroxamates','Acid derivatives converted to hydroxamic acids.']
  ]},
  N2O:{title:'N=O Bond Formation',sub:'Nitroso and nitro-related transformations',cats:[
    ['Nitroso compounds','Oxidation or electrophilic nitrosation routes.'],
    ['Nitro compounds','Nitration and oxidation routes; reducible to amines.'],
    ['N-oxide chemistry','Oxygen transfer and rearrangement applications.']
  ]},
  P1O:{title:'P-O Bond Formation',sub:'Phosphates, phosphonates and phosphoryl derivatives',cats:[
    ['Phosphorylation','Alcohols and phenols converted to phosphate esters.'],
    ['Phosphonate esters','Arbuzov and esterification routes.'],
    ['Protecting/activating groups','P-O chemistry in nucleotides and leaving groups.']
  ]},
  O1S:{title:'O-S Bond Formation',sub:'Sulfonates, sulfates and sulfur-oxygen derivatives',cats:[
    ['Sulfonates','Alcohols converted to mesylates, tosylates and triflates.'],
    ['Sulfates and sulfamates','O-sulfur derivatives for medicinal and synthetic use.'],
    ['Oxidation of sulfur','Sulfides to sulfoxides and sulfones form S-O bonds.']
  ]},
  O2S:{title:'S=O Bond Formation',sub:'Sulfoxides, sulfones, sulfonyl chlorides and sulfates',cats:[
    ['Sulfoxidation','Sulfides oxidized to sulfoxides with controlled oxidants.'],
    ['Sulfone formation','Further oxidation produces sulfones.'],
    ['Sulfonyl derivatives','Sulfonyl chlorides used for tosylates and sulfonamides.']
  ]},
  C1F:{title:'C-F Bond Formation',sub:'Fluorination and fluorinated building blocks',cats:[
    ['Nucleophilic fluorination','Fluoride displacement with activated substrates.'],
    ['Electrophilic fluorination','Selectfluor/NFSI-type reagents.'],
    ['Deoxyfluorination','Alcohols or carbonyl derivatives converted to fluorides.']
  ]},
  C1Cl:{title:'C-Cl Bond Formation',sub:'Chlorination and chloride handles',cats:[
    ['Alcohol chlorination','SOCl2, oxalyl chloride, Appel conditions.'],
    ['Aromatic chlorination','EAS or Sandmeyer routes.'],
    ['Acid chlorides','Carboxylic acids activated with thionyl chloride or oxalyl chloride.']
  ]},
  C1Br:{title:'C-Br Bond Formation',sub:'Bromination and bromide handles',cats:[
    ['Alcohol bromination','PBr3, HBr or Appel conditions.'],
    ['Allylic/benzylic bromination','NBS radical bromination.'],
    ['Aryl bromides','Useful substrates for cross-coupling.']
  ]},
  C1I:{title:'C-I Bond Formation',sub:'Iodides as reactive leaving groups',cats:[
    ['Finkelstein reaction','Halide exchange to iodides using iodide salts.'],
    ['Aryl iodides','Diazonium substitution or electrophilic iodination.'],
    ['Coupling handles','Iodides are highly reactive oxidative addition substrates.']
  ]},
  C1Sn:{title:'C-Sn Bond Formation',sub:'Organotin reagents for Stille chemistry',cats:[
    ['Stannylation','Formation of organostannanes from halides, organolithiums or hydrostannation.'],
    ['Stille coupling','Organotin + aryl/vinyl halide under Pd catalysis.'],
    ['Limitations','Toxicity and tin residue control are major pharma concerns.']
  ]},
  Carbocycles:{title:'Carbocycle Formation',sub:'Carbon-only ring systems',cats:[
    ['Diels-Alder','Six-membered ring construction.'],
    ['Ring-closing metathesis','Cyclic alkene formation.'],
    ['Intramolecular alkylation/acylation','Tethered cyclization to rings.'],
    ['Annulation','Robinson annulation and related ring-building strategies.']
  ]},
  NHeterocycles:{title:'Nitrogen Heterocycle Formation',sub:'Pyrroles, pyridines, imidazoles, triazoles and lactams',cats:[
    ['Paal-Knorr pyrrole synthesis','1,4-dicarbonyl + amine.'],
    ['Hantzsch pyridine synthesis','Multicomponent dihydropyridine route.'],
    ['Click triazoles','Azide + alkyne cycloaddition.'],
    ['Lactam formation','Intramolecular amide formation.']
  ]},
  OHeterocycles:{title:'Oxygen Heterocycle Formation',sub:'Furans, acetals, lactones and epoxides',cats:[
    ['Paal-Knorr furan synthesis','1,4-dicarbonyl dehydration.'],
    ['Lactonization','Hydroxy acids cyclize to lactones.'],
    ['Epoxidation','Alkenes converted to epoxides.'],
    ['Acetal cyclization','Diols and carbonyls form cyclic acetals.']
  ]},
  SHeterocycles:{title:'Sulfur Heterocycle Formation',sub:'Thiophenes, thiazoles and sulfur rings',cats:[
    ['Paal-Knorr thiophene synthesis','1,4-dicarbonyl + sulfur reagent.'],
    ['Thiazole formation','Hantzsch thiazole and condensation routes.'],
    ['Sulfide cyclization','Intramolecular thiolate substitution.']
  ]}
};

['Si1B','N1Si','P2N','N1P','N2S','N1S','P2O','P1S','P2S','S1S','P1F','S1F','Cl1N','Cl1S','I1O'].forEach(key=>{
  if(!synthesisMatrixDetails[key]){
    synthesisMatrixDetails[key]={title:`${key.replace(/1|2|3/g,'-$& ')} Bond Formation`,sub:'Specialized heteroatom bond formation',cats:[
      ['Direct coupling or substitution','Use activated electrophiles, nucleophilic heteroatom partners, or transition-metal catalysis where applicable.'],
      ['Oxidation-state adjustment','Many heteroatom bonds require oxidation or reduction after initial bond formation.'],
      ['Practical note','Check moisture sensitivity, reagent compatibility, odor/toxicity, and purification behavior.']
    ]};
  }
});

function renderSynthesisMatrix(root=document){
  const container=root.getElementById ? root.getElementById('synthesisSearchMatrix') : root.querySelector('#synthesisSearchMatrix');
  const target=root.getElementById ? root : document;
  const matrixRoot=container;
  if(!matrixRoot) return;
  const header=`<tr><th></th>${synthesisMatrixCols.map(c=>`<th>${c}</th>`).join('')}</tr>`;
  const rows=synthesisMatrixRows.map(row=>{
    const cells=synthesisMatrixCols.map(col=>{
      const keys=synthesisMatrixCells[`${row}|${col}`]||[];
      if(!keys.length) return '<td class="synth-empty">-</td>';
      const buttons=keys.map(key=>{
        const order=key.match(/[123]/)?.[0]||'1';
        const cls=order==='2'?'double':order==='3'?'triple':'single';
        const label=key.includes('Heterocycles')?key[0]:order==='2'?'=':order==='3'?'=':'-';
        return `<button class="synth-bond-button ${cls}" type="button" data-synth-key="${key}" title="${synthesisMatrixDetails[key]?.title||key}">${label}</button>`;
      }).join('');
      return `<td><div class="synth-cell-buttons">${buttons}</div></td>`;
    }).join('');
    return `<tr><th class="synth-row-head">${row}</th>${cells}</tr>`;
  }).join('');
  matrixRoot.innerHTML=`<table class="synth-matrix-table">${header}${rows}</table>`;
  matrixRoot.querySelectorAll('[data-synth-key]').forEach(btn=>{
    btn.addEventListener('click',()=>showSynthesisMatrixDetail(btn.dataset.synthKey));
  });
}

function showSynthesisMatrixDetail(key){
  const d=synthesisMatrixDetails[key];
  if(!d) return;
  const content=document.getElementById('detailContent');
  const cats=d.cats.map(c=>`<div class="synthesis-category-card"><strong>${c[0]}</strong><span>${c[1]}</span></div>`).join('');
  content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">WHAT OPENS FROM THIS MATRIX CELL</div><p class="detail-text">This entry corresponds to a desired bond or functional group transformation. In a synthesis-search workflow, you first select the bond type, then choose a target functional group or reaction family, and finally select the exact reagent conditions.</p></div>
    <div class="detail-section"><div class="detail-section-title">TRANSFORMATION CATEGORIES</div><div class="synthesis-category-grid">${cats}</div></div>
    <div class="detail-section"><div class="detail-section-title">HOW TO USE IN RETROSYNTHESIS</div><p class="detail-text">Disconnect the target around this bond, identify the nucleophilic and electrophilic fragments, check functional group tolerance, then choose between polar, radical, pericyclic, redox, or metal-catalyzed logic.</p></div>`;
  openDetailPanel();
}

function showSynthesisBondDetail(key){
  const d=synthesisBondDetails[key];
  if(!d) return;
  const content=document.getElementById('detailContent');
  const rows=d.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">SYNTHESIS LOGIC</div><p class="detail-text">Choose a target bond, identify suitable disconnection, then select a forward reaction based on substrate class, functional group tolerance, safety, selectivity, and purification. This mirrors practical retrosynthesis: target bond first, reaction family second, exact conditions third.</p></div>
    <div class="detail-section"><div class="detail-section-title">HIGH-YIELD TRANSFORMATIONS</div><table class="chem-table"><thead><tr><th>Reaction / Strategy</th><th>Use and conditions</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="detail-section"><div class="detail-section-title">LIMITATIONS AND R&D NOTES</div><p class="detail-text">${d.note}</p></div>
    <div class="detail-section"><div class="detail-section-title">RETROSYNTHESIS PROMPT</div><p class="detail-text">Ask: Can this bond be made by polar addition, substitution, acyl substitution, rearrangement, radical chemistry, pericyclic chemistry, or metal-catalyzed coupling? Then compare the shortest route with the safest and cleanest route.</p></div>`;
  openDetailPanel();
}

document.querySelectorAll('[data-bond]').forEach(tile=>{
  tile.addEventListener('click',()=>showSynthesisBondDetail(tile.dataset.bond));
});

function openSynthesisMapDetail(){
  const content=document.getElementById('detailContent');
  content.innerHTML=`<div class="detail-title">Organic Synthesis Map</div><div class="detail-subtitle">Bond Formation Explorer</div>
    <div class="detail-section"><div class="detail-section-title">BROWSE BY DESIRED BOND FORMATION</div><p class="detail-text">Select a matrix cell to open reaction families for single, double, or triple bond formation. This is useful for retrosynthesis: target bond first, reaction family second, exact conditions third.</p>
      <div class="synthesis-legend"><span>C-C</span><span>C-N</span><span>C-O</span><span>C-S</span><span>C-X</span></div>
      <div class="synthesis-search-matrix" id="synthesisSearchMatrix" aria-label="Bond formation matrix"></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">FAST BOND-FORMATION TILES</div>
      <div class="bond-map-grid" id="bondMapGrid">
        <button class="bond-tile featured" type="button" data-bond="cc"><span>C-C</span><strong>Carbon-Carbon Bonds</strong><em>Build molecular skeletons</em></button>
        <button class="bond-tile" type="button" data-bond="cn"><span>C-N</span><strong>Carbon-Nitrogen Bonds</strong><em>Amines, amides, heterocycles</em></button>
        <button class="bond-tile" type="button" data-bond="co"><span>C-O</span><strong>Carbon-Oxygen Bonds</strong><em>Ethers, esters, alcohol derivatives</em></button>
        <button class="bond-tile" type="button" data-bond="cs"><span>C-S</span><strong>Carbon-Sulfur Bonds</strong><em>Thioethers, sulfones, sulfonamides</em></button>
        <button class="bond-tile" type="button" data-bond="cx"><span>C-X</span><strong>Carbon-Halogen Bonds</strong><em>Halogenation and leaving groups</em></button>
        <button class="bond-tile" type="button" data-bond="cb"><span>C-B</span><strong>Carbon-Boron Bonds</strong><em>Borylation and Suzuki handles</em></button>
        <button class="bond-tile" type="button" data-bond="csi"><span>C-Si</span><strong>Carbon-Silicon Bonds</strong><em>Silyl enol ethers and protection</em></button>
        <button class="bond-tile" type="button" data-bond="rings"><span>Ring</span><strong>Ring Formation</strong><em>Cyclization and pericyclic strategy</em></button>
      </div>
    </div>
    <div class="detail-section"><div class="detail-section-title">TOS VS DOS</div><p class="detail-text">Target-oriented synthesis works backward from a chosen molecule using disconnections. Diversity-oriented synthesis builds libraries by using flexible reactions and varied building blocks.</p></div>`;
  renderSynthesisMatrix(content);
  content.querySelectorAll('[data-bond]').forEach(tile=>{
    tile.addEventListener('click',()=>showSynthesisBondDetail(tile.dataset.bond));
  });
  openDetailPanel();
}

document.querySelectorAll('[data-open-synthesis-map]').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    openSynthesisMapDetail();
  });
});

const pgConditions=['Strong acid','Mild acid','Neutral / weak acid','Mild base','Strong base','Organometallics','Hydride reduction','Hydrogenolysis','Oxidation'];
const protectingGroupData={
  amino:[
    {name:'Boc-NR2',full:'tert-Butyl carbamate',remove:'TFA, HCl/dioxane, strong acid',note:'Excellent for amines when basic and nucleophilic steps are planned; acid-labile.',s:['labile','labile','stable','stable','moderate','labile','moderate','stable','stable']},
    {name:'Fmoc-NR2',full:'9-Fluorenylmethyl carbamate',remove:'Piperidine, secondary amines, base',note:'Common in peptide chemistry; base-labile and usually acid-stable.',s:['moderate','stable','stable','labile','labile','labile','moderate','stable','stable']},
    {name:'Cbz-NR2 / Z',full:'Benzyl carbamate',remove:'H2/Pd, hydrogenolysis, strong acid alternatives',note:'Useful when acid/base stability is needed; sensitive to hydrogenolysis.',s:['moderate','stable','stable','stable','stable','labile','moderate','labile','stable']},
    {name:'Ac-NR2',full:'Acetamide protection',remove:'Hydrolysis under strong acid/base or reduction',note:'Robust but harder to remove; can reduce nucleophilicity strongly.',s:['moderate','stable','stable','stable','moderate','labile','labile','stable','stable']},
    {name:'Ts-NR2',full:'Tosyl sulfonamide',remove:'Strong reductive or harsh cleavage conditions',note:'Very robust sulfonamide protection; deprotection can be difficult.',s:['stable','stable','stable','stable','stable','labile','moderate','stable','stable']},
    {name:'Tr-NR2',full:'Trityl amine protection',remove:'Mild acid',note:'Bulky, acid-labile protection useful for selective chemistry.',s:['labile','labile','moderate','stable','stable','stable','stable','moderate','labile']}
  ],
  hydroxyl:[
    {name:'TMS-OR',full:'Trimethylsilyl ether',remove:'Mild acid, fluoride, methanol/water',note:'Very labile silyl ether; useful for temporary protection.',s:['labile','labile','moderate','labile','labile','moderate','stable','stable','moderate']},
    {name:'TBS/TBDMS-OR',full:'tert-Butyldimethylsilyl ether',remove:'TBAF, HF-pyridine, acid',note:'Workhorse alcohol protection with good base stability.',s:['labile','moderate','stable','stable','stable','moderate','stable','stable','moderate']},
    {name:'TBDPS-OR',full:'tert-Butyldiphenylsilyl ether',remove:'Fluoride or strong acid',note:'Bulkier and more stable than TBS; useful for primary alcohol selectivity.',s:['moderate','stable','stable','stable','stable','moderate','stable','stable','stable']},
    {name:'Bn-OR',full:'Benzyl ether',remove:'H2/Pd, oxidative cleavage alternatives',note:'Stable to many acids/bases; removed by hydrogenolysis.',s:['stable','stable','stable','stable','stable','stable','stable','labile','moderate']},
    {name:'Ac-OR',full:'Acetate ester',remove:'Base hydrolysis, methoxide, acid hydrolysis',note:'Easy to introduce/remove; not stable to strong nucleophilic base.',s:['moderate','stable','stable','labile','labile','labile','moderate','stable','stable']},
    {name:'THP-OR',full:'Tetrahydropyranyl ether',remove:'Mild acid',note:'Acid-labile alcohol protection; forms diastereomeric mixtures.',s:['labile','labile','stable','stable','stable','moderate','stable','stable','moderate']}
  ],
  carbonyl:[
    {name:'Acetal / ketal',full:'Cyclic or acyclic acetal',remove:'Aqueous acid',note:'Protects aldehydes and ketones from nucleophiles and hydrides; acid-labile.',s:['labile','labile','stable','stable','stable','stable','stable','stable','moderate']},
    {name:'Thioacetal',full:'1,3-dithiane / dithiolane',remove:'Hg(II), Raney Ni, oxidative conditions',note:'Robust carbonyl mask; can enable umpolung chemistry.',s:['stable','stable','stable','stable','stable','stable','stable','moderate','labile']},
    {name:'Oxime',full:'Carbonyl oxime derivative',remove:'Hydrolysis or reductive cleavage',note:'Useful for characterization and rearrangements; stability depends on substitution.',s:['moderate','stable','stable','stable','moderate','labile','labile','stable','moderate']},
    {name:'Hydrazone',full:'Hydrazone carbonyl derivative',remove:'Hydrolysis or oxidative cleavage',note:'Can be used in Wolff-Kishner type chemistry; sensitive to acid and oxidants.',s:['labile','moderate','stable','stable','moderate','labile','labile','stable','labile']}
  ],
  carboxyl:[
    {name:'Me/Et ester',full:'Methyl or ethyl ester',remove:'Saponification or acid hydrolysis',note:'Simple acid protection; vulnerable to hydrolysis and strong nucleophiles.',s:['moderate','stable','stable','moderate','labile','labile','labile','stable','stable']},
    {name:'t-Bu ester',full:'tert-Butyl ester',remove:'TFA or strong acid',note:'Acid-labile ester, stable to many bases; common with Boc strategies.',s:['labile','labile','stable','stable','stable','labile','moderate','stable','stable']},
    {name:'Bn ester',full:'Benzyl ester',remove:'H2/Pd hydrogenolysis',note:'Orthogonal to Boc/t-Bu strategies; sensitive to hydrogenation.',s:['stable','stable','stable','stable','stable','moderate','moderate','labile','stable']},
    {name:'Allyl ester',full:'Allyl carboxylate',remove:'Pd(0)-mediated deallylation',note:'Useful orthogonal acid protection in peptide and complex synthesis.',s:['stable','stable','stable','stable','moderate','moderate','stable','moderate','moderate']}
  ]
};
const pgLabels={amino:'Amino',hydroxyl:'Hydroxyl',carbonyl:'Carbonyl',carboxyl:'Carboxyl'};

function renderProtectingGroups(group='amino',root=document){
  const tabs=root.getElementById ? root.getElementById('pgTabs') : root.querySelector('#pgTabs');
  const matrix=root.getElementById ? root.getElementById('pgMatrix') : root.querySelector('#pgMatrix');
  if(!tabs||!matrix) return;
  tabs.innerHTML=Object.keys(protectingGroupData).map(key=>`<button class="pg-tab ${key===group?'active':''}" type="button" data-pg-group="${key}">${pgLabels[key]}</button>`).join('');
  tabs.querySelectorAll('[data-pg-group]').forEach(btn=>btn.addEventListener('click',()=>renderProtectingGroups(btn.dataset.pgGroup,root)));
  matrix.innerHTML=protectingGroupData[group].map(pg=>{
    const cells=pg.s.map((state,i)=>`<td class="pg-cell ${state}" title="${pgConditions[i]}: ${state}">${state}</td>`).join('');
    return `<article class="pg-card">
      <div class="pg-card-head"><div><div class="pg-card-title">${pg.name}</div><div class="pg-card-sub">${pg.full}</div></div><div class="pg-deprotect">Remove: ${pg.remove}</div></div>
      <div class="pg-table-wrap"><table class="pg-table"><thead><tr><th>Condition</th>${pgConditions.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr><td class="pg-condition">Stability</td>${cells}</tr></tbody></table></div>
      <div class="pg-card-foot">${pg.note}</div>
    </article>`;
  }).join('');
}

function openProtectingGroupsDetail(){
  const content=document.getElementById('detailContent');
  content.innerHTML=`<div class="detail-title">Protecting Groups Stability Matrix</div><div class="detail-subtitle">Route Planning Reference</div>
    <div class="detail-section"><div class="detail-section-title">FUNCTIONAL GROUPS</div><p class="detail-text">Choose a functional group family and compare protecting group behavior under common acidic, basic, nucleophilic, organometallic, reducing, hydrogenolysis, and oxidizing conditions.</p>
      <div class="pg-legend detail-pg-legend"><span class="pg-stable">Stable</span><span class="pg-moderate">Moderate</span><span class="pg-labile">Labile</span></div>
      <div class="pg-tabs" id="pgTabs"></div><div class="pg-matrix" id="pgMatrix"></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">PLANNING NOTE</div><p class="detail-text">Protecting groups should solve a real chemoselectivity problem. Prefer groups that survive planned conditions and can be removed orthogonally near the end of the route.</p></div>`;
  renderProtectingGroups('amino',content);
  openDetailPanel();
}

document.querySelectorAll('[data-open-protecting-groups]').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    openProtectingGroupsDetail();
  });
});

// ═══════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
    }
  });
},{threshold:0.1});
document.querySelectorAll('.topic-card,.reaction-card,.mini-reaction,.fg-card,.matrix-cell,.chapter-link,.quick-map-inner').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(15px)';
  el.style.transition='opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ═══════════════════════════════════════════
// INTERACTIVE STUDY CONSOLE
// ═══════════════════════════════════════════
const studyTopics=[
  {title:'General Organic Chemistry',type:'Part 01',url:'parts/part-01-goc.html',keys:'goc bonding hybridization inductive resonance acidity basicity carbocation carbanion aromaticity solvent'},
  {title:'Stereochemistry',type:'Part 02',url:'parts/part-02-stereochemistry.html',keys:'chirality enantiomer diastereomer rs ez optical activity conformations'},
  {title:'Functional Group Chemistry',type:'Part 03',url:'parts/part-03-functional-groups.html',keys:'alkane alkene alkyne arene alcohol phenol carbonyl amine acid ester amide'},
  {title:'Oxidation & Reduction',type:'Part 04',url:'parts/part-04-redox.html',keys:'pcc kmno4 lialh4 nabh4 dibal swern jones lindlar birch oxidation reduction'},
  {title:'Rearrangement Reactions',type:'Part 05',url:'parts/part-05-rearrangements.html',keys:'pinacol beckmann hofmann curtius fries claisen wagner meerwein'},
  {title:'Coupling Reactions',type:'Part 06',url:'parts/part-06-couplings.html',keys:'suzuki heck sonogashira negishi stille buchwald ullmann glaser palladium'},
  {title:'Named Reactions',type:'Part 07',url:'parts/part-07-named-reactions.html',keys:'grignard aldol wittig diels alder friedel crafts mannich michael'},
  {title:'Analytical & Practical Organic',type:'Part 08',url:'parts/part-08-analytical.html',keys:'tlc column distillation ir nmr mass spectroscopy purification'},
  {title:'Industrial & Pharma Organic Chemistry',type:'Part 09',url:'parts/part-09-pharma-industrial.html',keys:'api impurity gti nitrosamine scale up process green chemistry'},
  {title:'Advanced Concepts',type:'Part 10',url:'parts/part-10-advanced.html',keys:'pericyclic organometallic retrosynthesis protecting groups asymmetric synthesis'},
  {title:'Interview Preparation',type:'Practice',url:'interview.html',keys:'interview pharma rnd process analytical questions answers'},
  {title:'Online Structure Editor',type:'Tool',url:'structure-editor.html',keys:'draw molecule smiles inchi sdf png pubchem structure editor'}
];

const reactionExplorerData=[
  {reactant:'1 deg Alcohol',reagent:'PCC',product:'Aldehyde',note:'Mild anhydrous oxidation stops at aldehyde.'},
  {reactant:'1 deg Alcohol',reagent:'KMnO4 / H+',product:'Carboxylic acid',note:'Strong oxidation continues beyond aldehyde.'},
  {reactant:'2 deg Alcohol',reagent:'PCC',product:'Ketone',note:'Secondary alcohols oxidize cleanly to ketones.'},
  {reactant:'Aldehyde',reagent:'NaBH4',product:'1 deg Alcohol',note:'NaBH4 reduces aldehydes and ketones selectively.'},
  {reactant:'Ketone',reagent:'NaBH4',product:'2 deg Alcohol',note:'Hydride addition followed by protonation.'},
  {reactant:'Ester',reagent:'LiAlH4',product:'Two alcohols',note:'Strong hydride reagent reduces esters completely.'},
  {reactant:'Acid Chloride',reagent:'DIBAL-H',product:'Aldehyde',note:'Low temperature controlled reduction.'},
  {reactant:'Alkene',reagent:'HBr / ROOR',product:'Anti-Markovnikov bromide',note:'Radical peroxide effect works reliably for HBr.'},
  {reactant:'Alkene',reagent:'BH3 then H2O2/OH-',product:'Anti-Markovnikov alcohol',note:'Hydroboration oxidation gives syn addition overall.'},
  {reactant:'Aryl Bromide',reagent:'Ar-B(OH)2 / Pd',product:'Biaryl',note:'Suzuki coupling, common in medicinal chemistry.'}
];

const quizData=[
  {q:'A primary alcohol treated with PCC generally gives:',options:['Aldehyde','Carboxylic acid','Alkene','Ester'],answer:0,why:'PCC is mild and usually stops 1 deg alcohol oxidation at aldehyde.'},
  {q:'SN2 reaction is fastest when the substrate is:',options:['Tertiary alkyl halide','Primary alkyl halide','Aryl chloride','Neopentyl bromide'],answer:1,why:'SN2 needs backside attack, so low steric hindrance helps.'},
  {q:'LiAlH4 can reduce esters to:',options:['Aldehydes only','Alcohols','Alkenes','Acid chlorides'],answer:1,why:'LiAlH4 is strong enough to reduce esters completely to alcohols.'},
  {q:'Suzuki coupling typically uses:',options:['Organoboron reagent','Organotin reagent','Diazonium salt','Osmium tetroxide'],answer:0,why:'Suzuki is a Pd-catalysed cross-coupling of organoboron partners.'},
  {q:'IR absorption near 1700 cm-1 usually indicates:',options:['O-H stretch','C=O stretch','C-H bend','C=N stretch'],answer:1,why:'Carbonyl groups commonly absorb strongly around 1650-1750 cm-1.'}
];

const flashcards=[
  {front:'PCC',back:'Mild oxidant: 1 deg alcohol to aldehyde, 2 deg alcohol to ketone.'},
  {front:'DIBAL-H',back:'Controlled reduction: esters/nitriles can stop at aldehyde at low temperature.'},
  {front:'SN1',back:'Two-step substitution through carbocation; favored by 3 deg substrates and polar protic solvent.'},
  {front:'SN2',back:'One-step backside attack; favored by methyl/1 deg substrates and strong nucleophiles.'},
  {front:'Aldol Reaction',back:'Enolate addition to aldehyde/ketone followed by beta-hydroxy carbonyl formation.'},
  {front:'Suzuki Coupling',back:'Pd-catalysed coupling of aryl/vinyl halides with boronic acids.'}
];

const moleculeCards=[
  {name:'Benzene',structure:'C6H6',note:'Aromatic six pi electron system'},
  {name:'Pyridine',structure:'C5H5N',note:'Basic aromatic heterocycle'},
  {name:'PCC',structure:'[C5H5NH]+[CrO3Cl]-',note:'Mild alcohol oxidant'},
  {name:'DIBAL-H',structure:'i-Bu2AlH',note:'Selective hydride reducing agent'},
  {name:'Grignard',structure:'R-Mg-X',note:'Carbon nucleophile equivalent'},
  {name:'Boronic Acid',structure:'R-B(OH)2',note:'Suzuki coupling partner'}
];

const mechanismData={
  'SN2':['Nucleophile approaches from backside of C-X bond.','C-Nu bond forms while C-X bond breaks in one concerted step.','Configuration inverts at the reacting stereocenter.'],
  'SN1':['Leaving group departs to form a carbocation.','Solvent or nucleophile attacks planar carbocation.','Deprotonation gives substitution product; racemization may occur.'],
  'E2':['Base removes beta hydrogen anti-periplanar to leaving group.','C-H and C-X bonds break while C=C bond forms.','Product follows stereoelectronic geometry and often Zaitsev selectivity.'],
  'Aldol':['Base forms enolate from alpha hydrogen.','Enolate attacks another carbonyl compound.','Protonation gives beta-hydroxy carbonyl; heating can dehydrate.'],
  'Grignard Addition':['RMgX behaves like R- nucleophile.','Carbon attacks electrophilic carbonyl carbon.','Acidic workup protonates alkoxide to alcohol.']
};

const reagentRows=[
  {r:'PCC',u:'1 deg alcohol -> aldehyde; 2 deg alcohol -> ketone',n:'Mild, usually anhydrous.'},
  {r:'Jones / KMnO4',u:'Strong oxidation to acids or ketones',n:'Can over-oxidize sensitive substrates.'},
  {r:'NaBH4',u:'Aldehyde/ketone -> alcohol',n:'Milder than LiAlH4; tolerates protic solvents.'},
  {r:'LiAlH4',u:'Esters, acids, amides, aldehydes, ketones -> alcohols/amines',n:'Strong reducing agent; dry ether required.'},
  {r:'DIBAL-H',u:'Ester/nitrile/acid chloride -> aldehyde',n:'Low temperature control is important.'},
  {r:'Lindlar catalyst',u:'Alkyne -> cis alkene',n:'Poisoned catalyst prevents full reduction.'},
  {r:'Na / NH3(l)',u:'Alkyne -> trans alkene; Birch reduction',n:'Dissolving metal conditions.'},
  {r:'mCPBA',u:'Alkene -> epoxide; Baeyer-Villiger oxidation',n:'Peracid electrophilic oxygen transfer.'},
  {r:'OsO4 / NMO',u:'Alkene -> syn diol',n:'Powerful but toxic oxidant.'},
  {r:'BH3 then H2O2/OH-',u:'Alkene -> anti-Markovnikov alcohol',n:'Syn hydroboration followed by oxidation.'},
  {r:'Pd/C, H2',u:'Hydrogenation of alkenes/alkynes/nitro groups',n:'Watch for debenzylation and halide sensitivity.'},
  {r:'SOCl2',u:'Alcohol/acid -> chloride/acid chloride',n:'Often releases SO2 and HCl gases.'}
];

const fullInterviewSections=[
  {title:'SECTION 1: Organic Chemistry Fundamentals',items:[
    ['What is a nucleophile?','A nucleophile is an electron-rich species that donates an electron pair to an electrophilic center. Examples include hydroxide, alkoxides, amines, halides, enolates, and organometallic reagents.'],
    ['What is an electrophile?','An electrophile is an electron-deficient species that accepts an electron pair. Carbonyl carbons, carbocations, alkyl halides, acid chlorides, and protonated functional groups are common electrophiles.'],
    ['What is the difference between SN1 and SN2 reactions?','SN1 is stepwise and proceeds through a carbocation intermediate, while SN2 is concerted and occurs by backside attack. SN1 is favored by tertiary substrates and polar protic solvents; SN2 is favored by methyl or primary substrates and polar aprotic solvents.'],
    ['What is the difference between E1 and E2 reactions?','E1 is stepwise and proceeds through a carbocation, whereas E2 is concerted and requires a base to remove a beta hydrogen as the leaving group departs. E2 often requires anti-periplanar geometry.'],
    ['What makes a good leaving group?','A good leaving group forms a stable species after departure. Weak bases such as iodide, bromide, chloride, tosylate, mesylate, and water are good leaving groups.'],
    ['What is carbocation stability order?','The common stability order is benzylic or allylic > tertiary > secondary > primary > methyl. Resonance, hyperconjugation, and inductive donation stabilize carbocations.'],
    ['What is the inductive effect?','The inductive effect is electron withdrawal or donation through sigma bonds due to electronegativity differences. It decreases rapidly with distance.'],
    ['What is resonance effect?','Resonance is delocalization of electrons through pi bonds or lone pairs in a conjugated system. It strongly affects acidity, basicity, stability, and directing effects.'],
    ['What is hyperconjugation?','Hyperconjugation is stabilizing interaction between a sigma bond and an adjacent empty or partially filled p orbital or pi system. It helps explain alkyl carbocation and alkene stability.'],
    ['What are the conditions for aromaticity?','Aromatic compounds must be cyclic, planar, fully conjugated, and must contain 4n+2 pi electrons according to Huckel rule.'],
    ['What is antiaromaticity?','Antiaromatic compounds are cyclic, planar, fully conjugated systems with 4n pi electrons. They are destabilized compared with non-aromatic analogues.'],
    ['What is tautomerism?','Tautomerism is dynamic equilibrium between constitutional isomers, commonly keto-enol forms, involving proton transfer and pi bond shift.'],
    ['Why is pKa important in organic chemistry?','pKa predicts acid strength, base selection, ionization state, salt formation, extraction behavior, and compatibility with reagents. Lower pKa means stronger acid.'],
    ['What is the difference between polar protic and polar aprotic solvents?','Polar protic solvents can donate hydrogen bonds, such as water, methanol, and ethanol. Polar aprotic solvents have high polarity but no acidic hydrogen, such as DMSO, DMF, acetone, and acetonitrile.'],
    ['Why do polar aprotic solvents favor SN2 reactions?','They solvate cations strongly but do not heavily solvate anionic nucleophiles, so nucleophilicity remains high and backside attack becomes faster.'],
    ['What is steric hindrance?','Steric hindrance is reduced reactivity caused by bulky groups blocking approach to the reaction center. It strongly affects SN2, additions, and catalyst selectivity.'],
    ['What is regioselectivity?','Regioselectivity means one constitutional product forms preferentially over another possible positional isomer. Markovnikov addition is a common example.'],
    ['What is stereoselectivity?','Stereoselectivity means one stereoisomer forms preferentially over another. It may be enantioselective, diastereoselective, cis/trans selective, or E/Z selective.'],
    ['What is Hammond postulate?','Hammond postulate states that a transition state resembles the nearest species in energy. It helps explain selectivity in endothermic or exothermic steps.'],
    ['What is the difference between kinetic and thermodynamic control?','Kinetic control gives the fastest-forming product, often at lower temperature. Thermodynamic control gives the most stable product, often under reversible or heated conditions.']
  ]},
  {title:'SECTION 2: Stereochemistry and Isomerism',items:[
    ['What is chirality?','Chirality is the property of a molecule that is not superimposable on its mirror image. Chiral molecules often contain stereogenic centers or axial/planar chirality.'],
    ['What are enantiomers?','Enantiomers are non-superimposable mirror-image stereoisomers. They have identical properties in achiral environments except optical rotation, but behave differently in chiral biological systems.'],
    ['What are diastereomers?','Diastereomers are stereoisomers that are not mirror images. They generally have different physical and chemical properties and are easier to separate than enantiomers.'],
    ['What is a racemic mixture?','A racemic mixture contains equal amounts of two enantiomers and shows no net optical rotation because the rotations cancel.'],
    ['What is a meso compound?','A meso compound has stereocenters but is achiral because it contains an internal symmetry element. It is optically inactive by internal compensation.'],
    ['Does R/S configuration indicate plus or minus optical rotation?','No. R/S is absolute configuration, while plus/minus optical rotation is an experimental property. They are not directly predictable from each other.'],
    ['How are R and S configurations assigned?','Assign CIP priorities by atomic number, orient the lowest priority group away, then trace 1 to 2 to 3. Clockwise is R; anticlockwise is S.'],
    ['How are E and Z configurations assigned?','Assign priorities on both alkene carbons using CIP rules. Same side higher-priority groups give Z; opposite sides give E.'],
    ['What is conformational isomerism?','Conformational isomerism arises from rotation around sigma bonds. Examples include staggered/eclipsed ethane, anti/gauche butane, and chair/boat cyclohexane.'],
    ['Why do bulky groups prefer equatorial positions in cyclohexane?','Equatorial positions avoid severe 1,3-diaxial interactions, making that conformation more stable.'],
    ['What is optical activity?','Optical activity is the ability of a chiral substance to rotate plane-polarized light. It depends on concentration, path length, solvent, temperature, and wavelength.'],
    ['What is enantiomeric excess?','Enantiomeric excess measures optical purity: percent major enantiomer minus percent minor enantiomer.'],
    ['How can enantiomers be separated?','Enantiomers can be separated by chiral chromatography, enzymatic resolution, crystallization of diastereomeric salts, or asymmetric synthesis.'],
    ['Why is stereochemistry important in drugs?','Biological targets are chiral. Different enantiomers can differ in potency, toxicity, metabolism, receptor binding, and regulatory profile.'],
    ['What is atropisomerism?','Atropisomerism is chirality caused by restricted rotation around a bond, commonly seen in hindered biaryls.']
  ]},
  {title:'SECTION 3: Reagents and Functional Group Transformations',items:[
    ['What is PCC used for?','PCC is a mild oxidizing agent that converts primary alcohols to aldehydes and secondary alcohols to ketones, usually without over-oxidation to acids.'],
    ['What is the role of KMnO4?','KMnO4 is a strong oxidizing agent. It can oxidize alkenes, alcohols, aldehydes, and benzylic side chains depending on conditions.'],
    ['How do NaBH4 and LiAlH4 differ?','NaBH4 is milder and mainly reduces aldehydes and ketones. LiAlH4 is stronger and can reduce esters, acids, amides, nitriles, aldehydes, and ketones.'],
    ['Why is DIBAL-H used at low temperature?','Low temperature helps stop reduction of esters or nitriles at the aldehyde stage and reduces over-reduction to alcohols.'],
    ['What does a Grignard reagent do?','A Grignard reagent acts as a carbon nucleophile and forms C-C bonds by addition to electrophiles such as aldehydes, ketones, esters, and epoxides.'],
    ['Why must Grignard reactions be anhydrous?','Grignard reagents are strongly basic and are destroyed by water, alcohols, acids, amines, and other acidic protons.'],
    ['What is Swern oxidation?','Swern oxidation converts primary alcohols to aldehydes and secondary alcohols to ketones under mild, non-aqueous conditions using DMSO activation.'],
    ['What is Dess-Martin periodinane used for?','Dess-Martin periodinane is a mild oxidant for alcohols, useful for sensitive substrates and often cleaner than chromium oxidants.'],
    ['What is Wittig reaction?','The Wittig reaction converts aldehydes or ketones to alkenes using phosphorus ylides. It is a key carbon-carbon double bond forming reaction.'],
    ['What is Friedel-Crafts alkylation?','Friedel-Crafts alkylation introduces an alkyl group onto an aromatic ring using an alkyl halide and Lewis acid, but rearrangements and polyalkylation can occur.'],
    ['What is Friedel-Crafts acylation?','Friedel-Crafts acylation introduces an acyl group onto an aromatic ring using an acid chloride or anhydride with a Lewis acid. It avoids carbocation rearrangement.'],
    ['What is diazotization?','Diazotization converts aromatic primary amines into diazonium salts using nitrous acid at low temperature. Diazonium salts are useful synthetic intermediates.'],
    ['What is Sandmeyer reaction?','Sandmeyer reaction replaces an aromatic diazonium group with Cl, Br, CN, or other groups using copper salts.'],
    ['How are nitro groups reduced to amines?','Common methods include Fe/HCl, Sn/HCl, catalytic hydrogenation, or transfer hydrogenation depending on substrate tolerance.'],
    ['What is reductive amination?','Reductive amination converts aldehydes or ketones to amines through imine or iminium formation followed by reduction.'],
    ['What is tosylation?','Tosylation converts an alcohol into a tosylate, which is a much better leaving group for substitution or elimination.'],
    ['What is mCPBA used for?','mCPBA epoxidizes alkenes and can also perform Baeyer-Villiger oxidation of ketones to esters or lactones.'],
    ['What does Lindlar catalyst do?','Lindlar catalyst partially hydrogenates alkynes to cis alkenes and prevents full reduction to alkanes.'],
    ['What does sodium in liquid ammonia do to alkynes?','Dissolving metal reduction converts alkynes to trans alkenes through radical anion intermediates.'],
    ['What is ozonolysis used for?','Ozonolysis cleaves alkenes to carbonyl compounds. Reductive or oxidative workup controls whether aldehydes survive or become acids.'],
    ['What is hydroboration-oxidation?','Hydroboration-oxidation converts alkenes to anti-Markovnikov alcohols with syn addition overall.'],
    ['What is Markovnikov addition?','In addition of HX to an unsymmetrical alkene, hydrogen adds to the carbon with more hydrogens and halide adds to the more substituted carbon.'],
    ['What is the peroxide effect?','In presence of peroxides, HBr adds to alkenes by a radical pathway to give anti-Markovnikov bromides. It is generally reliable only for HBr.'],
    ['What is acetal protection?','Aldehydes and ketones react with diols under acid to form acetals, protecting carbonyls from nucleophiles and bases.'],
    ['What are common alcohol protecting groups?','Common alcohol protecting groups include TBS, TBDMS, TBDPS, benzyl, acetyl, and THP groups.']
  ]},
  {title:'SECTION 4: Named Reactions and Couplings',items:[
    ['What is Aldol reaction?','Aldol reaction involves enolate addition to an aldehyde or ketone to form a beta-hydroxy carbonyl compound, which can dehydrate to an enone.'],
    ['What is Claisen condensation?','Claisen condensation is reaction of ester enolates with esters to form beta-keto esters under basic conditions.'],
    ['What is Michael addition?','Michael addition is conjugate 1,4-addition of a nucleophile to an alpha,beta-unsaturated carbonyl compound.'],
    ['What is Mannich reaction?','Mannich reaction forms beta-aminocarbonyl compounds from an enolizable carbonyl compound, formaldehyde, and an amine.'],
    ['What is Diels-Alder reaction?','Diels-Alder reaction is a concerted [4+2] cycloaddition between a diene and a dienophile to form a cyclohexene ring.'],
    ['What is Beckmann rearrangement?','Beckmann rearrangement converts oximes to amides under acidic conditions through migration to electron-deficient nitrogen.'],
    ['What is Hofmann rearrangement?','Hofmann rearrangement converts primary amides to primary amines with one fewer carbon using halogen and base.'],
    ['What is Curtius rearrangement?','Curtius rearrangement converts acyl azides to isocyanates, which can be hydrolyzed to amines or trapped by alcohols or amines.'],
    ['What is Baeyer-Villiger oxidation?','Baeyer-Villiger oxidation inserts oxygen next to a carbonyl, converting ketones to esters or cyclic ketones to lactones.'],
    ['What is Pinacol rearrangement?','Pinacol rearrangement converts vicinal diols into carbonyl compounds through dehydration and 1,2-shift under acid.'],
    ['What is Suzuki coupling?','Suzuki coupling is a Pd-catalyzed cross-coupling between organoboron reagents and aryl or vinyl halides/triflates.'],
    ['Why is Suzuki coupling common in pharma?','Boronic acids are relatively accessible, less toxic than organotin reagents, and the reaction tolerates many functional groups and aqueous conditions.'],
    ['What is Heck reaction?','Heck reaction is Pd-catalyzed coupling of aryl or vinyl halides with alkenes, usually forming substituted alkenes.'],
    ['What is Sonogashira coupling?','Sonogashira coupling joins aryl or vinyl halides with terminal alkynes using Pd catalyst and often CuI co-catalyst.'],
    ['What is Stille coupling?','Stille coupling is Pd-catalyzed coupling of organotin reagents with organic halides. It is useful but limited by tin toxicity.'],
    ['What is Negishi coupling?','Negishi coupling uses organozinc reagents with organic halides under Pd or Ni catalysis and is useful for difficult C-C bond formation.'],
    ['What is Buchwald-Hartwig coupling?','Buchwald-Hartwig coupling is Pd-catalyzed C-N bond formation between aryl halides and amines or related nitrogen nucleophiles.'],
    ['What is Ullmann coupling?','Ullmann coupling uses copper to form aryl C-N, C-O, C-S, or C-C bonds. Modern ligand systems improve its scope.'],
    ['What is Wurtz reaction?','Wurtz reaction couples alkyl halides with sodium metal to form alkanes, mainly useful for symmetrical products.'],
    ['What is Glaser coupling?','Glaser coupling is oxidative homocoupling of terminal alkynes to form diynes, usually using copper and oxygen.']
  ]},
  {title:'SECTION 5: Process Chemistry and Scale-Up',items:[
    ['What is process chemistry?','Process chemistry develops and optimizes synthetic routes so they are safe, scalable, reproducible, economical, and capable of delivering required purity.'],
    ['What are the main challenges in scale-up?','Heat transfer, mixing, mass transfer, gas evolution, addition rate, crystallization, filtration, drying, and safety margins become more important at scale.'],
    ['How do you control an exothermic reaction?','Use cooling, slow addition, dilution, semi-batch operation, temperature interlocks, calorimetry data, and appropriate quench strategy.'],
    ['Why can a lab reaction fail during scale-up?','Small-scale conditions may hide heat accumulation, poor mixing, localized concentration, gas evolution, slow filtration, impurity formation, or unsafe quench behavior.'],
    ['What is impurity profiling?','Impurity profiling identifies, quantifies, tracks, and controls process-related impurities, degradation impurities, residual reagents, catalysts, solvents, and carryover materials.'],
    ['What are process-related impurities?','They arise from starting materials, intermediates, reagents, side reactions, catalysts, byproducts, and incomplete conversions in the manufacturing process.'],
    ['What are degradation impurities?','Degradation impurities form when API or intermediates degrade due to heat, light, oxygen, moisture, pH, or incompatible excipients.'],
    ['What is an impurity purge study?','A purge study evaluates how an impurity is removed or reduced through reaction, workup, crystallization, extraction, distillation, or chromatography steps.'],
    ['What is a control strategy?','A control strategy is the planned set of material controls, process controls, analytical controls, and specifications used to ensure quality.'],
    ['What is a critical process parameter?','A critical process parameter is a process variable that can significantly affect a critical quality attribute if not controlled.'],
    ['What is a critical quality attribute?','A CQA is a physical, chemical, biological, or microbiological property that must be within limits to ensure product quality.'],
    ['What is Quality by Design?','Quality by Design is a systematic development approach that uses scientific understanding, risk assessment, and control strategy to build quality into the process.'],
    ['What is DoE?','Design of Experiments is a statistical approach to study multiple variables and interactions efficiently during optimization.'],
    ['How do you select a solvent for process chemistry?','Consider solubility, selectivity, boiling point, toxicity, cost, recovery, safety, regulatory class, environmental impact, and crystallization behavior.'],
    ['What is crystallization used for?','Crystallization purifies compounds, controls particle properties, removes impurities, and can select a desired polymorphic form.'],
    ['What is polymorphism?','Polymorphism means the same compound exists in different crystal forms with different physical properties such as solubility, stability, and melting point.'],
    ['What is mother liquor?','Mother liquor is the solution remaining after crystallization or filtration; it may contain product, impurities, and solvent.'],
    ['What is reaction workup?','Workup includes quenching, extraction, washing, pH adjustment, phase separation, concentration, filtration, and other steps after reaction completion.'],
    ['What is the difference between yield and assay?','Yield is the isolated amount relative to theory. Assay measures chemical purity or content of the desired compound.'],
    ['Why is purity more important than yield in API development?','API must meet strict quality specifications. A high-yield process with unacceptable impurity profile is not suitable for manufacturing.'],
    ['What are residual solvents?','Residual solvents are organic volatile solvents remaining in drug substance or product after processing. They are controlled according to ICH Q3C.'],
    ['What are class 1, class 2, and class 3 solvents?','Class 1 solvents should be avoided due to high toxicity. Class 2 solvents are limited. Class 3 solvents have low toxic potential.'],
    ['What is green chemistry?','Green chemistry designs chemical processes to reduce waste, hazards, energy use, toxicity, and environmental impact.'],
    ['What is atom economy?','Atom economy measures how much of the reactant atoms end up in the desired product. Higher atom economy means less waste.'],
    ['What is process robustness?','A robust process gives consistent quality and yield despite small normal variations in process parameters.']
  ]},
  {title:'SECTION 6: Analytical and Characterization',items:[
    ['What is TLC used for?','TLC is used for quick reaction monitoring, checking purity, comparing starting material and product, and selecting column solvent systems.'],
    ['What is Rf value?','Rf is the distance traveled by compound divided by distance traveled by solvent front. It depends on stationary phase, mobile phase, and compound polarity.'],
    ['What causes TLC tailing?','Tailing can be caused by strong adsorption, acidic/basic interactions with silica, overloaded spots, moisture, or unsuitable solvent system.'],
    ['What is HPLC used for?','HPLC separates, identifies, and quantifies components in a mixture. It is widely used for assay, impurity profiling, and method validation.'],
    ['What is GC used for?','GC is used for volatile and thermally stable compounds, residual solvents, and volatile impurities.'],
    ['What does NMR tell you?','NMR provides information about chemical environments, number of protons/carbons, connectivity, symmetry, integration, splitting, and stereochemical clues.'],
    ['What does IR spectroscopy identify?','IR identifies functional groups through characteristic bond vibrations, such as C=O, O-H, N-H, C=N, and C-H stretches.'],
    ['What does mass spectrometry provide?','MS provides molecular weight, isotope pattern, fragmentation information, and sometimes molecular formula with high-resolution MS.'],
    ['What is UV spectroscopy useful for?','UV spectroscopy is useful for conjugated systems, chromophores, assay methods, and HPLC detection.'],
    ['What is LOD?','Limit of detection is the lowest amount of analyte that can be detected but not necessarily quantified accurately.'],
    ['What is LOQ?','Limit of quantification is the lowest amount of analyte that can be quantified with acceptable accuracy and precision.'],
    ['What is system suitability?','System suitability verifies that an analytical system is performing adequately before or during sample analysis.'],
    ['What is peak tailing factor?','Peak tailing factor measures asymmetry of a chromatographic peak. High tailing can affect integration and quantification.'],
    ['What is chromatographic resolution?','Resolution measures separation between two peaks. Higher resolution means better separation and more reliable quantification.'],
    ['What is accuracy in method validation?','Accuracy is closeness of measured value to true value, usually evaluated by recovery studies.'],
    ['What is precision in method validation?','Precision is repeatability or reproducibility of measurements under defined conditions.'],
    ['What is linearity?','Linearity is the ability of a method to produce responses proportional to analyte concentration over a defined range.'],
    ['What is robustness?','Robustness is the ability of a method to remain unaffected by small deliberate changes in method parameters.'],
    ['What is forced degradation?','Forced degradation exposes a compound to stress conditions such as acid, base, heat, oxidation, light, or humidity to understand degradation pathways.'],
    ['Why use orthogonal analytical methods?','Orthogonal methods reduce risk by confirming quality or structure using different separation or detection principles.']
  ]},
  {title:'SECTION 7: Regulatory, GTI, and Nitrosamine Topics',items:[
    ['What is a genotoxic impurity?','A genotoxic impurity is an impurity that can damage DNA and may pose carcinogenic risk even at very low levels.'],
    ['What is ICH M7?','ICH M7 provides guidance for assessment and control of DNA-reactive impurities in pharmaceuticals.'],
    ['What is TTC?','Threshold of toxicological concern is a risk-based exposure threshold commonly used for certain mutagenic impurities.'],
    ['What are nitrosamines?','Nitrosamines are potentially carcinogenic N-nitroso compounds that can form from amines and nitrosating agents under suitable conditions.'],
    ['How can nitrosamine risk be reduced?','Avoid nitrosating conditions, control nitrite sources, modify route or reagents, control pH, use scavengers where justified, and develop sensitive analytical methods.'],
    ['What is acceptable intake?','Acceptable intake is the maximum daily exposure to an impurity considered acceptable based on toxicological risk.'],
    ['What is ICH Q3A?','ICH Q3A covers impurities in new drug substances.'],
    ['What is ICH Q3B?','ICH Q3B covers impurities in new drug products.'],
    ['What is ICH Q3C?','ICH Q3C provides guidance on residual solvents and their permitted daily exposure limits.'],
    ['What is ICH Q3D?','ICH Q3D provides guidance on elemental impurities.'],
    ['What is cleaning validation?','Cleaning validation demonstrates that equipment cleaning removes residues to acceptable limits and prevents cross-contamination.'],
    ['What is hold time study?','Hold time study establishes how long materials, intermediates, or equipment can be held under defined conditions without quality impact.'],
    ['What is process validation?','Process validation demonstrates that a process consistently produces material meeting predetermined quality requirements.'],
    ['What is change control?','Change control is a formal system to assess, approve, implement, and document changes that may affect quality.'],
    ['What is deviation handling?','Deviation handling investigates departures from approved procedures or specifications and defines corrective and preventive actions.']
  ]},
  {title:'SECTION 8: Practical Lab and Safety Questions',items:[
    ['How do you quench LiAlH4 safely?','Quench slowly at low temperature with controlled addition, commonly using wet solvent or water followed by aqueous base/acid depending on procedure. The key is controlling hydrogen evolution and exotherm.'],
    ['Why is sodium metal hazardous?','Sodium reacts violently with water and protic solvents, producing heat and hydrogen gas. It must be handled dry and quenched carefully.'],
    ['How do you handle pyrophoric reagents?','Use inert atmosphere, dry apparatus, proper syringe/cannula technique, compatible solvents, small-scale training, and emergency quench plan.'],
    ['What is the risk of azides?','Organic and heavy-metal azides can be explosive. Sodium azide can form toxic hydrazoic acid under acidic conditions.'],
    ['Why is peroxide testing important for ethers?','Ethers can form explosive peroxides on storage, especially THF and diethyl ether. Testing and proper storage reduce risk.'],
    ['What is runaway reaction?','A runaway reaction occurs when heat generation exceeds heat removal, causing uncontrolled temperature and pressure rise.'],
    ['What is reaction calorimetry?','Reaction calorimetry measures heat release, adiabatic temperature rise, and thermal risk, supporting safe scale-up.'],
    ['Why is order of addition important?','Order of addition controls local concentration, heat release, selectivity, precipitation, gas evolution, and impurity formation.'],
    ['What is an inert atmosphere used for?','Nitrogen or argon excludes oxygen and moisture for air-sensitive or moisture-sensitive reactions.'],
    ['Why is water content important?','Water can quench reactive reagents, change pH, affect crystallization, promote hydrolysis, or alter selectivity.'],
    ['What is a drying agent?','A drying agent removes water from organic solutions. Examples include sodium sulfate, magnesium sulfate, and molecular sieves.'],
    ['Why is pH control important in workup?','pH controls ionization, extraction, salt formation, hydrolysis, precipitation, and impurity partitioning.'],
    ['How do you choose between extraction and crystallization?','Extraction is useful for partitioning based on solubility and ionization; crystallization is preferred when a pure solid can be selectively isolated.'],
    ['What is seed crystallization?','Seeding introduces crystals of desired form to initiate controlled crystallization and improve reproducibility.'],
    ['What is filtration difficulty caused by?','Fine particles, gelatinous solids, high viscosity, compressible cake, polymorph issues, or poor solvent choice can slow filtration.']
  ]},
  {title:'SECTION 9: Advanced Synthesis and Medicinal Chemistry',items:[
    ['What is retrosynthesis?','Retrosynthesis plans synthesis backward from target molecule to simpler precursors using strategic bond disconnections and functional group interconversions.'],
    ['What is a synthon?','A synthon is an idealized fragment used in retrosynthetic analysis. The actual reagent that provides it is called a synthetic equivalent.'],
    ['What is umpolung?','Umpolung is reversal of normal polarity, allowing a carbon normally electrophilic to behave as nucleophilic or vice versa.'],
    ['What is protecting group orthogonality?','Orthogonality means one protecting group can be removed under conditions that leave other protecting groups intact.'],
    ['When should protecting groups be avoided?','Protecting groups should be avoided when direct chemoselectivity is possible because they add steps, cost, waste, and impurity risk.'],
    ['What is asymmetric synthesis?','Asymmetric synthesis produces enantioenriched products using chiral catalysts, chiral auxiliaries, chiral pool starting materials, or biocatalysis.'],
    ['What is chiral pool synthesis?','Chiral pool synthesis uses naturally available enantiopure starting materials such as amino acids, sugars, terpenes, or alkaloids.'],
    ['What is organocatalysis?','Organocatalysis uses small organic molecules as catalysts, often for enantioselective carbon-carbon or carbon-heteroatom bond formation.'],
    ['What is bioisosterism?','Bioisosterism replaces a group with another group that has similar biological or physicochemical properties to improve potency, selectivity, or ADME.'],
    ['What is salt screening?','Salt screening evaluates different counterions to improve API properties such as solubility, crystallinity, stability, hygroscopicity, and manufacturability.'],
    ['What is co-crystal screening?','Co-crystal screening looks for crystalline forms with coformers to modify solid-state properties without changing covalent structure.'],
    ['What is logP?','logP measures partitioning between octanol and water for neutral molecules and reflects lipophilicity.'],
    ['What is pKa relevance in drug design?','pKa affects ionization, solubility, permeability, salt formation, binding, and formulation behavior.'],
    ['What is metabolic soft spot?','A metabolic soft spot is a site in a molecule prone to metabolic transformation, such as oxidation, hydrolysis, or dealkylation.'],
    ['What is structure-activity relationship?','SAR studies connect structural changes to biological activity, selectivity, toxicity, and physicochemical properties.']
  ]},
  {title:'SECTION 10: HR and R&D Behavioral Questions',items:[
    ['How would you explain your research experience briefly?','Summarize your project goal, your role, key reactions or analytical methods, major challenges, and measurable outcomes such as yield, purity, scale, or impurity control.'],
    ['How do you approach a failed reaction?','Check material quality, stoichiometry, solvent, temperature, water/oxygen sensitivity, reaction monitoring, workup, and analytical data. Then design a small set of controlled experiments.'],
    ['How do you prioritize safety in the lab?','Review hazards, SDS, compatibility, scale, exotherm, pressure, PPE, engineering controls, quench plan, and waste handling before starting work.'],
    ['How do you document experiments?','Record objective, procedure, quantities, observations, TLC/HPLC/NMR data, deviations, yield, purity, and conclusion in a clear and reproducible format.'],
    ['How do you handle pressure during urgent project timelines?','Prioritize critical experiments, communicate risks early, avoid unsafe shortcuts, and focus on data-driven decisions that move the project forward.'],
    ['How do you work with analytical teams?','Share clear sample information, expected compounds, likely impurities, method needs, urgency, and interpret data collaboratively.'],
    ['What makes a good process chemist?','Strong fundamentals, safety mindset, impurity awareness, analytical thinking, practical problem solving, documentation discipline, and scale-up awareness.'],
    ['Why do you want to work in pharma R&D?','A strong answer connects scientific problem solving with real patient impact, continuous learning, teamwork, and development of safe, scalable medicines.'],
    ['How do you decide if a route is good?','Evaluate yield, purity, step count, cost, raw material availability, safety, environmental impact, impurity profile, scalability, and regulatory risk.'],
    ['What would you do if HPLC shows a new unknown impurity?','Confirm reproducibility, isolate or enrich if possible, use LC-MS/NMR, check reaction pathway, stress conditions, raw materials, and develop a control or purge strategy.']
  ]}
];

const interviewItems=fullInterviewSections.flatMap(section=>section.items.map(item=>({q:item[0],a:item[1]})));

function renderInterviewPrepPage(){
  const section=document.getElementById('interview-prep');
  const content=section?.querySelector('.content-area');
  if(!content) return;
  const total=interviewItems.length;
  const sectionsHtml=fullInterviewSections.map((group,groupIndex)=>{
    let start=fullInterviewSections.slice(0,groupIndex).reduce((sum,g)=>sum+g.items.length,0);
    const cards=group.items.map((item,itemIndex)=>{
      const num=start+itemIndex+1;
      return `<div class="qa-card"><div class="qa-q">${num}. ${item[0]}</div><div class="qa-a">${item[1]}</div></div>`;
    }).join('');
    return `<div class="qa-section"><h3 class="sub">${group.title}</h3><div class="qa-grid">${cards}</div></div>`;
  }).join('');
  content.innerHTML=`
    <div class="section-badge">${total} High-Yield Q&A</div>
    <h2 class="glow-header">Organic + Pharma R&D Interview Prep</h2>
    <p class="glow-sub">English-only interview revision set covering organic fundamentals, stereochemistry, reagents, named reactions, process chemistry, analytical methods, regulatory topics, lab safety, medicinal chemistry, and R&D behavioral questions.</p>
    <div class="page-actions"><a class="page-pill" href="index.html">Back to Master Index</a><a class="page-pill" href="parts/part-01-goc.html">Revise GOC</a><a class="page-pill" href="parts/part-09-pharma-industrial.html">Pharma Topics</a></div>
    ${sectionsHtml}
    <div class="info-box"><strong>Answer style:</strong> Start with a precise definition, add one example, explain the chemical reason, and mention one practical limitation or R&D relevance where appropriate.</div>
  `;
}

function initStudyConsole(){
  const openTools=document.getElementById('openStudyTools');
  const closeTools=document.getElementById('closeStudyTools');
  openTools?.addEventListener('click',()=>document.body.classList.add('study-tools-open'));
  closeTools?.addEventListener('click',()=>document.body.classList.remove('study-tools-open'));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') document.body.classList.remove('study-tools-open');
  });
  const consolePanels=[...document.querySelectorAll('.console-panel')];
  function openConsolePanel(panel){
    consolePanels.forEach(p=>p.classList.toggle('active',p===panel));
  }
  consolePanels.forEach((panel,index)=>{
    if(index===0) panel.classList.add('active');
    panel.querySelector('.panel-top')?.addEventListener('click',()=>openConsolePanel(panel));
  });

  const search=document.getElementById('globalStudySearch');
  const searchResults=document.getElementById('globalSearchResults');
  function renderSearch(q=''){
    if(!searchResults) return;
    const query=q.trim().toLowerCase();
    const hits=studyTopics.filter(item=>!query||`${item.title} ${item.type} ${item.keys}`.toLowerCase().includes(query)).slice(0,8);
    searchResults.innerHTML=hits.map(item=>`<a class="search-hit" href="${item.url}"><strong>${item.title}</strong><span>${item.type}</span></a>`).join('')||'<div class="search-hit"><strong>No match found</strong><span>Try reagent, NMR, SN1 or pharma</span></div>';
  }
  if(search){renderSearch();search.addEventListener('input',e=>renderSearch(e.target.value));}

  const reactantSelect=document.getElementById('reactantSelect');
  const reagentSelect=document.getElementById('reagentSelect');
  const reactionOutput=document.getElementById('reactionOutput');
  const reactants=[...new Set(reactionExplorerData.map(x=>x.reactant))];
  const reagents=[...new Set(reactionExplorerData.map(x=>x.reagent))];
  if(reactantSelect&&reagentSelect){
    reactantSelect.innerHTML=reactants.map(x=>`<option>${x}</option>`).join('');
    reagentSelect.innerHTML=reagents.map(x=>`<option>${x}</option>`).join('');
    function renderReaction(){
      const hit=reactionExplorerData.find(x=>x.reactant===reactantSelect.value&&x.reagent===reagentSelect.value);
      reactionOutput.innerHTML=hit?`<strong>${hit.reactant} + ${hit.reagent} -> ${hit.product}</strong><br>${hit.note}`:'No common transformation for this pair. Try another reagent combination.';
    }
    reactantSelect.addEventListener('change',renderReaction);
    reagentSelect.addEventListener('change',renderReaction);
    renderReaction();
  }

  let quizIndex=0,quizScore=0,quizAnswered=0;
  const quizQuestion=document.getElementById('quizQuestion');
  const quizOptions=document.getElementById('quizOptions');
  const quizAnswer=document.getElementById('quizAnswer');
  const quizScoreEl=document.getElementById('quizScore');
  function renderQuiz(){
    if(!quizQuestion||!quizOptions) return;
    const item=quizData[quizIndex%quizData.length];
    quizQuestion.innerHTML=`<strong>Q.</strong> ${item.q}`;
    quizAnswer.textContent='';
    quizOptions.innerHTML=item.options.map((opt,i)=>`<button class="quiz-option" type="button" data-option="${i}">${opt}</button>`).join('');
    quizOptions.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>{
      if(quizOptions.dataset.locked==='true') return;
      quizOptions.dataset.locked='true';
      const choice=Number(btn.dataset.option);
      quizAnswered++;
      if(choice===item.answer){quizScore++;btn.classList.add('correct')}else{btn.classList.add('wrong');quizOptions.querySelector(`[data-option="${item.answer}"]`)?.classList.add('correct')}
      quizScoreEl.textContent=`Score ${quizScore}/${quizAnswered}`;
      quizAnswer.textContent=item.why;
    }));
    quizOptions.dataset.locked='false';
  }
  document.getElementById('nextQuizBtn')?.addEventListener('click',()=>{quizIndex++;renderQuiz()});
  renderQuiz();

  let flashIndex=0,flashBack=false;
  const flashcard=document.getElementById('flashcard');
  const flashText=document.getElementById('flashcardFront');
  const flashCount=document.getElementById('flashcardCount');
  function renderFlash(){
    if(!flashText) return;
    const item=flashcards[flashIndex%flashcards.length];
    flashText.textContent=flashBack?item.back:item.front;
    if(flashCount) flashCount.textContent=`${flashIndex+1}/${flashcards.length}`;
  }
  flashcard?.addEventListener('click',()=>{flashBack=!flashBack;renderFlash()});
  document.getElementById('nextFlashcard')?.addEventListener('click',()=>{flashIndex=(flashIndex+1)%flashcards.length;flashBack=false;renderFlash()});
  document.getElementById('prevFlashcard')?.addEventListener('click',()=>{flashIndex=(flashIndex-1+flashcards.length)%flashcards.length;flashBack=false;renderFlash()});
  renderFlash();

  const moleculeGrid=document.getElementById('moleculeGrid');
  if(moleculeGrid){
    moleculeGrid.innerHTML=moleculeCards.map(m=>`<div class="molecule-card"><div class="molecule-structure">${m.structure}</div><strong>${m.name}</strong><span>${m.note}</span></div>`).join('');
  }

  const mechanismSelect=document.getElementById('mechanismSelect');
  const mechanismFlow=document.getElementById('mechanismFlow');
  if(mechanismSelect&&mechanismFlow){
    mechanismSelect.innerHTML=Object.keys(mechanismData).map(x=>`<option>${x}</option>`).join('');
    function renderMechanism(){
      mechanismFlow.innerHTML=mechanismData[mechanismSelect.value].map((step,i)=>`<div class="mechanism-mini-step"><b>${i+1}</b><span>${step}</span></div>`).join('');
    }
    mechanismSelect.addEventListener('change',renderMechanism);
    renderMechanism();
  }

  const reagentBody=document.getElementById('reagentTableBody');
  function renderReagents(q=''){
    if(!reagentBody) return;
    const query=q.trim().toLowerCase();
    const rows=reagentRows.filter(x=>!query||`${x.r} ${x.u} ${x.n}`.toLowerCase().includes(query));
    reagentBody.innerHTML=rows.map(x=>`<tr><td>${x.r}</td><td>${x.u}</td><td>${x.n}</td></tr>`).join('');
  }
  document.getElementById('reagentSearch')?.addEventListener('input',e=>renderReagents(e.target.value));
  renderReagents();

  let interviewIndex=0;
  const interviewQuestion=document.getElementById('interviewQuestion');
  const interviewAnswer=document.getElementById('interviewAnswer');
  function renderInterview(){
    const item=interviewItems[interviewIndex%interviewItems.length];
    if(interviewQuestion) interviewQuestion.innerHTML=`<strong>Q.</strong> ${item.q}`;
    if(interviewAnswer){interviewAnswer.textContent=item.a;interviewAnswer.classList.remove('open')}
  }
  document.getElementById('showInterviewAnswer')?.addEventListener('click',()=>interviewAnswer?.classList.add('open'));
  document.getElementById('nextInterview')?.addEventListener('click',()=>{interviewIndex=(interviewIndex+1)%interviewItems.length;renderInterview()});
  renderInterview();

  const partCheckGrid=document.getElementById('partCheckGrid');
  const partKey='organo-console-progress';
  function getConsoleProgress(){try{return JSON.parse(localStorage.getItem(partKey)||'[]')}catch{return []}}
  function setConsoleProgress(items){try{localStorage.setItem(partKey,JSON.stringify(items))}catch{}}
  function renderConsoleProgress(){
    if(!partCheckGrid) return;
    const done=getConsoleProgress();
    const parts=studyTopics.slice(0,10);
    partCheckGrid.innerHTML=parts.map((p,i)=>`<button class="part-check ${done.includes(i)?'done':''}" type="button" data-part="${i}">${String(i+1).padStart(2,'0')} ${p.title.split(' ')[0]}</button>`).join('');
    partCheckGrid.querySelectorAll('.part-check').forEach(btn=>btn.addEventListener('click',()=>{
      const index=Number(btn.dataset.part);
      const next=getConsoleProgress();
      const pos=next.indexOf(index);
      if(pos>=0) next.splice(pos,1); else next.push(index);
      setConsoleProgress(next);
      renderConsoleProgress();
    }));
    const count=done.length;
    const percent=Math.round((count/10)*100);
    document.getElementById('studyProgressText').textContent=`${count}/10 Parts Done`;
    document.getElementById('studyProgressPercent').textContent=`${percent}%`;
    document.getElementById('studyProgressFill').style.width=`${percent}%`;
  }
  renderConsoleProgress();

  document.getElementById('printNotesBtn')?.addEventListener('click',()=>window.print());
  document.getElementById('togglePrintMode')?.addEventListener('click',()=>document.body.classList.toggle('clean-print-preview'));
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    renderInterviewPrepPage();
    initStudyConsole();
  });
}else{
  renderInterviewPrepPage();
  initStudyConsole();
}

