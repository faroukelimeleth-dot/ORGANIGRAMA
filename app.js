// ─── ESTADO ───
let CU = null; // current user
let currentView = 'tree';
let zoom = 1;

// ─── HELPERS ───
const $ = id => document.getElementById(id);
const inits = n => n.split(' ').filter((_,i)=>i<2).map(w=>w[0]).join('').toUpperCase();
const sk = id => 'goapp-' + id;

function saveData(id, fn, pr, mj) {
  try { localStorage.setItem(sk(id), JSON.stringify({fn,pr,mj})); } catch(e){}
}
function loadData(id) {
  try { return JSON.parse(localStorage.getItem(sk(id)) || 'null'); } catch(e){ return null; }
}
function getPerson(id) { return PEOPLE.find(p => p.id === id); }
function getChildren(parentId) { return PEOPLE.filter(p => p.parent === parentId); }
function hasData(id) {
  const d = loadData(id);
  return d && (d.fn || d.pr || d.mj);
}

// ─── INIT LOGIN DROPDOWN ───
function initLoginDropdown() {
  const s = $('sel-u');
  s.innerHTML = '<option value="">— Selecciona tu perfil —</option><option value="admin">Administrador</option>';
  const gr = document.createElement('optgroup');
  gr.label = '── Equipo ──';
  [...PEOPLE].sort((a,b)=>a.name.localeCompare(b.name)).forEach(p => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.name;
    gr.appendChild(o);
  });
  s.appendChild(gr);

  const fp = $('fil-proc');
  PROC_ORDER.forEach(pr => {
    const o = document.createElement('option');
    o.value = pr; o.textContent = pr;
    fp.appendChild(o);
  });
}

// ─── LOGIN / LOGOUT ───
function doLogin() {
  const u = $('sel-u').value;
  const p = $('inp-p').value;
  const err = $('lerr');
  if (!u) { err.textContent = 'Selecciona un usuario.'; return; }
  if (!p) { err.textContent = 'Ingresa tu contraseña.'; return; }
  const validPass = u === 'admin' ? ADMIN_PASS : (getPerson(u)?.pass || 'pass123');
  if (p !== validPass) { err.textContent = 'Contraseña incorrecta.'; return; }
  err.textContent = '';
  CU = { key: u, isAdmin: u === 'admin', person: u === 'admin' ? null : getPerson(u) };
  try { sessionStorage.setItem('go-session', JSON.stringify({key:u})); } catch(e){}
  showApp();
}

function doLogout() {
  CU = null;
  try { sessionStorage.removeItem('go-session'); } catch(e){}
  $('inp-p').value = '';
  $('sel-u').value = '';
  $('login').classList.add('active');
  $('app').classList.remove('active');
  ['v-tree','v-grid','v-pers'].forEach(id => $(id).classList.add('hidden'));
}

function restoreSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem('go-session') || 'null');
    if (s && s.key) {
      CU = { key: s.key, isAdmin: s.key === 'admin', person: s.key === 'admin' ? null : getPerson(s.key) };
      if (CU.person || CU.isAdmin) showApp();
    }
  } catch(e){}
}

// ─── MOSTRAR APP ───
function showApp() {
  $('login').classList.remove('active');
  $('app').classList.add('active');

  if (CU.isAdmin) {
    $('top-av').textContent = 'AD';
    $('top-av').style.background = '#6c8fff';
    $('top-nm').textContent = 'Administrador';
    $('tb-t').textContent = 'Vista general';
    $('view-tabs').style.display = 'flex';
    setView(currentView);
  } else {
    const p = CU.person;
    $('top-av').textContent = inits(p.name);
    $('top-av').style.background = TIER_COLOR[p.tier] || '#6c8fff';
    $('top-nm').textContent = p.name.split(' ').slice(0,2).join(' ');
    $('tb-t').textContent = 'Mi perfil';
    $('view-tabs').style.display = 'none';
    setView('pers');
    showPersonal(p);
  }
}

function setView(v) {
  ['v-tree','v-grid','v-pers'].forEach(id => $(id).classList.add('hidden'));
  if (v === 'tree') {
    $('v-tree').classList.remove('hidden');
    buildTree();
  } else if (v === 'grid') {
    $('v-grid').classList.remove('hidden');
    buildAdminGrid();
  } else if (v === 'pers') {
    $('v-pers').classList.remove('hidden');
  }
  document.querySelectorAll('.vt-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === v);
  });
  currentView = v;
}

// ─── VISTA PERSONAL ───
function showPersonal(p) {
  $('p-av').textContent = inits(p.name);
  $('p-av').style.background = TIER_BG[p.tier];
  $('p-av').style.color = TIER_COLOR[p.tier];
  $('p-nm').textContent = p.name;
  $('p-rl').textContent = p.role;
  const bg = $('p-bg');
  bg.textContent = p.proc + ' · ' + TIER_LABEL[p.tier];
  bg.style.background = TIER_BG[p.tier];
  bg.style.color = TIER_COLOR[p.tier];
  const d = loadData(p.id);
  $('p-fn').value = d?.fn || '';
  $('p-pr').value = d?.pr || '';
  $('p-mj').value = d?.mj || '';
}

function savePersonal() {
  saveData(CU.person.id, $('p-fn').value, $('p-pr').value, $('p-mj').value);
  const m = $('p-sm'); m.style.display = 'block';
  setTimeout(() => m.style.display = 'none', 2000);
}

// ─── ÁRBOL JERÁRQUICO ───
function buildTree() {
  const canvas = $('tree-canvas');
  canvas.innerHTML = '';
  const root = PEOPLE.find(p => p.parent === null);
  if (!root) return;
  canvas.appendChild(renderSubtree(root));
}

function renderSubtree(person) {
  const subtree = document.createElement('div');
  subtree.className = 'subtree';
  subtree.appendChild(makeTreeNode(person));

  const kids = getChildren(person.id);
  if (kids.length > 0) {
    const row = document.createElement('div');
    row.className = 'children-row ' + (kids.length > 1 ? 'multi' : 'single');
    kids.forEach(k => {
      const cell = document.createElement('div');
      cell.className = 'child-cell';
      cell.appendChild(renderSubtree(k));
      row.appendChild(cell);
    });
    subtree.appendChild(row);
    // Calcular extensión de la línea horizontal
    if (kids.length > 1) {
      // La línea va del centro del primer hijo al centro del último
      // Como los hijos tienen ancho variable, dejamos que CSS lo maneje con porcentajes
      requestAnimationFrame(() => {
        const cells = row.querySelectorAll(':scope > .child-cell');
        if (cells.length > 1) {
          const first = cells[0].getBoundingClientRect();
          const last = cells[cells.length - 1].getBoundingClientRect();
          const rowRect = row.getBoundingClientRect();
          const left = (first.left + first.width/2) - rowRect.left;
          const right = rowRect.right - (last.left + last.width/2);
          row.style.setProperty('--lx', left + 'px');
          row.style.setProperty('--rx', right + 'px');
        }
      });
    }
  }
  return subtree;
}

function makeTreeNode(p) {
  const node = document.createElement('div');
  node.className = 'tree-node tier-' + p.tier;
  if (hasData(p.id)) node.classList.add('has-data');
  const col = TIER_COLOR[p.tier];
  const bg = TIER_BG[p.tier];
  node.innerHTML = `
    <div class="tn-av" style="background:${bg};color:${col}">${inits(p.name)}</div>
    <div class="tn-name">${p.name}</div>
    <div class="tn-role">${p.role}</div>
    <div class="tn-status" style="color:${hasData(p.id)?'#34d399':'#4a5568'}">${hasData(p.id)?'● Completado':'○ Pendiente'}</div>
  `;
  node.onclick = () => openModal(p);
  return node;
}

// ─── MODAL ───
function openModal(p) {
  $('m-av').textContent = inits(p.name);
  $('m-av').style.background = TIER_BG[p.tier];
  $('m-av').style.color = TIER_COLOR[p.tier];
  $('m-nm').textContent = p.name;
  $('m-rl').textContent = p.role;
  const bg = $('m-bg');
  bg.textContent = p.proc + ' · ' + TIER_LABEL[p.tier];
  bg.style.background = TIER_BG[p.tier];
  bg.style.color = TIER_COLOR[p.tier];
  const d = loadData(p.id);
  $('m-fn').value = d?.fn || '';
  $('m-pr').value = d?.pr || '';
  $('m-mj').value = d?.mj || '';
  $('modal').classList.remove('hidden');
  $('modal').dataset.pid = p.id;
}
function closeModal() { $('modal').classList.add('hidden'); }
function saveModal() {
  const id = $('modal').dataset.pid;
  saveData(id, $('m-fn').value, $('m-pr').value, $('m-mj').value);
  const m = $('m-sm'); m.style.display = 'block';
  setTimeout(() => m.style.display = 'none', 1500);
  if (currentView === 'tree') buildTree();
  if (currentView === 'grid') buildAdminGrid();
}

// ─── VISTA LISTA / GRID ───
function buildAdminGrid() {
  const tree = $('admin-tree');
  tree.innerHTML = '';
  const grouped = {};
  PEOPLE.forEach(p => {
    if (!grouped[p.proc]) grouped[p.proc] = [];
    grouped[p.proc].push(p);
  });
  [...PROC_ORDER, ...Object.keys(grouped).filter(p => !PROC_ORDER.includes(p))].forEach(proc => {
    if (!grouped[proc]) return;
    const sec = document.createElement('div');
    sec.className = 'proc-sec';
    sec.setAttribute('data-proc', proc);
    const hd = document.createElement('div');
    hd.className = 'proc-title';
    const dot = document.createElement('span');
    dot.className = 'pdot';
    dot.style.background = PROC_COLOR[proc] || '#8892b0';
    hd.appendChild(dot);
    hd.appendChild(document.createTextNode(proc + ' (' + grouped[proc].length + ')'));
    sec.appendChild(hd);
    const grid = document.createElement('div');
    grid.className = 'cgrid';
    const tierOrder = {gg:0,dir:1,coord:2,ejec:3,aux:4};
    grouped[proc].sort((a,b) => (tierOrder[a.tier]||3) - (tierOrder[b.tier]||3))
      .forEach(p => grid.appendChild(makeGridCard(p)));
    sec.appendChild(grid);
    tree.appendChild(sec);
  });
}

function makeGridCard(p) {
  const d = document.createElement('div');
  d.className = 'pcard';
  d.id = 'gc-' + p.id;
  d.setAttribute('data-name', p.name.toLowerCase());
  d.setAttribute('data-role', p.role.toLowerCase());
  d.setAttribute('data-proc', p.proc);
  const dat = loadData(p.id);
  const has = dat && (dat.fn || dat.pr || dat.mj);
  const col = TIER_COLOR[p.tier];
  const bg = TIER_BG[p.tier];
  d.innerHTML = `
    <div class="pcard-t">
      <div class="pav" style="background:${bg};color:${col}">${inits(p.name)}</div>
      <div class="pname">${p.name}</div>
      <div class="prole">${p.role}</div>
      <div class="pstatus" style="color:${has?'#34d399':'#4a5568'}">${has?'● Perfil completado':'○ Sin completar'}</div>
    </div>
    <div class="pcard-b" id="gb-${p.id}">
      <div><div class="flbl">Funciones</div><textarea data-field="fn" data-id="${p.id}" placeholder="Funciones del cargo...">${dat?.fn||''}</textarea></div>
      <div><div class="flbl">Proceso que maneja</div><textarea data-field="pr" data-id="${p.id}" placeholder="Proceso a cargo...">${dat?.pr||''}</textarea></div>
      <div><div class="flbl">Mejora propuesta</div><textarea data-field="mj" data-id="${p.id}" placeholder="Oportunidad de mejora...">${dat?.mj||''}</textarea></div>
      <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px">
        <span class="smsg" id="gsm-${p.id}">✓ Guardado</span>
        <button class="sbtn" data-save="${p.id}">Guardar</button>
      </div>
    </div>
  `;
  d.querySelector('.pcard-t').onclick = (e) => { e.stopPropagation(); toggleGridCard(p.id); };
  return d;
}

function toggleGridCard(id) {
  const b = $('gb-' + id);
  const c = $('gc-' + id);
  const o = b.classList.contains('open');
  b.classList.toggle('open', !o);
  c.classList.toggle('exp', !o);
}

function saveGridCard(id) {
  const card = $('gc-' + id);
  const fn = card.querySelector('[data-field="fn"]').value;
  const pr = card.querySelector('[data-field="pr"]').value;
  const mj = card.querySelector('[data-field="mj"]').value;
  saveData(id, fn, pr, mj);
  const m = $('gsm-' + id);
  if (m) { m.style.display = 'block'; setTimeout(() => m.style.display = 'none', 1500); }
  const st = card.querySelector('.pstatus');
  if (fn || pr || mj) { st.style.color = '#34d399'; st.textContent = '● Perfil completado'; }
}

function filterGrid() {
  const q = $('srch').value.toLowerCase();
  const proc = $('fil-proc').value;
  document.querySelectorAll('.pcard').forEach(c => {
    const nm = c.getAttribute('data-name') || '';
    const rl = c.getAttribute('data-role') || '';
    const cp = c.getAttribute('data-proc') || '';
    const mQ = !q || nm.includes(q) || rl.includes(q);
    const mP = !proc || cp === proc;
    c.style.display = (mQ && mP) ? '' : 'none';
  });
  document.querySelectorAll('.proc-sec').forEach(s => {
    const visible = [...s.querySelectorAll('.pcard')].some(c => c.style.display !== 'none');
    s.style.display = visible ? '' : 'none';
  });
}

// ─── ZOOM DEL ÁRBOL ───
function setZoom(z) {
  zoom = Math.max(0.4, Math.min(1.6, z));
  $('tree-canvas').style.transform = `scale(${zoom})`;
  $('zoom-lbl').textContent = Math.round(zoom * 100) + '%';
}

// ─── EVENT LISTENERS ───
function attachEvents() {
  $('btn-login').onclick = doLogin;
  $('inp-p').onkeydown = e => { if (e.key === 'Enter') doLogin(); };
  $('btn-logout').onclick = doLogout;
  $('btn-save-p').onclick = savePersonal;
  $('btn-save-m').onclick = saveModal;
  $('m-close').onclick = closeModal;
  $('modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

  document.querySelectorAll('.vt-btn').forEach(b => {
    b.onclick = () => setView(b.dataset.view);
  });

  $('srch').oninput = filterGrid;
  $('fil-proc').onchange = filterGrid;

  $('zoom-in').onclick = () => setZoom(zoom + 0.1);
  $('zoom-out').onclick = () => setZoom(zoom - 0.1);
  $('zoom-reset').onclick = () => setZoom(1);

  // Event delegation para botones save de la grid
  $('admin-tree').addEventListener('click', e => {
    const btn = e.target.closest('[data-save]');
    if (btn) { e.stopPropagation(); saveGridCard(btn.dataset.save); }
  });
  $('admin-tree').addEventListener('change', e => {
    const ta = e.target.closest('[data-field]');
    if (ta) saveGridCard(ta.dataset.id);
  });
}

// ─── INIT ───
initLoginDropdown();
attachEvents();
restoreSession();
