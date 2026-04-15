import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// DATABASE LAYER
// ═══════════════════════════════════════════════════════════════
const DB = {
  get: (k) => { try { const v = localStorage.getItem("fjt_"+k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem("fjt_"+k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem("fjt_"+k); } catch {} },
};

const uid = () => Date.now()+Math.random().toString(36).slice(2,7);
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
  { id:1, name:"Itho", role:"Programmer", dept:"Programmer", availability:80, kpi:85, hoursLogged:160, status:"active", phone:"", email:"" },
  { id:2, name:"Erick", role:"Programmer", dept:"Programmer", availability:70, kpi:82, hoursLogged:148, status:"active", phone:"", email:"" },
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
  { id:1, name:"Garudafood - List Consumable", customer:"Garudafood", phase:"Production", status:"On Track", projectStatus:"on_track", priority:"Medium", startDate:addDays(T,-10), deadline:addDays(T,20), pic:"Gatot", team:[1,4], notes:"List consumable items - procurement phase", budget:50000000, spent:15000000, mandays:30, milestones:[], dailyReports:[], documents:[] },
  { id:2, name:"Diamond - Puyo & Jungle Juice", customer:"Diamond", phase:"Installation", status:"On Track", projectStatus:"on_track", priority:"High", startDate:addDays(T,-15), deadline:addDays(T,30), pic:"Itho", team:[1,2], notes:"Follow Up Hasil Pengerjaan. BA process", budget:150000000, spent:80000000, mandays:45, milestones:[], dailyReports:[], documents:[] },
  { id:3, name:"Pepsico - Prepare Pengiriman", customer:"Pepsico", phase:"Ready to Delivery", status:"At Risk", projectStatus:"at_risk", priority:"Critical", startDate:addDays(T,-5), deadline:addDays(T,7), pic:"Erick", team:[2,6], notes:"Senin team datang. Selasa depan kirim.", budget:200000000, spent:170000000, mandays:20, milestones:[], dailyReports:[], documents:[] },
  { id:4, name:"Cuzzon - Waiting Jig Customer", customer:"Cuzzon", phase:"Planning", status:"On Hold", projectStatus:"on_hold", priority:"Medium", startDate:addDays(T,-20), deadline:addDays(T,60), pic:"Datuk", team:[12], notes:"Menunggu Jig customer - panjang tidak cukup", budget:80000000, spent:30000000, mandays:60, milestones:[], dailyReports:[], documents:[] },
  { id:5, name:"Torabika - Z Cleated Belt", customer:"Torabika", phase:"Commissioning", status:"At Risk", projectStatus:"at_risk", priority:"High", startDate:addDays(T,-8), deadline:addDays(T,5), pic:"Ridwan", team:[16,18], notes:"Negosiasi dan setting belt - harus minggu ini", budget:120000000, spent:95000000, mandays:25, milestones:[], dailyReports:[], documents:[] },
  { id:6, name:"Beng Beng Ball - Delivery", customer:"Beng Beng", phase:"Ready to Delivery", status:"On Track", projectStatus:"on_track", priority:"High", startDate:addDays(T,-12), deadline:addDays(T,4), pic:"Saad", team:[13,14], notes:"Sudah dibongkar - Prepare to delivery", budget:90000000, spent:75000000, mandays:18, milestones:[], dailyReports:[], documents:[] },
  { id:7, name:"Modifikasi Jalur GB 7", customer:"Internal", phase:"Production", status:"On Track", projectStatus:"on_track", priority:"Medium", startDate:addDays(T,-3), deadline:addDays(T,10), pic:"Candra", team:[15,17], notes:"On process modifikasi - minggu depan selesai", budget:60000000, spent:20000000, mandays:15, milestones:[], dailyReports:[], documents:[] },
  { id:8, name:"Unilever Savory - Pengerjaan", customer:"Unilever", phase:"Commissioning", status:"At Risk", projectStatus:"at_risk", priority:"Critical", startDate:addDays(T,-20), deadline:addDays(T,15), pic:"Raju", team:[19,4,5], notes:"Ada ketidaksesuaian EOL, LINE B, Setting robot", budget:350000000, spent:280000000, mandays:55, milestones:[], dailyReports:[], documents:[] },
];

const VEHICLES_SEED = [
  { id:1, type:"Grandmax", plate:"B 1234 FJT", color:"Putih", year:2020, status:"available", lastMaintenance:addDays(T,-30), nextMaintenance:addDays(T,60), odometerKm:45000, notes:"Kondisi baik" },
  { id:2, type:"Grandmax", plate:"B 5678 FJT", color:"Silver", year:2019, status:"available", lastMaintenance:addDays(T,-15), nextMaintenance:addDays(T,75), odometerKm:62000, notes:"Ban depan perlu cek" },
  { id:3, type:"Truck", plate:"B 9012 FJT", color:"Kuning", year:2018, status:"available", lastMaintenance:addDays(T,-45), nextMaintenance:addDays(T,15), odometerKm:98000, notes:"AC kurang dingin" },
  { id:4, type:"Truck", plate:"B 3456 FJT", color:"Merah", year:2021, status:"maintenance", lastMaintenance:T, nextMaintenance:addDays(T,90), odometerKm:32000, notes:"Sedang service rutin" },
];

const ROUTES_SEED = [
  { id:1, date:T, vehicleId:1, driver:"Andi Triyono", destination:"PT Garudafood Cikarang", activities:["Pengiriman spare part","Meeting teknis"], team:[27,4], notes:"Berangkat pukul 07:00", status:"completed", returnTime:"16:00", kmStart:45000, kmEnd:45087 },
  { id:2, date:T, vehicleId:3, driver:"Bayu", destination:"PT Unilever Cikarang", activities:["Instalasi conveyor line B","Commissioning robot"], team:[28,19,5], notes:"Bawa toolkit lengkap", status:"in_progress", returnTime:"", kmStart:98000, kmEnd:null },
  { id:3, date:addDays(T,1), vehicleId:2, driver:"Dedi", destination:"PT Pepsico Sentul", activities:["Pengiriman unit","Pengujian awal"], team:[29,2], notes:"Koordinasi dengan team site", status:"scheduled", returnTime:"", kmStart:62000, kmEnd:null },
];

const COMPLETED_PROJECTS_SEED = [
  { id:101, name:"Indofood - Palletizer Robot", customer:"Indofood", phase:"Completed", status:"Completed", projectStatus:"completed", priority:"High", startDate:addDays(T,-120), deadline:addDays(T,-30), completedDate:addDays(T,-35), pic:"Raju", team:[19,4,1], notes:"Selesai tepat waktu", budget:450000000, spent:420000000, mandays:90, milestones:[], dailyReports:[], documents:[], afterSalesNotes:"", warrantyEnd:addDays(T,335) },
  { id:102, name:"Nestle - Conveyor System", customer:"Nestle", phase:"Completed", status:"Completed", projectStatus:"completed", priority:"Medium", startDate:addDays(T,-90), deadline:addDays(T,-20), completedDate:addDays(T,-22), pic:"Datuk", team:[12,13,16], notes:"Minor rework di final", budget:280000000, spent:275000000, mandays:75, milestones:[], dailyReports:[], documents:[], afterSalesNotes:"Laporan service Q1", warrantyEnd:addDays(T,343) },
];

function initDB() {
  if (!DB.get("users")) DB.set("users", USERS_SEED);
  if (!DB.get("engineers")) DB.set("engineers", ENGINEERS_SEED);
  if (!DB.get("projects")) DB.set("projects", PROJECTS_SEED);
  if (!DB.get("vehicles")) DB.set("vehicles", VEHICLES_SEED);
  if (!DB.get("routes")) DB.set("routes", ROUTES_SEED);
  if (!DB.get("completed_projects")) DB.set("completed_projects", COMPLETED_PROJECTS_SEED);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS & CONSTANTS
// ═══════════════════════════════════════════════════════════════
const PHASES = ["Planning","Production","Ready to Delivery","Installation","Commissioning","Completed"];
const PROJECT_STATUSES = ["On Track","At Risk","Delayed","On Hold"];
const phaseColor = {"Planning":"#3b82f6","Production":"#8b5cf6","Ready to Delivery":"#f59e0b","Installation":"#06b6d4","Commissioning":"#ec4899","Completed":"#10b981"};
const statusColor = {"On Track":"#10b981","At Risk":"#f59e0b","Delayed":"#ef4444","On Hold":"#6b7280","Planning":"#3b82f6","Completed":"#10b981"};
const priorityColor = {"Critical":"#ef4444","High":"#f59e0b","Medium":"#3b82f6","Low":"#6b7280"};
const kpiColor = (v) => v>=85?"#10b981":v>=70?"#f59e0b":"#ef4444";
const daysLeft = (d) => Math.ceil((new Date(d)-new Date())/86400000);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fmtIDR = (v) => v != null ? "Rp "+new Intl.NumberFormat("id-ID",{notation:"compact",maximumFractionDigits:1}).format(v) : "—";

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
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
      <div style={{background:"linear-gradient(135deg,#0d2137,#0a1628)",border:"1px solid #1e3a5f",borderRadius:20,padding:28,width:"100%",maxWidth:wide?900:600,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 0 80px #38bdf820",boxSizing:"border-box"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:13,color:"#38bdf8",fontWeight:700,letterSpacing:2}}>{title}</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#64748b",fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button>
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
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ-(value/100)*circ} strokeLinecap="round"/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{fill:color,fontSize:13,fontWeight:700,fontFamily:"inherit",transform:"rotate(90deg)",transformOrigin:`${size/2}px ${size/2}px`}}>
        {value}%
      </text>
    </svg>
  );
}

function PhaseBadge({ phase }) {
  const c = phaseColor[phase] || "#64748b";
  return <span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:c+"22",color:c,fontWeight:700,letterSpacing:1,border:`1px solid ${c}44`}}>{phase}</span>;
}

// FJT Logo SVG
function FJTLogo({ size=36 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:size,height:size,flexShrink:0}}>
        <svg viewBox="0 0 60 60" style={{width:"100%",height:"100%"}}>
          <rect width="60" height="60" rx="10" fill="#cc0000"/>
          <text x="30" y="42" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="Georgia,serif">F</text>
          <rect x="36" y="10" width="16" height="4" rx="2" fill="white"/>
          <rect x="40" y="10" width="4" height="24" rx="2" fill="white"/>
        </svg>
      </div>
      <div>
        <div style={{color:"#fff",fontWeight:800,fontSize:13,letterSpacing:.5,fontFamily:"Georgia,serif"}}>PT. Frensland Jaya Teknik</div>
        <div style={{color:"#94a3b8",fontSize:8,letterSpacing:.5}}>Conveyor · Palletizing · Automation</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN
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
          <div style={{color:"#38bdf8",fontSize:10,letterSpacing:3}}>v5.0 ENTERPRISE</div>
        </div>
        {err&&<div style={{background:"#ef444422",border:"1px solid #ef444466",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#ef4444",marginBottom:16,textAlign:"center"}}>{err}</div>}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:6}}>USERNAME</div>
          <input value={u} onChange={e=>{setU(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{width:"100%",background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="admin / pm / viewer"/>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:6}}>PASSWORD</div>
          <input type="password" value={p} onChange={e=>{setP(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{width:"100%",background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="••••••••"/>
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
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [currentUser, setCurrentUser] = useState(()=>DB.get("session"));
  const [tab, setTab] = useState("dashboard");
  const [projects, setProjectsState] = useState(()=>DB.get("projects")||[]);
  const [engineers, setEngineersState] = useState(()=>DB.get("engineers")||[]);
  const [users, setUsersState] = useState(()=>DB.get("users")||[]);
  const [vehicles, setVehiclesState] = useState(()=>DB.get("vehicles")||[]);
  const [routes, setRoutesState] = useState(()=>DB.get("routes")||[]);
  const [completedProjects, setCompletedState] = useState(()=>DB.get("completed_projects")||[]);
  const [toast, setToast] = useState(null);
  const [selProject, setSelProject] = useState(null);
  const [projTab, setProjTab] = useState("overview");
  const [mpFilter, setMpFilter] = useState({search:"",dept:"all",status:"all"});
  const [projFilter, setProjFilter] = useState({status:"all",priority:"all",customer:"all",search:"",phase:"all"});

  useEffect(()=>{initDB();},[]);

  const setProjects = useCallback((v)=>{ const d=typeof v==="function"?v(projects):v; DB.set("projects",d); setProjectsState(d); },[projects]);
  const setEngineers = useCallback((v)=>{ const d=typeof v==="function"?v(engineers):v; DB.set("engineers",d); setEngineersState(d); },[engineers]);
  const setUsers = useCallback((v)=>{ const d=typeof v==="function"?v(users):v; DB.set("users",d); setUsersState(d); },[users]);
  const setVehicles = useCallback((v)=>{ const d=typeof v==="function"?v(vehicles):v; DB.set("vehicles",d); setVehiclesState(d); },[vehicles]);
  const setRoutes = useCallback((v)=>{ const d=typeof v==="function"?v(routes):v; DB.set("routes",d); setRoutesState(d); },[routes]);
  const setCompleted = useCallback((v)=>{ const d=typeof v==="function"?v(completedProjects):v; DB.set("completed_projects",d); setCompletedState(d); },[completedProjects]);

  const showToast = (msg,color="#10b981")=>{ setToast({msg,color}); setTimeout(()=>setToast(null),2800); };
  const canEdit = currentUser?.role!=="viewer";

  const onLogin = (user)=>{ DB.set("session",user); setCurrentUser(user); };
  const onLogout = ()=>{ DB.del("session"); setCurrentUser(null); };

  if(!currentUser) return <LoginScreen onLogin={onLogin}/>;

  const inp = {background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"8px 12px",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",width:"100%"};
  const card = {background:"linear-gradient(135deg,#0d2137 0%,#0a1a2e 100%)",border:"1px solid #1e3a5f",borderRadius:16,padding:20};
  const btn = (color="#1e40af")=>({background:`linear-gradient(135deg,${color},${color}cc)`,border:"none",color:"#fff",borderRadius:8,padding:"8px 16px",fontSize:11,fontFamily:"inherit",cursor:"pointer",fontWeight:700,letterSpacing:1});
  const btnSm = (color="#1e40af")=>({background:`${color}22`,border:`1px solid ${color}`,color,borderRadius:6,padding:"4px 10px",fontSize:10,fontFamily:"inherit",cursor:"pointer",fontWeight:700});

  const customers = [...new Set(projects.map(p=>p.customer))].sort();
  const filteredProjects = projects.filter(p=>{
    const ms=p.name.toLowerCase().includes(projFilter.search.toLowerCase())||p.customer.toLowerCase().includes(projFilter.search.toLowerCase());
    return ms&&(projFilter.status==="all"||p.status===projFilter.status)&&(projFilter.priority==="all"||p.priority===projFilter.priority)&&(projFilter.customer==="all"||p.customer===projFilter.customer)&&(projFilter.phase==="all"||p.phase===projFilter.phase);
  });

  const depts = [...new Set(engineers.map(e=>e.dept))].sort();
  const filteredEngineers = engineers.filter(e=>{
    const ms=e.name.toLowerCase().includes(mpFilter.search.toLowerCase())||e.role.toLowerCase().includes(mpFilter.search.toLowerCase());
    return ms&&(mpFilter.dept==="all"||e.dept===mpFilter.dept)&&(mpFilter.status==="all"||e.status===mpFilter.status);
  });

  const avgKpi = Math.round(engineers.reduce((a,e)=>a+e.kpi,0)/Math.max(engineers.length,1));
  const selProj = projects.find(p=>p.id===selProject);

  const calcProjectProgress = (proj) => {
    const ms=proj.milestones||[];
    if(ms.length===0) return {plan:proj.planProgress||0,actual:proj.progress||0};
    return { plan:Math.round(ms.reduce((a,m)=>a+(m.planProgress||0),0)/ms.length), actual:Math.round(ms.reduce((a,m)=>a+(m.actualProgress||0),0)/ms.length) };
  };

  const TABS = [
    {id:"dashboard",label:"Dashboard",icon:"⬡"},
    {id:"projects",label:"Projects",icon:"◈"},
    {id:"manpower",label:"Manpower",icon:"◉"},
    {id:"route",label:"Route",icon:"🚐"},
    {id:"timeline",label:"Timeline",icon:"⊞"},
    {id:"completed",label:"Completed",icon:"✓"},
    {id:"kpi",label:"KPI",icon:"◎"},
    ...(currentUser.role==="admin"?[{id:"users",label:"Users",icon:"⊛"}]:[]),
  ];

  return (
    <div style={{minHeight:"100vh",background:"#060e1a",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#cbd5e1",display:"flex",flexDirection:"column"}}>
      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.color+"22",border:`1px solid ${toast.color}`,color:toast.color,borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,boxShadow:`0 0 20px ${toast.color}44`,backdropFilter:"blur(8px)"}}>{toast.msg}</div>}

      {/* Header */}
      <div style={{background:"linear-gradient(90deg,#0a1628,#0d2137)",borderBottom:"1px solid #1e3a5f",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px #00000066"}}>
        <FJTLogo size={36}/>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,padding:"5px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#cc0000,#991111)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{currentUser.avatar}</div>
            <div>
              <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{currentUser.name}</div>
              <div style={{fontSize:9,color:"#cc0000",letterSpacing:1}}>{currentUser.role.toUpperCase()}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{background:"#ef444420",border:"1px solid #ef444466",color:"#ef4444",borderRadius:7,padding:"6px 12px",fontSize:10,fontFamily:"inherit",cursor:"pointer",letterSpacing:1}}>LOGOUT</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:4,padding:"8px 24px",background:"#08111f",borderBottom:"1px solid #1e3a5f",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setSelProject(null);}} style={{
            background:tab===t.id?"linear-gradient(135deg,#cc0000,#991111)":"transparent",
            border:tab===t.id?"none":"1px solid #1e3a5f",
            color:tab===t.id?"#fff":"#64748b",
            borderRadius:8,padding:"6px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap",letterSpacing:.5,fontWeight:tab===t.id?700:400,
            boxShadow:tab===t.id?"0 0 16px #cc000030":"none",transition:"all 0.2s"
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{flex:1,padding:"20px 24px",maxWidth:1400,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>

        {/* ═══════════ DASHBOARD ═══════════ */}
        {tab==="dashboard"&&<DashboardTab projects={projects} engineers={engineers} completedProjects={completedProjects} setSelProject={setSelProject} setTab={setTab} setProjTab={setProjTab} card={card} inp={inp} btn={btn} canEdit={canEdit} setProjects={setProjects} showToast={showToast} calcProjectProgress={calcProjectProgress}/>}

        {/* ═══════════ PROJECTS ═══════════ */}
        {tab==="projects"&&<ProjectsTab projects={projects} setProjects={setProjects} engineers={engineers} selProject={selProject} setSelProject={setSelProject} projTab={projTab} setProjTab={setProjTab} projFilter={projFilter} setProjFilter={setProjFilter} filteredProjects={filteredProjects} customers={customers} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast} calcProjectProgress={calcProjectProgress} selProj={selProj} setTab={setTab} setCompleted={setCompleted} completedProjects={completedProjects}/>}

        {/* ═══════════ MANPOWER ═══════════ */}
        {tab==="manpower"&&<ManpowerTab engineers={engineers} setEngineers={setEngineers} filteredEngineers={filteredEngineers} mpFilter={mpFilter} setMpFilter={setMpFilter} depts={depts} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}

        {/* ═══════════ ROUTE ═══════════ */}
        {tab==="route"&&<RouteTab routes={routes} setRoutes={setRoutes} vehicles={vehicles} setVehicles={setVehicles} engineers={engineers} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}

        {/* ═══════════ TIMELINE ═══════════ */}
        {tab==="timeline"&&<TimelineTab projects={projects} card={card} setSelProject={setSelProject} setTab={setTab}/>}

        {/* ═══════════ COMPLETED ═══════════ */}
        {tab==="completed"&&<CompletedTab completedProjects={completedProjects} setCompleted={setCompleted} engineers={engineers} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}

        {/* ═══════════ KPI ═══════════ */}
        {tab==="kpi"&&<KPITab engineers={engineers} setEngineers={setEngineers} avgKpi={avgKpi} card={card} inp={inp} canEdit={canEdit}/>}

        {/* ═══════════ USERS ═══════════ */}
        {tab==="users"&&currentUser.role==="admin"&&<UsersTab users={users} setUsers={setUsers} currentUser={currentUser} canEdit={canEdit} card={card} inp={inp} btn={btn} btnSm={btnSm} showToast={showToast}/>}
      </div>

      <div style={{textAlign:"center",padding:"8px 0",fontSize:9,color:"#1e3a5f",borderTop:"1px solid #0d2137"}}>
        PT. Frensland Jaya Teknik · PMS v5.0 · {projects.length} Active Projects · {engineers.length} Engineers · Data tersimpan di browser
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════
function DashboardTab({projects,engineers,completedProjects,setSelProject,setTab,setProjTab,card,inp,btn,canEdit,setProjects,showToast,calcProjectProgress}) {
  const [editNote, setEditNote] = useState(null);
  const [noteVal, setNoteVal] = useState("");
  const avgKpi = Math.round(engineers.reduce((a,e)=>a+e.kpi,0)/Math.max(engineers.length,1));

  const kpiStats = [
    {label:"Total Aktif",value:projects.length,color:"#38bdf8"},
    {label:"On Track",value:projects.filter(p=>p.status==="On Track").length,color:"#10b981"},
    {label:"At Risk",value:projects.filter(p=>p.status==="At Risk").length,color:"#f59e0b"},
    {label:"Delayed",value:projects.filter(p=>p.status==="Delayed").length,color:"#ef4444"},
    {label:"On Hold",value:projects.filter(p=>p.status==="On Hold").length,color:"#6b7280"},
    {label:"Completed",value:completedProjects.length,color:"#10b981"},
    {label:"Engineers",value:engineers.length,color:"#a78bfa"},
    {label:"Avg KPI",value:avgKpi+"%",color:kpiColor(avgKpi)},
  ];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ EXECUTIVE DASHBOARD</div>
        <div style={{fontSize:10,color:"#334155"}}>— {new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}}>
        {kpiStats.map((s,i)=>(
          <div key={i} style={{...card,textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:9,color:"#64748b",marginTop:6,letterSpacing:1}}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Phase Distribution */}
      <div style={{...card,marginBottom:16}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ DISTRIBUSI PHASE PROYEK</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {PHASES.map(ph=>{
            const cnt=projects.filter(p=>p.phase===ph).length;
            const pct=projects.length?Math.round(cnt/projects.length*100):0;
            return (
              <div key={ph} style={{flex:1,minWidth:80,background:(phaseColor[ph]||"#64748b")+"11",border:`1px solid ${(phaseColor[ph]||"#64748b")}33`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:900,color:phaseColor[ph]||"#64748b"}}>{cnt}</div>
                <div style={{fontSize:8,color:phaseColor[ph]||"#64748b",fontWeight:700,letterSpacing:.5,marginTop:3}}>{ph}</div>
                <div style={{fontSize:8,color:"#475569",marginTop:2}}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Project Status List with Notes */}
        <div style={card}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ STATUS PROYEK (CATATAN)</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:350,overflowY:"auto"}}>
            {projects.slice(0,12).map(p=>{
              const {plan,actual}=calcProjectProgress(p);
              const d=daysLeft(p.deadline);
              const isEditing=editNote===p.id;
              return (
                <div key={p.id} style={{background:"#0f274480",border:"1px solid #1e3a5f",borderRadius:10,padding:"10px 12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");setProjTab("milestones");}}>
                      <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{p.name.slice(0,30)}</div>
                      <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}}>
                        <PhaseBadge phase={p.phase}/>
                        <Badge label={p.status} color={statusColor[p.status]}/>
                        {d<=7&&d>=0&&<Badge label={`${d}h`} color="#f59e0b"/>}
                        {d<0&&<Badge label="LATE" color="#ef4444"/>}
                      </div>
                    </div>
                    {canEdit&&<button onClick={()=>{setEditNote(isEditing?null:p.id);setNoteVal(p.notes||"");}} style={{background:"#38bdf822",border:"1px solid #38bdf844",color:"#38bdf8",borderRadius:5,padding:"2px 7px",fontSize:9,cursor:"pointer",flexShrink:0}}>✏ Catatan</button>}
                  </div>
                  {isEditing?(
                    <div>
                      <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} style={{width:"100%",background:"#0a1628",border:"1px solid #38bdf8",borderRadius:6,color:"#e2e8f0",padding:"6px",fontSize:11,fontFamily:"inherit",resize:"vertical",minHeight:60,boxSizing:"border-box"}}/>
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        <button onClick={()=>{setProjects(projects.map(pp=>pp.id===p.id?{...pp,notes:noteVal}:pp));setEditNote(null);}} style={{background:"#10b981",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",fontSize:10,cursor:"pointer"}}>Simpan</button>
                        <button onClick={()=>setEditNote(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer"}}>Batal</button>
                      </div>
                    </div>
                  ):(
                    p.notes&&<div style={{fontSize:10,color:"#64748b",fontStyle:"italic",marginTop:4,borderLeft:"2px solid #38bdf844",paddingLeft:8}}>{p.notes}</div>
                  )}
                  <div style={{display:"flex",gap:6,alignItems:"center",marginTop:6}}>
                    <ProgressBar value={plan} color="#3b82f666" h={3}/>
                    <ProgressBar value={actual} color={statusColor[p.status]} h={5}/>
                    <span style={{fontSize:10,color:"#38bdf8",minWidth:28}}>{actual}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadline Alerts */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={card}>
            <div style={{fontSize:11,color:"#f59e0b",letterSpacing:3,marginBottom:14}}>⚠️ DEADLINE ALERTS (14 Hari)</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:200,overflowY:"auto"}}>
              {projects.filter(p=>daysLeft(p.deadline)<=14&&daysLeft(p.deadline)>=-7).sort((a,b)=>daysLeft(a.deadline)-daysLeft(b.deadline)).map(p=>{
                const d=daysLeft(p.deadline);
                const c=d<0?"#ef4444":d<=3?"#ef4444":d<=7?"#f59e0b":"#3b82f6";
                return (
                  <div key={p.id} style={{background:c+"11",border:`1px solid ${c}33`,borderRadius:8,padding:"8px 12px",cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");}}>
                    <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{p.name.slice(0,35)}</div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                      <span style={{fontSize:9,color:"#475569"}}>PIC: {p.pic}</span>
                      <span style={{fontSize:9,color:c,fontWeight:700}}>{d<0?`${Math.abs(d)}h terlambat`:d===0?"HARI INI":`${d}h lagi`}</span>
                    </div>
                  </div>
                );
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
// PROJECTS TAB
// ═══════════════════════════════════════════════════════════════
function ProjectsTab({projects,setProjects,engineers,selProject,setSelProject,projTab,setProjTab,projFilter,setProjFilter,filteredProjects,customers,canEdit,card,inp,btn,btnSm,showToast,calcProjectProgress,selProj,setTab,setCompleted,completedProjects}) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editMilestone, setEditMilestone] = useState(null);
  const [editProjectId, setEditProjectId] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({name:"",date:"",planProgress:0,actualProgress:0,engineers:[],description:"",activities:[]});
  const [activityForm, setActivityForm] = useState({name:"",targetDate:"",actualDate:"",planPct:0,actualPct:0,assignee:"",status:"pending"});
  const [reportForm, setReportForm] = useState({date:T,summary:"",activities:"",issues:"",nextPlan:"",reporter:""});
  const [docForm, setDocForm] = useState({name:"",category:"Pra-Project",date:T,description:"",fileRef:""});
  const [newProject, setNewProject] = useState({name:"",customer:"",phase:"Planning",status:"On Track",priority:"Medium",startDate:"",deadline:"",pic:"",notes:"",budget:"",spent:"",mandays:"",team:[]});

  const DOC_CATEGORIES = ["Pra-Project","Kontrak","Gambar Teknik","Spesifikasi","BA","Invoice","Lainnya"];

  const saveProject = () => {
    if(!newProject.name||!newProject.customer) return;
    const p = {...newProject,id:uid(),milestones:[],dailyReports:[],documents:[],budget:Number(newProject.budget)||0,spent:Number(newProject.spent)||0,mandays:Number(newProject.mandays)||0};
    setProjects([...projects,p]);
    setShowAddProject(false);
    setNewProject({name:"",customer:"",phase:"Planning",status:"On Track",priority:"Medium",startDate:"",deadline:"",pic:"",notes:"",budget:"",spent:"",mandays:"",team:[]});
    showToast("✓ Proyek ditambahkan");
  };

  const deleteProject = (id) => {
    if(!window.confirm("Hapus proyek ini?")) return;
    setProjects(projects.filter(p=>p.id!==id));
    showToast("Proyek dihapus","#ef4444");
  };

  const saveMilestone = () => {
    if(!milestoneForm.name||!milestoneForm.date) return;
    const ms={...milestoneForm,id:uid(),activities:[]};
    setProjects(projects.map(p=>p.id===selProject?{...p,milestones:[...(p.milestones||[]),ms]}:p));
    setMilestoneForm({name:"",date:"",planProgress:0,actualProgress:0,engineers:[],description:"",activities:[]});
    setShowMilestoneForm(false);
    showToast("✓ Milestone ditambahkan");
  };

  const deleteMilestone = (projId,msId) => {
    setProjects(projects.map(p=>p.id===projId?{...p,milestones:(p.milestones||[]).filter(m=>m.id!==msId)}:p));
    showToast("Milestone dihapus","#ef4444");
  };

  const updateMilestone = (projId,msId,field,val) => {
    setProjects(projects.map(p=>p.id===projId?{...p,milestones:(p.milestones||[]).map(m=>m.id===msId?{...m,[field]:val}:m)}:p));
  };

  const addActivity = (projId,msId) => {
    if(!activityForm.name) return;
    const act={...activityForm,id:uid()};
    setProjects(projects.map(p=>p.id===projId?{...p,milestones:(p.milestones||[]).map(m=>m.id===msId?{...m,activities:[...(m.activities||[]),act]}:m)}:p));
    setActivityForm({name:"",targetDate:"",actualDate:"",planPct:0,actualPct:0,assignee:"",status:"pending"});
    showToast("✓ Aktivitas ditambahkan");
  };

  const deleteActivity = (projId,msId,actId) => {
    setProjects(projects.map(p=>p.id===projId?{...p,milestones:(p.milestones||[]).map(m=>m.id===msId?{...m,activities:(m.activities||[]).filter(a=>a.id!==actId)}:m)}:p));
  };

  const saveReport = () => {
    if(!reportForm.summary) return;
    const r={...reportForm,id:uid()};
    setProjects(projects.map(p=>p.id===selProject?{...p,dailyReports:[...(p.dailyReports||[]),r]}:p));
    setReportForm({date:T,summary:"",activities:"",issues:"",nextPlan:"",reporter:""});
    setShowReportForm(false);
    showToast("✓ Laporan harian ditambahkan");
  };

  const deleteReport = (projId,rid) => {
    setProjects(projects.map(p=>p.id===projId?{...p,dailyReports:(p.dailyReports||[]).filter(r=>r.id!==rid)}:p));
    showToast("Laporan dihapus","#ef4444");
  };

  const saveDoc = () => {
    if(!docForm.name) return;
    const d={...docForm,id:uid()};
    setProjects(projects.map(p=>p.id===selProject?{...p,documents:[...(p.documents||[]),d]}:p));
    setDocForm({name:"",category:"Pra-Project",date:T,description:"",fileRef:""});
    setShowDocForm(false);
    showToast("✓ Dokumen ditambahkan");
  };

  const deleteDoc = (projId,did) => {
    setProjects(projects.map(p=>p.id===projId?{...p,documents:(p.documents||[]).filter(d=>d.id!==did)}:p));
    showToast("Dokumen dihapus","#ef4444");
  };

  const moveToCompleted = (proj) => {
    if(!window.confirm("Tandai proyek ini sebagai Completed?")) return;
    const cp = {...proj,phase:"Completed",status:"Completed",projectStatus:"completed",completedDate:T,afterSalesNotes:"",warrantyEnd:addDays(T,365)};
    setCompleted([...(completedProjects||[]),cp]);
    setProjects(projects.filter(p=>p.id!==proj.id));
    setSelProject(null);
    showToast("✓ Proyek dipindahkan ke Completed");
  };

  // Field edit for project
  const updateProjectField = (id,field,val) => {
    setProjects(projects.map(p=>p.id===id?{...p,[field]:val}:p));
  };

  if(selProj) {
    const {plan,actual}=calcProjectProgress(selProj);
    const budgetPct=selProj.budget?Math.round((selProj.spent||0)/selProj.budget*100):0;
    const teamEngineers=(selProj.team||[]).map(id=>engineers.find(e=>e.id===id||e.id===Number(id))).filter(Boolean);

    const PROJ_TABS = [
      {id:"overview",label:"Overview"},
      {id:"milestones",label:"Milestones"},
      {id:"reports",label:"Laporan Harian"},
      {id:"documents",label:"Dokumen"},
      {id:"budget",label:"Budget"},
    ];

    return (
      <div>
        {/* Header */}
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:18,flexWrap:"wrap"}}>
          <button onClick={()=>setSelProject(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#38bdf8",borderRadius:8,padding:"6px 12px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>← Kembali</button>
          <div style={{flex:1}}>
            {editProjectId===selProj.id?(
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <input value={selProj.name} onChange={e=>updateProjectField(selProj.id,"name",e.target.value)} style={{...inp,width:"auto",flex:1,fontSize:14,fontWeight:700}}/>
                <button onClick={()=>setEditProjectId(null)} style={{background:"#10b981",border:"none",color:"#fff",borderRadius:6,padding:"5px 12px",fontSize:10,cursor:"pointer"}}>✓ Simpan</button>
              </div>
            ):(
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{fontSize:16,color:"#e2e8f0",fontWeight:800}}>{selProj.name}</div>
                {canEdit&&<button onClick={()=>setEditProjectId(selProj.id)} style={{background:"transparent",border:"1px solid #38bdf844",color:"#38bdf8",borderRadius:5,padding:"2px 8px",fontSize:9,cursor:"pointer"}}>✏ Edit Nama</button>}
              </div>
            )}
            <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap",alignItems:"center"}}>
              <PhaseBadge phase={selProj.phase}/>
              <Badge label={selProj.status} color={statusColor[selProj.status]}/>
              <Badge label={selProj.priority} color={priorityColor[selProj.priority]}/>
              <span style={{fontSize:10,color:"#64748b"}}>📅 {fmtDate(selProj.startDate)} → {fmtDate(selProj.deadline)}</span>
              {canEdit&&<button onClick={()=>moveToCompleted(selProj)} style={{background:"#10b98122",border:"1px solid #10b981",color:"#10b981",borderRadius:6,padding:"3px 10px",fontSize:9,cursor:"pointer"}}>→ Tandai Completed</button>}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"#64748b"}}>PIC: <span style={{color:"#e2e8f0",fontWeight:700}}>{selProj.pic}</span></div>
            <div style={{fontSize:11,color:"#64748b"}}>Customer: <span style={{color:"#e2e8f0"}}>{selProj.customer}</span></div>
          </div>
        </div>

        {/* Phase edit */}
        {canEdit&&(
          <div style={{...card,marginBottom:14,padding:12}}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:10,color:"#64748b",letterSpacing:1}}>PHASE:</span>
              {PHASES.map(ph=>(
                <button key={ph} onClick={()=>updateProjectField(selProj.id,"phase",ph)} style={{background:selProj.phase===ph?(phaseColor[ph]||"#64748b")+"44":"transparent",border:`1px solid ${selProj.phase===ph?(phaseColor[ph]||"#64748b"):"#1e3a5f"}`,color:selProj.phase===ph?(phaseColor[ph]||"#e2e8f0"):"#64748b",borderRadius:20,padding:"3px 10px",fontSize:9,cursor:"pointer",fontWeight:selProj.phase===ph?700:400,transition:"all .2s"}}>{ph}</button>
              ))}
              <span style={{fontSize:10,color:"#64748b",marginLeft:10,letterSpacing:1}}>STATUS:</span>
              {PROJECT_STATUSES.map(s=>(
                <button key={s} onClick={()=>updateProjectField(selProj.id,"status",s)} style={{background:selProj.status===s?(statusColor[s]||"#64748b")+"44":"transparent",border:`1px solid ${selProj.status===s?(statusColor[s]||"#64748b"):"#1e3a5f"}`,color:selProj.status===s?(statusColor[s]||"#e2e8f0"):"#64748b",borderRadius:20,padding:"3px 10px",fontSize:9,cursor:"pointer",fontWeight:selProj.status===s?700:400,transition:"all .2s"}}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        <div style={{...card,marginBottom:14}}>
          <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:4}}>
                <span>Plan: {plan}%</span><span>Actual: {actual}%</span>
              </div>
              <ProgressBar value={plan} color="#3b82f666" h={4}/>
              <div style={{height:4}}/>
              <ProgressBar value={actual} color={statusColor[selProj.status]} h={10}/>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:statusColor[selProj.status]}}>{actual}%</div>
              <div style={{fontSize:9,color:"#475569"}}>ACTUAL</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:"#38bdf8"}}>{daysLeft(selProj.deadline)}</div>
              <div style={{fontSize:9,color:"#475569"}}>HARI LAGI</div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto"}}>
          {PROJ_TABS.map(t=>(
            <button key={t.id} onClick={()=>setProjTab(t.id)} style={{background:projTab===t.id?"linear-gradient(135deg,#cc0000,#991111)":"transparent",border:projTab===t.id?"none":"1px solid #1e3a5f",color:projTab===t.id?"#fff":"#64748b",borderRadius:8,padding:"5px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>{t.label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {projTab==="overview"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={card}>
              <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ DETAIL PROYEK</div>
              {canEdit&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[["PIC","text","pic"],["Customer","text","customer"],["Start Date","date","startDate"],["Deadline","date","deadline"]].map(([lbl,type,key])=>(
                    <div key={key}>
                      <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:3}}>{lbl.toUpperCase()}</div>
                      <input type={type} style={inp} value={selProj[key]||""} onChange={e=>updateProjectField(selProj.id,key,e.target.value)}/>
                    </div>
                  ))}
                  <div>
                    <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:3}}>PRIORITY</div>
                    <select style={inp} value={selProj.priority||"Medium"} onChange={e=>updateProjectField(selProj.id,"priority",e.target.value)}>
                      {["Critical","High","Medium","Low"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>CATATAN</div>
              <textarea style={{...inp,minHeight:80,resize:"vertical"}} value={selProj.notes||""} onChange={e=>updateProjectField(selProj.id,"notes",e.target.value)} placeholder="Catatan proyek..."/>
            </div>
            <div style={card}>
              <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ TEAM ({teamEngineers.length} orang)</div>
              {canEdit&&(
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>TAMBAH MANPOWER (pilih banyak)</div>
                  <select multiple style={{...inp,height:100}} onChange={e=>{
                    const vals=Array.from(e.target.selectedOptions,o=>Number(o.value));
                    const existing=selProj.team||[];
                    const merged=[...new Set([...existing,...vals])];
                    updateProjectField(selProj.id,"team",merged);
                  }}>
                    {engineers.filter(e=>!(selProj.team||[]).includes(e.id)).map(e=><option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
                  </select>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:180,overflowY:"auto"}}>
                {teamEngineers.map(e=>(
                  <div key={e.id} style={{display:"flex",alignItems:"center",gap:8,background:"#0f274460",borderRadius:8,padding:"6px 10px"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:kpiColor(e.kpi)+"22",border:`1.5px solid ${kpiColor(e.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:kpiColor(e.kpi)}}>{e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"#e2e8f0"}}>{e.name}</div><div style={{fontSize:9,color:"#475569"}}>{e.dept} · {e.role}</div></div>
                    {canEdit&&<button onClick={()=>updateProjectField(selProj.id,"team",(selProj.team||[]).filter(id=>id!==e.id))} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>×</button>}
                  </div>
                ))}
                {teamEngineers.length===0&&<div style={{fontSize:11,color:"#334155",textAlign:"center",padding:20}}>Belum ada manpower ditambahkan</div>}
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES */}
        {projTab==="milestones"&&(
          <div>
            {canEdit&&(
              <div style={{marginBottom:12}}>
                <button onClick={()=>setShowMilestoneForm(!showMilestoneForm)} style={{...btn("#cc0000")}}>+ Tambah Milestone</button>
              </div>
            )}
            {showMilestoneForm&&canEdit&&(
              <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
                <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:10}}>▸ MILESTONE BARU</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {[["NAMA","text","name","Nama milestone..."],["TARGET DATE","date","date",""]].map(([lbl,type,key,ph])=>(
                    <div key={key}>
                      <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{lbl}</div>
                      <input type={type} style={inp} value={milestoneForm[key]} placeholder={ph} onChange={e=>setMilestoneForm({...milestoneForm,[key]:e.target.value})}/>
                    </div>
                  ))}
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PLAN %</div><input type="number" min="0" max="100" style={inp} value={milestoneForm.planProgress} onChange={e=>setMilestoneForm({...milestoneForm,planProgress:+e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ACTUAL %</div><input type="number" min="0" max="100" style={inp} value={milestoneForm.actualProgress} onChange={e=>setMilestoneForm({...milestoneForm,actualProgress:+e.target.value})}/></div>
                  <div>
                    <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ENGINEER (multi)</div>
                    <select multiple style={{...inp,height:72}} onChange={e=>{const v=Array.from(e.target.selectedOptions,o=>o.value);setMilestoneForm({...milestoneForm,engineers:v});}}>
                      {engineers.map(e=><option key={e.id} value={e.name}>{e.name} ({e.dept})</option>)}
                    </select>
                  </div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DESKRIPSI</div><textarea style={{...inp,height:72,resize:"vertical"}} value={milestoneForm.description} onChange={e=>setMilestoneForm({...milestoneForm,description:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={saveMilestone} style={{...btn("#10b981")}}>SIMPAN</button>
                  <button onClick={()=>setShowMilestoneForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
                </div>
              </div>
            )}
            {(selProj.milestones||[]).length===0&&<div style={{...card,textAlign:"center",color:"#334155",fontSize:12,padding:40}}>Belum ada milestone. Tambahkan milestone untuk mulai tracking.</div>}
            {[...(selProj.milestones||[])].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(ms=>{
              const variance=(ms.actualProgress||0)-(ms.planProgress||0);
              const msExpanded=editMilestone===ms.id;
              return (
                <div key={ms.id} style={{...card,marginBottom:12,borderLeft:`3px solid ${variance>=0?"#10b981":"#ef4444"}`}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{ms.name}</div>
                      <div style={{fontSize:10,color:"#475569",marginTop:2}}>📅 {fmtDate(ms.date)} · 👥 {(ms.engineers||[]).join(", ")||"—"}</div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,background:variance>=0?"#10b98122":"#ef444422",color:variance>=0?"#10b981":"#ef4444",fontWeight:700}}>{variance>=0?"+":""}{variance}% VAR</span>
                      {canEdit&&<>
                        <button onClick={()=>setEditMilestone(msExpanded?null:ms.id)} style={{background:"#38bdf822",border:"1px solid #38bdf8",color:"#38bdf8",borderRadius:6,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>✏</button>
                        <button onClick={()=>deleteMilestone(selProj.id,ms.id)} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>✕</button>
                      </>}
                    </div>
                  </div>
                  <ProgressBar value={ms.planProgress||0} color="#3b82f666" h={4}/>
                  <div style={{height:3}}/>
                  <ProgressBar value={ms.actualProgress||0} color={variance>=0?"#10b981":"#f59e0b"} h={7}/>
                  {msExpanded&&canEdit&&(
                    <div style={{background:"#0f2744",borderRadius:10,padding:12,marginTop:10}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                        {[["PLAN %","number","planProgress"],["ACTUAL %","number","actualProgress"],["TARGET DATE","date","date"]].map(([lbl,type,key])=>(
                          <div key={key}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{lbl}</div><input type={type} min="0" max="100" style={inp} defaultValue={ms[key]||0} onBlur={e=>updateMilestone(selProj.id,ms.id,key,type==="number"?+e.target.value:e.target.value)}/></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Activities */}
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:9,color:"#38bdf8",letterSpacing:2,marginBottom:8}}>AKTIVITAS</div>
                    {(ms.activities||[]).map(act=>(
                      <div key={act.id} style={{display:"flex",alignItems:"center",gap:8,background:"#0f274460",borderRadius:6,padding:"6px 10px",marginBottom:4}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:act.status==="done"?"#10b981":act.status==="in_progress"?"#f59e0b":"#334155",flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,color:"#e2e8f0"}}>{act.name}</div>
                          {act.assignee&&<div style={{fontSize:9,color:"#475569"}}>{act.assignee}</div>}
                        </div>
                        {canEdit&&<select style={{...inp,width:"auto",fontSize:9,padding:"2px 6px"}} value={act.status} onChange={e=>{
                          setProjects(prev=>prev.map(p=>p.id===selProj.id?{...p,milestones:(p.milestones||[]).map(m=>m.id===ms.id?{...m,activities:(m.activities||[]).map(a=>a.id===act.id?{...a,status:e.target.value}:a)}:m)}:p));
                        }}>
                          <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="done">Done</option>
                        </select>}
                        {canEdit&&<button onClick={()=>deleteActivity(selProj.id,ms.id,act.id)} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:12}}>✕</button>}
                      </div>
                    ))}
                    {canEdit&&(
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        <input style={{...inp,flex:1}} value={activityForm.name} onChange={e=>setActivityForm({...activityForm,name:e.target.value})} placeholder="Nama aktivitas baru..."/>
                        <input style={{...inp,width:120}} value={activityForm.assignee} onChange={e=>setActivityForm({...activityForm,assignee:e.target.value})} placeholder="Assignee"/>
                        <button onClick={()=>addActivity(selProj.id,ms.id)} style={{...btn("#10b981"),padding:"6px 12px",fontSize:10}}>+ Add</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DAILY REPORTS */}
        {projTab==="reports"&&(
          <div>
            {canEdit&&<button onClick={()=>setShowReportForm(!showReportForm)} style={{...btn("#cc0000"),marginBottom:12}}>+ Tambah Laporan Harian</button>}
            {showReportForm&&canEdit&&(
              <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
                <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:10}}>▸ LAPORAN HARIAN BARU</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TANGGAL</div><input type="date" style={inp} value={reportForm.date} onChange={e=>setReportForm({...reportForm,date:e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>REPORTER</div><input style={inp} value={reportForm.reporter} onChange={e=>setReportForm({...reportForm,reporter:e.target.value})} placeholder="Nama reporter"/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>RINGKASAN HARI INI</div><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={reportForm.summary} onChange={e=>setReportForm({...reportForm,summary:e.target.value})} placeholder="Apa yang dikerjakan hari ini..."/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>AKTIVITAS DETAIL</div><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={reportForm.activities} onChange={e=>setReportForm({...reportForm,activities:e.target.value})} placeholder="Detail kegiatan..."/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ISSUES / KENDALA</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={reportForm.issues} onChange={e=>setReportForm({...reportForm,issues:e.target.value})} placeholder="Masalah yang dihadapi..."/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>RENCANA BESOK</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={reportForm.nextPlan} onChange={e=>setReportForm({...reportForm,nextPlan:e.target.value})} placeholder="Rencana esok hari..."/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={saveReport} style={{...btn("#10b981")}}>SIMPAN LAPORAN</button>
                  <button onClick={()=>setShowReportForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
                </div>
              </div>
            )}
            {(selProj.dailyReports||[]).length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:40}}>Belum ada laporan harian</div>}
            {[...(selProj.dailyReports||[])].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>(
              <div key={r.id} style={{...card,marginBottom:12,borderLeft:"3px solid #cc0000"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>📋 Laporan {fmtDate(r.date)}</div>
                    {r.reporter&&<div style={{fontSize:10,color:"#64748b"}}>Oleh: {r.reporter}</div>}
                  </div>
                  {canEdit&&<button onClick={()=>deleteReport(selProj.id,r.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
                {r.summary&&<div style={{marginBottom:10}}><div style={{fontSize:9,color:"#38bdf8",letterSpacing:1,marginBottom:4}}>RINGKASAN</div><div style={{fontSize:11,color:"#cbd5e1",lineHeight:1.6}}>{r.summary}</div></div>}
                {r.activities&&<div style={{marginBottom:10}}><div style={{fontSize:9,color:"#38bdf8",letterSpacing:1,marginBottom:4}}>AKTIVITAS</div><div style={{fontSize:11,color:"#94a3b8",lineHeight:1.6}}>{r.activities}</div></div>}
                {r.issues&&<div style={{marginBottom:10,background:"#ef444411",border:"1px solid #ef444433",borderRadius:8,padding:"8px 12px"}}><div style={{fontSize:9,color:"#ef4444",letterSpacing:1,marginBottom:4}}>ISSUES</div><div style={{fontSize:11,color:"#fca5a5",lineHeight:1.6}}>{r.issues}</div></div>}
                {r.nextPlan&&<div><div style={{fontSize:9,color:"#10b981",letterSpacing:1,marginBottom:4}}>RENCANA BESOK</div><div style={{fontSize:11,color:"#6ee7b7",lineHeight:1.6}}>{r.nextPlan}</div></div>}
              </div>
            ))}
          </div>
        )}

        {/* DOCUMENTS */}
        {projTab==="documents"&&(
          <div>
            {canEdit&&<button onClick={()=>setShowDocForm(!showDocForm)} style={{...btn("#cc0000"),marginBottom:12}}>+ Tambah Dokumen</button>}
            {showDocForm&&canEdit&&(
              <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
                <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:10}}>▸ DOKUMEN BARU</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NAMA DOKUMEN</div><input style={inp} value={docForm.name} onChange={e=>setDocForm({...docForm,name:e.target.value})} placeholder="Nama dokumen..."/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KATEGORI</div>
                    <select style={inp} value={docForm.category} onChange={e=>setDocForm({...docForm,category:e.target.value})}>
                      {DOC_CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TANGGAL</div><input type="date" style={inp} value={docForm.date} onChange={e=>setDocForm({...docForm,date:e.target.value})}/></div>
                  <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>REFERENSI FILE / LINK</div><input style={inp} value={docForm.fileRef} onChange={e=>setDocForm({...docForm,fileRef:e.target.value})} placeholder="No. dokumen / link..."/></div>
                  <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DESKRIPSI</div><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={docForm.description} onChange={e=>setDocForm({...docForm,description:e.target.value})}/></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={saveDoc} style={{...btn("#10b981")}}>SIMPAN</button>
                  <button onClick={()=>setShowDocForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
                </div>
              </div>
            )}
            {/* Group by category */}
            {DOC_CATEGORIES.filter(cat=>(selProj.documents||[]).some(d=>d.category===cat)).map(cat=>(
              <div key={cat} style={{marginBottom:16}}>
                <div style={{fontSize:10,color:"#38bdf8",letterSpacing:2,marginBottom:8}}>📁 {cat.toUpperCase()}</div>
                {(selProj.documents||[]).filter(d=>d.category===cat).map(d=>(
                  <div key={d.id} style={{...card,marginBottom:8,padding:"12px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{d.name}</div>
                        <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{fmtDate(d.date)}{d.fileRef&&<> · <span style={{color:"#38bdf8"}}>{d.fileRef}</span></>}</div>
                        {d.description&&<div style={{fontSize:10,color:"#475569",marginTop:4}}>{d.description}</div>}
                      </div>
                      {canEdit&&<button onClick={()=>deleteDoc(selProj.id,d.id)} style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}>✕</button>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {(selProj.documents||[]).length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:40}}>Belum ada dokumen. Tambahkan dokumen pra-project atau referensi.</div>}
          </div>
        )}

        {/* BUDGET */}
        {projTab==="budget"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={card}>
              <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:16}}>▸ BUDGET PROYEK</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[["BUDGET (Rp) — Opsional","budget"],["SPENT (Rp) — Opsional","spent"]].map(([lbl,key])=>(
                  <div key={key}>
                    <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>{lbl}</div>
                    <input type="number" style={inp} value={selProj[key]||""} placeholder="Opsional" onChange={e=>updateProjectField(selProj.id,key,Number(e.target.value)||0)}/>
                  </div>
                ))}
                <div>
                  <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>MANDAYS — OPSIONAL</div>
                  <input type="number" style={inp} value={selProj.mandays||""} placeholder="Jumlah hari kerja (opsional)" onChange={e=>updateProjectField(selProj.id,"mandays",Number(e.target.value)||0)}/>
                </div>
              </div>
            </div>
            <div style={card}>
              <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:16}}>▸ RINGKASAN BUDGET</div>
              {selProj.budget>0?(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:9,color:"#64748b"}}>TOTAL BUDGET</div>
                      <div style={{fontSize:18,color:"#38bdf8",fontWeight:800}}>{fmtIDR(selProj.budget)}</div>
                    </div>
                    <div>
                      <div style={{fontSize:9,color:"#64748b"}}>TERPAKAI</div>
                      <div style={{fontSize:18,color:budgetPct>90?"#ef4444":"#f59e0b",fontWeight:800}}>{fmtIDR(selProj.spent||0)}</div>
                    </div>
                    <div>
                      <div style={{fontSize:9,color:"#64748b"}}>SISA</div>
                      <div style={{fontSize:18,color:"#10b981",fontWeight:800}}>{fmtIDR((selProj.budget||0)-(selProj.spent||0))}</div>
                    </div>
                  </div>
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:4}}><span>Utilitas Budget</span><span style={{color:budgetPct>90?"#ef4444":"#e2e8f0",fontWeight:700}}>{budgetPct}%</span></div>
                    <ProgressBar value={budgetPct} color={budgetPct>90?"#ef4444":budgetPct>75?"#f59e0b":"#10b981"} h={12}/>
                  </div>
                  {selProj.mandays>0&&(
                    <div style={{background:"#0f274460",borderRadius:10,padding:12,marginTop:12}}>
                      <div style={{fontSize:9,color:"#64748b",marginBottom:6}}>MANDAYS DETAIL</div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div><div style={{fontSize:9,color:"#64748b"}}>TOTAL MANDAYS</div><div style={{fontSize:16,color:"#a78bfa",fontWeight:800}}>{selProj.mandays} hari</div></div>
                        <div><div style={{fontSize:9,color:"#64748b"}}>COST/MANDAY</div><div style={{fontSize:16,color:"#38bdf8",fontWeight:800}}>{fmtIDR(Math.round((selProj.budget||0)/selProj.mandays))}</div></div>
                      </div>
                    </div>
                  )}
                </div>
              ):(
                <div style={{textAlign:"center",color:"#334155",padding:30}}>
                  <div style={{fontSize:24,marginBottom:8}}>💰</div>
                  <div style={{fontSize:12}}>Budget belum diisi (opsional)</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // PROJECT LIST
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ MANAJEMEN PROYEK ({filteredProjects.length}/{projects.length})</div>
        {canEdit&&<button onClick={()=>setShowAddProject(true)} style={{...btn("#cc0000")}}>+ TAMBAH PROYEK</button>}
      </div>

      {/* Filters */}
      <div style={{...card,marginBottom:14,padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input style={{...inp,flex:1,minWidth:180}} placeholder="🔍 Cari proyek / customer..." value={projFilter.search} onChange={e=>setProjFilter({...projFilter,search:e.target.value})}/>
          <select style={{...inp,width:"auto"}} value={projFilter.phase} onChange={e=>setProjFilter({...projFilter,phase:e.target.value})}>
            <option value="all">All Phase</option>{PHASES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select style={{...inp,width:"auto"}} value={projFilter.status} onChange={e=>setProjFilter({...projFilter,status:e.target.value})}>
            <option value="all">All Status</option>{["On Track","At Risk","Delayed","On Hold"].map(s=><option key={s}>{s}</option>)}
          </select>
          <select style={{...inp,width:"auto"}} value={projFilter.priority} onChange={e=>setProjFilter({...projFilter,priority:e.target.value})}>
            <option value="all">All Priority</option>{["Critical","High","Medium","Low"].map(s=><option key={s}>{s}</option>)}
          </select>
          <select style={{...inp,width:"auto"}} value={projFilter.customer} onChange={e=>setProjFilter({...projFilter,customer:e.target.value})}>
            <option value="all">All Customer</option>{customers.map(c=><option key={c}>{c}</option>)}
          </select>
          {(projFilter.search||projFilter.status!=="all"||projFilter.priority!=="all"||projFilter.customer!=="all"||projFilter.phase!=="all")&&
            <button onClick={()=>setProjFilter({status:"all",priority:"all",customer:"all",search:"",phase:"all"})} style={{background:"#ef444420",border:"1px solid #ef4444",color:"#ef4444",borderRadius:6,padding:"6px 10px",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>Reset</button>}
        </div>
      </div>

      {showAddProject&&canEdit&&(
        <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:12}}>▸ PROYEK BARU</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["NAMA PROYEK *","text","name"],["CUSTOMER *","text","customer"],["PIC","text","pic"],["START DATE","date","startDate"],["DEADLINE","date","deadline"]].map(([lbl,type,key])=>(
              <div key={key}>
                <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>{lbl}</div>
                <input type={type} style={inp} value={newProject[key]||""} onChange={e=>setNewProject({...newProject,[key]:e.target.value})}/>
              </div>
            ))}
            <div>
              <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>PHASE</div>
              <select style={inp} value={newProject.phase} onChange={e=>setNewProject({...newProject,phase:e.target.value})}>
                {PHASES.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>STATUS</div>
              <select style={inp} value={newProject.status} onChange={e=>setNewProject({...newProject,status:e.target.value})}>
                {PROJECT_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>PRIORITY</div>
              <select style={inp} value={newProject.priority} onChange={e=>setNewProject({...newProject,priority:e.target.value})}>
                {["Critical","High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>BUDGET (Rp) — Opsional</div><input type="number" style={inp} placeholder="0" value={newProject.budget} onChange={e=>setNewProject({...newProject,budget:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>MANDAYS — Opsional</div><input type="number" style={inp} placeholder="0" value={newProject.mandays} onChange={e=>setNewProject({...newProject,mandays:e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",letterSpacing:1,marginBottom:4}}>CATATAN</div><textarea style={{...inp,minHeight:60,resize:"vertical"}} value={newProject.notes} onChange={e=>setNewProject({...newProject,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={saveProject} style={{...btn("#cc0000")}}>BUAT PROYEK</button>
            <button onClick={()=>setShowAddProject(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:14}}>
        {filteredProjects.map(p=>{
          const {plan,actual}=calcProjectProgress(p);
          const d=daysLeft(p.deadline);
          const teamCount=(p.team||[]).length;
          return (
            <div key={p.id} style={{...card,cursor:"pointer",border:`1px solid ${statusColor[p.status]}33`,transition:"all .2s",position:"relative"}} onClick={()=>setSelProject(p.id)}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"16px 16px 0 0",background:phaseColor[p.phase]||"#64748b"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,marginTop:4}}>
                <div style={{flex:1,paddingRight:10}}>
                  <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700,lineHeight:1.4,marginBottom:4}}>{p.name}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{p.customer}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end",flexShrink:0}}>
                  <PhaseBadge phase={p.phase}/>
                  <Badge label={p.status} color={statusColor[p.status]}/>
                  <Badge label={p.priority} color={priorityColor[p.priority]}/>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:6}}>
                <span>PIC: <span style={{color:"#e2e8f0"}}>{p.pic}</span></span>
                <span>👥 {teamCount} orang</span>
                <span style={{color:d<0?"#ef4444":d<=7?"#f59e0b":"#64748b",fontWeight:d<=7?700:400}}>{d<0?`${Math.abs(d)}h telat`:d===0?"Hari ini":fmtDate(p.deadline)}</span>
              </div>
              <div style={{marginBottom:6}}>
                <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:9,color:"#3b82f6",minWidth:40}}>Plan {plan}%</span>
                  <ProgressBar value={plan} color="#3b82f666" h={4}/>
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  <span style={{fontSize:9,color:statusColor[p.status],minWidth:40}}>Actual {actual}%</span>
                  <ProgressBar value={actual} color={statusColor[p.status]} h={7}/>
                </div>
              </div>
              {p.notes&&<div style={{fontSize:9,color:"#475569",fontStyle:"italic",borderTop:"1px solid #1e3a5f",paddingTop:6,marginTop:6,lineHeight:1.5}}>{p.notes.slice(0,80)}{p.notes.length>80?"...":""}</div>}
              {canEdit&&(
                <button onClick={e=>{e.stopPropagation();deleteProject(p.id);}} style={{position:"absolute",top:12,right:12,background:"transparent",border:"none",color:"#334155",cursor:"pointer",fontSize:14,padding:2}} title="Hapus">×</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MANPOWER TAB
// ═══════════════════════════════════════════════════════════════
function ManpowerTab({engineers,setEngineers,filteredEngineers,mpFilter,setMpFilter,depts,canEdit,card,inp,btn,btnSm,showToast}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newEng, setNewEng] = useState({name:"",role:"",dept:"",availability:100,kpi:80,hoursLogged:0,status:"active",phone:"",email:""});

  const addEngineer = () => {
    if(!newEng.name||!newEng.role) return;
    setEngineers([...engineers,{...newEng,id:Date.now()}]);
    setNewEng({name:"",role:"",dept:"",availability:100,kpi:80,hoursLogged:0,status:"active",phone:"",email:""});
    setShowAddForm(false);
    showToast("✓ Manpower ditambahkan");
  };

  const deleteEngineer = (id) => {
    if(!window.confirm("Hapus manpower ini?")) return;
    setEngineers(engineers.filter(e=>e.id!==id));
    showToast("Manpower dihapus","#ef4444");
  };

  const saveEdit = () => {
    setEngineers(engineers.map(e=>e.id===editId?{...e,...editData}:e));
    setEditId(null);
    showToast("✓ Data diperbarui");
  };

  const deptGroups = [...new Set(filteredEngineers.map(e=>e.dept))].sort();

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ MANPOWER ({filteredEngineers.length}/{engineers.length})</div>
        {canEdit&&<button onClick={()=>setShowAddForm(true)} style={{...btn("#cc0000")}}>+ TAMBAH MANPOWER</button>}
      </div>

      <div style={{...card,marginBottom:14,padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input style={{...inp,flex:1,minWidth:160}} placeholder="🔍 Cari nama / role..." value={mpFilter.search} onChange={e=>setMpFilter({...mpFilter,search:e.target.value})}/>
          <select style={{...inp,width:"auto"}} value={mpFilter.dept} onChange={e=>setMpFilter({...mpFilter,dept:e.target.value})}>
            <option value="all">All Dept</option>{depts.map(d=><option key={d}>{d}</option>)}
          </select>
          <select style={{...inp,width:"auto"}} value={mpFilter.status} onChange={e=>setMpFilter({...mpFilter,status:e.target.value})}>
            <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {showAddForm&&canEdit&&(
        <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ MANPOWER BARU</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[["NAMA *","text","name"],["ROLE *","text","role"],["DEPARTMENT","text","dept"],["PHONE","text","phone"],["EMAIL","email","email"]].map(([lbl,type,key])=>(
              <div key={key}>
                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{lbl}</div>
                <input type={type} style={inp} value={newEng[key]||""} onChange={e=>setNewEng({...newEng,[key]:e.target.value})}/>
              </div>
            ))}
            <div>
              <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>STATUS</div>
              <select style={inp} value={newEng.status} onChange={e=>setNewEng({...newEng,status:e.target.value})}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addEngineer} style={{...btn("#10b981")}}>TAMBAH</button>
            <button onClick={()=>setShowAddForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </div>
      )}

      {deptGroups.map(dept=>(
        <div key={dept} style={{marginBottom:20}}>
          <div style={{fontSize:10,color:"#38bdf8",letterSpacing:3,marginBottom:10}}>▸ {dept.toUpperCase()} ({filteredEngineers.filter(e=>e.dept===dept).length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {filteredEngineers.filter(e=>e.dept===dept).map(e=>{
              const isEditing=editId===e.id;
              return (
                <div key={e.id} style={{...card,padding:14,border:`1px solid ${kpiColor(e.kpi)}33`}}>
                  {isEditing?(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        {[["NAMA","name"],["ROLE","role"],["DEPT","dept"],["PHONE","phone"],["EMAIL","email"]].map(([lbl,key])=>(
                          <div key={key}><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>{lbl}</div><input style={{...inp,fontSize:11,padding:"5px 8px"}} value={editData[key]??e[key]??""} onChange={ev=>setEditData({...editData,[key]:ev.target.value})}/></div>
                        ))}
                        <div><div style={{fontSize:8,color:"#64748b",marginBottom:2}}>STATUS</div><select style={{...inp,fontSize:11,padding:"5px 8px"}} value={editData.status??e.status} onChange={ev=>setEditData({...editData,status:ev.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={saveEdit} style={{...btn("#10b981"),padding:"5px 12px",fontSize:10}}>Simpan</button>
                        <button onClick={()=>setEditId(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer"}}>Batal</button>
                      </div>
                    </div>
                  ):(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:36,height:36,borderRadius:"50%",background:kpiColor(e.kpi)+"22",border:`2px solid ${kpiColor(e.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:kpiColor(e.kpi)}}>{e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                          <div>
                            <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{e.name}</div>
                            <div style={{fontSize:9,color:"#475569"}}>{e.role}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:4}}>
                          <Badge label={e.status==="active"?"ACTIVE":"INACTIVE"} color={e.status==="active"?"#10b981":"#6b7280"} small/>
                        </div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:8}}>
                        <span>Avail: <span style={{color:"#38bdf8",fontWeight:700}}>{e.availability}%</span></span>
                        <span>KPI: <span style={{color:kpiColor(e.kpi),fontWeight:700}}>{e.kpi}%</span></span>
                        <span>Hours: <span style={{color:"#a78bfa",fontWeight:700}}>{e.hoursLogged}h</span></span>
                      </div>
                      <GaugeRing value={e.kpi} size={50}/>
                      {canEdit&&(
                        <div style={{display:"flex",gap:6,marginTop:8}}>
                          <button onClick={()=>{setEditId(e.id);setEditData({});}} style={{...btnSm("#38bdf8"),flex:1}}>✏ Edit</button>
                          <button onClick={()=>deleteEngineer(e.id)} style={{...btnSm("#ef4444"),flex:1}}>✕ Hapus</button>
                        </div>
                      )}
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
// ROUTE TAB
// ═══════════════════════════════════════════════════════════════
function RouteTab({routes,setRoutes,vehicles,setVehicles,engineers,canEdit,card,inp,btn,btnSm,showToast}) {
  const [routeView, setRouteView] = useState("calendar"); // calendar | list | vehicles | maintenance
  const [selectedDate, setSelectedDate] = useState(T);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editRouteId, setEditRouteId] = useState(null);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [calDate, setCalDate] = useState(new Date());

  const [routeForm, setRouteForm] = useState({date:T,vehicleId:"",driver:"",destination:"",activities:[],activityInput:"",team:[],notes:"",status:"scheduled",returnTime:"",kmStart:"",kmEnd:""});
  const [vehicleForm, setVehicleForm] = useState({type:"Grandmax",plate:"",color:"",year:"",status:"available",lastMaintenance:"",nextMaintenance:"",odometerKm:"",notes:""});

  const routeStatuses = {scheduled:"#3b82f6",in_progress:"#f59e0b",completed:"#10b981",cancelled:"#ef4444"};

  const getDaysInMonth = (date) => {
    const year=date.getFullYear(), month=date.getMonth();
    const firstDay=new Date(year,month,1).getDay();
    const daysInMonth=new Date(year,month+1,0).getDate();
    return {firstDay,daysInMonth,year,month};
  };

  const saveRoute = () => {
    if(!routeForm.destination||!routeForm.driver) return;
    const acts=routeForm.activityInput?[...routeForm.activities,routeForm.activityInput]:routeForm.activities;
    if(editRouteId) {
      setRoutes(routes.map(r=>r.id===editRouteId?{...routeForm,id:editRouteId,activities:acts}:r));
      setEditRouteId(null);
    } else {
      setRoutes([...routes,{...routeForm,id:uid(),activities:acts}]);
    }
    setRouteForm({date:T,vehicleId:"",driver:"",destination:"",activities:[],activityInput:"",team:[],notes:"",status:"scheduled",returnTime:"",kmStart:"",kmEnd:""});
    setShowAddRoute(false);
    showToast("✓ Route disimpan");
  };

  const deleteRoute = (id) => {
    if(!window.confirm("Hapus route ini?")) return;
    setRoutes(routes.filter(r=>r.id!==id));
    showToast("Route dihapus","#ef4444");
  };

  const saveVehicle = () => {
    if(!vehicleForm.plate||!vehicleForm.type) return;
    if(editVehicleId) {
      setVehicles(vehicles.map(v=>v.id===editVehicleId?{...vehicleForm,id:editVehicleId}:v));
      setEditVehicleId(null);
    } else {
      setVehicles([...vehicles,{...vehicleForm,id:uid()}]);
    }
    setVehicleForm({type:"Grandmax",plate:"",color:"",year:"",status:"available",lastMaintenance:"",nextMaintenance:"",odometerKm:"",notes:""});
    setShowAddVehicle(false);
    showToast("✓ Kendaraan disimpan");
  };

  const deleteVehicle = (id) => {
    if(!window.confirm("Hapus kendaraan ini?")) return;
    setVehicles(vehicles.filter(v=>v.id!==id));
    showToast("Kendaraan dihapus","#ef4444");
  };

  const exportRoutesToCSV = () => {
    const header="Tanggal,Kendaraan,Driver,Destinasi,Aktivitas,Tim,Status,KM Start,KM End,Catatan\n";
    const rows=routes.map(r=>{
      const v=vehicles.find(vv=>vv.id===r.vehicleId||vv.id===Number(r.vehicleId));
      return `${r.date},"${v?v.plate+' ('+v.type+')':''}","${r.driver}","${r.destination}","${(r.activities||[]).join('; ')}","${(r.team||[]).join('; ')}",${r.status},${r.kmStart||''},${r.kmEnd||''},"${r.notes||''}"`;
    }).join("\n");
    const blob=new Blob([header+rows],{type:"text/csv"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="routes.csv"; a.click();
    showToast("✓ Exported ke CSV");
  };

  const SUB = [
    {id:"calendar",label:"📅 Kalender"},
    {id:"list",label:"📋 List Route"},
    {id:"vehicles",label:"🚐 Kendaraan"},
    {id:"maintenance",label:"🔧 Maintenance"},
  ];

  const {firstDay,daysInMonth,year,month}=getDaysInMonth(calDate);

  // Maintenance alerts
  const maintenanceAlerts=vehicles.filter(v=>daysLeft(v.nextMaintenance)<=14);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:4}}>▸ FLEET & ROUTE MANAGEMENT</div>
        <div style={{display:"flex",gap:8}}>
          {canEdit&&<button onClick={()=>setShowAddRoute(!showAddRoute)} style={{...btn("#cc0000")}}>+ TAMBAH ROUTE</button>}
          <button onClick={exportRoutesToCSV} style={{...btn("#10b981")}}>↓ Export CSV</button>
        </div>
      </div>

      {/* Maintenance alerts */}
      {maintenanceAlerts.length>0&&(
        <div style={{background:"#f59e0b11",border:"1px solid #f59e0b33",borderRadius:10,padding:"10px 16px",marginBottom:14}}>
          <div style={{fontSize:10,color:"#f59e0b",fontWeight:700,marginBottom:6}}>⚠️ MAINTENANCE ALERTS ({maintenanceAlerts.length} kendaraan)</div>
          {maintenanceAlerts.map(v=>(
            <div key={v.id} style={{fontSize:11,color:"#e2e8f0"}}>🔧 {v.plate} ({v.type}) — Maintenance {daysLeft(v.nextMaintenance)<=0?"TERLAMBAT":daysLeft(v.nextMaintenance)+" hari lagi"} · {fmtDate(v.nextMaintenance)}</div>
          ))}
        </div>
      )}

      {/* Sub nav */}
      <div style={{display:"flex",gap:4,marginBottom:14}}>
        {SUB.map(s=>(
          <button key={s.id} onClick={()=>setRouteView(s.id)} style={{background:routeView===s.id?"linear-gradient(135deg,#cc0000,#991111)":"transparent",border:routeView===s.id?"none":"1px solid #1e3a5f",color:routeView===s.id?"#fff":"#64748b",borderRadius:8,padding:"5px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>{s.label}</button>
        ))}
      </div>

      {/* ADD ROUTE FORM */}
      {showAddRoute&&canEdit&&(
        <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
          <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ {editRouteId?"EDIT":"TAMBAH"} ROUTE</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TANGGAL</div><input type="date" style={inp} value={routeForm.date} onChange={e=>setRouteForm({...routeForm,date:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KENDARAAN</div>
              <select style={inp} value={routeForm.vehicleId} onChange={e=>setRouteForm({...routeForm,vehicleId:e.target.value})}>
                <option value="">-- Pilih Kendaraan --</option>
                {vehicles.map(v=><option key={v.id} value={v.id}>{v.plate} — {v.type} ({v.color})</option>)}
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DRIVER</div><input style={inp} value={routeForm.driver} onChange={e=>setRouteForm({...routeForm,driver:e.target.value})} placeholder="Nama driver"/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DESTINASI / TUJUAN</div><input style={inp} value={routeForm.destination} onChange={e=>setRouteForm({...routeForm,destination:e.target.value})} placeholder="PT. xxx, Lokasi..."/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>STATUS</div>
              <select style={inp} value={routeForm.status} onChange={e=>setRouteForm({...routeForm,status:e.target.value})}>
                <option value="scheduled">Scheduled</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>RETURN TIME</div><input type="time" style={inp} value={routeForm.returnTime} onChange={e=>setRouteForm({...routeForm,returnTime:e.target.value})}/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KM START</div><input type="number" style={inp} value={routeForm.kmStart} onChange={e=>setRouteForm({...routeForm,kmStart:e.target.value})} placeholder="Odometer start"/></div>
            <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KM END</div><input type="number" style={inp} value={routeForm.kmEnd} onChange={e=>setRouteForm({...routeForm,kmEnd:e.target.value})} placeholder="Odometer end"/></div>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KEGIATAN (tekan Enter untuk tambah)</div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input style={{...inp,flex:1}} value={routeForm.activityInput} onChange={e=>setRouteForm({...routeForm,activityInput:e.target.value})} onKeyDown={e=>{if(e.key==="Enter"&&routeForm.activityInput){setRouteForm({...routeForm,activities:[...routeForm.activities,routeForm.activityInput],activityInput:""});e.preventDefault();}}} placeholder="Tambah kegiatan..."/>
                <button onClick={()=>{if(routeForm.activityInput){setRouteForm({...routeForm,activities:[...routeForm.activities,routeForm.activityInput],activityInput:""});}}} style={{...btn("#38bdf8"),padding:"6px 14px"}}>+</button>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {routeForm.activities.map((act,i)=>(
                  <div key={i} style={{background:"#38bdf822",border:"1px solid #38bdf844",borderRadius:20,padding:"2px 10px",fontSize:10,color:"#38bdf8",display:"flex",alignItems:"center",gap:6}}>
                    {act}<button onClick={()=>setRouteForm({...routeForm,activities:routeForm.activities.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:0,lineHeight:1}}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TIM (pilih banyak)</div>
              <select multiple style={{...inp,height:80}} onChange={e=>{const v=Array.from(e.target.selectedOptions,o=>Number(o.value));setRouteForm({...routeForm,team:v});}}>
                {engineers.map(e=><option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>CATATAN</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={routeForm.notes} onChange={e=>setRouteForm({...routeForm,notes:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveRoute} style={{...btn("#cc0000")}}>SIMPAN ROUTE</button>
            <button onClick={()=>{setShowAddRoute(false);setEditRouteId(null);}} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {routeView==="calendar"&&(
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button onClick={()=>setCalDate(new Date(calDate.getFullYear(),calDate.getMonth()-1,1))} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>←</button>
            <div style={{fontSize:14,color:"#e2e8f0",fontWeight:700}}>{calDate.toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</div>
            <button onClick={()=>setCalDate(new Date(calDate.getFullYear(),calDate.getMonth()+1,1))} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>→</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d=><div key={d} style={{textAlign:"center",fontSize:9,color:"#64748b",fontWeight:700,padding:"4px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const dayNum=i+1;
              const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(dayNum).padStart(2,"0")}`;
              const dayRoutes=routes.filter(r=>r.date===dateStr);
              const isToday=dateStr===T;
              return (
                <div key={dayNum} onClick={()=>setSelectedDate(dateStr)} style={{minHeight:70,background:selectedDate===dateStr?"#cc000022":isToday?"#38bdf811":"#0f274460",border:`1px solid ${selectedDate===dateStr?"#cc0000":isToday?"#38bdf844":"#1e3a5f"}`,borderRadius:8,padding:"6px",cursor:"pointer",transition:"all .2s"}}>
                  <div style={{fontSize:11,color:isToday?"#38bdf8":"#e2e8f0",fontWeight:isToday?700:400,marginBottom:4}}>{dayNum}</div>
                  {dayRoutes.map(r=>{
                    const v=vehicles.find(vv=>vv.id===r.vehicleId||vv.id===Number(r.vehicleId));
                    return <div key={r.id} style={{fontSize:8,background:(routeStatuses[r.status]||"#64748b")+"33",color:routeStatuses[r.status]||"#64748b",borderRadius:3,padding:"1px 4px",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v?.type||"?"}: {r.destination.slice(0,15)}</div>;
                  })}
                </div>
              );
            })}
          </div>
          {selectedDate&&(
            <div style={{marginTop:16,borderTop:"1px solid #1e3a5f",paddingTop:16}}>
              <div style={{fontSize:11,color:"#38bdf8",letterSpacing:2,marginBottom:10}}>ROUTES — {fmtDate(selectedDate)}</div>
              {routes.filter(r=>r.date===selectedDate).map(r=>{
                const v=vehicles.find(vv=>vv.id===r.vehicleId||vv.id===Number(r.vehicleId));
                const teamNames=Array.isArray(r.team)?r.team.map(id=>{const e=engineers.find(e=>e.id===id||e.id===Number(id));return e?.name||id;}).join(", "):"";
                return (
                  <div key={r.id} style={{background:"#0f274460",border:"1px solid #1e3a5f",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div>
                        <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{r.destination}</div>
                        <div style={{fontSize:10,color:"#475569"}}>🚐 {v?v.plate+" ("+v.type+")":"—"} · 👤 {r.driver}</div>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <Badge label={r.status.replace("_"," ").toUpperCase()} color={routeStatuses[r.status]||"#64748b"}/>
                        {canEdit&&<button onClick={()=>{setEditRouteId(r.id);setRouteForm({...r,activityInput:""});setShowAddRoute(true);}} style={{...btnSm("#38bdf8")}}>✏</button>}
                        {canEdit&&<button onClick={()=>deleteRoute(r.id)} style={{...btnSm("#ef4444")}}>✕</button>}
                      </div>
                    </div>
                    {(r.activities||[]).length>0&&<div style={{marginBottom:6}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>KEGIATAN:</div>{(r.activities||[]).map((a,i)=><div key={i} style={{fontSize:10,color:"#94a3b8"}}>• {a}</div>)}</div>}
                    {teamNames&&<div style={{fontSize:10,color:"#475569"}}>👥 {teamNames}</div>}
                    {r.notes&&<div style={{fontSize:10,color:"#64748b",fontStyle:"italic",marginTop:4}}>{r.notes}</div>}
                  </div>
                );
              })}
              {routes.filter(r=>r.date===selectedDate).length===0&&<div style={{fontSize:11,color:"#334155",textAlign:"center",padding:20}}>Tidak ada route pada tanggal ini</div>}
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {routeView==="list"&&(
        <div>
          {routes.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>{
            const v=vehicles.find(vv=>vv.id===r.vehicleId||vv.id===Number(r.vehicleId));
            const teamNames=Array.isArray(r.team)?r.team.map(id=>{const e=engineers.find(e=>e.id===id||e.id===Number(id));return e?.name||id;}).join(", "):"";
            return (
              <div key={r.id} style={{...card,marginBottom:10,borderLeft:`3px solid ${routeStatuses[r.status]||"#64748b"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{r.destination}</div>
                    <div style={{fontSize:10,color:"#475569",marginTop:2}}>📅 {fmtDate(r.date)} · 🚐 {v?v.plate+" ("+v.type+")":"—"} · 👤 {r.driver}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Badge label={r.status.replace("_"," ").toUpperCase()} color={routeStatuses[r.status]||"#64748b"}/>
                    {canEdit&&<button onClick={()=>{setEditRouteId(r.id);setRouteForm({...r,activityInput:""});setShowAddRoute(true);}} style={{...btnSm("#38bdf8")}}>✏ Edit</button>}
                    {canEdit&&<button onClick={()=>deleteRoute(r.id)} style={{...btnSm("#ef4444")}}>✕ Hapus</button>}
                  </div>
                </div>
                {(r.activities||[]).length>0&&<div style={{marginBottom:6}}>{(r.activities||[]).map((a,i)=><span key={i} style={{fontSize:9,background:"#38bdf811",border:"1px solid #38bdf833",borderRadius:20,padding:"2px 8px",color:"#38bdf8",marginRight:6}}>• {a}</span>)}</div>}
                <div style={{display:"flex",gap:16,fontSize:10,color:"#64748b",flexWrap:"wrap"}}>
                  {teamNames&&<span>👥 {teamNames}</span>}
                  {r.kmStart&&<span>KM: {r.kmStart}{r.kmEnd?" → "+r.kmEnd:""}{r.kmEnd&&r.kmStart?" (+"+(Number(r.kmEnd)-Number(r.kmStart))+"km)":""}</span>}
                  {r.returnTime&&<span>Kembali: {r.returnTime}</span>}
                </div>
              </div>
            );
          })}
          {routes.length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:40}}>Belum ada data route</div>}
        </div>
      )}

      {/* VEHICLES VIEW */}
      {routeView==="vehicles"&&(
        <div>
          {canEdit&&<button onClick={()=>setShowAddVehicle(!showAddVehicle)} style={{...btn("#cc0000"),marginBottom:14}}>+ TAMBAH KENDARAAN</button>}
          {showAddVehicle&&canEdit&&(
            <div style={{...card,marginBottom:14,border:"1px solid #cc000044"}}>
              <div style={{fontSize:10,color:"#cc0000",letterSpacing:2,marginBottom:12}}>▸ {editVehicleId?"EDIT":"TAMBAH"} KENDARAAN</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TIPE *</div>
                  <select style={inp} value={vehicleForm.type} onChange={e=>setVehicleForm({...vehicleForm,type:e.target.value})}>
                    <option>Grandmax</option><option>Truck</option><option>Minibus</option><option>Pickup</option>
                  </select>
                </div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PLAT NOMOR *</div><input style={inp} value={vehicleForm.plate} onChange={e=>setVehicleForm({...vehicleForm,plate:e.target.value})} placeholder="B 1234 FJT"/></div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>WARNA</div><input style={inp} value={vehicleForm.color} onChange={e=>setVehicleForm({...vehicleForm,color:e.target.value})}/></div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TAHUN</div><input type="number" style={inp} value={vehicleForm.year} onChange={e=>setVehicleForm({...vehicleForm,year:e.target.value})}/></div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>STATUS</div>
                  <select style={inp} value={vehicleForm.status} onChange={e=>setVehicleForm({...vehicleForm,status:e.target.value})}>
                    <option value="available">Available</option><option value="on_route">On Route</option><option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ODOMETER (KM)</div><input type="number" style={inp} value={vehicleForm.odometerKm} onChange={e=>setVehicleForm({...vehicleForm,odometerKm:e.target.value})}/></div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>LAST MAINTENANCE</div><input type="date" style={inp} value={vehicleForm.lastMaintenance} onChange={e=>setVehicleForm({...vehicleForm,lastMaintenance:e.target.value})}/></div>
                <div><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NEXT MAINTENANCE</div><input type="date" style={inp} value={vehicleForm.nextMaintenance} onChange={e=>setVehicleForm({...vehicleForm,nextMaintenance:e.target.value})}/></div>
                <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:"#64748b",marginBottom:3}}>CATATAN KONDISI</div><textarea style={{...inp,minHeight:50,resize:"vertical"}} value={vehicleForm.notes} onChange={e=>setVehicleForm({...vehicleForm,notes:e.target.value})}/></div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={saveVehicle} style={{...btn("#10b981")}}>SIMPAN</button>
                <button onClick={()=>{setShowAddVehicle(false);setEditVehicleId(null);}} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
            {vehicles.map(v=>{
              const vColor=v.status==="available"?"#10b981":v.status==="on_route"?"#f59e0b":"#ef4444";
              const maintDays=daysLeft(v.nextMaintenance);
              return (
                <div key={v.id} style={{...card,border:`1px solid ${vColor}33`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:16,marginBottom:4}}>{v.type==="Grandmax"?"🚐":"🚛"}</div>
                      <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{v.plate}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>{v.type} · {v.color} · {v.year}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                      <Badge label={v.status.replace("_"," ").toUpperCase()} color={vColor}/>
                      {maintDays<=14&&<Badge label={maintDays<=0?"TERLAMBAT":"MAINT "+maintDays+"h"} color="#f59e0b"/>}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10,fontSize:10}}>
                    <div style={{background:"#0f274460",borderRadius:6,padding:"6px 10px"}}><div style={{color:"#64748b",marginBottom:2}}>ODOMETER</div><div style={{color:"#38bdf8",fontWeight:700}}>{(v.odometerKm||0).toLocaleString()} km</div></div>
                    <div style={{background:"#0f274460",borderRadius:6,padding:"6px 10px"}}><div style={{color:"#64748b",marginBottom:2}}>NEXT SERVICE</div><div style={{color:maintDays<=0?"#ef4444":maintDays<=14?"#f59e0b":"#10b981",fontWeight:700}}>{fmtDate(v.nextMaintenance)}</div></div>
                  </div>
                  {v.notes&&<div style={{fontSize:10,color:"#64748b",fontStyle:"italic",marginBottom:10}}>{v.notes}</div>}
                  {canEdit&&(
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>{setEditVehicleId(v.id);setVehicleForm({...v});setShowAddVehicle(true);}} style={{...btnSm("#38bdf8"),flex:1}}>✏ Edit</button>
                      <button onClick={()=>deleteVehicle(v.id)} style={{...btnSm("#ef4444"),flex:1}}>✕ Hapus</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAINTENANCE VIEW */}
      {routeView==="maintenance"&&(
        <div>
          <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ STATUS MAINTENANCE KENDARAAN</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[...vehicles].sort((a,b)=>new Date(a.nextMaintenance)-new Date(b.nextMaintenance)).map(v=>{
              const maintDays=daysLeft(v.nextMaintenance);
              const c=maintDays<=0?"#ef4444":maintDays<=14?"#f59e0b":"#10b981";
              const lastDays=v.lastMaintenance?Math.abs(daysLeft(v.lastMaintenance)):null;
              return (
                <div key={v.id} style={{...card,borderLeft:`3px solid ${c}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                    <div>
                      <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{v.plate} — {v.type}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>{v.color} · {v.year} · {(v.odometerKm||0).toLocaleString()} km</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,textAlign:"center"}}>
                      <div style={{background:"#0f274460",borderRadius:8,padding:"8px 12px"}}>
                        <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TERAKHIR SERVICE</div>
                        <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{fmtDate(v.lastMaintenance)}</div>
                        <div style={{fontSize:9,color:"#475569"}}>{lastDays!=null?lastDays+" hari lalu":""}</div>
                      </div>
                      <div style={{background:c+"11",border:`1px solid ${c}33`,borderRadius:8,padding:"8px 12px"}}>
                        <div style={{fontSize:9,color:c,marginBottom:3}}>NEXT SERVICE</div>
                        <div style={{fontSize:11,color:c,fontWeight:700}}>{fmtDate(v.nextMaintenance)}</div>
                        <div style={{fontSize:9,color:c,fontWeight:700}}>{maintDays<=0?`TERLAMBAT ${Math.abs(maintDays)}h`:maintDays+" hari lagi"}</div>
                      </div>
                    </div>
                  </div>
                  {v.notes&&<div style={{fontSize:10,color:"#64748b",marginTop:8,fontStyle:"italic"}}>🔧 {v.notes}</div>}
                  {canEdit&&(
                    <div style={{marginTop:10}}>
                      <button onClick={()=>{
                        const newNext=window.prompt("Tanggal next maintenance (YYYY-MM-DD):",addDays(T,90));
                        if(newNext) { setVehicles(vehicles.map(vv=>vv.id===v.id?{...vv,lastMaintenance:T,nextMaintenance:newNext}:vv)); showToast("✓ Maintenance diperbarui"); }
                      }} style={{...btnSm("#10b981")}}>✓ Catat Service Selesai</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMELINE TAB
// ═══════════════════════════════════════════════════════════════
function TimelineTab({projects,card,setSelProject,setTab}) {
  const sorted=[...projects].sort((a,b)=>new Date(a.startDate)-new Date(b.startDate));
  const allDates=projects.flatMap(p=>[new Date(p.startDate),new Date(p.deadline)]).filter(d=>!isNaN(d));
  const minDate=allDates.length?new Date(Math.min(...allDates)):new Date();
  const maxDate=allDates.length?new Date(Math.max(...allDates)):new Date();
  const totalDays=Math.max((maxDate-minDate)/86400000,1);

  return (
    <div>
      <div style={{fontSize:11,color:"#cc0000",letterSpacing:4,marginBottom:18}}>▸ GANTT TIMELINE</div>
      <div style={card}>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:800}}>
            {/* Header */}
            <div style={{display:"flex",marginBottom:8,paddingLeft:200}}>
              {Array.from({length:Math.ceil(totalDays/7)}).map((_,i)=>{
                const d=new Date(minDate); d.setDate(d.getDate()+i*7);
                return <div key={i} style={{minWidth:60,fontSize:8,color:"#475569",textAlign:"center"}}>{d.toLocaleDateString("id-ID",{month:"short",day:"numeric"})}</div>;
              })}
            </div>
            {/* Rows */}
            {sorted.map(p=>{
              if(!p.startDate||!p.deadline) return null;
              const start=Math.max(0,(new Date(p.startDate)-minDate)/86400000);
              const dur=(new Date(p.deadline)-new Date(p.startDate))/86400000;
              const left=(start/totalDays)*100;
              const width=Math.max((dur/totalDays)*100,1);
              const c=phaseColor[p.phase]||statusColor[p.status]||"#64748b";
              return (
                <div key={p.id} style={{display:"flex",alignItems:"center",marginBottom:6}}>
                  <div style={{width:200,fontSize:10,color:"#e2e8f0",paddingRight:10,flexShrink:0,cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} onClick={()=>{setSelProject(p.id);setTab("projects");}}>
                    {p.name.slice(0,28)}
                  </div>
                  <div style={{flex:1,position:"relative",height:24,background:"#0f274460",borderRadius:4}}>
                    <div style={{position:"absolute",left:`${left}%`,width:`${width}%`,height:"100%",background:c+"88",border:`1px solid ${c}`,borderRadius:4,display:"flex",alignItems:"center",paddingLeft:6,overflow:"hidden",transition:"all .3s"}}>
                      <span style={{fontSize:9,color:"#fff",fontWeight:700,whiteSpace:"nowrap"}}>{p.phase}</span>
                    </div>
                    <div style={{position:"absolute",left:`${left+(width*(calcPct(p)))*.01}%`,top:0,width:"2px",height:"100%",background:"#10b981",opacity:0.8}}/>
                  </div>
                  <div style={{width:60,fontSize:9,color:"#475569",textAlign:"right",paddingLeft:8}}>{daysLeft(p.deadline)}h</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}>
          {PHASES.map(ph=><div key={ph} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:8,background:phaseColor[ph],borderRadius:2}}/><span style={{fontSize:9,color:"#64748b"}}>{ph}</span></div>)}
        </div>
      </div>
    </div>
  );
}
function calcPct(p) { const ms=p.milestones||[]; if(ms.length===0) return p.progress||0; return Math.round(ms.reduce((a,m)=>a+(m.actualProgress||0),0)/ms.length); }

// ═══════════════════════════════════════════════════════════════
// COMPLETED TAB
// ═══════════════════════════════════════════════════════════════
function CompletedTab({completedProjects,setCompleted,engineers,canEdit,card,inp,btn,btnSm,showToast}) {
  const [editId, setEditId] = useState(null);
  const [afterSales, setAfterSales] = useState("");

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:11,color:"#10b981",letterSpacing:4}}>▸ COMPLETED PROJECTS & AFTER SALES ({completedProjects.length})</div>
      </div>
      {completedProjects.length===0&&<div style={{...card,textAlign:"center",color:"#334155",padding:60}}><div style={{fontSize:24,marginBottom:12}}>🏆</div>Belum ada proyek selesai</div>}
      {completedProjects.map(p=>{
        const teamEngineers=(p.team||[]).map(id=>engineers.find(e=>e.id===id||e.id===Number(id))).filter(Boolean);
        const isEditing=editId===p.id;
        const warrantyDays=p.warrantyEnd?daysLeft(p.warrantyEnd):null;
        return (
          <div key={p.id} style={{...card,marginBottom:14,borderLeft:"3px solid #10b981"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:14,color:"#e2e8f0",fontWeight:800}}>{p.name}</div>
                <div style={{fontSize:10,color:"#64748b",marginTop:3}}>{p.customer} · PIC: {p.pic} · Selesai: {fmtDate(p.completedDate)}</div>
                <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                  <Badge label="COMPLETED" color="#10b981"/>
                  {warrantyDays!=null&&<Badge label={warrantyDays>0?`Garansi ${warrantyDays}h`:"GARANSI HABIS"} color={warrantyDays>0?"#38bdf8":"#ef4444"}/>}
                  {p.budget>0&&<Badge label={fmtIDR(p.budget)} color="#a78bfa"/>}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {canEdit&&<button onClick={()=>{setEditId(isEditing?null:p.id);setAfterSales(p.afterSalesNotes||"");}} style={{...btnSm("#38bdf8")}}>🔧 After Sales</button>}
                {canEdit&&<button onClick={()=>{if(window.confirm("Hapus dari completed?"))setCompleted(completedProjects.filter(c=>c.id!==p.id));}} style={{...btnSm("#ef4444")}}>✕</button>}
              </div>
            </div>
            {teamEngineers.length>0&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                {teamEngineers.map(e=><div key={e.id} style={{background:"#38bdf811",border:"1px solid #38bdf833",borderRadius:20,padding:"2px 10px",fontSize:9,color:"#38bdf8"}}>{e.name}</div>)}
              </div>
            )}
            {isEditing&&(
              <div style={{background:"#0f274460",borderRadius:10,padding:12,marginBottom:10}}>
                <div style={{fontSize:9,color:"#38bdf8",letterSpacing:1,marginBottom:6}}>AFTER SALES NOTES & SUPPORT</div>
                <textarea style={{...inp,minHeight:80,resize:"vertical"}} value={afterSales} onChange={e=>setAfterSales(e.target.value)} placeholder="Catatan after sales, kunjungan servis, keluhan customer..."/>
                <div style={{marginTop:8,display:"flex",gap:6}}>
                  <button onClick={()=>{setCompleted(completedProjects.map(c=>c.id===p.id?{...c,afterSalesNotes:afterSales}:c));setEditId(null);showToast("✓ After sales diperbarui");}} style={{...btn("#10b981")}}>Simpan</button>
                  <button onClick={()=>setEditId(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"5px 12px",fontSize:10,cursor:"pointer"}}>Batal</button>
                </div>
              </div>
            )}
            {p.afterSalesNotes&&!isEditing&&(
              <div style={{background:"#10b98111",border:"1px solid #10b98133",borderRadius:8,padding:"8px 12px"}}>
                <div style={{fontSize:9,color:"#10b981",marginBottom:4}}>AFTER SALES NOTES</div>
                <div style={{fontSize:11,color:"#6ee7b7",lineHeight:1.6}}>{p.afterSalesNotes}</div>
              </div>
            )}
            {canEdit&&warrantyDays!=null&&(
              <div style={{marginTop:8}}>
                <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>UPDATE WARRANTY END DATE:</div>
                <input type="date" style={{...inp,width:160}} defaultValue={p.warrantyEnd} onBlur={e=>setCompleted(completedProjects.map(c=>c.id===p.id?{...c,warrantyEnd:e.target.value}:c))}/>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// KPI TAB
// ═══════════════════════════════════════════════════════════════
function KPITab({engineers,setEngineers,avgKpi,card,inp,canEdit}) {
  const depts=[...new Set(engineers.map(e=>e.dept))].sort();
  return (
    <div>
      <div style={{fontSize:11,color:"#cc0000",letterSpacing:4,marginBottom:18}}>▸ KPI DASHBOARD</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:18}}>
        {depts.map(d=>{
          const des=engineers.filter(e=>e.dept===d);
          const avg=Math.round(des.reduce((a,e)=>a+e.kpi,0)/Math.max(des.length,1));
          return (
            <div key={d} style={{...card,textAlign:"center"}}>
              <GaugeRing value={avg}/>
              <div style={{fontSize:10,color:"#e2e8f0",fontWeight:700,marginTop:4}}>{d}</div>
              <div style={{fontSize:9,color:"#475569"}}>{des.length} orang</div>
            </div>
          );
        })}
      </div>
      <div style={card}>
        <div style={{fontSize:11,color:"#cc0000",letterSpacing:3,marginBottom:14}}>▸ INDIVIDUAL KPI</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
          {[...engineers].sort((a,b)=>b.kpi-a.kpi).map(e=>(
            <div key={e.id} style={{background:"#0f274460",borderRadius:10,padding:"10px 12px",border:`1px solid ${kpiColor(e.kpi)}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{e.name}</div>
                  <div style={{fontSize:9,color:"#475569"}}>{e.dept}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:900,color:kpiColor(e.kpi)}}>{e.kpi}%</div>
                  <div style={{fontSize:9,color:"#a78bfa"}}>{e.hoursLogged}h</div>
                </div>
              </div>
              <ProgressBar value={e.kpi} color={kpiColor(e.kpi)} h={6}/>
              {canEdit&&<input type="range" min="0" max="100" value={e.kpi} onChange={ev=>setEngineers(engineers.map(en=>en.id===e.id?{...en,kpi:+ev.target.value}:en))} style={{width:"100%",marginTop:8,accentColor:kpiColor(e.kpi)}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════
function UsersTab({users,setUsers,currentUser,canEdit,card,inp,btn,btnSm,showToast}) {
  const [newUser, setNewUser] = useState({username:"",password:"",name:"",role:"viewer"});
  return (
    <div>
      <div style={{fontSize:11,color:"#cc0000",letterSpacing:4,marginBottom:18}}>▸ USER MANAGEMENT</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {users.map(u=>(
          <div key={u.id} style={{...card,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#cc0000,#991111)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>{u.avatar}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{u.name}</div>
              <div style={{fontSize:10,color:"#64748b"}}>@{u.username} · {u.role}</div>
            </div>
            <Badge label={u.role.toUpperCase()} color={u.role==="admin"?"#cc0000":u.role==="pm"?"#3b82f6":"#64748b"}/>
            <div style={{display:"flex",gap:6}}>
              <select style={{...inp,width:"auto",fontSize:11}} value={u.role} onChange={e=>setUsers(users.map(us=>us.id===u.id?{...us,role:e.target.value}:us))}>
                <option value="admin">Admin</option><option value="pm">PM</option><option value="viewer">Viewer</option>
              </select>
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
        <button onClick={()=>{
          if(!newUser.username||!newUser.password||!newUser.name) return;
          const avatar=newUser.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();
          setUsers([...users,{...newUser,id:uid(),avatar}]);
          setNewUser({username:"",password:"",name:"",role:"viewer"});
          showToast("✓ User ditambahkan");
        }} style={{...btn("#cc0000")}}>SIMPAN USER</button>
      </div>
    </div>
  );
}
