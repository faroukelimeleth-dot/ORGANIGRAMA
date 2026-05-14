// ─── DATOS DEL EQUIPO ───
// Para modificar contraseñas individuales, edita el campo "pass" de cada persona
// Por defecto: admin → admin123, todos los demás → pass123

const PEOPLE = [
  // GERENCIA
  {id:'gg',name:'Pedro José Ochoa Ariza',role:'Gerente General',proc:'Gerencia General',tier:'gg',parent:null,pass:'pass123'},

  // DIRECCIÓN GENERAL
  {id:'dg',name:'Farouk Elimeleth Flor Cárdenas',role:'Director General',proc:'Dirección General',tier:'dir',parent:'gg',pass:'pass123'},

  // DIRECTORES (reportan a Dir. General)
  {id:'df',name:'Jenifer Cristina Ochoa Quintero',role:'Directora Financiera, Adm. y Contable',proc:'Contable, Adm. y Financiero',tier:'dir',parent:'dg',pass:'pass123'},
  {id:'do',name:'Gladys Eugenia Olarte Miranda',role:'Directora de Operaciones',proc:'Operaciones',tier:'dir',parent:'dg',pass:'pass123'},
  {id:'dc',name:'José Rubén Tavera Beltrán',role:'Director Comercial',proc:'Comercial',tier:'dir',parent:'dg',pass:'pass123'},
  {id:'dco',name:'Ricardo Mario Meza Valencia',role:'Director de Consultoría',proc:'Consultoría',tier:'dir',parent:'dg',pass:'pass123'},
  {id:'cm',name:'Luisa Fernanda Velázquez Corredor',role:'Community Manager',proc:'Comunicaciones',tier:'dir',parent:'dg',pass:'pass123'},

  // FINANCIERO - Coordinadores
  {id:'ct',name:'Mayra Alejandra Ardila Chaparro',role:'Coordinadora de Tesorería',proc:'Contable, Adm. y Financiero',tier:'coord',parent:'df',pass:'pass123'},
  {id:'cs',name:'Astrid Camila Cárdenas Avellaneda',role:'Coordinadora de Sistematización SIIGO',proc:'Contable, Adm. y Financiero',tier:'coord',parent:'df',pass:'pass123'},
  {id:'cth',name:'Karen Jimena Murillo Saldaña',role:'Coordinadora de Talento Humano',proc:'Contable, Adm. y Financiero',tier:'coord',parent:'df',pass:'pass123'},
  // FINANCIERO - Auxiliares
  {id:'ax-sist',name:'José David Gomez Arevalo',role:'Auxiliar de Sistematización',proc:'Contable, Adm. y Financiero',tier:'aux',parent:'cs',pass:'pass123'},
  {id:'ax-c1',name:'Slendy Salamanca Maldonado',role:'Auxiliar de Conciliación',proc:'Contable, Adm. y Financiero',tier:'aux',parent:'ct',pass:'pass123'},
  {id:'ax-c2',name:'Stefani Miranda Avellaneda',role:'Auxiliar de Conciliación',proc:'Contable, Adm. y Financiero',tier:'aux',parent:'ct',pass:'pass123'},
  {id:'as-ssgt',name:'Lisseth Mayerly',role:'Asesor SSGT',proc:'Contable, Adm. y Financiero',tier:'aux',parent:'df',pass:'pass123'},
  {id:'as-trib',name:'Omar Darío',role:'Asesor Tributario',proc:'Contable, Adm. y Financiero',tier:'aux',parent:'df',pass:'pass123'},

  // OPERACIONES - Coordinadores
  {id:'cl',name:'Marlon Stik Medina Guarín',role:'Coordinador Logístico',proc:'Operaciones',tier:'coord',parent:'do',pass:'pass123'},
  {id:'cp',name:'Angela Solanyei Lopez Leguizamon',role:'Coordinadora de Programación',proc:'Operaciones',tier:'coord',parent:'do',pass:'pass123'},
  {id:'cb-st',name:'Wendy Nikol Vargas Gomez',role:'Coordinadora Bodega Santander',proc:'Operaciones',tier:'coord',parent:'do',pass:'pass123'},
  {id:'cb-bq',name:'Aseneth Arevalo Melendez',role:'Coordinadora Bodega Barranquilla',proc:'Operaciones',tier:'coord',parent:'do',pass:'pass123'},
  // OPERACIONES - Auxiliares
  {id:'ax-prog',name:'Daniela Cordero Molina',role:'Auxiliar de Programación',proc:'Operaciones',tier:'aux',parent:'cp',pass:'pass123'},
  {id:'ax-bst',name:'Santiago Tarazona Cala',role:'Auxiliar Bodega Santander',proc:'Operaciones',tier:'aux',parent:'cb-st',pass:'pass123'},
  {id:'ax-bbq',name:'Diana Marcela Reyes Berrio',role:'Auxiliar Bodega Barranquilla',proc:'Operaciones',tier:'aux',parent:'cb-bq',pass:'pass123'},

  // COMERCIAL - Ejecutivos
  {id:'ec-mb',name:'Zoe Lorena Rey Olarte',role:'Ejecutivo Comercial Magdalena y Bolívar',proc:'Comercial',tier:'ejec',parent:'dc',pass:'pass123'},
  {id:'ec-cp',name:'Uriel Sepúlveda Celis',role:'Ejecutivo Comercial Caquetá y Putumayo',proc:'Comercial',tier:'ejec',parent:'dc',pass:'pass123'},
  {id:'ec-ns',name:'Flor Stella Florez Vargas',role:'Ejecutivo Comercial Norte de Santander',proc:'Comercial',tier:'ejec',parent:'dc',pass:'pass123'},
  {id:'ec-st',name:'Miguel Ascencio Calderón',role:'Ejecutivo Comercial Santander',proc:'Comercial',tier:'ejec',parent:'dc',pass:'pass123'},
  {id:'ec-cs',name:'Carlos Alberto Reyes Rosillo',role:'Ejecutivo Comercial Córdoba y Sucre',proc:'Comercial',tier:'ejec',parent:'dc',pass:'pass123'},
  {id:'ec-ag',name:'Ivan Alberto Calderón Rendón',role:'Ejecutivo Comercial Atlántico y La Guajira',proc:'Comercial',tier:'ejec',parent:'dc',pass:'pass123'},

  // CONSULTORÍA - Especialistas
  {id:'esp1',name:'Yuly Paola Ramírez Penagos',role:'Especialista de Consultoría',proc:'Consultoría',tier:'ejec',parent:'dco',pass:'pass123'},
  {id:'esp2',name:'Jorge Eduardo Soto Ortiz',role:'Especialista de Consultoría',proc:'Consultoría',tier:'ejec',parent:'dco',pass:'pass123'},

  // COMUNICACIONES
  {id:'ax-cm',name:'Sami Vanessa Murillo',role:'Auxiliar Community Manager',proc:'Comunicaciones',tier:'aux',parent:'cm',pass:'pass123'},

  // DISEÑO (reporta a Dir. General)
  {id:'dg-graf',name:'Juan Carlos Pedreira Fernandez',role:'Diseñador Gráfico',proc:'Diseño Gráfico',tier:'ejec',parent:'dg',pass:'pass123'},
];

const ADMIN_PASS = 'admin123';

// Colores por nivel jerárquico
const TIER_COLOR = {
  gg:'#6c8fff',
  dir:'#a78bfa',
  coord:'#34d399',
  ejec:'#fb923c',
  aux:'#8892b0'
};
const TIER_BG = {
  gg:'rgba(108,143,255,.18)',
  dir:'rgba(167,139,250,.18)',
  coord:'rgba(52,211,153,.16)',
  ejec:'rgba(251,146,60,.16)',
  aux:'rgba(136,146,176,.14)'
};
const TIER_LABEL = {
  gg:'Gerencia',
  dir:'Dirección',
  coord:'Coordinación',
  ejec:'Ejecutivo/Especialista',
  aux:'Auxiliar/Asesor'
};

// Colores por proceso (para vista lista)
const PROC_COLOR = {
  'Gerencia General':'#6c8fff',
  'Dirección General':'#a78bfa',
  'Comercial':'#34d399',
  'Operaciones':'#fb923c',
  'Contable, Adm. y Financiero':'#fbbf24',
  'Consultoría':'#f87171',
  'Comunicaciones':'#38bdf8',
  'Diseño Gráfico':'#e879f9'
};

// Orden de procesos
const PROC_ORDER = [
  'Gerencia General',
  'Dirección General',
  'Comercial',
  'Operaciones',
  'Contable, Adm. y Financiero',
  'Consultoría',
  'Comunicaciones',
  'Diseño Gráfico'
];
