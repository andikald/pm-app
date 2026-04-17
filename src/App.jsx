import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// DATABASE LAYER (in-memory for artifact env)
// ═══════════════════════════════════════════════════════════════
const STORE = {};
const DB = {
  get: (k) => { try { return STORE[k] ? JSON.parse(JSON.stringify(STORE[k])) : null; } catch { return null; } },
  set: (k, v) => { try { STORE[k] = JSON.parse(JSON.stringify(v)); } catch {} },
  del: (k) => { try { delete STORE[k]; } catch {} },
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const today = new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate()+n); return r.toISOString().slice(0,10); };
const T = today.toISOString().slice(0,10);

// ═══════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════
const USERS_SEED = [
  { id:1, username:"admin", password:"admin123", name:"Administrator", role:"admin", avatar:"AD" },
  { id:2, username:"pm", password:"pm123", name:"Project Manager", role:"pm", avatar:"PM" },
  { id:3, username:"viewer", password:"view123", name:"Viewer", role:"viewer", avatar:"VW" },
];

const ENGINEERS_SEED = [
  { id:1, name:"Itho", role:"Programmer", dept:"Programmer", availability:80, kpi:85, hoursLogged:160, status:"active", phone:"6281234567890", email:"" },
  { id:2, name:"Erick", role:"Programmer", dept:"Programmer", availability:70, kpi:82, hoursLogged:148, status:"active", phone:"6281234567891", email:"" },
  { id:3, name:"Farhan", role:"Programmer", dept:"Programmer", availability:90, kpi:78, hoursLogged:132, status:"active", phone:"", email:"" },
  { id:4, name:"Gatot", role:"Electrical Engineer", dept:"Electrical", availability:60, kpi:88, hoursLogged:176, status:"active", phone:"", email:"" },
  { id:5, name:"Nana", role:"Electrical Engineer", dept:"Electrical", availability:75, kpi:80, hoursLogged:152, status:"active", phone:"", email:"" },
  { id:6, name:"Putra", role:"Electrical Engineer", dept:"Electrical", availability:50, kpi:74, hoursLogged:144, status:"active", phone:"", email:"" },
  { id:7, name:"Fadel", role:"Electrical Engineer", dept:"Electrical", availability:85, kpi:79, hoursLogged:128, status:"active", phone:"", email:"" },
  { id:8, name:"Gaza", role:"Electrical Engineer", dept:"Electrical", availability:100, kpi:72, hoursLogged:112, status:"active", phone:"", email:"" },
  { id:9, name:"Tomi", role:"Electrical Engineer", dept:"Electrical", availability:60, kpi:83, hoursLogged:168, status:"active", phone:"", email:"" },
  { id:10, name:"Luthfi", role:"Electrical Engineer", dept:"Electrical", availability:40, kpi:77, hoursLogged:136, status:"active", phone:"", email:"" },
  { id:11, name:"Samuel", role:"Electrical Engineer", dept:"Electrical", availability:90, kpi:81, hoursLogged:124, status:"active", phone:"", email:"" },
  { id:12, name:"Datuk", role:"Mechanical Engineer", dept:"Mechanical", availability:70, kpi:86, hoursLogged:172, status:"active", phone:"", email:"" },
  { id:13, name:"Saad", role:"Mechanical Engineer", dept:"Mechanical", availability:80, kpi:84, hoursLogged:160, status:"active", phone:"", email:"" },
  { id:14, name:"Eri S", role:"Mechanical Engineer", dept:"Mechanical", availability:65, kpi:79, hoursLogged:148, status:"active", phone:"", email:"" },
  { id:15, name:"Candra", role:"Mechanical Engineer", dept:"Mechanical", availability:55, kpi:76, hoursLogged:140, status:"active", phone:"", email:"" },
  { id:16, name:"Ridwan", role:"Mechanical Engineer", dept:"Mechanical", availability:75, kpi:82, hoursLogged:156, status:"active", phone:"", email:"" },
  { id:17, name:"Dede", role:"Mechanical Engineer", dept:"Mechanical", availability:80, kpi:78, hoursLogged:132, status:"active", phone:"", email:"" },
  { id:18, name:"Rio", role:"Mechanical Engineer", dept:"Mechanical", availability:90, kpi:80, hoursLogged:120, status:"active", phone:"", email:"" },
  { id:19, name:"Raju", role:"Mechatronic Engineer", dept:"Mechatronic", availability:60, kpi:88, hoursLogged:176, status:"active", phone:"", email:"" },
  { id:20, name:"Ade Irawan Saputra", role:"Mechanical Engineer", dept:"Mechanical", availability:70, kpi:83, hoursLogged:164, status:"active", phone:"", email:"" },
  { id:21, name:"Ahmad", role:"Mechanical Engineer", dept:"Mechanical", availability:85, kpi:75, hoursLogged:116, status:"active", phone:"", email:"" },
  { id:22, name:"Hanif Birru", role:"HSE Officer", dept:"HSE", availability:100, kpi:90, hoursLogged:144, status:"active", phone:"", email:"" },
  { id:23, name:"Alpa", role:"HSE Officer", dept:"HSE", availability:100, kpi:87, hoursLogged:136, status:"active", phone:"", email:"" },
  { id:24, name:"Julius", role:"HSE Officer", dept:"HSE", availability:100, kpi:85, hoursLogged:128, status:"active", phone:"", email:"" },
  { id:25, name:"Hadiman", role:"Designer", dept:"Design", availability:80, kpi:88, hoursLogged:168, status:"active", phone:"", email:"" },
  { id:26, name:"Yahya", role:"Designer", dept:"Design", availability:75, kpi:84, hoursLogged:152, status:"active", phone:"", email:"" },
  { id:27, name:"Andi Triyono", role:"Production", dept:"Production", availability:60, kpi:82, hoursLogged:176, status:"active", phone:"", email:"" },
  { id:28, name:"Bayu", role:"Production", dept:"Production", availability:70, kpi:79, hoursLogged:160, status:"active", phone:"", email:"" },
  { id:29, name:"Dedi", role:"Production", dept:"Production", availability:75, kpi:77, hoursLogged:148, status:"active", phone:"", email:"" },
  { id:30, name:"Satrio", role:"Production", dept:"Production", availability:80, kpi:80, hoursLogged:136, status:"active", phone:"", email:"" },
  { id:31, name:"Tanjung", role:"Production", dept:"Production", availability:85, kpi:76, hoursLogged:124, status:"active", phone:"", email:"" },
  { id:32, name:"Duta", role:"Production", dept:"Production", availability:90, kpi:78, hoursLogged:112, status:"active", phone:"", email:"" },
  { id:33, name:"Saifunuri", role:"Production", dept:"Production", availability:70, kpi:81, hoursLogged:144, status:"active", phone:"", email:"" },
  { id:34, name:"Mahdumi", role:"Production", dept:"Production", availability:75, kpi:83, hoursLogged:156, status:"active", phone:"", email:"" },
];

const PROJECTS_SEED = [
  { id:1, name:"Garudafood - List Consumable", customer:"Garudafood", phase:"Production", status:"On Track", priority:"Medium", startDate:addDays(T,-10), deadline:addDays(T,20), pic:"Gatot", team:[1,4], notes:"List consumable items - procurement phase", budget:50000000, spent:15000000, mandays:30, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:2, name:"Diamond - Puyo & Jungle Juice", customer:"Diamond", phase:"Installation", status:"On Track", priority:"High", startDate:addDays(T,-15), deadline:addDays(T,30), pic:"Itho", team:[1,2], notes:"Follow Up Hasil Pengerjaan. BA process", budget:150000000, spent:80000000, mandays:45, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:3, name:"Pepsico - Prepare Pengiriman", customer:"Pepsico", phase:"Ready to Delivery", status:"At Risk", priority:"Critical", startDate:addDays(T,-5), deadline:addDays(T,7), pic:"Erick", team:[2,6], notes:"Senin team datang. Selasa depan kirim.", budget:200000000, spent:170000000, mandays:20, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:4, name:"Cuzzon - Waiting Jig Customer", customer:"Cuzzon", phase:"Planning", status:"On Hold", priority:"Medium", startDate:addDays(T,-20), deadline:addDays(T,60), pic:"Datuk", team:[12], notes:"Menunggu Jig customer", budget:80000000, spent:30000000, mandays:60, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:5, name:"Torabika - Z Cleated Belt", customer:"Torabika", phase:"Commissioning", status:"At Risk", priority:"High", startDate:addDays(T,-8), deadline:addDays(T,5), pic:"Ridwan", team:[16,18], notes:"Negosiasi dan setting belt", budget:120000000, spent:95000000, mandays:25, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:6, name:"Beng Beng Ball - Delivery", customer:"Beng Beng", phase:"Ready to Delivery", status:"On Track", priority:"High", startDate:addDays(T,-12), deadline:addDays(T,4), pic:"Saad", team:[13,14], notes:"Sudah dibongkar - Prepare to delivery", budget:90000000, spent:75000000, mandays:18, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:7, name:"Modifikasi Jalur GB 7", customer:"Internal", phase:"Production", status:"On Track", priority:"Medium", startDate:addDays(T,-3), deadline:addDays(T,10), pic:"Candra", team:[15,17], notes:"On process modifikasi", budget:60000000, spent:20000000, mandays:15, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
  { id:8, name:"Unilever Savory - Pengerjaan", customer:"Unilever", phase:"Commissioning", status:"At Risk", priority:"Critical", startDate:addDays(T,-20), deadline:addDays(T,15), pic:"Raju", team:[19,4,5], notes:"Ada ketidaksesuaian EOL, LINE B", budget:350000000, spent:280000000, mandays:55, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], ganttItems:[], scurveData:[] },
];

const VEHICLES_SEED = [
  { id:1, type:"Grandmax", plate:"B 1234 FJT", color:"Putih", year:2020, status:"available", lastMaintenance:addDays(T,-30), nextMaintenance:addDays(T,60), odometerKm:45000, notes:"Kondisi baik" },
  { id:2, type:"Grandmax", plate:"B 5678 FJT", color:"Silver", year:2019, status:"available", lastMaintenance:addDays(T,-15), nextMaintenance:addDays(T,75), odometerKm:62000, notes:"Ban depan perlu cek" },
  { id:3, type:"Truck", plate:"B 9012 FJT", color:"Kuning", year:2018, status:"available", lastMaintenance:addDays(T,-45), nextMaintenance:addDays(T,15), odometerKm:98000, notes:"AC kurang dingin" },
  { id:4, type:"Truck", plate:"B 3456 FJT", color:"Merah", year:2021, status:"maintenance", lastMaintenance:T, nextMaintenance:addDays(T,90), odometerKm:32000, notes:"Sedang service rutin" },
];

const ROUTES_SEED = [
  { id:1, date:T, vehicleId:1, driver:"Andi Triyono", destination:"PT Garudafood Cikarang", activities:["Pengiriman spare part"], team:[27,4], notes:"Berangkat pukul 07:00", status:"completed", returnTime:"16:00", kmStart:45000, kmEnd:45087 },
  { id:2, date:T, vehicleId:3, driver:"Bayu", destination:"PT Unilever Cikarang", activities:["Instalasi conveyor line B"], team:[28,19,5], notes:"Bawa toolkit lengkap", status:"in_progress", returnTime:"", kmStart:98000, kmEnd:null },
];

const COMPLETED_PROJECTS_SEED = [
  { id:101, name:"Indofood - Palletizer Robot", customer:"Indofood", phase:"Completed", status:"Completed", priority:"High", startDate:addDays(T,-120), deadline:addDays(T,-30), completedDate:addDays(T,-35), pic:"Raju", team:[19,4,1], notes:"Selesai tepat waktu", budget:450000000, spent:420000000, mandays:90, milestones:[], dailyReports:[], documents:[], wbsItems:[], materials:[], afterSalesNotes:"", warrantyEnd:addDays(T,335) },
];

function initDB() {
  if(!DB.get("users")) DB.set("users", USERS_SEED);
  if(!DB.get("engineers")) DB.set("engineers", ENGINEERS_SEED);
  if(!DB.get("projects")) DB.set("projects", PROJECTS_SEED);
  if(!DB.get("vehicles")) DB.set("vehicles", VEHICLES_SEED);
  if(!DB.get("routes")) DB.set("routes", ROUTES_SEED);
  if(!DB.get("completed_projects")) DB.set("completed_projects", COMPLETED_PROJECTS_SEED);
  if(!DB.get("timesheets")) DB.set("timesheets", []);
  if(!DB.get("kpi_records")) DB.set("kpi_records", []);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS & CONSTANTS
// ═══════════════════════════════════════════════════════════════
const PHASES = ["Planning","Production","Ready to Delivery","Installation","Commissioning","Completed"];
const phaseColor = {"Planning":"#3b82f6","Production":"#8b5cf6","Ready to Delivery":"#f59e0b","Installation":"#06b6d4","Commissioning":"#ec4899","Completed":"#10b981"};
const statusColor = {"On Track":"#10b981","At Risk":"#f59e0b","Delayed":"#ef4444","On Hold":"#6b7280","Completed":"#10b981"};
const priorityColor = {"Critical":"#ef4444","High":"#f59e0b","Medium":"#3b82f6","Low":"#6b7280"};
const kpiColor = (v) => v>=85?"#10b981":v>=70?"#f59e0b":"#ef4444";
const daysLeft = (d) => Math.ceil((new Date(d)-new Date())/86400000);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fmtIDR = (v) => v!=null ? "Rp "+new Intl.NumberFormat("id-ID",{notation:"compact",maximumFractionDigits:1}).format(v) : "—";
const calcProjectProgress = (proj) => {
  const ms = proj.milestones||[];
  if(ms.length===0) return {plan:proj.planProgress||0, actual:proj.progress||0};
  return { plan:Math.round(ms.reduce((a,m)=>a+(m.planProgress||0),0)/ms.length), actual:Math.round(ms.reduce((a,m)=>a+(m.actualProgress||0),0)/ms.length) };
};
const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
const DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

// ═══════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════
function ProgressBar({ value, color="#38bdf8", h=8 }) {
  return (
    <div style={{background:"#0f2744",borderRadius:99,height:h,overflow:"hidden",flex:1}}>
      <div style={{width:`${Math.min(Math.max(value||0,0),100)}%`,height:"100%",background:color,borderRadius:99,transition:"width .5s"}}/>
    </div>
  );
}
function Badge({ label, color, small }) {
  return <span style={{fontSize:small?8:9,padding:small?"1px 6px":"2px 8px",borderRadius:99,background:color+"22",color,letterSpacing:1,fontWeight:700,whiteSpace:"nowrap",border:`1px solid ${color}44`}}>{label}</span>;
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"linear-gradient(135deg,#0d2137,#0a1628)",border:"1px solid #1e3a5f",borderRadius:20,padding:28,width:"100%",maxWidth:wide?960:600,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 0 80px #38bdf820",boxSizing:"border-box"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:13,color:"#38bdf8",fontWeight:700,letterSpacing:2}}>{title}</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function GaugeRing({ value, size=70 }) {
  const r=size/2-7, circ=2*Math.PI*r, color=kpiColor(value);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a5f" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={circ-(value/100)*circ} strokeLinecap="round"/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" style={{fill:color,fontSize:13,fontWeight:700,fontFamily:"inherit",transform:"rotate(90deg)",transformOrigin:`${size/2}px ${size/2}px`}}>{value}%</text>
    </svg>
  );
}
function PhaseBadge({ phase }) {
  const c = phaseColor[phase]||"#64748b";
  return <span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:c+"22",color:c,fontWeight:700,letterSpacing:1,border:`1px solid ${c}44`}}>{phase}</span>;
}

// FJT Logo using uploaded image
function FJTLogo({ size=36 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:size,height:size,flexShrink:0,borderRadius:8,overflow:"hidden",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <img src="https://i.imgur.com/placeholder.png" alt="FJT" style={{display:"none"}}/>
        <svg viewBox="0 0 60 72" style={{width:"100%",height:"100%"}}>
          <rect width="60" height="72" rx="8" fill="#111"/>
          {/* F letter left bracket */}
          <rect x="8" y="12" width="6" height="36" rx="2" fill="#cc0000"/>
          <rect x="8" y="12" width="20" height="6" rx="2" fill="#cc0000"/>
          <rect x="8" y="29" width="16" height="5" rx="2" fill="#cc0000"/>
          {/* J letter right */}
          <rect x="30" y="12" width="20" height="6" rx="2" fill="#cc0000"/>
          <rect x="40" y="12" width="6" height="30" rx="2" fill="#cc0000"/>
          <rect x="24" y="38" width="22" height="6" rx="2" fill="#cc0000"/>
          <rect x="24" y="38" width="6" height="10" rx="2" fill="#cc0000"/>
          {/* T at top center overlap */}
          <rect x="18" y="8" width="24" height="5" rx="2" fill="#cc0000"/>
          <rect x="28" y="8" width="4" height="14" rx="2" fill="#cc0000"/>
          {/* FJT text */}
          <text x="30" y="67" textAnchor="middle" fill="#cc0000" fontSize="9" fontWeight="700" fontFamily="Georgia,serif" fontStyle="italic">FJT</text>
        </svg>
      </div>
      <div>
        <div style={{color:"#fff",fontWeight:800,fontSize:13,letterSpacing:.5,fontFamily:"Georgia,serif"}}>PT. Frensiand Jaya Teknik</div>
        <div style={{color:"#94a3b8",fontSize:8,letterSpacing:.5}}>Conveyor · Palletizing · Automation</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const users = DB.get("users")||[];
      const user = users.find(x=>x.username===u&&x.password===p);
      if(user) onLogin(user); else { setErr("Username atau password salah"); setLoading(false); }
    }, 500);
  };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060e1a 0%,#0a1628 50%,#060e1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 20% 50%,#cc000008,transparent 60%),radial-gradient(ellipse at 80% 20%,#38bdf808,transparent 50%)"}}/>
      <div style={{background:"linear-gradient(135deg,#0d2137,#0a1628)",border:"1px solid #1e3a5f",borderRadius:24,padding:48,width:380,boxSizing:"border-box",boxShadow:"0 0 80px #38bdf815,0 0 150px #cc000010",position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <div style={{background:"#0a1628",border:"1px solid #cc000033",borderRadius:16,padding:"12px 20px"}}>
              <FJTLogo size={48}/>
            </div>
          </div>
          <div style={{color:"#f0f9ff",fontSize:16,fontWeight:700,letterSpacing:2,marginBottom:4}}>PROJECT MANAGEMENT SYSTEM</div>
          <div style={{color:"#38bdf8",fontSize:10,letterSpacing:3}}>v7.0 ENTERPRISE</div>
        </div>
        {err&&<div style={{background:"#ef444422",border:"1px solid #ef444466",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#ef4444",marginBottom:16,textAlign:"center"}}>{err}</div>}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:6}}>USERNAME</div>
          <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()} style={{width:"100%",background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="admin / pm / viewer"/>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:6}}>PASSWORD</div>
          <input type="password" value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()} style={{width:"100%",background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="••••••••"/>
        </div>
        <button onClick={handle} disabled={loading} style={{width:"100%",background:loading?"#1e3a5f":"linear-gradient(135deg,#cc0000,#991111)",border:"none",color:"#fff",borderRadius:10,padding:"12px 0",fontSize:13,fontFamily:"inherit",cursor:loading?"not-allowed":"pointer",letterSpacing:2,fontWeight:700,boxShadow:"0 0 20px #cc000030"}}>
          {loading?"AUTHENTICATING...":"LOGIN →"}
        </button>
        <div style={{marginTop:16,fontSize:10,color:"#334155",textAlign:"center"}}>admin:admin123 · pm:pm123 · viewer:view123</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════════════════════════════
const NAV_GROUPS = [
  { group:"OVERVIEW", items:[
    {id:"dashboard",label:"Dashboard",icon:"⬡"},
  ]},
  { group:"PROYEK", items:[
    {id:"projects",label:"Projects",icon:"◈"},
    {id:"gantt",label:"Gantt Chart",icon:"▦"},
    {id:"delivery",label:"Delivery & Material",icon:"📦"},
    {id:"timeline",label:"Timeline",icon:"⊞"},
    {id:"completed",label:"Completed",icon:"✓"},
  ]},
  { group:"MANPOWER", items:[
    {id:"manpower",label:"Manpower",icon:"◉"},
    {id:"calendar",label:"Kalender Engineer",icon:"📅"},
    {id:"timesheet",label:"Timesheet",icon:"⏱"},
    {id:"workhours",label:"Input Jam Kerja",icon:"🕐"},
    {id:"mpactivity",label:"Aktivitas Manpower",icon:"📋"},
  ]},
  { group:"OPERASIONAL", items:[
    {id:"route",label:"Route",icon:"🚐"},
    {id:"kpi",label:"KPI Project",icon:"◎"},
  ]},
];

function Sidebar({ tab, setTab, currentUser, onLogout, projects, engineers }) {
  const canSeeAdmin = currentUser.role === "admin";
  const allGroups = canSeeAdmin ? [...NAV_GROUPS, {group:"ADMIN",items:[{id:"users",label:"Users",icon:"⊛"}]}] : NAV_GROUPS;
  return (
    <div style={{width:200,background:"linear-gradient(180deg,#08111f,#060e1a)",borderRight:"1px solid #1e3a5f",display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",position:"sticky",top:0,overflowY:"auto"}}>
      <div style={{padding:"16px 14px",borderBottom:"1px solid #1e3a5f"}}>
        <FJTLogo size={32}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {allGroups.map(g=>(
          <div key={g.group}>
            <div style={{fontSize:8,color:"#334155",letterSpacing:2,padding:"10px 14px 4px",fontWeight:700}}>{g.group}</div>
            {g.items.map(item=>(
              <button key={item.id} onClick={()=>setTab(item.id)} style={{
                width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:tab===item.id?"linear-gradient(90deg,#cc000022,transparent)":"transparent",
                border:"none",borderLeft:tab===item.id?"2px solid #cc0000":"2px solid transparent",
                color:tab===item.id?"#e2e8f0":"#475569",fontSize:11,fontFamily:"inherit",cursor:"pointer",textAlign:"left",transition:"all .15s",
                fontWeight:tab===item.id?700:400,
              }}>
                <span style={{fontSize:13}}>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{padding:"12px 14px",borderTop:"1px solid #1e3a5f"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#cc0000,#991111)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{currentUser.avatar}</div>
          <div style={{overflow:"hidden"}}>
            <div style={{fontSize:10,color:"#e2e8f0",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentUser.name}</div>
            <div style={{fontSize:8,color:"#cc0000",letterSpacing:1}}>{currentUser.role.toUpperCase()}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{width:"100%",background:"#ef444420",border:"1px solid #ef444466",color:"#ef4444",borderRadius:6,padding:"6px 0",fontSize:9,fontFamily:"inherit",cursor:"pointer",letterSpacing:1}}>LOGOUT</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GANTT CHART TAB
// ═══════════════════════════════════════════════════════════════
function GanttTab({ projects, setProjects, card, inp, btn, btnSm, canEdit, showToast }) {
  const [view, setView] = useState("weekly"); // daily/weekly/monthly
  const [selProjectId, setSelProjectId] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({projectId:"",name:"",startDate:T,endDate:addDays(T,7),progress:0,type:"task",phase:"Planning",assignee:""});
  const [editId, setEditId] = useState(null);

  const allGanttItems = projects.flatMap(p=>(p.ganttItems||[]).map(g=>({...g,projectId:p.id,projectName:p.name})));
  const filtered = selProjectId==="all" ? allGanttItems : allGanttItems.filter(g=>g.projectId===Number(selProjectId)||g.projectId===selProjectId);

  const viewDays = view==="daily"?30:view==="weekly"?84:365;
  const startRef = new Date(); startRef.setDate(startRef.getDate()-7);
  const cols = [];
  if(view==="daily") { for(let i=0;i<30;i++) { const d=new Date(startRef); d.setDate(d.getDate()+i); cols.push(d.toISOString().slice(0,10)); } }
  else if(view==="weekly") { for(let i=0;i<12;i++) { const d=new Date(startRef); d.setDate(d.getDate()+i*7); cols.push(d.toISOString().slice(0,10)); } }
  else { for(let i=0;i<12;i++) { const d=new Date(startRef); d.setMonth(d.getMonth()+i); cols.push(d.toISOString().slice(0,10)); } }

  const totalDays = viewDays;
  const getBarStyle = (item) => {
    const start = new Date(item.startDate); const end = new Date(item.endDate);
    const refStart = startRef;
    const left = Math.max(0, (start-refStart)/86400000/totalDays*100);
    const width = Math.max(1, (end-start)/86400000/totalDays*100);
    return {left:`${left}%`, width:`${Math.min(width, 100-left)}%`};
  };

  const saveItem = () => {
    if(!formData.name||!formData.projectId) return;
    const item = {...formData, id:editId||uid()};
    setProjects(projects.map(p=>p.id==formData.projectId ? {
      ...p,
      ganttItems: editId
        ? (p.ganttItems||[]).map(g=>g.id===editId?item:g)
        : [...(p.ganttItems||[]), item]
    }:p));
    setShowForm(false); setEditId(null);
    setFormData({projectId:"",name:"",startDate:T,endDate:addDays(T,7),progress:0,type:"task",phase:"Planning",assignee:""});
    showToast("✓ Gantt item disimpan");
  };

  const deleteItem = (projId, itemId) => {
    setProjects(projects.map(p=>p.id==projId?{...p,ganttItems:(p.ganttItems||[]).filter(g=>g.id!==itemId)}:p));
    showToast("Item dihapus","#ef4444");
  };

  const typeColor = {task:"#38bdf8",milestone:"#f59e0b",phase:"#8b5cf6"};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ GANTT CHART</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <select style={{...inp,width:"auto"}} value={selProjectId} onChange={e=>setSelProjectId(e.target.value)}>
            <option value="all">Semua Project</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {["daily","weekly","monthly"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{...btnSm(view===v?"#cc0000":"#1e3a5f"),fontWeight:view===v?700:400}}>
              {v==="daily"?"Harian":v==="weekly"?"Mingguan":"Bulanan"}
            </button>
          ))}
          {canEdit&&<button onClick={()=>{setShowForm(true);setEditId(null);}} style={{...btn("#cc0000")}}>+ Tambah</button>}
        </div>
      </div>

      {showForm&&canEdit&&(
        <Modal title={editId?"Edit Gantt Item":"Tambah Gantt Item"} onClose={()=>{setShowForm(false);setEditId(null);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PROJECT *</div>
              <select style={inp} value={formData.projectId} onChange={e=>setFormData({...formData,projectId:e.target.value})}>
                <option value="">Pilih Project</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NAMA ITEM *</div><input style={inp} value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Nama task/milestone..."/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TIPE</div>
              <select style={inp} value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})}>
                <option value="task">Task</option><option value="milestone">Milestone</option><option value="phase">Phase</option>
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PHASE</div>
              <select style={inp} value={formData.phase} onChange={e=>setFormData({...formData,phase:e.target.value})}>
                {PHASES.map(ph=><option key={ph}>{ph}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>MULAI</div><input type="date" style={inp} value={formData.startDate} onChange={e=>setFormData({...formData,startDate:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>SELESAI</div><input type="date" style={inp} value={formData.endDate} onChange={e=>setFormData({...formData,endDate:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PROGRESS (%)</div><input type="number" min="0" max="100" style={inp} value={formData.progress} onChange={e=>setFormData({...formData,progress:+e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ASSIGNEE</div><input style={inp} value={formData.assignee} onChange={e=>setFormData({...formData,assignee:e.target.value})} placeholder="Nama PIC..."/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveItem} style={{...btn("#10b981")}}>SIMPAN</button>
            <button onClick={()=>{setShowForm(false);setEditId(null);}} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </Modal>
      )}

      {/* Gantt Chart Visualization */}
      <div style={{...card,overflowX:"auto"}}>
        <div style={{minWidth:900}}>
          {/* Header */}
          <div style={{display:"flex",borderBottom:"1px solid #1e3a5f",marginBottom:8}}>
            <div style={{width:220,flexShrink:0,fontSize:9,color:"#64748b",padding:"6px 8px",fontWeight:700}}>ITEM</div>
            <div style={{flex:1,position:"relative",display:"flex"}}>
              {cols.map((d,i)=>(
                <div key={i} style={{flex:1,fontSize:8,color:"#334155",padding:"4px 0",textAlign:"center",borderLeft:"1px solid #1e3a5f22"}}>
                  {view==="daily"?new Date(d).getDate()+"/"+new Date(d).getMonth():
                   view==="weekly"?"W"+(Math.ceil((new Date(d).getDate())/7))+"/"+MONTHS[new Date(d).getMonth()]:
                   MONTHS[new Date(d).getMonth()]+new Date(d).getFullYear().toString().slice(2)}
                </div>
              ))}
            </div>
          </div>
          {/* Today line */}
          {filtered.length===0&&<div style={{textAlign:"center",color:"#334155",padding:40}}>Belum ada item. Klik "Tambah" untuk menambah task/milestone.</div>}
          {filtered.map(item=>{
            const barStyle = getBarStyle(item);
            const c = typeColor[item.type]||"#38bdf8";
            return (
              <div key={item.id} style={{display:"flex",alignItems:"center",marginBottom:6,minHeight:32}}>
                <div style={{width:220,flexShrink:0,display:"flex",alignItems:"center",gap:6,paddingRight:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}}/>
                  <div style={{overflow:"hidden"}}>
                    <div style={{fontSize:10,color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>
                    <div style={{fontSize:8,color:"#475569"}}>{item.projectName?.slice(0,20)}</div>
                  </div>
                  {canEdit&&<div style={{display:"flex",gap:3,marginLeft:"auto",flexShrink:0}}>
                    <button onClick={()=>{setFormData({...item,projectId:item.projectId});setEditId(item.id);setShowForm(true);}} style={{background:"transparent",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:11}}>✏</button>
                    <button onClick={()=>deleteItem(item.projectId,item.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11}}>✕</button>
                  </div>}
                </div>
                <div style={{flex:1,position:"relative",height:28,background:"#0f274430",borderRadius:4}}>
                  {/* Grid lines */}
                  {cols.map((_,i)=><div key={i} style={{position:"absolute",left:`${i/cols.length*100}%`,top:0,bottom:0,borderLeft:"1px solid #1e3a5f22"}}/>)}
                  {/* Bar */}
                  <div style={{position:"absolute",top:4,height:20,borderRadius:4,background:c+"66",border:`1px solid ${c}`,transition:"all .3s",...barStyle}}>
                    <div style={{height:"100%",width:`${item.progress}%`,background:c,borderRadius:4,opacity:.7}}/>
                    {item.progress>0&&<span style={{position:"absolute",left:4,top:"50%",transform:"translateY(-50%)",fontSize:8,color:"#fff",fontWeight:700}}>{item.progress}%</span>}
                  </div>
                </div>
                <div style={{width:60,textAlign:"right",fontSize:9,color:"#475569",flexShrink:0,paddingLeft:6}}>
                  <PhaseBadge phase={item.phase}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* S-Curve */}
      <div style={{...card,marginTop:16}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ S-CURVE PROGRESS</div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          {(selProjectId==="all"?projects:projects.filter(p=>p.id==selProjectId)).map(p=>{
            const {plan,actual} = calcProjectProgress(p);
            return (
              <div key={p.id} style={{flex:1,minWidth:200,background:"#0f274440",borderRadius:10,padding:14}}>
                <div style={{fontSize:10,color:"#e2e8f0",fontWeight:700,marginBottom:8}}>{p.name.slice(0,30)}</div>
                <div style={{marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",marginBottom:3}}><span>Plan</span><span>{plan}%</span></div>
                  <ProgressBar value={plan} color="#3b82f666" h={6}/>
                </div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",marginBottom:3}}><span>Actual</span><span style={{color:statusColor[p.status]}}>{actual}%</span></div>
                  <ProgressBar value={actual} color={statusColor[p.status]} h={8}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9}}>
                  <PhaseBadge phase={p.phase}/>
                  <span style={{color:actual>=plan?"#10b981":"#f59e0b",fontWeight:700}}>{actual>=plan?"On Track":"Behind"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WBS per project */}
      <div style={{...card,marginTop:16}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ WBS (Work Breakdown Structure)</div>
        {(selProjectId==="all"?projects:projects.filter(p=>p.id==selProjectId)).map(p=>(
          <WBSSection key={p.id} project={p} setProjects={setProjects} projects={projects} card={card} inp={inp} btn={btn} btnSm={btnSm} canEdit={canEdit} showToast={showToast}/>
        ))}
      </div>
    </div>
  );
}

function WBSSection({ project, projects, setProjects, card, inp, btn, btnSm, canEdit, showToast, engineers }) {
  const WSTATUS = {pending:"#64748b",in_progress:"#f59e0b",done:"#10b981",blocked:"#ef4444"};
  const [activePhaseWBS, setActivePhaseWBS] = useState(null);
  const [showWBSForm, setShowWBSForm] = useState(false);
  const [editWBSId, setEditWBSId] = useState(null);
  const [wbsForm, setWbsForm] = useState({name:"",level:1,phase:"Planning",assignee:"",startDate:T,endDate:addDays(T,7),weight:10,status:"pending",description:""});
  // Daily log form state
  const [showLogForm, setShowLogForm] = useState(null); // wbsItemId
  const [logForm, setLogForm] = useState({date:T,hours:8,description:"",reporter:"",manpowerIds:[],endDate:""});
  const [editLogId, setEditLogId] = useState(null);
  // S-Curve view
  const [showSCurve, setShowSCurve] = useState(false);

  const wbs = project.wbsItems||[];

  const saveWBS = () => {
    if(!wbsForm.name) return;
    const item = {...wbsForm, id: editWBSId||uid(), dailyLogs: editWBSId ? (wbs.find(w=>w.id===editWBSId)?.dailyLogs||[]) : []};
    setProjects(projects.map(p=>p.id===project.id ? {
      ...p, wbsItems: editWBSId ? wbs.map(w=>w.id===editWBSId?item:w) : [...wbs, item]
    } : p));
    setWbsForm({name:"",level:1,phase:"Planning",assignee:"",startDate:T,endDate:addDays(T,7),weight:10,status:"pending",description:""});
    setShowWBSForm(false); setEditWBSId(null);
    showToast(editWBSId?"✓ WBS diperbarui":"✓ WBS item ditambahkan");
  };
  const deleteWBS = (id) => {
    setProjects(projects.map(p=>p.id===project.id?{...p,wbsItems:wbs.filter(w=>w.id!==id)}:p));
    showToast("WBS item dihapus","#ef4444");
  };
  const updateWBSField = (id,field,val) => {
    setProjects(projects.map(p=>p.id===project.id?{...p,wbsItems:wbs.map(w=>w.id===id?{...w,[field]:val}:w)}:p));
  };

  // Daily log operations
  const saveLog = (wbsId) => {
    if(!logForm.description) return;
    const logs = wbs.find(w=>w.id===wbsId)?.dailyLogs||[];
    // If recurring (endDate set), generate one entry per day
    let newLogs = [];
    if(logForm.endDate && logForm.endDate > logForm.date) {
      let cur = logForm.date;
      while(cur <= logForm.endDate) {
        newLogs.push({...logForm, id:uid(), date:cur, endDate:undefined});
        cur = addDays(cur,1);
      }
    } else {
      const entry = {...logForm, id: editLogId||uid(), endDate:undefined};
      newLogs = editLogId ? logs.map(l=>l.id===editLogId?entry:l) : [...logs, entry];
    }
    if(!editLogId && logForm.endDate && logForm.endDate > logForm.date) {
      newLogs = [...logs, ...newLogs];
    }
    setProjects(projects.map(p=>p.id===project.id?{...p,wbsItems:wbs.map(w=>w.id===wbsId?{...w,dailyLogs:newLogs}:w)}:p));
    setLogForm({date:T,hours:8,description:"",reporter:"",manpowerIds:[],endDate:""});
    setShowLogForm(null); setEditLogId(null);
    showToast("✓ Laporan harian disimpan");
  };
  const deleteLog = (wbsId, logId) => {
    setProjects(projects.map(p=>p.id===project.id?{...p,wbsItems:wbs.map(w=>w.id===wbsId?{...w,dailyLogs:(w.dailyLogs||[]).filter(l=>l.id!==logId)}:w)}:p));
  };

  // S-Curve calculation from daily logs
  const buildSCurveData = () => {
    const allLogs = wbs.flatMap(w=>(w.dailyLogs||[]).map(l=>({...l,wbsId:w.id,wbsWeight:w.weight||0})));
    if(allLogs.length===0) return [];
    const dates = [...new Set(allLogs.map(l=>l.date))].sort();
    const totalWeight = wbs.reduce((a,w)=>a+(w.weight||0),0)||100;
    let cumPlan = 0, cumActual = 0;
    // Plan: distribute weight evenly over WBS duration
    const planByDate = {};
    wbs.forEach(w=>{
      if(!w.startDate||!w.endDate) return;
      const start = new Date(w.startDate), end = new Date(w.endDate);
      const days = Math.max(1,Math.round((end-start)/86400000));
      const dailyWeight = (w.weight||0)/days;
      let cur = w.startDate;
      while(cur <= w.endDate) {
        planByDate[cur] = (planByDate[cur]||0)+dailyWeight;
        cur = addDays(cur,1);
      }
    });
    const allDatesUnion = [...new Set([...Object.keys(planByDate),...dates])].sort();
    let cumP=0,cumA=0;
    return allDatesUnion.map(date=>{
      cumP = Math.min(100, cumP + (planByDate[date]||0)/totalWeight*100);
      const dayActual = allLogs.filter(l=>l.date===date).reduce((a,l)=>{
        const w = wbs.find(x=>x.id===l.wbsId);
        return a + (w?.status==="done" ? (w?.weight||0) : (l.hours||0)/8*(w?.weight||0)*0.3);
      },0);
      cumA = Math.min(100, cumA + dayActual/totalWeight*100);
      return {date, plan:Math.round(cumP*10)/10, actual:Math.round(cumA*10)/10};
    });
  };

  const scData = buildSCurveData();
  const phaseGroups = {};
  PHASES.forEach(ph=>{phaseGroups[ph]=wbs.filter(w=>(w.phase||"Planning")===ph);});

  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div>
          <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{project.name}</div>
          <div style={{fontSize:9,color:"#475569"}}>{wbs.length} WBS items · {wbs.filter(w=>w.status==="done").length} selesai</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {scData.length>0&&<button onClick={()=>setShowSCurve(!showSCurve)} style={{...btnSm("#8b5cf6"),fontSize:9}}>📈 S-Curve</button>}
          {canEdit&&<button onClick={()=>{setShowWBSForm(!showWBSForm);setEditWBSId(null);setWbsForm({name:"",level:1,phase:"Planning",assignee:"",startDate:T,endDate:addDays(T,7),weight:10,status:"pending",description:""});}} style={{...btnSm("#cc0000"),fontSize:9}}>+ WBS Item</button>}
        </div>
      </div>

      {/* S-Curve Chart */}
      {showSCurve&&scData.length>0&&(
        <div style={{background:"#0f274460",borderRadius:10,padding:14,marginBottom:12}}>
          <div style={{fontSize:10,color:"#8b5cf6",letterSpacing:2,marginBottom:8}}>▸ S-CURVE PROGRESS ({project.name})</div>
          <div style={{position:"relative",height:140,overflowX:"auto"}}>
            <svg viewBox={`0 0 ${Math.max(600,scData.length*20)} 130`} style={{width:"100%",minWidth:400,height:130}}>
              <defs>
                <linearGradient id={`planGrad${project.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id={`actGrad${project.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Grid */}
              {[0,25,50,75,100].map(v=>(
                <g key={v}>
                  <line x1="40" y1={110-v} x2={Math.max(600,scData.length*20)} y2={110-v} stroke="#1e3a5f" strokeWidth="0.5"/>
                  <text x="35" y={113-v} textAnchor="end" fill="#475569" fontSize="8">{v}%</text>
                </g>
              ))}
              {/* Plan curve */}
              {scData.length>1&&(
                <polyline points={scData.map((d,i)=>`${40+i*(Math.max(560,scData.length*20-40)/(scData.length-1))},${110-d.plan}`).join(" ")} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4"/>
              )}
              {/* Actual curve */}
              {scData.length>1&&(
                <polyline points={scData.map((d,i)=>`${40+i*(Math.max(560,scData.length*20-40)/(scData.length-1))},${110-d.actual}`).join(" ")} fill="none" stroke="#10b981" strokeWidth="2"/>
              )}
              {/* Date labels - show every N */}
              {scData.filter((_,i)=>i%Math.ceil(scData.length/8)===0).map((d,i,arr)=>{
                const idx = scData.indexOf(d);
                const x = 40+idx*(Math.max(560,scData.length*20-40)/(scData.length-1));
                return <text key={d.date} x={x} y={125} textAnchor="middle" fill="#334155" fontSize="7">{d.date.slice(5)}</text>;
              })}
            </svg>
          </div>
          <div style={{display:"flex",gap:16,marginTop:6}}>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:"#3b82f6"}}><div style={{width:20,height:2,background:"#3b82f6",borderTop:"2px dashed #3b82f6"}}/> Plan: {scData[scData.length-1]?.plan||0}%</div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:"#10b981"}}><div style={{width:20,height:2,background:"#10b981"}}/> Actual: {scData[scData.length-1]?.actual||0}%</div>
          </div>
        </div>
      )}

      {/* WBS Form */}
      {showWBSForm&&canEdit&&(
        <div style={{background:"#0f274440",borderRadius:10,padding:12,marginBottom:12,border:"1px solid #cc000033"}}>
          <div style={{fontSize:10,color:"#cc0000",letterSpacing:1,marginBottom:8}}>{editWBSId?"▸ EDIT WBS":"▸ TAMBAH WBS ITEM"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>NAMA *</div><input style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.name} onChange={e=>setWbsForm({...wbsForm,name:e.target.value})}/></div>
            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>PHASE</div>
              <select style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.phase} onChange={e=>setWbsForm({...wbsForm,phase:e.target.value})}>
                {PHASES.map(ph=><option key={ph}>{ph}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>LEVEL</div>
              <select style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.level} onChange={e=>setWbsForm({...wbsForm,level:+e.target.value})}>
                <option value={1}>1 - Phase</option><option value={2}>2 - Deliverable</option><option value={3}>3 - Work Package</option>
              </select>
            </div>
            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>ASSIGNEE</div><input style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.assignee} onChange={e=>setWbsForm({...wbsForm,assignee:e.target.value})}/></div>
            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>MULAI</div><input type="date" style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.startDate} onChange={e=>setWbsForm({...wbsForm,startDate:e.target.value})}/></div>
            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>SELESAI</div><input type="date" style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.endDate} onChange={e=>setWbsForm({...wbsForm,endDate:e.target.value})}/></div>
            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>BOBOT (%)</div><input type="number" min="0" max="100" style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.weight} onChange={e=>setWbsForm({...wbsForm,weight:+e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>DESKRIPSI</div><input style={{...inp,fontSize:11,padding:"5px 8px"}} value={wbsForm.description} onChange={e=>setWbsForm({...wbsForm,description:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={saveWBS} style={{...btnSm("#10b981"),fontSize:10}}>Simpan</button>
            <button onClick={()=>{setShowWBSForm(false);setEditWBSId(null);}} style={{...btnSm("#64748b"),fontSize:10}}>Batal</button>
          </div>
        </div>
      )}

      {/* WBS by Phase */}
      {PHASES.map(ph=>{
        const items = phaseGroups[ph]||[];
        const phaseHasData = items.length>0;
        return (
          <div key={ph} style={{marginBottom:10,borderLeft:`2px solid ${phaseHasData?phaseColor[ph]:"#1e3a5f"}`,paddingLeft:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,cursor:"pointer"}} onClick={()=>setActivePhaseWBS(activePhaseWBS===ph?null:ph)}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:9,fontWeight:700,color:phaseHasData?phaseColor[ph]:"#334155",letterSpacing:1}}>{ph.toUpperCase()}</span>
                {phaseHasData&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:99,background:phaseColor[ph]+"22",color:phaseColor[ph],fontWeight:700}}>{items.length} item</span>}
                {!phaseHasData&&<span style={{fontSize:8,color:"#1e3a5f",fontStyle:"italic"}}>belum ada data</span>}
              </div>
              <span style={{fontSize:9,color:"#334155"}}>{activePhaseWBS===ph?"▲":"▼"}</span>
            </div>
            {activePhaseWBS===ph&&items.map(w=>(
              <div key={w.id} style={{marginBottom:8,background:"#0f274440",borderRadius:8,padding:"8px 10px",marginLeft:(w.level-1)*12}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                  <div style={{fontSize:8,color:"#475569",minWidth:16,paddingTop:2}}>{w.level}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <div>
                        <div style={{fontSize:10,color:"#e2e8f0",fontWeight:700}}>{w.name}</div>
                        {w.description&&<div style={{fontSize:8,color:"#475569",fontStyle:"italic"}}>{w.description}</div>}
                        <div style={{fontSize:8,color:"#475569",marginTop:2}}>{w.assignee&&`${w.assignee} · `}{fmtDate(w.startDate)} → {fmtDate(w.endDate)} · Bobot {w.weight}%</div>
                      </div>
                      <div style={{display:"flex",gap:4,flexShrink:0}}>
                        {canEdit&&<select style={{...inp,width:"auto",fontSize:9,padding:"2px 5px"}} value={w.status} onChange={e=>updateWBSField(w.id,"status",e.target.value)}>
                          <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="done">Done</option><option value="blocked">Blocked</option>
                        </select>}
                        <div style={{width:7,height:7,borderRadius:"50%",background:WSTATUS[w.status]||"#64748b",marginTop:2,flexShrink:0}}/>
                        {canEdit&&<>
                          <button onClick={()=>{setEditWBSId(w.id);setWbsForm({...w});setShowWBSForm(true);}} style={{background:"transparent",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:10}}>✏</button>
                          <button onClick={()=>deleteWBS(w.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:10}}>✕</button>
                        </>}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <ProgressBar value={w.status==="done"?100:w.status==="in_progress"?50:0} color={WSTATUS[w.status]||"#64748b"} h={4}/>
                    {/* Daily Logs */}
                    <div style={{marginTop:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{fontSize:8,color:"#38bdf8",letterSpacing:1}}>LAPORAN HARIAN ({(w.dailyLogs||[]).length})</div>
                        {canEdit&&<button onClick={()=>{setShowLogForm(showLogForm===w.id?null:w.id);setEditLogId(null);setLogForm({date:T,hours:8,description:"",reporter:"",manpowerIds:[],endDate:""}); }} style={{...btnSm("#10b981"),fontSize:8,padding:"2px 7px"}}>+ Log</button>}
                      </div>
                      {showLogForm===w.id&&canEdit&&(
                        <div style={{background:"#0a162860",borderRadius:8,padding:10,marginBottom:8,border:"1px solid #10b98133"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>TANGGAL</div><input type="date" style={{...inp,fontSize:10,padding:"4px 7px"}} value={logForm.date} onChange={e=>setLogForm({...logForm,date:e.target.value})}/></div>
                            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>S/D TANGGAL (opsional)</div><input type="date" style={{...inp,fontSize:10,padding:"4px 7px"}} value={logForm.endDate} onChange={e=>setLogForm({...logForm,endDate:e.target.value})}/></div>
                            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>JAM KERJA</div><input type="number" min="0" max="24" style={{...inp,fontSize:10,padding:"4px 7px"}} value={logForm.hours} onChange={e=>setLogForm({...logForm,hours:+e.target.value})}/></div>
                            <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>REPORTER</div><input style={{...inp,fontSize:10,padding:"4px 7px"}} value={logForm.reporter} onChange={e=>setLogForm({...logForm,reporter:e.target.value})} placeholder="Nama..."/></div>
                            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>KEGIATAN *</div><textarea style={{...inp,fontSize:10,padding:"4px 7px",minHeight:50,resize:"vertical"}} value={logForm.description} onChange={e=>setLogForm({...logForm,description:e.target.value})} placeholder="Deskripsi kegiatan hari ini..."/></div>
                            {engineers&&<div style={{gridColumn:"1/-1"}}>
                              <div style={{fontSize:8,color:"#64748b",marginBottom:2}}>MANPOWER TERLIBAT</div>
                              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                {(engineers||[]).slice(0,20).map(e=>(
                                  <label key={e.id} style={{display:"flex",alignItems:"center",gap:3,fontSize:8,color:logForm.manpowerIds?.includes(e.id)?"#10b981":"#475569",cursor:"pointer",background:logForm.manpowerIds?.includes(e.id)?"#10b98122":"transparent",padding:"2px 5px",borderRadius:4,border:`1px solid ${logForm.manpowerIds?.includes(e.id)?"#10b981":"#1e3a5f"}`}}>
                                    <input type="checkbox" style={{display:"none"}} checked={logForm.manpowerIds?.includes(e.id)||false} onChange={ev=>setLogForm({...logForm,manpowerIds:ev.target.checked?[...(logForm.manpowerIds||[]),e.id]:(logForm.manpowerIds||[]).filter(id=>id!==e.id)})}/>
                                    {e.name.split(" ")[0]}
                                  </label>
                                ))}
                              </div>
                            </div>}
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>saveLog(w.id)} style={{...btnSm("#10b981"),fontSize:9}}>Simpan</button>
                            <button onClick={()=>{setShowLogForm(null);setEditLogId(null);}} style={{...btnSm("#64748b"),fontSize:9}}>Batal</button>
                          </div>
                          {logForm.endDate&&logForm.endDate>logForm.date&&<div style={{fontSize:8,color:"#f59e0b",marginTop:6}}>⚠ Akan membuat log dari {logForm.date} s/d {logForm.endDate}</div>}
                        </div>
                      )}
                      {(w.dailyLogs||[]).length>0&&(
                        <div style={{maxHeight:160,overflowY:"auto"}}>
                          {[...(w.dailyLogs||[])].sort((a,b)=>b.date.localeCompare(a.date)).map(log=>(
                            <div key={log.id} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"5px 8px",background:"#0a162840",borderRadius:5,marginBottom:3}}>
                              <div style={{fontSize:8,color:"#38bdf8",fontWeight:700,minWidth:55,flexShrink:0}}>{log.date}</div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:9,color:"#e2e8f0"}}>{log.description}</div>
                                <div style={{fontSize:7,color:"#475569"}}>{log.hours}h{log.reporter&&` · ${log.reporter}`}{log.manpowerIds?.length>0&&` · ${log.manpowerIds.length} manpower`}</div>
                              </div>
                              {canEdit&&<>
                                <button onClick={()=>{setEditLogId(log.id);setLogForm({...log,endDate:""});setShowLogForm(w.id);}} style={{background:"transparent",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:9}}>✏</button>
                                <button onClick={()=>deleteLog(w.id,log.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:9}}>✕</button>
                              </>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DELIVERY & MATERIAL STATUS TAB
// ═══════════════════════════════════════════════════════════════
function DeliveryTab({ projects, setProjects, card, inp, btn, btnSm, canEdit, showToast }) {
  const [selProjectId, setSelProjectId] = useState("all");
  const [showForm, setShowForm] = useState(null); // projectId
  const [form, setForm] = useState({name:"",category:"Material",status:"pending",qty:1,unit:"pcs",supplier:"",eta:"",actualDate:"",notes:"",phase:"Planning"});
  const [editId, setEditId] = useState(null);

  const allMaterials = projects.flatMap(p=>(p.materials||[]).map(m=>({...m,projectId:p.id,projectName:p.name})));
  const filtered = selProjectId==="all" ? allMaterials : allMaterials.filter(m=>m.projectId==selProjectId);

  const saveMaterial = (projId) => {
    if(!form.name) return;
    const item = {...form, id:editId||uid()};
    setProjects(projects.map(p=>p.id==projId?{...p,materials:editId?(p.materials||[]).map(m=>m.id===editId?item:m):[...(p.materials||[]),item]}:p));
    setShowForm(null); setEditId(null);
    setForm({name:"",category:"Material",status:"pending",qty:1,unit:"pcs",supplier:"",eta:"",actualDate:"",notes:"",phase:"Planning"});
    showToast("✓ Material/Delivery disimpan");
  };

  const deleteItem = (projId, id) => {
    setProjects(projects.map(p=>p.id==projId?{...p,materials:(p.materials||[]).filter(m=>m.id!==id)}:p));
    showToast("Item dihapus","#ef4444");
  };

  const statusC = {pending:"#64748b",ordered:"#3b82f6",delivered:"#10b981",delayed:"#ef4444",partial:"#f59e0b",rejected:"#ef4444"};
  const catC = {Material:"#8b5cf6",Equipment:"#06b6d4","Spare Part":"#f59e0b",Delivery:"#10b981",Other:"#64748b"};

  const byPhase = {};
  filtered.forEach(m=>{ const ph=m.phase||"Planning"; if(!byPhase[ph])byPhase[ph]=[]; byPhase[ph].push(m); });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ DELIVERY READINESS & MATERIAL STATUS</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <select style={{...inp,width:"auto"}} value={selProjectId} onChange={e=>setSelProjectId(e.target.value)}>
            <option value="all">Semua Project</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {canEdit&&<button onClick={()=>setShowForm("new")} style={{...btn("#cc0000")}}>+ Tambah</button>}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:16}}>
        {[["Total",filtered.length,"#38bdf8"],["Delivered",filtered.filter(m=>m.status==="delivered").length,"#10b981"],["Pending",filtered.filter(m=>m.status==="pending").length,"#64748b"],["Delayed",filtered.filter(m=>m.status==="delayed").length,"#ef4444"],["On Order",filtered.filter(m=>m.status==="ordered").length,"#3b82f6"]].map(([l,v,c])=>(
          <div key={l} style={{...card,textAlign:"center",padding:14}}>
            <div style={{fontSize:22,fontWeight:900,color:c}}>{v}</div>
            <div style={{fontSize:9,color:"#64748b",letterSpacing:1}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm&&canEdit&&(
        <Modal title={editId?"Edit Item":"Tambah Material/Delivery"} onClose={()=>{setShowForm(null);setEditId(null);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {showForm==="new"&&<div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PROJECT *</div>
              <select style={inp} value={form.projectId||""} onChange={e=>setForm({...form,projectId:e.target.value})}>
                <option value="">Pilih Project</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>}
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NAMA ITEM *</div><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KATEGORI</div>
              <select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {["Material","Equipment","Spare Part","Delivery","Other"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PHASE</div>
              <select style={inp} value={form.phase} onChange={e=>setForm({...form,phase:e.target.value})}>
                {PHASES.map(ph=><option key={ph}>{ph}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>STATUS</div>
              <select style={inp} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                {["pending","ordered","delivered","delayed","partial","rejected"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>QTY</div><input type="number" style={inp} value={form.qty} onChange={e=>setForm({...form,qty:+e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>UNIT</div><input style={inp} value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="pcs/set/kg..."/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>SUPPLIER</div><input style={inp} value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ETA</div><input type="date" style={inp} value={form.eta} onChange={e=>setForm({...form,eta:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ACTUAL TIBA</div><input type="date" style={inp} value={form.actualDate} onChange={e=>setForm({...form,actualDate:e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NOTES</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>saveMaterial(form.projectId||showForm)} style={{...btn("#10b981")}}>SIMPAN</button>
            <button onClick={()=>{setShowForm(null);setEditId(null);}} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </Modal>
      )}

      {/* Per Phase per Project View */}
      {projects.filter(p=>selProjectId==="all"||(p.id==selProjectId)).map(p=>{
        const mats = (p.materials||[]);
        if(mats.length===0&&selProjectId!=="all") return null;
        const byPh = {};
        PHASES.forEach(ph=>{ const items=mats.filter(m=>m.phase===ph); if(items.length>0) byPh[ph]=items; });
        return (
          <div key={p.id} style={{...card,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:9,color:"#475569"}}>{mats.length} item · {mats.filter(m=>m.status==="delivered").length} delivered</div>
              </div>
              {canEdit&&<button onClick={()=>{setForm({...form,projectId:p.id});setShowForm(p.id);}} style={{...btnSm("#cc0000"),fontSize:9}}>+ Add Item</button>}
            </div>
            {mats.length===0&&<div style={{fontSize:10,color:"#334155",fontStyle:"italic",textAlign:"center",padding:20}}>Belum ada material/delivery item</div>}
            {Object.entries(byPh).map(([ph,items])=>(
              <div key={ph} style={{marginBottom:12}}>
                <div style={{fontSize:9,color:phaseColor[ph]||"#64748b",letterSpacing:2,marginBottom:6,fontWeight:700}}>▸ {ph.toUpperCase()}</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {items.map(m=>(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,background:"#0f274450",borderRadius:8,padding:"8px 12px"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:statusC[m.status]||"#64748b",flexShrink:0}}/>
                      <div style={{width:70,flexShrink:0}}>
                        <span style={{fontSize:8,padding:"1px 6px",borderRadius:99,background:(catC[m.category]||"#64748b")+"22",color:catC[m.category]||"#64748b",fontWeight:700}}>{m.category}</span>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:"#e2e8f0",fontWeight:700}}>{m.name}</div>
                        <div style={{fontSize:8,color:"#475569"}}>{m.qty} {m.unit}{m.supplier&&` · ${m.supplier}`}{m.eta&&` · ETA: ${fmtDate(m.eta)}`}</div>
                        {m.notes&&<div style={{fontSize:8,color:"#334155",fontStyle:"italic"}}>{m.notes}</div>}
                      </div>
                      <span style={{fontSize:8,padding:"2px 7px",borderRadius:99,background:(statusC[m.status]||"#64748b")+"22",color:statusC[m.status]||"#64748b",fontWeight:700,border:`1px solid ${statusC[m.status]||"#64748b"}44`,whiteSpace:"nowrap"}}>{m.status}</span>
                      {canEdit&&<>
                        <button onClick={()=>{setForm({...m,projectId:p.id});setEditId(m.id);setShowForm(p.id);}} style={{background:"transparent",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:11}}>✏</button>
                        <button onClick={()=>deleteItem(p.id,m.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11}}>✕</button>
                      </>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENGINEER CALENDAR TAB
// ═══════════════════════════════════════════════════════════════
function CalendarTab({ engineers, projects, card, inp, btn, btnSm, canEdit, showToast }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selEng, setSelEng] = useState(engineers[0]?.id||null);
  const [events, setEvents] = useState(()=>DB.get("cal_events")||{});
  const [showForm, setShowForm] = useState(null);
  const [form, setForm] = useState({title:"",type:"site",projectId:"",hours:8,notes:""});

  const saveEvents = (e) => { setEvents(e); DB.set("cal_events",e); };

  const daysInMonth = new Date(year,month+1,0).getDate();
  const firstDay = new Date(year,month,1).getDay();
  const engineer = engineers.find(e=>e.id===selEng);

  const getKey = (d) => `${selEng}_${year}_${month}_${d}`;
  const getDay = (d) => events[getKey(d)]||[];

  const typeC = {site:"#10b981",office:"#3b82f6",leave:"#f59e0b",training:"#8b5cf6",overtime:"#ec4899"};
  const typeLabel = {site:"Site",office:"Kantor",leave:"Cuti",training:"Training",overtime:"Lembur"};

  const addEvent = (day) => {
    if(!form.title) return;
    const key = getKey(day);
    const ev = {...form,id:uid()};
    const updated = {...events,[key]:[...(events[key]||[]),ev]};
    saveEvents(updated);
    setShowForm(null);
    showToast("✓ Event ditambahkan");
    setForm({title:"",type:"site",projectId:"",hours:8,notes:""});
  };

  const deleteEvent = (day, id) => {
    const key = getKey(day);
    const updated = {...events,[key]:(events[key]||[]).filter(e=>e.id!==id)};
    saveEvents(updated);
  };

  // Monthly stats
  const monthlyHours = Array.from({length:daysInMonth},(_,i)=>i+1).reduce((acc,d)=>{
    const dayEvs = getDay(d);
    return acc + dayEvs.reduce((a,e)=>a+(e.hours||0),0);
  }, 0);
  const siteDays = Array.from({length:daysInMonth},(_,i)=>i+1).filter(d=>getDay(d).some(e=>e.type==="site")).length;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ KALENDER ENGINEER</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <select style={{...inp,width:"auto"}} value={selEng||""} onChange={e=>setSelEng(+e.target.value||e.target.value)}>
            {engineers.map(e=><option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
          </select>
          <button onClick={()=>{setMonth(m=>m===0?11:m-1);if(month===0)setYear(y=>y-1);}} style={{...btnSm("#1e3a5f")}}>◀</button>
          <span style={{fontSize:11,color:"#e2e8f0",fontWeight:700,minWidth:100,textAlign:"center"}}>{MONTHS[month]} {year}</span>
          <button onClick={()=>{setMonth(m=>m===11?0:m+1);if(month===11)setYear(y=>y+1);}} style={{...btnSm("#1e3a5f")}}>▶</button>
        </div>
      </div>

      {/* Engineer Info + Stats */}
      {engineer&&<div style={{...card,marginBottom:14,display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
        <div>
          <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{engineer.name}</div>
          <div style={{fontSize:10,color:"#64748b"}}>{engineer.role} · {engineer.dept}</div>
        </div>
        <div style={{display:"flex",gap:16}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:"#38bdf8"}}>{monthlyHours}</div><div style={{fontSize:8,color:"#475569"}}>JAM BULAN INI</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:"#10b981"}}>{siteDays}</div><div style={{fontSize:8,color:"#475569"}}>HARI SITE</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:900,color:kpiColor(engineer.kpi)}}>{engineer.kpi}%</div><div style={{fontSize:8,color:"#475569"}}>KPI</div></div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(typeC).map(([t,c])=><span key={t} style={{fontSize:8,padding:"2px 6px",borderRadius:4,background:c+"22",color:c,fontWeight:700}}>{typeLabel[t]}</span>)}
        </div>
      </div>}

      {/* Calendar Grid */}
      <div style={card}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
          {DAYS.map(d=><div key={d} style={{fontSize:9,color:"#475569",textAlign:"center",padding:"4px 0",fontWeight:700}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {Array.from({length:firstDay},(_,i)=><div key={"e"+i}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const d = i+1;
            const dayEvs = getDay(d);
            const isToday = year===now.getFullYear()&&month===now.getMonth()&&d===now.getDate();
            return (
              <div key={d} style={{minHeight:70,background:isToday?"#cc000022":"#0f274440",borderRadius:8,padding:4,border:isToday?"1px solid #cc0000":"1px solid #1e3a5f22",cursor:"pointer",position:"relative"}} onClick={()=>canEdit&&setShowForm(d)}>
                <div style={{fontSize:10,color:isToday?"#cc0000":"#64748b",fontWeight:isToday?700:400,marginBottom:3}}>{d}</div>
                {dayEvs.slice(0,3).map(ev=>(
                  <div key={ev.id} style={{fontSize:7,background:(typeC[ev.type]||"#64748b")+"33",color:typeC[ev.type]||"#64748b",borderRadius:3,padding:"1px 4px",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{ev.title.slice(0,10)}</span>
                    {canEdit&&<span onClick={e=>{e.stopPropagation();deleteEvent(d,ev.id);}} style={{cursor:"pointer",marginLeft:2,fontWeight:900}}>×</span>}
                  </div>
                ))}
                {dayEvs.length>3&&<div style={{fontSize:7,color:"#475569"}}>+{dayEvs.length-3}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showForm&&canEdit&&(
        <Modal title={`Tambah Event — ${showForm} ${MONTHS[month]} ${year}`} onClose={()=>setShowForm(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>JUDUL *</div><input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Nama kegiatan..."/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TIPE</div>
              <select style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                {Object.entries(typeLabel).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>JAM KERJA</div><input type="number" min="0" max="24" style={inp} value={form.hours} onChange={e=>setForm({...form,hours:+e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PROJECT</div>
              <select style={inp} value={form.projectId} onChange={e=>setForm({...form,projectId:e.target.value})}>
                <option value="">-</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name.slice(0,30)}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NOTES</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>addEvent(showForm)} style={{...btn("#10b981")}}>TAMBAH</button>
            <button onClick={()=>setShowForm(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORK HOURS INPUT TAB
// ═══════════════════════════════════════════════════════════════
function WorkHoursTab({ engineers, projects, card, inp, btn, btnSm, canEdit, showToast }) {
  const [entries, setEntriesState] = useState(()=>DB.get("workhours")||[]);
  const [form, setForm] = useState({date:T,engineerId:"",projectId:"",type:"site",hours:8,overtime:0,description:""});
  const [showForm, setShowForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState(T.slice(0,7));

  const saveEntries = (e) => { setEntriesState(e); DB.set("workhours",e); };

  const addEntry = () => {
    if(!form.engineerId||!form.hours) return;
    saveEntries([...entries,{...form,id:uid()}]);
    setForm({date:T,engineerId:"",projectId:"",type:"site",hours:8,overtime:0,description:""});
    setShowForm(false);
    showToast("✓ Jam kerja dicatat");
  };

  const deleteEntry = (id) => {
    saveEntries(entries.filter(e=>e.id!==id));
    showToast("Entry dihapus","#ef4444");
  };

  const filtered = entries.filter(e=>e.date.startsWith(filterMonth));
  const byEngineer = {};
  filtered.forEach(e=>{
    if(!byEngineer[e.engineerId]) byEngineer[e.engineerId]={regular:0,overtime:0,entries:[]};
    byEngineer[e.engineerId].regular += e.hours||0;
    byEngineer[e.engineerId].overtime += e.overtime||0;
    byEngineer[e.engineerId].entries.push(e);
  });

  const typeC = {site:"#10b981",office:"#3b82f6",overtime:"#ec4899",training:"#8b5cf6"};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ INPUT JAM KERJA MANPOWER</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input type="month" style={{...inp,width:"auto"}} value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}/>
          {canEdit&&<button onClick={()=>setShowForm(true)} style={{...btn("#cc0000")}}>+ Input Jam Kerja</button>}
        </div>
      </div>

      {showForm&&canEdit&&(
        <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ INPUT JAM KERJA BARU</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TANGGAL</div><input type="date" style={inp} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ENGINEER *</div>
              <select style={inp} value={form.engineerId} onChange={e=>setForm({...form,engineerId:e.target.value})}>
                <option value="">Pilih Engineer</option>
                {engineers.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PROJECT</div>
              <select style={inp} value={form.projectId} onChange={e=>setForm({...form,projectId:e.target.value})}>
                <option value="">-</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name.slice(0,30)}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TIPE</div>
              <select style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option value="site">Site</option><option value="office">Kantor</option><option value="overtime">Lembur</option><option value="training">Training</option>
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>JAM REGULER</div><input type="number" min="0" max="24" style={inp} value={form.hours} onChange={e=>setForm({...form,hours:+e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>JAM LEMBUR</div><input type="number" min="0" max="12" style={inp} value={form.overtime} onChange={e=>setForm({...form,overtime:+e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KETERANGAN</div><input style={inp} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Kegiatan hari ini..."/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addEntry} style={{...btn("#10b981")}}>SIMPAN</button>
            <button onClick={()=>setShowForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </div>
      )}

      {/* Summary by engineer */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10,marginBottom:16}}>
        {Object.entries(byEngineer).map(([engId,data])=>{
          const eng = engineers.find(e=>String(e.id)===String(engId));
          if(!eng) return null;
          const totalH = data.regular + data.overtime;
          return (
            <div key={engId} style={{...card,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{eng.name}</div>
                  <div style={{fontSize:9,color:"#475569"}}>{eng.dept} · {filterMonth}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:900,color:"#38bdf8"}}>{totalH}h</div>
                  <div style={{fontSize:8,color:"#475569"}}>Total Jam</div>
                </div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:8}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:"#10b981"}}>{data.regular}h</div><div style={{fontSize:8,color:"#475569"}}>Reguler</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:"#ec4899"}}>{data.overtime}h</div><div style={{fontSize:8,color:"#475569"}}>Lembur</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:"#f59e0b"}}>{data.entries.length}</div><div style={{fontSize:8,color:"#475569"}}>Entry</div></div>
              </div>
              <ProgressBar value={Math.min(totalH/176*100,100)} color="#38bdf8" h={6}/>
              <div style={{fontSize:8,color:"#334155",marginTop:4}}>{Math.round(totalH/176*100)}% dari standar 176h/bulan</div>
            </div>
          );
        })}
        {Object.keys(byEngineer).length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:40,gridColumn:"1/-1"}}>Belum ada data jam kerja untuk periode ini</div>}
      </div>

      {/* Detail table */}
      {filtered.length>0&&<div style={card}>
        <div style={{fontSize:11,color:"#38bdf8",letterSpacing:2,marginBottom:12}}>▸ DETAIL ENTRY</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
            <thead>
              <tr>
                {["Tanggal","Engineer","Project","Tipe","Jam Reg","Jam OT","Keterangan",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontSize:9,borderBottom:"1px solid #1e3a5f",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...filtered].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>{
                const eng = engineers.find(en=>String(en.id)===String(e.engineerId));
                const proj = projects.find(p=>String(p.id)===String(e.projectId));
                return (
                  <tr key={e.id} style={{borderBottom:"1px solid #1e3a5f22"}}>
                    <td style={{padding:"6px 8px",color:"#94a3b8"}}>{fmtDate(e.date)}</td>
                    <td style={{padding:"6px 8px",color:"#e2e8f0",fontWeight:700}}>{eng?.name||"—"}</td>
                    <td style={{padding:"6px 8px",color:"#94a3b8"}}>{proj?.name?.slice(0,20)||"—"}</td>
                    <td style={{padding:"6px 8px"}}><span style={{fontSize:8,padding:"1px 6px",borderRadius:99,background:(typeC[e.type]||"#64748b")+"22",color:typeC[e.type]||"#64748b",fontWeight:700}}>{e.type}</span></td>
                    <td style={{padding:"6px 8px",color:"#38bdf8",fontWeight:700}}>{e.hours}h</td>
                    <td style={{padding:"6px 8px",color:"#ec4899",fontWeight:700}}>{e.overtime||0}h</td>
                    <td style={{padding:"6px 8px",color:"#64748b",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.description}</td>
                    <td style={{padding:"6px 8px"}}>{canEdit&&<button onClick={()=>deleteEntry(e.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:12}}>✕</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMESHEET & UTILIZATION TAB
// ═══════════════════════════════════════════════════════════════
function TimesheetTab({ engineers, projects, card, inp, btn, canEdit }) {
  const [filterMonth, setFilterMonth] = useState(T.slice(0,7));
  const workhours = DB.get("workhours")||[];
  const filtered = workhours.filter(e=>e.date.startsWith(filterMonth));

  const engStats = engineers.map(eng=>{
    const entries = filtered.filter(e=>String(e.engineerId)===String(eng.id));
    const regular = entries.reduce((a,e)=>a+(e.hours||0),0);
    const overtime = entries.reduce((a,e)=>a+(e.overtime||0),0);
    const total = regular + overtime;
    const utilization = Math.round(total/176*100);
    const siteDays = [...new Set(entries.filter(e=>e.type==="site").map(e=>e.date))].length;
    const officeDays = [...new Set(entries.filter(e=>e.type==="office").map(e=>e.date))].length;
    const projects_worked = [...new Set(entries.filter(e=>e.projectId).map(e=>e.projectId))];
    return {...eng, regular, overtime, total, utilization, siteDays, officeDays, projects_worked};
  }).sort((a,b)=>b.utilization-a.utilization);

  const avgUtil = Math.round(engStats.reduce((a,e)=>a+e.utilization,0)/Math.max(engStats.length,1));
  const inRange = engStats.filter(e=>e.utilization>=75&&e.utilization<=90).length;
  const overUtil = engStats.filter(e=>e.utilization>90).length;
  const underUtil = engStats.filter(e=>e.utilization<75&&e.utilization>0).length;

  const utilC = (v) => v>90?"#ef4444":v>=75?"#10b981":v>0?"#f59e0b":"#334155";

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ TIMESHEET & UTILIZATION</div>
        <input type="month" style={{...inp,width:"auto"}} value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
        {[[`${avgUtil}%`,"Avg Utilization",utilC(avgUtil)],[`${inRange}`,"In Range 75-90%","#10b981"],[`${overUtil}`,"Over 90%","#ef4444"],[`${underUtil}`,"Under 75%","#f59e0b"]].map(([v,l,c])=>(
          <div key={l} style={{...card,textAlign:"center",padding:14}}>
            <div style={{fontSize:24,fontWeight:900,color:c}}>{v}</div>
            <div style={{fontSize:9,color:"#64748b",letterSpacing:.5,marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
        {engStats.map(e=>(
          <div key={e.id} style={{...card,padding:14,border:`1px solid ${utilC(e.utilization)}22`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{e.name}</div>
                <div style={{fontSize:9,color:"#475569"}}>{e.dept}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:900,color:utilC(e.utilization)}}>{e.utilization}%</div>
                <div style={{fontSize:8,color:"#475569"}}>utilization</div>
              </div>
            </div>
            <ProgressBar value={e.utilization} color={utilC(e.utilization)} h={8}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9,color:"#475569"}}>
              <span>Reg: <b style={{color:"#38bdf8"}}>{e.regular}h</b></span>
              <span>OT: <b style={{color:"#ec4899"}}>{e.overtime}h</b></span>
              <span>Site: <b style={{color:"#10b981"}}>{e.siteDays}d</b></span>
              <span>Office: <b style={{color:"#3b82f6"}}>{e.officeDays}d</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// KPI PROJECT TAB
// ═══════════════════════════════════════════════════════════════
const KPI_TARGETS = [
  {id:"otd",label:"On-Time Delivery",target:90,unit:"%",operator:"≥",desc:"Pengiriman tepat waktu",icon:"🚚"},
  {id:"milestone",label:"Milestone Achievement",target:95,unit:"%",operator:"≥",desc:"Pencapaian milestone",icon:"🏆"},
  {id:"rework",label:"Rework Rate",target:5,unit:"%",operator:"≤",desc:"Tingkat pengerjaan ulang",icon:"🔄"},
  {id:"utilization",label:"Team Utilization",target:90,targetMin:75,unit:"%",operator:"75–90",desc:"Utilisasi tim",icon:"👥"},
  {id:"task",label:"Task Completion",target:95,unit:"%",operator:"≥",desc:"Penyelesaian task",icon:"✅"},
  {id:"issue",label:"Issue Resolution",target:2,unit:"hari",operator:"≤",desc:"Waktu resolusi masalah",icon:"⚡"},
];

function KPIProjectTab({ projects, engineers, card, inp, btn, btnSm, canEdit, showToast }) {
  const [records, setRecordsState] = useState(()=>DB.get("kpi_records")||[]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({period:T.slice(0,7),projectId:"all",otd:0,milestone:0,rework:0,utilization:0,task:0,issue:0,notes:""});

  const saveRecords = (r) => { setRecordsState(r); DB.set("kpi_records",r); };

  const saveRecord = () => {
    const rec = {...form,id:editId||uid()};
    if(editId) saveRecords(records.map(r=>r.id===editId?rec:r));
    else saveRecords([...records,rec]);
    setShowForm(false); setEditId(null);
    setForm({period:T.slice(0,7),projectId:"all",otd:0,milestone:0,rework:0,utilization:0,task:0,issue:0,notes:""});
    showToast("✓ KPI record disimpan");
  };

  const deleteRecord = (id) => {
    saveRecords(records.filter(r=>r.id!==id));
    showToast("Record dihapus","#ef4444");
  };

  // Calculate current KPI from actual data
  const calcActualKPI = () => {
    const proj = projects;
    const allMs = proj.flatMap(p=>p.milestones||[]);
    const otd = proj.length>0?Math.round(proj.filter(p=>{const d=daysLeft(p.deadline);return d>=0||p.status==="On Track";}).length/proj.length*100):0;
    const msAchieved = allMs.length>0?Math.round(allMs.filter(m=>(m.actualProgress||0)>=(m.planProgress||0)).length/allMs.length*100):0;
    const workhours = DB.get("workhours")||[];
    const thisMonth = workhours.filter(e=>e.date.startsWith(T.slice(0,7)));
    const engUtils = engineers.map(eng=>{
      const total = thisMonth.filter(e=>String(e.engineerId)===String(eng.id)).reduce((a,e)=>a+(e.hours||0),0);
      return Math.min(total/176*100,100);
    });
    const avgUtil = Math.round(engUtils.reduce((a,v)=>a+v,0)/Math.max(engUtils.length,1));
    return {otd,milestone:msAchieved||95,rework:3,utilization:avgUtil||80,task:92,issue:1.5};
  };

  const actual = calcActualKPI();

  const getStatus = (kpi, value) => {
    if(kpi.operator==="≥") return value>=kpi.target?"pass":"fail";
    if(kpi.operator==="≤") return value<=kpi.target?"pass":"fail";
    if(kpi.operator==="75–90") return value>=75&&value<=90?"pass":value>90?"warn":"fail";
    return "pass";
  };

  const latest = records.length>0?records[records.length-1]:null;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ KPI PROJECT MANAGEMENT</div>
        {canEdit&&<button onClick={()=>{setShowForm(true);setEditId(null);}} style={{...btn("#cc0000")}}>+ Input KPI</button>}
      </div>

      {/* KPI Cards - Live */}
      <div style={{fontSize:10,color:"#38bdf8",letterSpacing:2,marginBottom:10}}>▸ KPI REAL-TIME (KALKULASI OTOMATIS)</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginBottom:20}}>
        {KPI_TARGETS.map(kpi=>{
          const val = actual[kpi.id]||0;
          const status = getStatus(kpi,val);
          const c = status==="pass"?"#10b981":status==="warn"?"#f59e0b":"#ef4444";
          return (
            <div key={kpi.id} style={{...card,border:`1px solid ${c}33`,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{kpi.icon} {kpi.label}</div>
                  <div style={{fontSize:8,color:"#475569"}}>{kpi.desc}</div>
                </div>
                <span style={{fontSize:8,padding:"2px 6px",borderRadius:99,background:c+"22",color:c,fontWeight:700}}>{status==="pass"?"✓ OK":status==="warn"?"⚠ WARN":"✗ FAIL"}</span>
              </div>
              <div style={{fontSize:28,fontWeight:900,color:c,marginBottom:6}}>{val}{kpi.unit}</div>
              <div style={{fontSize:9,color:"#475569",marginBottom:6}}>Target: {kpi.operator} {kpi.target}{kpi.unit}</div>
              <ProgressBar value={kpi.operator==="≤"?Math.max(0,100-val/kpi.target*100):Math.min(val,100)} color={c} h={6}/>
            </div>
          );
        })}
      </div>

      {/* Manual KPI Input Form */}
      {showForm&&canEdit&&(
        <div style={{...card,marginBottom:16,border:"1px solid #cc000044"}}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ {editId?"EDIT":"INPUT"} KPI MANUAL</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PERIODE</div><input type="month" style={inp} value={form.period} onChange={e=>setForm({...form,period:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PROJECT</div>
              <select style={inp} value={form.projectId} onChange={e=>setForm({...form,projectId:e.target.value})}>
                <option value="all">Semua Project</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            {KPI_TARGETS.map(kpi=>(
              <div key={kpi.id}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{kpi.label} ({kpi.unit})</div>
                <input type="number" min="0" max={kpi.unit==="hari"?30:100} step={kpi.unit==="hari"?0.5:1} style={inp} value={form[kpi.id]||0} onChange={e=>setForm({...form,[kpi.id]:+e.target.value})}/>
              </div>
            ))}
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NOTES</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveRecord} style={{...btn("#10b981")}}>SIMPAN KPI</button>
            <button onClick={()=>{setShowForm(false);setEditId(null);}} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </div>
      )}

      {/* KPI History */}
      {records.length>0&&<div style={card}>
        <div style={{fontSize:11,color:"#38bdf8",letterSpacing:2,marginBottom:12}}>▸ RIWAYAT KPI</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
            <thead>
              <tr>
                {["Periode","Project","OTD","Milestone","Rework","Utilization","Task","Issue","",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontSize:9,borderBottom:"1px solid #1e3a5f",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...records].sort((a,b)=>b.period.localeCompare(a.period)).map(r=>{
                const proj = r.projectId!=="all"?projects.find(p=>String(p.id)===r.projectId):null;
                return (
                  <tr key={r.id} style={{borderBottom:"1px solid #1e3a5f22"}}>
                    <td style={{padding:"6px 8px",color:"#94a3b8"}}>{r.period}</td>
                    <td style={{padding:"6px 8px",color:"#e2e8f0"}}>{proj?.name?.slice(0,20)||"All Projects"}</td>
                    {KPI_TARGETS.map(kpi=>{
                      const val = r[kpi.id]||0;
                      const st = getStatus(kpi,val);
                      const c = st==="pass"?"#10b981":st==="warn"?"#f59e0b":"#ef4444";
                      return <td key={kpi.id} style={{padding:"6px 8px",color:c,fontWeight:700}}>{val}{kpi.unit}</td>;
                    })}
                    <td style={{padding:"6px 8px"}}>
                      {canEdit&&<button onClick={()=>{setForm(r);setEditId(r.id);setShowForm(true);}} style={{background:"transparent",border:"none",color:"#38bdf8",cursor:"pointer",fontSize:11}}>✏</button>}
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      {canEdit&&<button onClick={()=>deleteRecord(r.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11}}>✕</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}

const calcActualPhase = (proj) => {
  const wbs = proj.wbsItems||[];
  const phaseOrder = ["Planning","Production","Ready to Delivery","Installation","Commissioning","Completed"];
  const phasesWithData = [...new Set(wbs.filter(w=>w.phase).map(w=>w.phase))];
  let deepestIdx = phaseOrder.indexOf(proj.phase||"Planning");
  phasesWithData.forEach(ph => {
    const idx = phaseOrder.indexOf(ph);
    if(idx > deepestIdx) deepestIdx = idx;
  });
  return phaseOrder[Math.max(0,deepestIdx)] || proj.phase || "Planning";
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════
function DashboardTab({projects,engineers,completedProjects,setSelProject,setTab,card,inp,btn,canEdit,setProjects,showToast}) {
  const [editNote,setEditNote]=useState(null);const [noteVal,setNoteVal]=useState("");
  const avgKpi=Math.round(engineers.reduce((a,e)=>a+e.kpi,0)/Math.max(engineers.length,1));
  const kpiStats=[
    {label:"Total Aktif",value:projects.length,color:"#38bdf8"},
    {label:"On Track",value:projects.filter(p=>p.status==="On Track").length,color:"#10b981"},
    {label:"At Risk",value:projects.filter(p=>p.status==="At Risk").length,color:"#f59e0b"},
    {label:"Delayed",value:projects.filter(p=>p.status==="Delayed").length,color:"#ef4444"},
    {label:"On Hold",value:projects.filter(p=>p.status==="On Hold").length,color:"#6b7280"},
    {label:"Completed",value:completedProjects.length,color:"#10b981"},
    {label:"Engineers",value:engineers.length,color:"#a78bfa"},
    {label:"Avg KPI",value:avgKpi+"%",color:kpiColor(avgKpi)},
  ];
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ EXECUTIVE DASHBOARD</div>
        <div style={{fontSize:10,color:"#334155"}}>— {new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:20}}>
        {kpiStats.map((s,i)=>(
          <div key={i} style={{...card,textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:9,color:"#64748b",marginTop:6,letterSpacing:1}}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{...card,marginBottom:16}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ DISTRIBUSI PHASE PROYEK</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {PHASES.map(ph=>{const cnt=projects.filter(p=>p.phase===ph).length;const pct=projects.length?Math.round(cnt/projects.length*100):0;return(
            <div key={ph} style={{flex:1,minWidth:80,background:(phaseColor[ph]||"#64748b")+"11",border:`1px solid ${(phaseColor[ph]||"#64748b")}33`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:phaseColor[ph]||"#64748b"}}>{cnt}</div>
              <div style={{fontSize:8,color:phaseColor[ph]||"#64748b",fontWeight:700,letterSpacing:.5,marginTop:3}}>{ph}</div>
              <div style={{fontSize:10,color:phaseColor[ph]||"#64748b",fontWeight:900,marginTop:4}}>{pct}%</div>
              <div style={{marginTop:5,background:"#0f274460",borderRadius:99,height:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:phaseColor[ph]||"#64748b",borderRadius:99}}/></div>
              <div style={{fontSize:7,color:"#475569",marginTop:2}}>{cnt} dari {projects.length}</div>
            </div>
          );})}
        </div>
        {/* Status breakdown with % */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
          {[["On Track","#10b981"],["At Risk","#f59e0b"],["Delayed","#ef4444"],["On Hold","#6b7280"]].map(([s,c])=>{
            const cnt=projects.filter(p=>p.status===s).length;
            const pct=projects.length?Math.round(cnt/projects.length*100):0;
            return(
              <div key={s} style={{background:c+"11",border:`1px solid ${c}33`,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:10,color:c,fontWeight:700}}>{s}</div><div style={{fontSize:8,color:"#475569"}}>{cnt} proyek</div></div>
                <div style={{fontSize:20,fontWeight:900,color:c}}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={card}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ STATUS PROYEK</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:350,overflowY:"auto"}}>
            {projects.map(p=>{
              const {plan,actual}=calcProjectProgress(p);const d=daysLeft(p.deadline);const isEditing=editNote===p.id;
              return(
                <div key={p.id} style={{background:"#0f274480",border:"1px solid #1e3a5f",borderRadius:10,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");}}>
                      <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{p.name.slice(0,30)}</div>
                      <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}}>
                        <PhaseBadge phase={p.phase}/><Badge label={p.status} color={statusColor[p.status]}/>
                        {d<=7&&d>=0&&<Badge label={`${d}h`} color="#f59e0b"/>}{d<0&&<Badge label="LATE" color="#ef4444"/>}
                      </div>
                    </div>
                    {canEdit&&<button onClick={()=>{setEditNote(isEditing?null:p.id);setNoteVal(p.notes||"");}} style={{background:"#38bdf822",border:"1px solid #38bdf844",color:"#38bdf8",borderRadius:5,padding:"2px 7px",fontSize:9,cursor:"pointer",flexShrink:0}}>✏</button>}
                  </div>
                  {isEditing?(<div><textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} style={{width:"100%",background:"#0a1628",border:"1px solid #38bdf8",borderRadius:6,color:"#e2e8f0",padding:"6px",fontSize:11,fontFamily:"inherit",resize:"vertical",minHeight:60,boxSizing:"border-box"}}/><div style={{display:"flex",gap:6,marginTop:6}}><button onClick={()=>{setProjects(projects.map(pp=>pp.id===p.id?{...pp,notes:noteVal}:pp));setEditNote(null);}} style={{background:"#10b981",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",fontSize:10,cursor:"pointer"}}>Simpan</button><button onClick={()=>setEditNote(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer"}}>Batal</button></div></div>):
                  (p.notes&&<div style={{fontSize:10,color:"#64748b",fontStyle:"italic",marginTop:4,borderLeft:"2px solid #38bdf844",paddingLeft:8}}>{p.notes}</div>)}
                  <div style={{display:"flex",gap:6,alignItems:"center",marginTop:6}}>
                    <ProgressBar value={plan} color="#3b82f666" h={3}/><ProgressBar value={actual} color={statusColor[p.status]} h={5}/>
                    <span style={{fontSize:10,color:"#38bdf8",minWidth:28}}>{actual}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={card}>
            <div style={{fontSize:11,color:"#f59e0b",letterSpacing:3,marginBottom:14}}>⚠️ DEADLINE ALERTS (14 Hari)</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:200,overflowY:"auto"}}>
              {projects.filter(p=>daysLeft(p.deadline)<=14&&daysLeft(p.deadline)>=-7).sort((a,b)=>daysLeft(a.deadline)-daysLeft(b.deadline)).map(p=>{
                const d=daysLeft(p.deadline);const c=d<0?"#ef4444":d<=3?"#ef4444":d<=7?"#f59e0b":"#3b82f6";
                return(<div key={p.id} style={{background:c+"11",border:`1px solid ${c}33`,borderRadius:8,padding:"8px 12px",cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");}}>
                  <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{p.name.slice(0,35)}</div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:9,color:"#475569"}}>PIC: {p.pic}</span><span style={{fontSize:9,color:c,fontWeight:700}}>{d<0?`${Math.abs(d)}h terlambat`:d===0?"HARI INI":`${d}h lagi`}</span></div>
                </div>);
              })}
              {projects.filter(p=>daysLeft(p.deadline)<=14&&daysLeft(p.deadline)>=-7).length===0&&<div style={{fontSize:11,color:"#334155",textAlign:"center",padding:20}}>Tidak ada deadline mendesak</div>}
            </div>
          </div>
          <div style={card}>
            <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:12}}>▸ TOP PERFORMERS</div>
            {[...engineers].sort((a,b)=>b.kpi-a.kpi).slice(0,5).map((e,i)=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{fontSize:11,color:i<3?"#f59e0b":"#334155",fontWeight:900,minWidth:18}}>#{i+1}</div>
                <div style={{width:28,height:28,borderRadius:"50%",background:kpiColor(e.kpi)+"22",border:`1.5px solid ${kpiColor(e.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:kpiColor(e.kpi)}}>{e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                <div style={{flex:1}}><div style={{fontSize:11,color:"#e2e8f0"}}>{e.name}</div><div style={{fontSize:9,color:"#475569"}}>{e.dept}</div></div>
                <div style={{fontSize:14,fontWeight:900,color:kpiColor(e.kpi)}}>{e.kpi}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROJECTS TAB (preserved from v5 with improvements)
// ═══════════════════════════════════════════════════════════════
function ProjectsTab({projects,setProjects,engineers,selProject,setSelProject,card,inp,btn,btnSm,showToast,canEdit,setCompleted,completedProjects}) {
  const [projTab,setProjTab]=useState("overview");
  const [showAddProject,setShowAddProject]=useState(false);
  const [newProject,setNewProject]=useState({name:"",customer:"",phase:"Planning",status:"On Track",priority:"Medium",startDate:"",deadline:"",pic:"",notes:"",budget:"",spent:"",mandays:"",team:[]});
  const [showMilestoneForm,setShowMilestoneForm]=useState(false);
  const [milestoneForm,setMilestoneForm]=useState({name:"",date:"",planProgress:0,actualProgress:0,description:""});
  const [showReportForm,setShowReportForm]=useState(false);
  const [reportForm,setReportForm]=useState({date:T,summary:"",activities:"",issues:"",nextPlan:"",reporter:""});
  const [projFilter,setProjFilter]=useState({status:"all",priority:"all",customer:"all",search:"",phase:"all"});
  const [editProjectId,setEditProjectId]=useState(null);

  const customers=[...new Set(projects.map(p=>p.customer))].sort();
  const filteredProjects=projects.filter(p=>{
    const ms=p.name.toLowerCase().includes(projFilter.search.toLowerCase())||p.customer.toLowerCase().includes(projFilter.search.toLowerCase());
    return ms&&(projFilter.status==="all"||p.status===projFilter.status)&&(projFilter.priority==="all"||p.priority===projFilter.priority)&&(projFilter.customer==="all"||p.customer===projFilter.customer)&&(projFilter.phase==="all"||p.phase===projFilter.phase);
  });

  const selProj = projects.find(p=>p.id===selProject);

  const saveProject=()=>{
    if(!newProject.name||!newProject.customer)return;
    const p={...newProject,id:uid(),milestones:[],dailyReports:[],documents:[],wbsItems:[],materials:[],ganttItems:[],budget:Number(newProject.budget)||0,spent:Number(newProject.spent)||0,mandays:Number(newProject.mandays)||0};
    setProjects([...projects,p]);setShowAddProject(false);
    setNewProject({name:"",customer:"",phase:"Planning",status:"On Track",priority:"Medium",startDate:"",deadline:"",pic:"",notes:"",budget:"",spent:"",mandays:"",team:[]});
    showToast("✓ Proyek ditambahkan");
  };

  const deleteProject=(id)=>{if(!window.confirm("Hapus proyek ini?"))return;setProjects(projects.filter(p=>p.id!==id));setSelProject(null);showToast("Proyek dihapus","#ef4444");};
  const updateProjectField=(id,field,val)=>setProjects(projects.map(p=>p.id===id?{...p,[field]:val}:p));
  const saveMilestone=()=>{if(!milestoneForm.name||!milestoneForm.date)return;const ms={...milestoneForm,id:uid(),activities:[]};setProjects(projects.map(p=>p.id===selProject?{...p,milestones:[...(p.milestones||[]),ms]}:p));setMilestoneForm({name:"",date:"",planProgress:0,actualProgress:0,description:""});setShowMilestoneForm(false);showToast("✓ Milestone ditambahkan");};
  const deleteMilestone=(msId)=>setProjects(projects.map(p=>p.id===selProject?{...p,milestones:(p.milestones||[]).filter(m=>m.id!==msId)}:p));
  const updateMilestone=(msId,field,val)=>setProjects(projects.map(p=>p.id===selProject?{...p,milestones:(p.milestones||[]).map(m=>m.id===msId?{...m,[field]:val}:m)}:p));
  const saveReport=()=>{if(!reportForm.summary)return;setProjects(projects.map(p=>p.id===selProject?{...p,dailyReports:[...(p.dailyReports||[]),{...reportForm,id:uid()}]}:p));setReportForm({date:T,summary:"",activities:"",issues:"",nextPlan:"",reporter:""});setShowReportForm(false);showToast("✓ Laporan ditambahkan");};
  const deleteReport=(rid)=>setProjects(projects.map(p=>p.id===selProject?{...p,dailyReports:(p.dailyReports||[]).filter(r=>r.id!==rid)}:p));
  const moveToCompleted=(proj)=>{if(!window.confirm("Tandai sebagai Completed?"))return;setCompleted([...(completedProjects||[]),{...proj,phase:"Completed",status:"Completed",completedDate:T,afterSalesNotes:"",warrantyEnd:addDays(T,365)}]);setProjects(projects.filter(p=>p.id!==proj.id));setSelProject(null);showToast("✓ Dipindahkan ke Completed");};

  // DETAIL VIEW
  if(selProj) {
    const {plan,actual}=calcProjectProgress(selProj);
    const d=daysLeft(selProj.deadline);
    const budgetPct=selProj.budget>0?Math.round((selProj.spent||0)/selProj.budget*100):0;
    const PROJ_TABS=[{id:"overview",label:"Overview"},{id:"milestones",label:"Milestones"},{id:"reports",label:"Laporan"},{id:"budget",label:"Budget"}];
    return(
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:20}}>
          <button onClick={()=>setSelProject(null)} style={{...btnSm("#1e3a5f"),fontSize:11}}>← Kembali</button>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:2}}>▸ DETAIL PROYEK</div>
          {canEdit&&<button onClick={()=>moveToCompleted(selProj)} style={{...btnSm("#10b981"),fontSize:10,marginLeft:"auto"}}>✓ Mark Complete</button>}
          {canEdit&&<button onClick={()=>deleteProject(selProj.id)} style={{...btnSm("#ef4444"),fontSize:10}}>🗑 Hapus</button>}
        </div>
        <div style={{...card,marginBottom:16,borderLeft:`4px solid ${phaseColor[selProj.phase]||"#64748b"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:18,color:"#e2e8f0",fontWeight:800,marginBottom:6}}>{selProj.name}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <PhaseBadge phase={selProj.phase}/>
                <Badge label={selProj.status} color={statusColor[selProj.status]}/>
                <Badge label={selProj.priority} color={priorityColor[selProj.priority]}/>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:26,fontWeight:900,color:d<0?"#ef4444":d<=7?"#f59e0b":"#38bdf8"}}>{d<0?`${Math.abs(d)}h LATE`:d===0?"HARI INI":`${d} hari`}</div>
              <div style={{fontSize:9,color:"#475569"}}>{fmtDate(selProj.startDate)} → {fmtDate(selProj.deadline)}</div>
            </div>
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8}}>
            {[["CUSTOMER",selProj.customer,"#38bdf8"],["PIC",selProj.pic,"#a78bfa"],["BUDGET",fmtIDR(selProj.budget),"#10b981"],["SPENT",fmtIDR(selProj.spent),"#f59e0b"]].map(([l,v,c])=>(
              <div key={l} style={{background:"#0f274460",borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:8,color:"#475569",marginBottom:2}}>{l}</div><div style={{fontSize:13,color:c,fontWeight:700}}>{v}</div></div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:4"}}><span>Plan {plan}%</span><span>Actual {actual}%</span></div>
            <ProgressBar value={plan} color="#3b82f666" h={5}/>
            <div style={{height:3}}/>
            <ProgressBar value={actual} color={statusColor[selProj.status]} h={10}/>
          </div>
          {/* Edit fields */}
          {canEdit&&<div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
            {[["PHASE","phase","select",PHASES],["STATUS","status","select",["On Track","At Risk","Delayed","On Hold"]],["PRIORITY","priority","select",["Critical","High","Medium","Low"]]].map(([lbl,key,type,opts])=>(
              <div key={key}><div style={{fontSize:8,color:"#475569",marginBottom:2}}>{lbl}</div>
                <select style={{...inp,fontSize:11,padding:"5px 8px"}} value={selProj[key]} onChange={e=>updateProjectField(selProj.id,key,e.target.value)}>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>}
        </div>
        {/* Sub-tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto"}}>
          {PROJ_TABS.map(t=>(
            <button key={t.id} onClick={()=>setProjTab(t.id)} style={{background:projTab===t.id?"linear-gradient(135deg,#cc0000,#991111)":"transparent",border:projTab===t.id?"none":"1px solid #1e3a5f",color:projTab===t.id?"#fff":"#64748b",borderRadius:8,padding:"6px 14px",fontSize:10,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>{t.label}</button>
          ))}
        </div>
        {projTab==="overview"&&(
          <div>
            <div style={{...card,marginBottom:12}}>
              <div style={{fontSize:10,color:"#64748b",marginBottom:6}}>NOTES / CATATAN</div>
              {canEdit?<textarea style={{...inp,minHeight:80,resize:"vertical"}} value={selProj.notes||""} onChange={e=>updateProjectField(selProj.id,"notes",e.target.value)} placeholder="Catatan proyek..."/>:<div style={{fontSize:11,color:"#94a3b8",lineHeight:1.6}}>{selProj.notes||"Belum ada catatan"}</div>}
            </div>
            <div style={{...card}}>
              <div style={{fontSize:10,color:"#38bdf8",letterSpacing:2,marginBottom:12}}>▸ TEAM MEMBERS</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {(selProj.team||[]).map(tid=>{const eng=engineers.find(e=>e.id===tid);return eng?(<div key={tid} style={{background:"#0f274460",borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:kpiColor(eng.kpi)+"22",border:`1.5px solid ${kpiColor(eng.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:kpiColor(eng.kpi)}}>{eng.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><div><div style={{fontSize:10,color:"#e2e8f0"}}>{eng.name}</div><div style={{fontSize:8,color:"#475569"}}>{eng.dept}</div></div></div>):null;})}
              </div>
            </div>
          </div>
        )}
        {projTab==="milestones"&&(
          <div>
            {canEdit&&<button onClick={()=>setShowMilestoneForm(!showMilestoneForm)} style={{...btn("#cc0000"),marginBottom:12}}>+ Tambah Milestone</button>}
            {showMilestoneForm&&canEdit&&(
              <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
                <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:10}}>▸ MILESTONE BARU</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NAMA MILESTONE *</div><input style={inp} value={milestoneForm.name} onChange={e=>setMilestoneForm({...milestoneForm,name:e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TARGET DATE</div><input type="date" style={inp} value={milestoneForm.date} onChange={e=>setMilestoneForm({...milestoneForm,date:e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PLAN PROGRESS (%)</div><input type="number" min="0" max="100" style={inp} value={milestoneForm.planProgress} onChange={e=>setMilestoneForm({...milestoneForm,planProgress:+e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ACTUAL PROGRESS (%)</div><input type="number" min="0" max="100" style={inp} value={milestoneForm.actualProgress} onChange={e=>setMilestoneForm({...milestoneForm,actualProgress:+e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DESKRIPSI</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={milestoneForm.description} onChange={e=>setMilestoneForm({...milestoneForm,description:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}><button onClick={saveMilestone} style={{...btn("#10b981")}}>SIMPAN</button><button onClick={()=>setShowMilestoneForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button></div>
              </div>
            )}
            {(selProj.milestones||[]).length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:40}}>Belum ada milestone</div>}
            {(selProj.milestones||[]).map(ms=>{
              const variance=(ms.actualProgress||0)-(ms.planProgress||0);
              return(
                <div key={ms.id} style={{...card,marginBottom:12,borderLeft:`3px solid ${variance>=0?"#10b981":"#f59e0b"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{ms.name}</div><div style={{fontSize:10,color:"#64748b"}}>{fmtDate(ms.date)}</div></div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,background:variance>=0?"#10b98122":"#ef444422",color:variance>=0?"#10b981":"#ef4444",fontWeight:700}}>{variance>=0?"+":""}{variance}% VAR</span>
                      {canEdit&&<button onClick={()=>deleteMilestone(ms.id)} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>✕</button>}
                    </div>
                  </div>
                  <div style={{marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",marginBottom:3}}><span>Plan {ms.planProgress||0}%</span></div><ProgressBar value={ms.planProgress||0} color="#3b82f666" h={5}/></div>
                  <div><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",marginBottom:3}}><span>Actual {ms.actualProgress||0}%</span></div><ProgressBar value={ms.actualProgress||0} color={variance>=0?"#10b981":"#f59e0b"} h={8}/></div>
                  {canEdit&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:10}}>
                    {[["PLAN %","planProgress"],["ACTUAL %","actualProgress"]].map(([lbl,key])=>(
                      <div key={key}><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>{lbl}</div><input type="number" min="0" max="100" style={{...inp,fontSize:11,padding:"5px 8px"}} value={ms[key]||0} onChange={e=>updateMilestone(ms.id,key,+e.target.value)}/></div>
                    ))}
                    <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>DATE</div><input type="date" style={{...inp,fontSize:11,padding:"5px 8px"}} value={ms.date||""} onChange={e=>updateMilestone(ms.id,"date",e.target.value)}/></div>
                  </div>}
                  {ms.description&&<div style={{fontSize:10,color:"#64748b",marginTop:8,fontStyle:"italic"}}>{ms.description}</div>}
                </div>
              );
            })}
          </div>
        )}
        {projTab==="reports"&&(
          <div>
            {canEdit&&<button onClick={()=>setShowReportForm(!showReportForm)} style={{...btn("#cc0000"),marginBottom:12}}>+ Tambah Laporan</button>}
            {showReportForm&&canEdit&&(
              <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
                <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:10}}>▸ LAPORAN HARIAN</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TANGGAL</div><input type="date" style={inp} value={reportForm.date} onChange={e=>setReportForm({...reportForm,date:e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>REPORTER</div><input style={inp} value={reportForm.reporter} onChange={e=>setReportForm({...reportForm,reporter:e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>RINGKASAN *</div><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={reportForm.summary} onChange={e=>setReportForm({...reportForm,summary:e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ISSUES</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={reportForm.issues} onChange={e=>setReportForm({...reportForm,issues:e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>RENCANA BESOK</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={reportForm.nextPlan} onChange={e=>setReportForm({...reportForm,nextPlan:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}><button onClick={saveReport} style={{...btn("#10b981")}}>SIMPAN</button><button onClick={()=>setShowReportForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button></div>
              </div>
            )}
            {[...(selProj.dailyReports||[])].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>(
              <div key={r.id} style={{...card,marginBottom:12,borderLeft:"3px solid #cc0000"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>📋 {fmtDate(r.date)}</div>{r.reporter&&<div style={{fontSize:10,color:"#64748b"}}>Oleh: {r.reporter}</div>}</div>
                  {canEdit&&<button onClick={()=>deleteReport(r.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
                {r.summary&&<div style={{marginBottom:8}}><div style={{fontSize:9,color:"#38bdf8",letterSpacing:1,marginBottom:3}}>RINGKASAN</div><div style={{fontSize:11,color:"#cbd5e1",lineHeight:1.6}}>{r.summary}</div></div>}
                {r.issues&&<div style={{marginBottom:8,background:"#ef444411",border:"1px solid #ef444433",borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:9,color:"#ef4444",marginBottom:3}}>ISSUES</div><div style={{fontSize:11,color:"#fca5a5",lineHeight:1.6}}>{r.issues}</div></div>}
                {r.nextPlan&&<div><div style={{fontSize:9,color:"#10b981",marginBottom:3}}>RENCANA BESOK</div><div style={{fontSize:11,color:"#6ee7b7",lineHeight:1.6}}>{r.nextPlan}</div></div>}
              </div>
            ))}
            {(selProj.dailyReports||[]).length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:40}}>Belum ada laporan harian</div>}
          </div>
        )}
        {projTab==="budget"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={card}>
              <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:16}}>▸ BUDGET PROYEK</div>
              {[["BUDGET (Rp)","budget"],["SPENT (Rp)","spent"],["MANDAYS","mandays"]].map(([lbl,key])=>(
                <div key={key} style={{marginBottom:10}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{lbl}</div>
                  <input type="number" style={inp} value={selProj[key]||""} onChange={e=>updateProjectField(selProj.id,key,Number(e.target.value)||0)}/>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:16}}>▸ RINGKASAN</div>
              {selProj.budget>0?(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    {[["BUDGET",selProj.budget,"#38bdf8"],["SPENT",selProj.spent||0,"#f59e0b"],["SISA",(selProj.budget||0)-(selProj.spent||0),"#10b981"]].map(([l,v,c])=>(
                      <div key={l}><div style={{fontSize:8,color:"#64748b"}}>{l}</div><div style={{fontSize:16,color:c,fontWeight:800}}>{fmtIDR(v)}</div></div>
                    ))}
                  </div>
                  <ProgressBar value={budgetPct} color={budgetPct>90?"#ef4444":budgetPct>75?"#f59e0b":"#10b981"} h={12}/>
                  <div style={{fontSize:10,color:"#64748b",marginTop:6}}>{budgetPct}% terpakai</div>
                </div>
              ):<div style={{textAlign:"center",color:"#334155",padding:30}}>Budget belum diisi</div>}
            </div>
          </div>
        )}
      </div>
    );
  }

  // PROJECT LIST
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ MANAJEMEN PROYEK ({filteredProjects.length}/{projects.length})</div>
        {canEdit&&<button onClick={()=>setShowAddProject(true)} style={{...btn("#cc0000")}}>+ TAMBAH PROYEK</button>}
      </div>
      <div style={{...card,marginBottom:14,padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input style={{...inp,flex:1,minWidth:180}} placeholder="🔍 Cari proyek / customer..." value={projFilter.search} onChange={e=>setProjFilter({...projFilter,search:e.target.value})}/>
          <select style={{...inp,width:"auto"}} value={projFilter.phase} onChange={e=>setProjFilter({...projFilter,phase:e.target.value})}><option value="all">All Phase</option>{PHASES.map(s=><option key={s}>{s}</option>)}</select>
          <select style={{...inp,width:"auto"}} value={projFilter.status} onChange={e=>setProjFilter({...projFilter,status:e.target.value})}><option value="all">All Status</option>{["On Track","At Risk","Delayed","On Hold"].map(s=><option key={s}>{s}</option>)}</select>
          <select style={{...inp,width:"auto"}} value={projFilter.priority} onChange={e=>setProjFilter({...projFilter,priority:e.target.value})}><option value="all">All Priority</option>{["Critical","High","Medium","Low"].map(s=><option key={s}>{s}</option>)}</select>
          <select style={{...inp,width:"auto"}} value={projFilter.customer} onChange={e=>setProjFilter({...projFilter,customer:e.target.value})}><option value="all">All Customer</option>{customers.map(c=><option key={c}>{c}</option>)}</select>
        </div>
      </div>
      {showAddProject&&canEdit&&(
        <Modal title="Tambah Proyek Baru" onClose={()=>setShowAddProject(false)} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["NAMA PROYEK *","text","name"],["CUSTOMER *","text","customer"],["PIC","text","pic"]].map(([l,t,k])=>(
              <div key={k}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{l}</div><input type={t} style={inp} value={newProject[k]||""} onChange={e=>setNewProject({...newProject,[k]:e.target.value})}/></div>
            ))}
            {[["PHASE","phase","select",PHASES],["STATUS","status","select",["On Track","At Risk","Delayed","On Hold"]],["PRIORITY","priority","select",["Critical","High","Medium","Low"]]].map(([l,k,t,opts])=>(
              <div key={k}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{l}</div><select style={inp} value={newProject[k]} onChange={e=>setNewProject({...newProject,[k]:e.target.value})}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
            ))}
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>MULAI</div><input type="date" style={inp} value={newProject.startDate} onChange={e=>setNewProject({...newProject,startDate:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DEADLINE</div><input type="date" style={inp} value={newProject.deadline} onChange={e=>setNewProject({...newProject,deadline:e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NOTES</div><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={newProject.notes} onChange={e=>setNewProject({...newProject,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}><button onClick={saveProject} style={{...btn("#cc0000")}}>SIMPAN PROYEK</button><button onClick={()=>setShowAddProject(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button></div>
        </Modal>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
        {filteredProjects.map(p=>{
          const {plan,actual}=calcProjectProgress(p);const d=daysLeft(p.deadline);const teamCount=(p.team||[]).length;
          return(
            <div key={p.id} onClick={()=>setSelProject(p.id)} style={{...card,cursor:"pointer",position:"relative",borderLeft:`3px solid ${phaseColor[p.phase]||"#64748b"}`,transition:"transform .15s,box-shadow .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px #38bdf810";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,paddingRight:20}}>
                  <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700,marginBottom:4}}>{p.name}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <PhaseBadge phase={p.phase}/><Badge label={p.status} color={statusColor[p.status]}/><Badge label={p.priority} color={priorityColor[p.priority]}/>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:6}}>
                <span>PIC: <span style={{color:"#e2e8f0"}}>{p.pic}</span></span>
                <span>👥 {teamCount}</span>
                <span style={{color:d<0?"#ef4444":d<=7?"#f59e0b":"#64748b",fontWeight:d<=7?700:400}}>{d<0?`${Math.abs(d)}h telat`:fmtDate(p.deadline)}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:9,color:"#3b82f6",minWidth:40}}>Plan {plan}%</span><ProgressBar value={plan} color="#3b82f666" h={4}/>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:statusColor[p.status],minWidth:40}}>Actual {actual}%</span><ProgressBar value={actual} color={statusColor[p.status]} h={7}/>
              </div>
              {canEdit&&<button onClick={e=>{e.stopPropagation();deleteProject(p.id);}} style={{position:"absolute",top:10,right:10,background:"transparent",border:"none",color:"#334155",cursor:"pointer",fontSize:16}} title="Hapus">×</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MANPOWER TAB — with WhatsApp integration
// ═══════════════════════════════════════════════════════════════
function ManpowerTab({engineers,setEngineers,card,inp,btn,btnSm,showToast,canEdit}) {
  const [mpFilter,setMpFilter]=useState({search:"",dept:"all",status:"all"});
  const [showAddForm,setShowAddForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const [editData,setEditData]=useState({});
  const [newEng,setNewEng]=useState({name:"",role:"",dept:"",availability:100,kpi:80,hoursLogged:0,status:"active",phone:"",email:""});

  const depts=[...new Set(engineers.map(e=>e.dept))].sort();
  const filteredEngineers=engineers.filter(e=>{
    const ms=e.name.toLowerCase().includes(mpFilter.search.toLowerCase())||e.role.toLowerCase().includes(mpFilter.search.toLowerCase());
    return ms&&(mpFilter.dept==="all"||e.dept===mpFilter.dept)&&(mpFilter.status==="all"||e.status===mpFilter.status);
  });
  const deptGroups=[...new Set(filteredEngineers.map(e=>e.dept))].sort();

  const addEngineer=()=>{if(!newEng.name||!newEng.role)return;setEngineers([...engineers,{...newEng,id:Date.now()}]);setNewEng({name:"",role:"",dept:"",availability:100,kpi:80,hoursLogged:0,status:"active",phone:"",email:""});setShowAddForm(false);showToast("✓ Manpower ditambahkan");};
  const deleteEngineer=(id)=>{if(!window.confirm("Hapus manpower ini?"))return;setEngineers(engineers.filter(e=>e.id!==id));showToast("Manpower dihapus","#ef4444");};
  const saveEdit=()=>{setEngineers(engineers.map(e=>e.id===editId?{...e,...editData}:e));setEditId(null);showToast("✓ Data diperbarui");};

  const formatWA=(phone)=>{if(!phone)return null;const clean=phone.replace(/[^0-9]/g,"");const num=clean.startsWith("0")?`62${clean.slice(1)}`:clean.startsWith("62")?clean:`62${clean}`;return`https://wa.me/${num}`;};

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ MANPOWER ({filteredEngineers.length}/{engineers.length})</div>
        {canEdit&&<button onClick={()=>setShowAddForm(true)} style={{...btn("#cc0000")}}>+ TAMBAH MANPOWER</button>}
      </div>
      <div style={{...card,marginBottom:14,padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input style={{...inp,flex:1,minWidth:160}} placeholder="🔍 Cari nama / role..." value={mpFilter.search} onChange={e=>setMpFilter({...mpFilter,search:e.target.value})}/>
          <select style={{...inp,width:"auto"}} value={mpFilter.dept} onChange={e=>setMpFilter({...mpFilter,dept:e.target.value})}><option value="all">All Dept</option>{depts.map(d=><option key={d}>{d}</option>)}</select>
          <select style={{...inp,width:"auto"}} value={mpFilter.status} onChange={e=>setMpFilter({...mpFilter,status:e.target.value})}><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </div>
      </div>
      {showAddForm&&canEdit&&(
        <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ MANPOWER BARU</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[["NAMA *","text","name"],["ROLE *","text","role"],["DEPARTMENT","text","dept"],["NO. WA (62xxx)","text","phone"],["EMAIL","email","email"]].map(([lbl,type,key])=>(
              <div key={key}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{lbl}</div><input type={type} style={inp} value={newEng[key]||""} onChange={e=>setNewEng({...newEng,[key]:e.target.value})}/></div>
            ))}
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>STATUS</div><select style={inp} value={newEng.status} onChange={e=>setNewEng({...newEng,status:e.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div style={{display:"flex",gap:8}}><button onClick={addEngineer} style={{...btn("#10b981")}}>TAMBAH</button><button onClick={()=>setShowAddForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button></div>
        </div>
      )}
      {deptGroups.map(dept=>(
        <div key={dept} style={{marginBottom:20}}>
          <div style={{fontSize:10,color:"#38bdf8",letterSpacing:3,marginBottom:10}}>▸ {dept.toUpperCase()} ({filteredEngineers.filter(e=>e.dept===dept).length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {filteredEngineers.filter(e=>e.dept===dept).map(e=>{
              const isEditing=editId===e.id;
              const waUrl=formatWA(e.phone);
              return(
                <div key={e.id} style={{...card,padding:14,border:`1px solid ${kpiColor(e.kpi)}33`}}>
                  {isEditing?(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        {[["NAMA","name"],["ROLE","role"],["DEPT","dept"],["NO. WA","phone"],["EMAIL","email"]].map(([lbl,key])=>(
                          <div key={key}><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>{lbl}</div><input style={{...inp,fontSize:11,padding:"5px 8px"}} value={editData[key]??e[key]??""} onChange={ev=>setEditData({...editData,[key]:ev.target.value})}/></div>
                        ))}
                        <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>STATUS</div><select style={{...inp,fontSize:11,padding:"5px 8px"}} value={editData.status??e.status} onChange={ev=>setEditData({...editData,status:ev.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                      </div>
                      <div style={{display:"flex",gap:6}}><button onClick={saveEdit} style={{...btnSm("#10b981"),fontSize:10}}>Simpan</button><button onClick={()=>setEditId(null)} style={{...btnSm("#64748b"),fontSize:10}}>Batal</button></div>
                    </div>
                  ):(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div>
                          <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{e.name}</div>
                          <div style={{fontSize:9,color:"#475569"}}>{e.role}</div>
                          <div style={{display:"flex",gap:6,marginTop:4}}>
                            <span style={{fontSize:8,padding:"1px 5px",borderRadius:99,background:e.status==="active"?"#10b98122":"#6b728022",color:e.status==="active"?"#10b981":"#6b7280",fontWeight:700}}>{e.status}</span>
                          </div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:20,fontWeight:900,color:kpiColor(e.kpi)}}>{e.kpi}%</div>
                          <div style={{fontSize:8,color:"#a78bfa"}}>{e.hoursLogged}h</div>
                        </div>
                      </div>
                      <div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",marginBottom:3}}><span>Availability</span><span>{e.availability}%</span></div><ProgressBar value={e.availability} color="#38bdf8" h={5}/></div>
                      <ProgressBar value={e.kpi} color={kpiColor(e.kpi)} h={7}/>
                      <div style={{display:"flex",gap:6,marginTop:10,alignItems:"center"}}>
                        {waUrl&&<a href={waUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,background:"#25d36622",border:"1px solid #25d36644",color:"#25d366",borderRadius:6,padding:"4px 8px",fontSize:9,textDecoration:"none",fontWeight:700}}><span style={{fontSize:12}}>💬</span> WA</a>}
                        {e.email&&<a href={`mailto:${e.email}`} style={{display:"flex",alignItems:"center",gap:4,background:"#38bdf822",border:"1px solid #38bdf844",color:"#38bdf8",borderRadius:6,padding:"4px 8px",fontSize:9,textDecoration:"none",fontWeight:700}}><span style={{fontSize:12}}>✉</span> Email</a>}
                        {canEdit&&<div style={{display:"flex",gap:4,marginLeft:"auto"}}>
                          <button onClick={()=>{setEditId(e.id);setEditData({});}} style={{...btnSm("#38bdf8"),fontSize:9}}>Edit</button>
                          <button onClick={()=>deleteEngineer(e.id)} style={{...btnSm("#ef4444"),fontSize:9}}>Del</button>
                        </div>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMELINE TAB
// ═══════════════════════════════════════════════════════════════
function TimelineTab({ projects, card, setSelProject, setTab }) {
  const sorted = [...projects].sort((a,b)=>new Date(a.startDate)-new Date(b.startDate));
  const allDates = projects.flatMap(p=>[new Date(p.startDate),new Date(p.deadline)]);
  const minDate = new Date(Math.min(...allDates.map(d=>d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d=>d.getTime())));
  const totalMs = maxDate-minDate||1;
  return(
    <div>
      <div style={{fontSize:11,color:"#cc0000",letterSpacing:4,marginBottom:20}}>▸ PROJECT TIMELINE</div>
      <div style={card}>
        {sorted.map(p=>{
          const start=new Date(p.startDate),end=new Date(p.deadline);
          const left=Math.max(0,(start-minDate)/totalMs*100);
          const width=Math.max(1,(end-start)/totalMs*100);
          const d=daysLeft(p.deadline);
          const c=phaseColor[p.phase]||"#64748b";
          return(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");}}>
              <div style={{width:180,flexShrink:0}}>
                <div style={{fontSize:10,color:"#e2e8f0",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:8,color:"#475569"}}>{p.customer}</div>
              </div>
              <div style={{flex:1,height:28,background:"#0f2744",borderRadius:4,position:"relative"}}>
                <div style={{position:"absolute",left:`${left}%`,width:`${Math.min(width,100-left)}%`,height:"100%",background:`linear-gradient(90deg,${c},${c}88)`,borderRadius:4,display:"flex",alignItems:"center",paddingLeft:6}}>
                  <span style={{fontSize:8,color:"#fff",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden"}}>{p.phase}</span>
                </div>
              </div>
              <div style={{width:60,textAlign:"right",fontSize:9,color:d<0?"#ef4444":d<=7?"#f59e0b":"#64748b",flexShrink:0,fontWeight:700}}>{d<0?`${Math.abs(d)}h late`:d===0?"Today":`${d}d`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPLETED TAB
// ═══════════════════════════════════════════════════════════════
function CompletedTab({completedProjects,setCompleted,engineers,canEdit,card,inp,btn,btnSm,showToast}) {
  const [editId,setEditId]=useState(null);
  return(
    <div>
      <div style={{fontSize:11,color:"#cc0000",letterSpacing:4,marginBottom:20}}>▸ COMPLETED PROJECTS ({completedProjects.length})</div>
      {completedProjects.length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:60}}>Belum ada proyek selesai</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
        {completedProjects.map(p=>(
          <div key={p.id} style={{...card,borderLeft:"3px solid #10b981"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div><div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{p.name}</div><div style={{fontSize:9,color:"#475569"}}>{p.customer} · {fmtDate(p.completedDate)}</div></div>
              {canEdit&&<button onClick={()=>{if(!window.confirm("Hapus?"))return;setCompleted(completedProjects.filter(cp=>cp.id!==p.id));showToast("Dihapus","#ef4444");}} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>✕</button>}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
              <Badge label="COMPLETED" color="#10b981"/>
              <Badge label={p.priority} color={priorityColor[p.priority]}/>
            </div>
            <div style={{display:"flex",gap:16,marginBottom:8}}>
              <div><div style={{fontSize:8,color:"#64748b"}}>BUDGET</div><div style={{fontSize:11,color:"#38bdf8",fontWeight:700}}>{fmtIDR(p.budget)}</div></div>
              <div><div style={{fontSize:8,color:"#64748b"}}>SPENT</div><div style={{fontSize:11,color:"#f59e0b",fontWeight:700}}>{fmtIDR(p.spent)}</div></div>
              <div><div style={{fontSize:8,color:"#64748b"}}>GARANSI</div><div style={{fontSize:11,color:"#10b981",fontWeight:700}}>{fmtDate(p.warrantyEnd)}</div></div>
            </div>
            {editId===p.id&&canEdit&&(
              <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>AFTER SALES NOTES</div>
                <textarea style={{...inp,minHeight:60,resize:"vertical"}} defaultValue={p.afterSalesNotes||""} onBlur={e=>setCompleted(completedProjects.map(cp=>cp.id===p.id?{...cp,afterSalesNotes:e.target.value}:cp))}/>
                <button onClick={()=>setEditId(null)} style={{...btnSm("#10b981"),fontSize:9,marginTop:6}}>Tutup</button>
              </div>
            )}
            {p.afterSalesNotes&&editId!==p.id&&<div style={{fontSize:9,color:"#64748b",fontStyle:"italic",marginTop:6}}>{p.afterSalesNotes}</div>}
            {canEdit&&editId!==p.id&&<button onClick={()=>setEditId(p.id)} style={{...btnSm("#38bdf8"),fontSize:9,marginTop:8}}>✏ After Sales Notes</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROUTE TAB
// ═══════════════════════════════════════════════════════════════
function RouteTab({routes,setRoutes,vehicles,setVehicles,engineers,canEdit,card,inp,btn,btnSm,showToast}) {
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({date:T,vehicleId:"",driver:"",destination:"",activities:[],team:[],notes:"",status:"scheduled",kmStart:""});
  const vehicleMap=Object.fromEntries(vehicles.map(v=>[v.id,v]));
  const statusC={scheduled:"#3b82f6",in_progress:"#f59e0b",completed:"#10b981",cancelled:"#ef4444"};
  const saveRoute=()=>{if(!form.destination||!form.vehicleId)return;setRoutes([...routes,{...form,id:uid(),kmStart:+form.kmStart||0}]);setForm({date:T,vehicleId:"",driver:"",destination:"",activities:[],team:[],notes:"",status:"scheduled",kmStart:""});setShowForm(false);showToast("✓ Route ditambahkan");};
  const deleteRoute=(id)=>{setRoutes(routes.filter(r=>r.id!==id));showToast("Route dihapus","#ef4444");};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ VEHICLE & ROUTE</div>
        {canEdit&&<button onClick={()=>setShowForm(true)} style={{...btn("#cc0000")}}>+ TAMBAH ROUTE</button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:16}}>
        {vehicles.map(v=>(
          <div key={v.id} style={{...card,padding:14,border:`1px solid ${v.status==="available"?"#10b98133":v.status==="maintenance"?"#f59e0b33":"#6b728033"}`}}>
            <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{v.type}</div>
            <div style={{fontSize:10,color:"#38bdf8"}}>{v.plate}</div>
            <div style={{fontSize:9,color:"#475569",marginTop:4}}>Odometer: {v.odometerKm?.toLocaleString()} km</div>
            <Badge label={v.status.toUpperCase()} color={v.status==="available"?"#10b981":v.status==="maintenance"?"#f59e0b":"#6b7280"}/>
          </div>
        ))}
      </div>
      {showForm&&canEdit&&(
        <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ ROUTE BARU</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TANGGAL</div><input type="date" style={inp} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KENDARAAN</div><select style={inp} value={form.vehicleId} onChange={e=>setForm({...form,vehicleId:+e.target.value})}><option value="">Pilih</option>{vehicles.map(v=><option key={v.id} value={v.id}>{v.type} - {v.plate}</option>)}</select></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DRIVER</div><input style={inp} value={form.driver} onChange={e=>setForm({...form,driver:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TUJUAN *</div><input style={inp} value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KM START</div><input type="number" style={inp} value={form.kmStart} onChange={e=>setForm({...form,kmStart:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>STATUS</div><select style={inp} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="scheduled">Scheduled</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NOTES</div><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}><button onClick={saveRoute} style={{...btn("#10b981")}}>SIMPAN</button><button onClick={()=>setShowForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button></div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[...routes].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>{
          const v=vehicleMap[r.vehicleId];
          return(
            <div key={r.id} style={{...card,borderLeft:`3px solid ${statusC[r.status]||"#64748b"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{r.destination}</div>
                  <div style={{fontSize:10,color:"#475569"}}>{fmtDate(r.date)} · {r.driver}{v?` · ${v.plate}`:""}</div>
                  {r.notes&&<div style={{fontSize:9,color:"#64748b",marginTop:4,fontStyle:"italic"}}>{r.notes}</div>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {canEdit&&<select style={{...inp,width:"auto",fontSize:9,padding:"3px 6px"}} value={r.status} onChange={e=>setRoutes(routes.map(rt=>rt.id===r.id?{...rt,status:e.target.value}:rt))}><option value="scheduled">Scheduled</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>}
                  {canEdit&&<button onClick={()=>deleteRoute(r.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════
function UsersTab({users,setUsers,currentUser,canEdit,card,inp,btn,btnSm,showToast}) {
  const [newUser,setNewUser]=useState({username:"",password:"",name:"",role:"viewer"});
  return(
    <div>
      <div style={{fontSize:11,color:"#cc0000",letterSpacing:4,marginBottom:18}}>▸ USER MANAGEMENT</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {users.map(u=>(
          <div key={u.id} style={{...card,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#cc0000,#991111)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>{u.avatar}</div>
            <div style={{flex:1}}><div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{u.name}</div><div style={{fontSize:10,color:"#64748b"}}>@{u.username} · {u.role}</div></div>
            <Badge label={u.role.toUpperCase()} color={u.role==="admin"?"#cc0000":u.role==="pm"?"#3b82f6":"#64748b"}/>
            <div style={{display:"flex",gap:6}}>
              <select style={{...inp,width:"auto",fontSize:11}} value={u.role} onChange={e=>setUsers(users.map(us=>us.id===u.id?{...us,role:e.target.value}:us))}><option value="admin">Admin</option><option value="pm">PM</option><option value="viewer">Viewer</option></select>
              {u.id!==currentUser.id&&<button onClick={()=>setUsers(users.filter(us=>us.id!==u.id))} style={{...btnSm("#ef4444")}}>Hapus</button>}
            </div>
          </div>
        ))}
      </div>
      <div style={{...card,border:"1px solid #cc000044"}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ TAMBAH USER</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {[["NAMA","text","name"],["USERNAME","text","username"],["PASSWORD","password","password"]].map(([l,t,k])=>(
            <div key={k}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{l}</div><input type={t} style={inp} value={newUser[k]} onChange={e=>setNewUser({...newUser,[k]:e.target.value})}/></div>
          ))}
          <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ROLE</div><select style={inp} value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}><option value="admin">Admin</option><option value="pm">PM</option><option value="viewer">Viewer</option></select></div>
        </div>
        <button onClick={()=>{if(!newUser.username||!newUser.password||!newUser.name)return;const avatar=newUser.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();setUsers([...users,{...newUser,id:uid(),avatar}]);setNewUser({username:"",password:"",name:"",role:"viewer"});showToast("✓ User ditambahkan");}} style={{...btn("#cc0000")}}>SIMPAN USER</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [currentUser,setCurrentUser]=useState(()=>DB.get("session"));
  const [tab,setTab]=useState("dashboard");
  const [projects,setProjectsState]=useState(()=>DB.get("projects")||[]);
  const [engineers,setEngineersState]=useState(()=>DB.get("engineers")||[]);
  const [users,setUsersState]=useState(()=>DB.get("users")||[]);
  const [vehicles,setVehiclesState]=useState(()=>DB.get("vehicles")||[]);
  const [routes,setRoutesState]=useState(()=>DB.get("routes")||[]);
  const [completedProjects,setCompletedState]=useState(()=>DB.get("completed_projects")||[]);
  const [toast,setToast]=useState(null);
  const [selProject,setSelProject]=useState(null);

  useEffect(()=>{initDB();},[]);

  const setProjects=useCallback((v)=>{const d=typeof v==="function"?v(projects):v;DB.set("projects",d);setProjectsState(d);},[projects]);
  const setEngineers=useCallback((v)=>{const d=typeof v==="function"?v(engineers):v;DB.set("engineers",d);setEngineersState(d);},[engineers]);
  const setUsers=useCallback((v)=>{const d=typeof v==="function"?v(users):v;DB.set("users",d);setUsersState(d);},[users]);
  const setVehicles=useCallback((v)=>{const d=typeof v==="function"?v(vehicles):v;DB.set("vehicles",d);setVehiclesState(d);},[vehicles]);
  const setRoutes=useCallback((v)=>{const d=typeof v==="function"?v(routes):v;DB.set("routes",d);setRoutesState(d);},[routes]);
  const setCompleted=useCallback((v)=>{const d=typeof v==="function"?v(completedProjects):v;DB.set("completed_projects",d);setCompletedState(d);},[completedProjects]);

  const showToast=(msg,color="#10b981")=>{setToast({msg,color});setTimeout(()=>setToast(null),2800);};
  const canEdit=currentUser?.role!=="viewer";

  const onLogin=(user)=>{DB.set("session",user);setCurrentUser(user);};
  const onLogout=()=>{DB.del("session");setCurrentUser(null);};

  if(!currentUser) return <LoginScreen onLogin={onLogin}/>;

  const inp={background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"8px 12px",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",width:"100%"};
  const card={background:"linear-gradient(135deg,#0d2137 0%,#0a1a2e 100%)",border:"1px solid #1e3a5f",borderRadius:16,padding:20};
  const btn=(color="#1e40af")=>({background:`linear-gradient(135deg,${color},${color}cc)`,border:"none",color:"#fff",borderRadius:8,padding:"8px 16px",fontSize:11,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1});
  const btnSm=(color="#1e40af")=>({background:`${color}22`,border:`1px solid ${color}`,color,borderRadius:6,padding:"4px 10px",fontSize:10,fontFamily:"inherit",cursor:"pointer",fontWeight:700});

  const sharedProps={projects,setProjects,engineers,setEngineers,completedProjects,setCompleted,card,inp,btn,btnSm,canEdit,showToast};

  return(
    <div style={{minHeight:"100vh",background:"#060e1a",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#cbd5e1",display:"flex"}}>
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.color+"22",border:`1px solid ${toast.color}`,color:toast.color,borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,boxShadow:`0 0 20px ${toast.color}44`,backdropFilter:"blur(8px)"}}>{toast.msg}</div>}

      <Sidebar tab={tab} setTab={(t)=>{setTab(t);setSelProject(null);}} currentUser={currentUser} onLogout={onLogout} projects={projects} engineers={engineers}/>

      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {/* Top bar */}
        <div style={{background:"linear-gradient(90deg,#0a1628,#0d2137)",borderBottom:"1px solid #1e3a5f",padding:"8px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:3}}>
            {NAV_GROUPS.flatMap(g=>g.items).concat([{id:"users",label:"Users"}]).find(t=>t.id===tab)?.label?.toUpperCase()||""}
          </div>
          <div style={{fontSize:9,color:"#334155"}}>{new Date().toLocaleDateString("id-ID",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div>
        </div>

        <div style={{flex:1,padding:"20px 24px",maxWidth:1400,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
          {tab==="dashboard"&&<DashboardTab {...sharedProps} setSelProject={setSelProject} setTab={setTab}/>}
          {tab==="projects"&&<ProjectsTab {...sharedProps} selProject={selProject} setSelProject={setSelProject} users={users} setUsers={setUsers} vehicles={vehicles} routes={routes} setRoutes={setRoutes} setVehicles={setVehicles}/>}
          {tab==="gantt"&&<GanttTab {...sharedProps}/>}
          {tab==="delivery"&&<DeliveryTab {...sharedProps}/>}
          {tab==="timeline"&&<TimelineTab projects={projects} card={card} setSelProject={setSelProject} setTab={setTab}/>}
          {tab==="completed"&&<CompletedTab completedProjects={completedProjects} setCompleted={setCompleted} engineers={engineers} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}
          {tab==="manpower"&&<ManpowerTab engineers={engineers} setEngineers={setEngineers} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast} canEdit={canEdit}/>}
          {tab==="calendar"&&<CalendarTab engineers={engineers} projects={projects} card={card} inp={inp} btn={btn} btnSm={btnSm} canEdit={canEdit} showToast={showToast}/>}
          {tab==="workhours"&&<WorkHoursTab engineers={engineers} projects={projects} card={card} inp={inp} btn={btn} btnSm={btnSm} canEdit={canEdit} showToast={showToast}/>}
          {tab==="timesheet"&&<TimesheetTab engineers={engineers} projects={projects} card={card} inp={inp} btn={btn} canEdit={canEdit}/>}
          {tab==="route"&&<RouteTab routes={routes} setRoutes={setRoutes} vehicles={vehicles} setVehicles={setVehicles} engineers={engineers} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}
          {tab==="kpi"&&<KPIProjectTab projects={projects} engineers={engineers} card={card} inp={inp} btn={btn} btnSm={btnSm} canEdit={canEdit} showToast={showToast}/>}
          {tab==="users"&&currentUser.role==="admin"&&<UsersTab users={users} setUsers={setUsers} currentUser={currentUser} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}
        </div>

        <div style={{textAlign:"center",padding:"8px 0",fontSize:9,color:"#1e3a5f",borderTop:"1px solid #0d2137"}}>
          PT. Frensiand Jaya Teknik · PMS v7.0 Enterprise · {projects.length} Active Projects · {engineers.length} Engineers
        </div>
      </div>
    </div>
  );
}