import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// DATABASE LAYER (localStorage-backed)
// ═══════════════════════════════════════════════════════════════
const DB = {
  get: (k) => { try { const v = localStorage.getItem("pmv4_"+k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem("pmv4_"+k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem("pmv4_"+k); } catch {} },
};

// ═══════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════
const USERS_SEED = [
  { id: 1, username: "admin", password: "admin123", name: "Administrator", role: "admin", avatar: "AD" },
  { id: 2, username: "pm", password: "pm123", name: "Project Manager", role: "pm", avatar: "PM" },
  { id: 3, username: "viewer", password: "view123", name: "Viewer", role: "viewer", avatar: "VW" },
];

const ENGINEERS_SEED = [
  { id: 1, name: "Itho", role: "Programmer", dept: "Programmer", availability: 80, kpi: 85, hoursLogged: 160, status: "active" },
  { id: 2, name: "Erick", role: "Programmer", dept: "Programmer", availability: 70, kpi: 82, hoursLogged: 148, status: "active" },
  { id: 3, name: "Farhan", role: "Programmer", dept: "Programmer", availability: 90, kpi: 78, hoursLogged: 132, status: "active" },
  { id: 4, name: "Gatot", role: "Electrical Engineer", dept: "Electrical", availability: 60, kpi: 88, hoursLogged: 176, status: "active" },
  { id: 5, name: "Nana", role: "Electrical Engineer", dept: "Electrical", availability: 75, kpi: 80, hoursLogged: 152, status: "active" },
  { id: 6, name: "Putra", role: "Electrical Engineer", dept: "Electrical", availability: 50, kpi: 74, hoursLogged: 144, status: "active" },
  { id: 7, name: "Fadel", role: "Electrical Engineer", dept: "Electrical", availability: 85, kpi: 79, hoursLogged: 128, status: "active" },
  { id: 8, name: "Gaza", role: "Electrical Engineer", dept: "Electrical", availability: 100, kpi: 72, hoursLogged: 112, status: "active" },
  { id: 9, name: "Tomi", role: "Electrical Engineer", dept: "Electrical", availability: 60, kpi: 83, hoursLogged: 168, status: "active" },
  { id: 10, name: "Luthfi", role: "Electrical Engineer", dept: "Electrical", availability: 40, kpi: 77, hoursLogged: 136, status: "active" },
  { id: 11, name: "Samuel", role: "Electrical Engineer", dept: "Electrical", availability: 90, kpi: 81, hoursLogged: 124, status: "active" },
  { id: 12, name: "Datuk", role: "Mechanical Engineer", dept: "Mechanical", availability: 70, kpi: 86, hoursLogged: 172, status: "active" },
  { id: 13, name: "Saad", role: "Mechanical Engineer", dept: "Mechanical", availability: 80, kpi: 84, hoursLogged: 160, status: "active" },
  { id: 14, name: "Eri S", role: "Mechanical Engineer", dept: "Mechanical", availability: 65, kpi: 79, hoursLogged: 148, status: "active" },
  { id: 15, name: "Candra", role: "Mechanical Engineer", dept: "Mechanical", availability: 55, kpi: 76, hoursLogged: 140, status: "active" },
  { id: 16, name: "Ridwan", role: "Mechanical Engineer", dept: "Mechanical", availability: 75, kpi: 82, hoursLogged: 156, status: "active" },
  { id: 17, name: "Dede", role: "Mechanical Engineer", dept: "Mechanical", availability: 80, kpi: 78, hoursLogged: 132, status: "active" },
  { id: 18, name: "Rio", role: "Mechanical Engineer", dept: "Mechanical", availability: 90, kpi: 80, hoursLogged: 120, status: "active" },
  { id: 19, name: "Raju", role: "Mechatronic Engineer", dept: "Mechatronic", availability: 60, kpi: 88, hoursLogged: 176, status: "active" },
  { id: 20, name: "Ade Irawan Saputra", role: "Mechanical Engineer", dept: "Mechanical", availability: 70, kpi: 83, hoursLogged: 164, status: "active" },
  { id: 21, name: "Ahmad", role: "Mechanical Engineer", dept: "Mechanical", availability: 85, kpi: 75, hoursLogged: 116, status: "active" },
  { id: 22, name: "Hanif Birru", role: "HSE Officer", dept: "HSE", availability: 100, kpi: 90, hoursLogged: 144, status: "active" },
  { id: 23, name: "Alpa", role: "HSE Officer", dept: "HSE", availability: 100, kpi: 87, hoursLogged: 136, status: "active" },
  { id: 24, name: "Julius", role: "HSE Officer", dept: "HSE", availability: 100, kpi: 85, hoursLogged: 128, status: "active" },
  { id: 25, name: "Hadiman", role: "Designer", dept: "Design", availability: 80, kpi: 88, hoursLogged: 168, status: "active" },
  { id: 26, name: "Yahya", role: "Designer", dept: "Design", availability: 75, kpi: 84, hoursLogged: 152, status: "active" },
  { id: 27, name: "Andi Triyono", role: "Production", dept: "Production", availability: 60, kpi: 82, hoursLogged: 176, status: "active" },
  { id: 28, name: "Bayu", role: "Production", dept: "Production", availability: 70, kpi: 79, hoursLogged: 160, status: "active" },
  { id: 29, name: "Dedi", role: "Production", dept: "Production", availability: 75, kpi: 77, hoursLogged: 148, status: "active" },
  { id: 30, name: "Satrio", role: "Production", dept: "Production", availability: 80, kpi: 80, hoursLogged: 136, status: "active" },
  { id: 31, name: "Tanjung", role: "Production", dept: "Production", availability: 85, kpi: 76, hoursLogged: 124, status: "active" },
  { id: 32, name: "Duta", role: "Production", dept: "Production", availability: 90, kpi: 78, hoursLogged: 112, status: "active" },
  { id: 33, name: "Saifunuri", role: "Production", dept: "Production", availability: 70, kpi: 81, hoursLogged: 144, status: "active" },
  { id: 34, name: "Mahdumi", role: "Production", dept: "Production", availability: 75, kpi: 83, hoursLogged: 156, status: "active" },
];

const today = new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate()+n); return r.toISOString().slice(0,10); };
const T = today.toISOString().slice(0,10);

const PROJECTS_SEED = [
  { id:1, name:"Garudafood - List Consumable", customer:"Garudafood", status:"On Track", priority:"Medium", startDate:addDays(T,-10), deadline:addDays(T,20), pic:"Gatot", team:[], notes:"List consumable items - procurement phase", budget:50000000, spent:15000000, milestones:[] },
  { id:2, name:"Diamond - Puyo & Jungle Juice", customer:"Diamond", status:"On Track", priority:"High", startDate:addDays(T,-15), deadline:addDays(T,30), pic:"Itho", team:[], notes:"Follow Up Hasil Pengerjaan. BA process", budget:150000000, spent:80000000, milestones:[] },
  { id:3, name:"Pepsico - Prepare Pengiriman", customer:"Pepsico", status:"At Risk", priority:"Critical", startDate:addDays(T,-5), deadline:addDays(T,7), pic:"Erick", team:[], notes:"Senin team Pepsico datang. Selasa depan kirim. Ethernet dan cover SS. Method statement dan safety document", budget:200000000, spent:170000000, milestones:[] },
  { id:4, name:"Cuzzon - Waiting Jig Customer", customer:"Cuzzon", status:"On Hold", priority:"Medium", startDate:addDays(T,-20), deadline:addDays(T,60), pic:"Datuk", team:[], notes:"Menunggu Jig customer - panjang tidak cukup", budget:80000000, spent:30000000, milestones:[] },
  { id:5, name:"Torabika - Z Cleated Belt", customer:"Torabika", status:"At Risk", priority:"High", startDate:addDays(T,-8), deadline:addDays(T,5), pic:"Ridwan", team:[], notes:"Negosiasi dan setting belt - harus minggu ini", budget:120000000, spent:95000000, milestones:[] },
  { id:6, name:"Beng Beng Ball - Delivery", customer:"Beng Beng", status:"On Track", priority:"High", startDate:addDays(T,-12), deadline:addDays(T,4), pic:"Saad", team:[], notes:"Sudah dibongkar - Prepare to delivery - kiriman hari Jumat depan", budget:90000000, spent:75000000, milestones:[] },
  { id:7, name:"Modifikasi Jalur GB 7", customer:"Internal", status:"On Track", priority:"Medium", startDate:addDays(T,-3), deadline:addDays(T,10), pic:"Candra", team:[], notes:"On process modifikasi - minggu depan selesai", budget:60000000, spent:20000000, milestones:[] },
  { id:8, name:"Unilever Savory - Pengerjaan", customer:"Unilever", status:"At Risk", priority:"Critical", startDate:addDays(T,-20), deadline:addDays(T,15), pic:"Raju", team:[], notes:"Ada ketidaksesuaian EOL, LINE B, Setting robot", budget:350000000, spent:280000000, milestones:[] },
  { id:9, name:"Yakult - Conveyor Issue & BA", customer:"Yakult", status:"On Track", priority:"High", startDate:addDays(T,-7), deadline:addDays(T,14), pic:"Farhan", team:[], notes:"Conveyor issue dan berita acara", budget:100000000, spent:60000000, milestones:[] },
  { id:10, name:"MIM - Double Stacking Controller", customer:"MIM", status:"On Hold", priority:"Medium", startDate:addDays(T,14), deadline:addDays(T,60), pic:"Erick", team:[], notes:"Sehabis lebaran. Electrical Controller Program Double Stacking", budget:180000000, spent:10000000, milestones:[] },
  { id:11, name:"Mayora - Conveyor Metal Detector", customer:"Mayora", status:"On Track", priority:"High", startDate:addDays(T,-14), deadline:addDays(T,3), pic:"Gatot", team:[], notes:"Ready to ship", budget:130000000, spent:125000000, milestones:[] },
  { id:12, name:"Mayora - Conveyor SOC 3 Step", customer:"Mayora", status:"On Track", priority:"High", startDate:addDays(T,-14), deadline:addDays(T,3), pic:"Nana", team:[], notes:"Ready to ship", budget:140000000, spent:135000000, milestones:[] },
  { id:13, name:"Mayora Candy Incline SPK 03", customer:"Mayora", status:"On Track", priority:"Critical", startDate:addDays(T,-20), deadline:addDays(T,0), pic:"Putra", team:[], notes:"Target kirim 10 April", budget:160000000, spent:150000000, milestones:[] },
  { id:14, name:"Mayora Biscuit Jatake 2", customer:"Mayora", status:"On Track", priority:"High", startDate:addDays(T,-15), deadline:addDays(T,16), pic:"Fadel", team:[], notes:"Target akhir April", budget:200000000, spent:120000000, milestones:[] },
  { id:15, name:"BKP - Modif Flat Belt Conveyor", customer:"BKP", status:"At Risk", priority:"Critical", startDate:addDays(T,-10), deadline:addDays(T,5), pic:"Gaza", team:[], notes:"On process checking - butuh kirim segera. Modifikasi Flat Belt Conveyor 2.7Mt dan system antrian", budget:95000000, spent:80000000, milestones:[] },
  { id:16, name:"CBC Cemani - Instalasi", customer:"CBC", status:"On Track", priority:"Critical", startDate:addDays(T,-2), deadline:addDays(T,1), pic:"Tomi", team:[], notes:"Selasa kirim dan instalasi", budget:110000000, spent:100000000, milestones:[] },
  { id:17, name:"CBC Energizer - Load Cell Modif", customer:"CBC", status:"On Track", priority:"Medium", startDate:addDays(T,-5), deadline:addDays(T,14), pic:"Luthfi", team:[], notes:"Load cell modifikasi saja", budget:45000000, spent:20000000, milestones:[] },
  { id:18, name:"URC - Yava Conveyor", customer:"URC", status:"Planning", priority:"Medium", startDate:addDays(T,7), deadline:addDays(T,45), pic:"Samuel", team:[], notes:"", budget:120000000, spent:5000000, milestones:[] },
  { id:19, name:"Kencana - 7 Conveyor", customer:"Kencana", status:"Planning", priority:"High", startDate:addDays(T,5), deadline:addDays(T,60), pic:"Datuk", team:[], notes:"7 conveyor units", budget:350000000, spent:0, milestones:[] },
  { id:20, name:"Aqua Klaten - Ganti SKI", customer:"Aqua", status:"On Track", priority:"Medium", startDate:addDays(T,-3), deadline:addDays(T,21), pic:"Ridwan", team:[], notes:"Ganti SKI", budget:75000000, spent:25000000, milestones:[] },
  { id:21, name:"Unilever Skin - Motor Ganti", customer:"Unilever", status:"At Risk", priority:"High", startDate:addDays(T,-7), deadline:addDays(T,7), pic:"Dede", team:[], notes:"Motor perlu ganti", budget:55000000, spent:40000000, milestones:[] },
  { id:22, name:"Glico - April", customer:"Glico", status:"Planning", priority:"Medium", startDate:addDays(T,3), deadline:addDays(T,21), pic:"Rio", team:[], notes:"Target April", budget:90000000, spent:10000000, milestones:[] },
  { id:23, name:"Sugizindo - Gripper", customer:"Sugizindo", status:"On Track", priority:"Medium", startDate:addDays(T,-5), deadline:addDays(T,25), pic:"Raju", team:[], notes:"Gripper project", budget:130000000, spent:50000000, milestones:[] },
  { id:24, name:"Pocari Sweat - Cover & Motor", customer:"Pocari Sweat", status:"At Risk", priority:"High", startDate:addDays(T,-8), deadline:addDays(T,10), pic:"Ade Irawan Saputra", team:[], notes:"Cover dan motor goyang", budget:70000000, spent:55000000, milestones:[] },
  { id:25, name:"Mayora Purwosari", customer:"Mayora", status:"Planning", priority:"Medium", startDate:addDays(T,7), deadline:addDays(T,45), pic:"Ahmad", team:[], notes:"", budget:150000000, spent:5000000, milestones:[] },
  { id:26, name:"Indofood Padalarang - Built Drawing", customer:"Indofood", status:"On Track", priority:"Critical", startDate:addDays(T,-10), deadline:addDays(T,30), pic:"Hadiman", team:[], notes:"Built Drawing Mechanical, Electrical & Panel untuk proyek Conveyor Sortir, Conveyor FG Line 2, Robotic Palletizer & Conveyor System, Conveyor RM Line 2-12", budget:500000000, spent:200000000, milestones:[] },
  { id:27, name:"Mondelez - BA & Quotation Sparepart", customer:"Mondelez", status:"On Track", priority:"Medium", startDate:addDays(T,-5), deadline:addDays(T,14), pic:"Saad", team:[], notes:"Berita acara. Quotation sparepart", budget:60000000, spent:20000000, milestones:[] },
  { id:28, name:"Castrol - Prepare Production", customer:"Castrol", status:"On Track", priority:"High", startDate:addDays(T,-3), deadline:addDays(T,14), pic:"Candra", team:[], notes:"Prepare untuk production", budget:110000000, spent:40000000, milestones:[] },
  { id:29, name:"DAM - Invoice", customer:"DAM", status:"On Track", priority:"Medium", startDate:addDays(T,-1), deadline:addDays(T,7), pic:"Andi Triyono", team:[], notes:"Invoice process", budget:30000000, spent:30000000, milestones:[] },
  { id:30, name:"Danone Cianjur - Perbaikan BA", customer:"Danone", status:"At Risk", priority:"High", startDate:addDays(T,-5), deadline:addDays(T,7), pic:"Eri S", team:[], notes:"Perbaikan untuk BA", budget:85000000, spent:70000000, milestones:[] },
  { id:31, name:"Mayora Jayanti 1 - Trial", customer:"Mayora", status:"On Track", priority:"Medium", startDate:addDays(T,-3), deadline:addDays(T,14), pic:"Bayu", team:[], notes:"Trial conveyor kosong", budget:140000000, spent:90000000, milestones:[] },
  { id:32, name:"Mayora Jayanti 3 - Belum BA", customer:"Mayora", status:"At Risk", priority:"High", startDate:addDays(T,-10), deadline:addDays(T,14), pic:"Dedi", team:[], notes:"Belum BA", budget:145000000, spent:130000000, milestones:[] },
  { id:33, name:"Sarihusada - BV Punchlist", customer:"Sarihusada", status:"On Track", priority:"Medium", startDate:addDays(T,-7), deadline:addDays(T,21), pic:"Satrio", team:[], notes:"BV punchlist", budget:90000000, spent:40000000, milestones:[] },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const statusColor = { "On Track":"#10b981","At Risk":"#f59e0b","Delayed":"#ef4444","On Hold":"#6b7280","Planning":"#3b82f6","Completed":"#a78bfa" };
const priorityColor = { "Critical":"#ef4444","High":"#f59e0b","Medium":"#3b82f6","Low":"#6b7280" };
const kpiColor = (v) => v>=85?"#10b981":v>=70?"#f59e0b":"#ef4444";
const daysLeft = (d) => Math.ceil((new Date(d)-new Date())/86400000);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fmtIDR = (v) => v != null ? new Intl.NumberFormat("id-ID",{notation:"compact",maximumFractionDigits:1}).format(v) : "—";
const uid = () => Date.now()+Math.random().toString(36).slice(2,7);

function initDB() {
  if (!DB.get("users")) DB.set("users", USERS_SEED);
  if (!DB.get("engineers")) DB.set("engineers", ENGINEERS_SEED);
  if (!DB.get("projects")) DB.set("projects", PROJECTS_SEED);
}

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════
function ProgressBar({ value, color="#38bdf8", h=8 }) {
  return (
    <div style={{background:"#0f2744",borderRadius:99,height:h,overflow:"hidden",flex:1}}>
      <div style={{width:`${Math.min(Math.max(value,0),100)}%`,height:"100%",background:color,borderRadius:99,transition:"width .5s"}}/>
    </div>
  );
}
function Badge({ label, color }) {
  return <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,background:color+"22",color,letterSpacing:1,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>;
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

// S-Curve chart using SVG
function SCurve({ milestones }) {
  const W=500, H=160, PAD=30;
  if (!milestones || milestones.length===0) {
    return <div style={{textAlign:"center",color:"#334155",fontSize:11,padding:30}}>Tambahkan milestone untuk melihat S-Curve</div>;
  }
  const sorted = [...milestones].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const total = milestones.length;
  // cumulative plan vs actual
  const pts_plan=[], pts_actual=[];
  let cumPlan=0, cumActual=0;
  sorted.forEach((m,i) => {
    cumPlan += 100/total;
    cumActual += (m.actualProgress ?? 0)/total;
    pts_plan.push({ x:(i/(total-1||1))*(W-PAD*2)+PAD, y:H-PAD-(cumPlan/100)*(H-PAD*2) });
    pts_actual.push({ x:(i/(total-1||1))*(W-PAD*2)+PAD, y:H-PAD-(Math.min(cumActual,100)/100)*(H-PAD*2) });
  });
  const toPath = (pts) => pts.length<2 ? "" : pts.map((p,i) => {
    if(i===0) return `M${p.x},${p.y}`;
    const prev=pts[i-1];
    const mx=(prev.x+p.x)/2;
    return `C${mx},${prev.y} ${mx},${p.y} ${p.x},${p.y}`;
  }).join(" ");
  // Grid lines
  const gridLines = [0,25,50,75,100].map(v => H-PAD-(v/100)*(H-PAD*2));
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      {/* Grid */}
      {gridLines.map((y,i) => (
        <g key={i}>
          <line x1={PAD} y1={y} x2={W-PAD} y2={y} stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4"/>
          <text x={PAD-4} y={y} textAnchor="end" dominantBaseline="middle" fill="#334155" fontSize="9">{[100,75,50,25,0][i]}%</text>
        </g>
      ))}
      {/* Axes */}
      <line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} stroke="#1e3a5f" strokeWidth="1"/>
      <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="#1e3a5f" strokeWidth="1"/>
      {/* Plan curve */}
      <path d={toPath(pts_plan)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,3"/>
      {/* Actual curve */}
      <path d={toPath(pts_actual)} fill="none" stroke="#10b981" strokeWidth="2.5"/>
      {/* Fill area under actual */}
      <path d={toPath(pts_actual)+` L${pts_actual[pts_actual.length-1]?.x},${H-PAD} L${PAD},${H-PAD} Z`} fill="#10b98118"/>
      {/* Points */}
      {pts_plan.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6"/>)}
      {pts_actual.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10b981"/>)}
      {/* Labels */}
      {sorted.map((m,i) => (
        <text key={i} x={pts_plan[i]?.x} y={H-PAD+14} textAnchor="middle" fill="#475569" fontSize="8">{m.name?.slice(0,8)}</text>
      ))}
      {/* Legend */}
      <g transform={`translate(${W-PAD-120},${PAD})`}>
        <line x1="0" y1="6" x2="18" y2="6" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
        <text x="22" y="10" fill="#3b82f6" fontSize="9">Plan</text>
        <line x1="0" y1="20" x2="18" y2="20" stroke="#10b981" strokeWidth="2.5"/>
        <text x="22" y="24" fill="#10b981" fontSize="9">Actual</text>
      </g>
    </svg>
  );
}

// Bar chart planning vs actual
function PlanActualBar({ projects }) {
  const W=600, H=180, PAD=40, bw=18, gap=6;
  const gw=bw*2+gap;
  const totalW=Math.max(projects.length*(gw+12)+PAD*2, 400);
  const max=100;
  const gridYs=[0,25,50,75,100];
  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${H}`} style={{overflow:"visible"}}>
      {gridYs.map(v=>{
        const y=H-PAD-(v/max)*(H-PAD*2);
        return <g key={v}>
          <line x1={PAD} y1={y} x2={totalW-10} y2={y} stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3,3"/>
          <text x={PAD-4} y={y} textAnchor="end" dominantBaseline="middle" fill="#334155" fontSize="9">{v}%</text>
        </g>;
      })}
      <line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} stroke="#1e3a5f" strokeWidth="1"/>
      <line x1={PAD} y1={H-PAD} x2={totalW-10} y2={H-PAD} stroke="#1e3a5f" strokeWidth="1"/>
      {projects.map((p,i)=>{
        const x=PAD+i*(gw+12);
        const planH=((p.planProgress||0)/max)*(H-PAD*2);
        const actH=(p.progress||0)/max*(H-PAD*2);
        const variance=(p.progress||0)-(p.planProgress||0);
        const varColor=variance>=0?"#10b981":"#ef4444";
        return <g key={p.id}>
          <rect x={x} y={H-PAD-planH} width={bw} height={planH} fill="#3b82f6" rx="3" opacity=".75"/>
          <rect x={x+bw+gap} y={H-PAD-actH} width={bw} height={actH} fill="#10b981" rx="3" opacity=".85"/>
          <text x={x+bw} y={H-PAD+12} textAnchor="middle" fill="#475569" fontSize="8">{p.customer?.slice(0,8)}</text>
          {variance!==0 && <text x={x+bw} y={H-PAD-Math.max(planH,actH)-4} textAnchor="middle" fill={varColor} fontSize="8" fontWeight="bold">{variance>0?"+":""}{variance}%</text>}
        </g>;
      })}
      <g transform={`translate(${totalW-90},${PAD})`}>
        <rect x="0" y="2" width="12" height="8" fill="#3b82f6" opacity=".75" rx="2"/>
        <text x="16" y="10" fill="#3b82f6" fontSize="9">Plan</text>
        <rect x="0" y="16" width="12" height="8" fill="#10b981" opacity=".85" rx="2"/>
        <text x="16" y="24" fill="#10b981" fontSize="9">Actual</text>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const users = DB.get("users") || [];
      const user = users.find(u => u.username===username && u.password===password);
      if (user) { onLogin(user); }
      else { setError("Username atau password salah"); setLoading(false); }
    }, 500);
  };

  return (
    <div style={{minHeight:"100vh",background:"#060e1a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Mono','Courier New',monospace"}}>
      <div style={{background:"linear-gradient(135deg,#0d2137,#0a1628)",border:"1px solid #1e3a5f",borderRadius:24,padding:48,width:360,boxSizing:"border-box",boxShadow:"0 0 80px #38bdf820"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:60,height:60,background:"linear-gradient(135deg,#38bdf8,#3b82f6)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,margin:"0 auto 16px",boxShadow:"0 0 30px #38bdf840"}}>PM</div>
          <div style={{color:"#f0f9ff",fontSize:18,fontWeight:700,letterSpacing:2}}>PROJECT COMMAND</div>
          <div style={{color:"#38bdf8",fontSize:10,letterSpacing:4,marginTop:4}}>MANAGEMENT SYSTEM v4.0</div>
        </div>
        {error && <div style={{background:"#ef444422",border:"1px solid #ef444466",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#ef4444",marginBottom:16,textAlign:"center"}}>{error}</div>}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:6}}>USERNAME</div>
          <input value={username} onChange={e=>{setUsername(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{width:"100%",background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="admin / pm / viewer"/>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:6}}>PASSWORD</div>
          <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handle()}
            style={{width:"100%",background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="••••••••"/>
        </div>
        <button onClick={handle} disabled={loading}
          style={{width:"100%",background:loading?"#1e3a5f":"linear-gradient(135deg,#1e40af,#0ea5e9)",border:"none",color:"#fff",borderRadius:10,padding:"12px 0",fontSize:13,fontFamily:"inherit",cursor:loading?"not-allowed":"pointer",letterSpacing:2,fontWeight:700,boxShadow:"0 0 20px #38bdf820"}}>
          {loading?"AUTHENTICATING...":"LOGIN →"}
        </button>
        <div style={{marginTop:20,fontSize:10,color:"#334155",textAlign:"center"}}>
          admin:admin123 · pm:pm123 · viewer:view123
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => DB.get("session"));
  const [tab, setTab] = useState("dashboard");
  const [projects, setProjectsState] = useState(() => DB.get("projects") || []);
  const [engineers, setEngineersState] = useState(() => DB.get("engineers") || []);
  const [toast, setToast] = useState(null);
  // Project detail
  const [selProject, setSelProject] = useState(null);
  const [projTab, setProjTab] = useState("overview");
  // Manpower
  const [selEngineer, setSelEngineer] = useState(null);
  const [mpFilter, setMpFilter] = useState({ search:"", dept:"all", status:"all" });
  // Milestone form
  const [milestoneForm, setMilestoneForm] = useState({ name:"", date:"", planProgress:0, actualProgress:0, engineers:[], description:"", activities:[] });
  const [activityForm, setActivityForm] = useState({ name:"", targetDate:"", actualDate:"", planPct:0, actualPct:0, assignee:"", status:"pending" });
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editMilestone, setEditMilestone] = useState(null);
  // Add project
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name:"", customer:"", status:"Planning", priority:"Medium", startDate:"", deadline:"", pic:"", notes:"", budget:0, spent:0, planProgress:0 });
  // Filters
  const [projFilter, setProjFilter] = useState({ status:"all", priority:"all", customer:"all", search:"" });
  // User mgmt
  const [users, setUsersState] = useState(() => DB.get("users") || []);

  useEffect(() => { initDB(); }, []);

  const setProjects = useCallback((v) => { const d = typeof v==="function"?v(projects):v; DB.set("projects",d); setProjectsState(d); }, [projects]);
  const setEngineers = useCallback((v) => { const d = typeof v==="function"?v(engineers):v; DB.set("engineers",d); setEngineersState(d); }, [engineers]);
  const setUsers = useCallback((v) => { const d = typeof v==="function"?v(users):v; DB.set("users",d); setUsersState(d); }, [users]);

  const showToast = (msg, color="#10b981") => { setToast({msg,color}); setTimeout(()=>setToast(null),2600); };
  const canEdit = currentUser?.role !== "viewer";

  const onLogin = (user) => { DB.set("session",user); setCurrentUser(user); };
  const onLogout = () => { DB.del("session"); setCurrentUser(null); };

  if (!currentUser) return <LoginScreen onLogin={onLogin}/>;

  // Computed
  const customers = [...new Set(projects.map(p=>p.customer))].sort();
  const filteredProjects = projects.filter(p => {
    const ms = p.name.toLowerCase().includes(projFilter.search.toLowerCase()) || p.customer.toLowerCase().includes(projFilter.search.toLowerCase());
    const mst = projFilter.status==="all" || p.status===projFilter.status;
    const mp = projFilter.priority==="all" || p.priority===projFilter.priority;
    const mc = projFilter.customer==="all" || p.customer===projFilter.customer;
    return ms&&mst&&mp&&mc;
  });
  const depts = [...new Set(engineers.map(e=>e.dept))].sort();
  const filteredEngineers = engineers.filter(e => {
    const ms = e.name.toLowerCase().includes(mpFilter.search.toLowerCase()) || e.role.toLowerCase().includes(mpFilter.search.toLowerCase());
    const md = mpFilter.dept==="all" || e.dept===mpFilter.dept;
    const mst = mpFilter.status==="all" || e.status===mpFilter.status;
    return ms&&md&&mst;
  });

  const avgKpi = Math.round(engineers.reduce((a,e)=>a+e.kpi,0)/Math.max(engineers.length,1));

  const inp = { background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,color:"#e2e8f0",padding:"8px 12px",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",width:"100%" };
  const card = { background:"linear-gradient(135deg,#0d2137 0%,#0a1a2e 100%)",border:"1px solid #1e3a5f",borderRadius:16,padding:20 };

  const TABS = [
    { id:"dashboard", label:"Dashboard", icon:"⬡" },
    { id:"projects", label:"Projects", icon:"◈" },
    { id:"manpower", label:"Manpower", icon:"◉" },
    { id:"timeline", label:"Timeline", icon:"⊞" },
    { id:"kpi", label:"KPI", icon:"◎" },
    ...(currentUser.role==="admin"?[{ id:"users", label:"Users", icon:"⊛" }]:[]),
  ];

  // ────────────────────────────────────────────────────────────
  // MILESTONE EDITOR helpers
  // ────────────────────────────────────────────────────────────
  const selProj = projects.find(p=>p.id===selProject);

  const saveMilestone = () => {
    if (!milestoneForm.name || !milestoneForm.date) return;
    const ms = { ...milestoneForm, id: uid(), activities: [] };
    setProjects(projects.map(p => p.id===selProject ? {...p, milestones:[...(p.milestones||[]),ms]} : p));
    setMilestoneForm({ name:"",date:"",planProgress:0,actualProgress:0,engineers:[],description:"",activities:[] });
    setShowMilestoneForm(false);
    showToast("✓ Milestone ditambahkan");
  };
  const updateMilestone = (projId, msId, field, val) => {
    setProjects(projects.map(p => p.id===projId ? {...p, milestones:(p.milestones||[]).map(m => m.id===msId ? {...m,[field]:val} : m)} : p));
  };
  const deleteMilestone = (projId, msId) => {
    setProjects(projects.map(p => p.id===projId ? {...p, milestones:(p.milestones||[]).filter(m=>m.id!==msId)} : p));
    showToast("Milestone dihapus","#ef4444");
  };
  const addActivity = (projId, msId) => {
    if (!activityForm.name) return;
    const act = { ...activityForm, id: uid() };
    setProjects(projects.map(p => p.id===projId ? {...p, milestones:(p.milestones||[]).map(m => m.id===msId ? {...m, activities:[...(m.activities||[]),act]} : m)} : p));
    setActivityForm({ name:"",targetDate:"",actualDate:"",planPct:0,actualPct:0,assignee:"",status:"pending" });
    showToast("✓ Aktivitas ditambahkan");
  };
  const updateActivity = (projId, msId, actId, field, val) => {
    setProjects(projects.map(p => p.id===projId ? {...p, milestones:(p.milestones||[]).map(m => m.id===msId ? {...m, activities:(m.activities||[]).map(a => a.id===actId ? {...a,[field]:val} : a)} : m)} : p));
  };

  // Auto-calc project progress from milestones
  const calcProjectProgress = (proj) => {
    const ms = proj.milestones||[];
    if (ms.length===0) return { plan: proj.planProgress||0, actual: proj.progress||0 };
    const plan = Math.round(ms.reduce((a,m)=>a+(m.planProgress||0),0)/ms.length);
    const actual = Math.round(ms.reduce((a,m)=>a+(m.actualProgress||0),0)/ms.length);
    return { plan, actual };
  };

  return (
    <div style={{minHeight:"100vh",background:"#060e1a",fontFamily:"'DM Mono','Courier New',monospace",color:"#cbd5e1",display:"flex",flexDirection:"column"}}>

      {/* Toast */}
      {toast && <div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.color+"22",border:`1px solid ${toast.color}`,color:toast.color,borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,boxShadow:`0 0 20px ${toast.color}44`}}>{toast.msg}</div>}

      {/* Header */}
      <div style={{background:"linear-gradient(90deg,#0a1628,#0d2137)",borderBottom:"1px solid #1e3a5f",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#38bdf8,#3b82f6)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,boxShadow:"0 0 20px #38bdf840"}}>PM</div>
          <div>
            <div style={{color:"#f0f9ff",fontWeight:700,fontSize:14,letterSpacing:1}}>PROJECT COMMAND</div>
            <div style={{color:"#38bdf8",fontSize:9,letterSpacing:3}}>MANAGEMENT SYSTEM v4.0</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#38bdf8,#1e40af)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{currentUser.avatar}</div>
            <div>
              <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700}}>{currentUser.name}</div>
              <div style={{fontSize:9,color:"#38bdf8",letterSpacing:1}}>{currentUser.role.toUpperCase()}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{background:"#ef444420",border:"1px solid #ef444466",color:"#ef4444",borderRadius:7,padding:"6px 12px",fontSize:10,fontFamily:"inherit",cursor:"pointer",letterSpacing:1}}>LOGOUT</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{display:"flex",gap:4,padding:"10px 24px",background:"#08111f",borderBottom:"1px solid #1e3a5f",overflowX:"auto"}}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>{setTab(t.id);setSelProject(null);}} style={{
            background:tab===t.id?"linear-gradient(135deg,#1e40af,#0ea5e9)":"transparent",
            border:tab===t.id?"none":"1px solid #1e3a5f",
            color:tab===t.id?"#fff":"#64748b",
            borderRadius:8,padding:"6px 14px",fontSize:11,fontFamily:"inherit",
            cursor:"pointer",whiteSpace:"nowrap",letterSpacing:1,fontWeight:tab===t.id?700:400,
            boxShadow:tab===t.id?"0 0 16px #38bdf840":"none",transition:"all 0.2s"
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{flex:1,padding:"20px 24px",maxWidth:1400,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>

        {/* ══════════════════════════════════════════════════════
            DASHBOARD
        ══════════════════════════════════════════════════════ */}
        {tab==="dashboard" && (
          <div>
            <div style={{fontSize:11,color:"#38bdf8",letterSpacing:4,marginBottom:18}}>▸ EXECUTIVE DASHBOARD</div>

            {/* KPI Summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
              {[
                {label:"Total Projects",value:projects.length,color:"#38bdf8"},
                {label:"On Track",value:projects.filter(p=>p.status==="On Track").length,color:"#10b981"},
                {label:"At Risk",value:projects.filter(p=>p.status==="At Risk").length,color:"#f59e0b"},
                {label:"Delayed",value:projects.filter(p=>p.status==="Delayed").length,color:"#ef4444"},
                {label:"On Hold",value:projects.filter(p=>p.status==="On Hold").length,color:"#6b7280"},
                {label:"Total Engineers",value:engineers.length,color:"#a78bfa"},
                {label:"Avg KPI",value:avgKpi+"%",color:kpiColor(avgKpi)},
              ].map((s,i)=>(
                <div key={i} style={card}>
                  <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:9,color:"#64748b",marginTop:4,letterSpacing:1}}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Planning vs Actual Bar Chart */}
            <div style={{...card,marginBottom:18}}>
              <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ PLANNING vs ACTUAL — SEMUA PROYEK</div>
              <div style={{display:"flex",gap:12,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:8,background:"#3b82f6",borderRadius:2,opacity:.75}}/><span style={{fontSize:10,color:"#94a3b8"}}>Planning</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:8,background:"#10b981",borderRadius:2}}/><span style={{fontSize:10,color:"#94a3b8"}}>Actual</span></div>
              </div>
              <div style={{overflowX:"auto"}}>
                <PlanActualBar projects={projects.map(p => { const c=calcProjectProgress(p); return {...p, planProgress:c.plan, progress:c.actual}; })} />
              </div>
            </div>

            {/* Project Status List */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
              <div style={card}>
                <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ STATUS PROYEK</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:320,overflowY:"auto"}}>
                  {projects.slice(0,15).map(p => {
                    const {plan,actual} = calcProjectProgress(p);
                    const d=daysLeft(p.deadline);
                    return (
                      <div key={p.id} style={{cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");setProjTab("milestones");}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
                          <span style={{fontSize:11,color:"#e2e8f0"}}>{p.name.slice(0,32)}</span>
                          <div style={{display:"flex",gap:6}}>
                            <Badge label={p.status} color={statusColor[p.status]}/>
                            {d<=7&&d>=0&&<Badge label={`${d}h`} color="#f59e0b"/>}
                            {d<0&&<Badge label="LATE" color="#ef4444"/>}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <ProgressBar value={plan} color="#3b82f666" h={4}/>
                          <ProgressBar value={actual} color={statusColor[p.status]} h={6}/>
                          <span style={{fontSize:10,color:"#38bdf8",minWidth:28}}>{actual}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={card}>
                <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ TOP ENGINEER PERFORMANCE</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[...engineers].sort((a,b)=>b.kpi-a.kpi).slice(0,8).map((e,i)=>(
                    <div key={e.id} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:12,color:i<3?"#f59e0b":"#334155",fontWeight:900,minWidth:20}}>#{i+1}</div>
                      <div style={{width:30,height:30,borderRadius:"50%",background:kpiColor(e.kpi)+"22",border:`1.5px solid ${kpiColor(e.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:kpiColor(e.kpi),flexShrink:0}}>
                        {e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,color:"#e2e8f0"}}>{e.name}</div>
                        <div style={{fontSize:9,color:"#475569"}}>{e.dept}</div>
                      </div>
                      <div style={{fontSize:14,fontWeight:900,color:kpiColor(e.kpi)}}>{e.kpi}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deadlines Alert */}
            <div style={card}>
              <div style={{fontSize:11,color:"#f59e0b",letterSpacing:3,marginBottom:14}}>⚠️ DEADLINE ALERTS (Next 14 Days)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
                {projects.filter(p=>daysLeft(p.deadline)<=14&&daysLeft(p.deadline)>=-7).sort((a,b)=>daysLeft(a.deadline)-daysLeft(b.deadline)).map(p=>{
                  const d=daysLeft(p.deadline);
                  const color=d<0?"#ef4444":d<=3?"#ef4444":d<=7?"#f59e0b":"#3b82f6";
                  return (
                    <div key={p.id} style={{background:color+"11",border:`1px solid ${color}33`,borderRadius:10,padding:"10px 14px",cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setTab("projects");}}>
                      <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700,marginBottom:4}}>{p.name}</div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:10,color:"#475569"}}>PIC: {p.pic}</span>
                        <span style={{fontSize:10,color,fontWeight:700}}>{d<0?`${Math.abs(d)} hari terlambat`:d===0?"HARI INI":`${d} hari lagi`}</span>
                      </div>
                    </div>
                  );
                })}
                {projects.filter(p=>daysLeft(p.deadline)<=14&&daysLeft(p.deadline)>=-7).length===0&&<div style={{fontSize:12,color:"#334155"}}>Tidak ada deadline dalam 14 hari ke depan</div>}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PROJECTS
        ══════════════════════════════════════════════════════ */}
        {tab==="projects" && (
          <div>
            {/* Project List or Detail */}
            {!selProject ? (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div style={{fontSize:11,color:"#38bdf8",letterSpacing:4}}>▸ MANAJEMEN PROYEK ({filteredProjects.length}/{projects.length})</div>
                  {canEdit&&<button onClick={()=>setShowAddProject(true)} style={{background:"linear-gradient(135deg,#1e40af,#0ea5e9)",border:"none",color:"#fff",borderRadius:8,padding:"8px 16px",fontSize:11,fontFamily:"inherit",cursor:"pointer",letterSpacing:1}}>+ TAMBAH PROYEK</button>}
                </div>

                {/* Filter bar */}
                <div style={{...card,marginBottom:16,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <input style={{...inp,flex:1,minWidth:180}} placeholder="🔍 Cari proyek / customer..." value={projFilter.search} onChange={e=>setProjFilter({...projFilter,search:e.target.value})}/>
                  <select style={{...inp,width:"auto"}} value={projFilter.status} onChange={e=>setProjFilter({...projFilter,status:e.target.value})}>
                    <option value="all">All Status</option>
                    {["On Track","At Risk","Delayed","On Hold","Planning","Completed"].map(s=><option key={s}>{s}</option>)}
                  </select>
                  <select style={{...inp,width:"auto"}} value={projFilter.priority} onChange={e=>setProjFilter({...projFilter,priority:e.target.value})}>
                    <option value="all">All Priority</option>
                    {["Critical","High","Medium","Low"].map(s=><option key={s}>{s}</option>)}
                  </select>
                  <select style={{...inp,width:"auto"}} value={projFilter.customer} onChange={e=>setProjFilter({...projFilter,customer:e.target.value})}>
                    <option value="all">All Customer</option>
                    {customers.map(c=><option key={c}>{c}</option>)}
                  </select>
                  {(projFilter.search||projFilter.status!=="all"||projFilter.priority!=="all"||projFilter.customer!=="all")&&
                    <button onClick={()=>setProjFilter({status:"all",priority:"all",customer:"all",search:""})} style={{background:"#ef444420",border:"1px solid #ef4444",color:"#ef4444",borderRadius:6,padding:"6px 10px",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>Reset</button>}
                </div>

                {showAddProject && canEdit && (
                  <div style={{...card,marginBottom:16,border:"1px solid #38bdf840"}}>
                    <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:12}}>▸ PROYEK BARU</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {[["NAMA PROYEK","text","name"],["CUSTOMER","text","customer"],["PIC","text","pic"],["DEADLINE","date","deadline"],["START DATE","date","startDate"]].map(([lbl,type,key])=>(
                        <div key={key}>
                          <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:4}}>{lbl}</div>
                          <input type={type} style={inp} value={newProject[key]} onChange={e=>setNewProject({...newProject,[key]:e.target.value})}/>
                        </div>
                      ))}
                      <div>
                        <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:4}}>STATUS</div>
                        <select style={inp} value={newProject.status} onChange={e=>setNewProject({...newProject,status:e.target.value})}>
                          {["Planning","On Track","At Risk","Delayed","On Hold","Completed"].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:4}}>PRIORITAS</div>
                        <select style={inp} value={newProject.priority} onChange={e=>setNewProject({...newProject,priority:e.target.value})}>
                          {["Critical","High","Medium","Low"].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:4}}>BUDGET (IDR)</div>
                        <input type="number" style={inp} value={newProject.budget} onChange={e=>setNewProject({...newProject,budget:+e.target.value})}/>
                      </div>
                      <div style={{gridColumn:"1/-1"}}>
                        <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:4}}>CATATAN</div>
                        <input style={inp} value={newProject.notes} onChange={e=>setNewProject({...newProject,notes:e.target.value})} placeholder="Deskripsi / status terkini..."/>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:12}}>
                      <button onClick={()=>{
                        if(!newProject.name||!newProject.customer)return;
                        const proj={...newProject,id:uid(),milestones:[],team:[],spent:0,progress:0,planProgress:0};
                        setProjects([...projects,proj]);
                        setNewProject({name:"",customer:"",status:"Planning",priority:"Medium",startDate:"",deadline:"",pic:"",notes:"",budget:0,spent:0,planProgress:0});
                        setShowAddProject(false);
                        showToast("✓ Proyek berhasil ditambahkan");
                      }} style={{background:"#10b981",border:"none",color:"#fff",borderRadius:8,padding:"8px 18px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>SIMPAN</button>
                      <button onClick={()=>setShowAddProject(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"8px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
                    </div>
                  </div>
                )}

                {/* Project table */}
                <div style={{...card,overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:800}}>
                    <thead>
                      <tr>
                        {["PROJECT","CUSTOMER","STATUS","PRIORITY","PROGRESS","PIC","DEADLINE","BUDGET",""].map(h=>(
                          <th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#38bdf8",fontSize:9,letterSpacing:2,borderBottom:"1px solid #1e3a5f",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((p,i)=>{
                        const {plan,actual}=calcProjectProgress(p);
                        const d=daysLeft(p.deadline);
                        return (
                          <tr key={p.id} style={{background:i%2===0?"transparent":"#ffffff03",cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setProjTab("milestones");}}>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08"}}>
                              <div style={{fontWeight:700,color:"#e2e8f0",maxWidth:220}}>{p.name}</div>
                              <div style={{fontSize:9,color:"#475569",marginTop:2}}>{p.notes?.slice(0,50)}{p.notes?.length>50?"...":""}</div>
                            </td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08",color:"#94a3b8"}}>{p.customer}</td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08"}}><Badge label={p.status} color={statusColor[p.status]}/></td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08"}}><Badge label={p.priority} color={priorityColor[p.priority]}/></td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08",minWidth:120}}>
                              <div style={{marginBottom:3}}><ProgressBar value={plan} color="#3b82f666" h={3}/></div>
                              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                                <ProgressBar value={actual} color={statusColor[p.status]} h={6}/>
                                <span style={{fontSize:10,color:"#38bdf8",minWidth:28}}>{actual}%</span>
                              </div>
                            </td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08",color:"#94a3b8"}}>{p.pic}</td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08",whiteSpace:"nowrap"}}>
                              <div style={{color:d<0?"#ef4444":d<=7?"#f59e0b":"#94a3b8",fontSize:11}}>{fmtDate(p.deadline)}</div>
                              {d<0&&<div style={{fontSize:9,color:"#ef4444"}}>TERLAMBAT {Math.abs(d)}h</div>}
                              {d>=0&&d<=7&&<div style={{fontSize:9,color:"#f59e0b"}}>{d}h lagi</div>}
                            </td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08",color:"#64748b"}}>{fmtIDR(p.budget)}</td>
                            <td style={{padding:"10px 10px",borderBottom:"1px solid #1e3a5f08"}}>
                              <span style={{color:"#38bdf8",fontSize:12}}>›</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ── PROJECT DETAIL ── */
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <button onClick={()=>setSelProject(null)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:6,padding:"5px 10px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>← Kembali</button>
                  {selProj && <>
                    <div style={{fontSize:13,color:"#f0f9ff",fontWeight:700}}>{selProj.name}</div>
                    <Badge label={selProj.status} color={statusColor[selProj.status]}/>
                    <Badge label={selProj.priority} color={priorityColor[selProj.priority]}/>
                    <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                      {["overview","milestones","scurve","notes"].map(st=>(
                        <button key={st} onClick={()=>setProjTab(st)} style={{background:projTab===st?"#1e40af":"transparent",border:"1px solid #1e3a5f",color:projTab===st?"#fff":"#64748b",borderRadius:6,padding:"5px 12px",fontSize:10,fontFamily:"inherit",cursor:"pointer",letterSpacing:1}}>{st.toUpperCase()}</button>
                      ))}
                    </div>
                  </>}
                </div>

                {selProj && (
                  <div>
                    {/* OVERVIEW */}
                    {projTab==="overview" && (
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                        <div style={{...card,gridColumn:"1/-1"}}>
                          <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ INFORMASI PROYEK</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                            {[["CUSTOMER",selProj.customer],["PIC",selProj.pic],["START",fmtDate(selProj.startDate)],["DEADLINE",fmtDate(selProj.deadline)],["BUDGET",fmtIDR(selProj.budget)+" IDR"],["SPENT",fmtIDR(selProj.spent)+" IDR"]].map(([l,v])=>(
                              <div key={l}>
                                <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:3}}>{l}</div>
                                <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{v||"—"}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{fontSize:9,color:"#64748b",letterSpacing:2,marginBottom:6}}>CATATAN</div>
                          {canEdit ? (
                            <textarea value={selProj.notes||""} onChange={e=>setProjects(projects.map(p=>p.id===selProj.id?{...p,notes:e.target.value}:p))}
                              style={{...inp,height:80,resize:"vertical",padding:10}} placeholder="Catatan / status terkini..."/>
                          ) : <div style={{fontSize:12,color:"#94a3b8"}}>{selProj.notes||"—"}</div>}
                          {canEdit&&<div style={{display:"flex",gap:10,marginTop:12}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>STATUS</div>
                              <select style={inp} value={selProj.status} onChange={e=>{setProjects(projects.map(p=>p.id===selProj.id?{...p,status:e.target.value}:p));showToast("✓ Status diperbarui");}}>
                                {["Planning","On Track","At Risk","Delayed","On Hold","Completed"].map(s=><option key={s}>{s}</option>)}
                              </select>
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>SPENT (IDR)</div>
                              <input type="number" style={inp} value={selProj.spent||0} onChange={e=>setProjects(projects.map(p=>p.id===selProj.id?{...p,spent:+e.target.value}:p))}/>
                            </div>
                            <button onClick={()=>{setProjects(projects.filter(p=>p.id!==selProj.id));setSelProject(null);showToast("Proyek dihapus","#ef4444");}}
                              style={{background:"#ef444420",border:"1px solid #ef4444",color:"#ef4444",borderRadius:8,padding:"8px 12px",fontSize:11,fontFamily:"inherit",cursor:"pointer",alignSelf:"flex-end"}}>Hapus</button>
                          </div>}
                          {/* Engineers on project */}
                          <div style={{marginTop:14}}>
                            <div style={{fontSize:9,color:"#38bdf8",letterSpacing:2,marginBottom:8}}>TEAM ON PROJECT</div>
                            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                              {engineers.filter(e=>e.project===selProj.name||selProj.team?.includes(e.id)).map(e=>(
                                <div key={e.id} style={{background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,padding:"5px 10px",fontSize:11}}>
                                  <span style={{color:"#e2e8f0"}}>{e.name}</span>
                                  <span style={{color:"#475569",marginLeft:6,fontSize:9}}>{e.role}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Budget card */}
                        <div style={card}>
                          <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ BUDGET</div>
                          {(() => {
                            const pct=selProj.budget?Math.round((selProj.spent||0)/selProj.budget*100):0;
                            return <>
                              <div style={{fontSize:30,fontWeight:900,color:pct>90?"#ef4444":pct>75?"#f59e0b":"#10b981"}}>{pct}%</div>
                              <div style={{fontSize:10,color:"#64748b",marginBottom:10}}>Budget terpakai</div>
                              <ProgressBar value={pct} color={pct>90?"#ef4444":pct>75?"#f59e0b":"#10b981"} h={10}/>
                              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"#64748b"}}>
                                <span>Spent: {fmtIDR(selProj.spent||0)}</span>
                                <span>Budget: {fmtIDR(selProj.budget||0)}</span>
                              </div>
                            </>;
                          })()}
                        </div>
                        {/* Progress card */}
                        <div style={card}>
                          <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ PROGRESS</div>
                          {(() => {
                            const {plan,actual}=calcProjectProgress(selProj);
                            const variance=actual-plan;
                            return <>
                              <div style={{display:"flex",gap:20,marginBottom:14}}>
                                <div style={{textAlign:"center"}}>
                                  <div style={{fontSize:28,fontWeight:900,color:"#3b82f6"}}>{plan}%</div>
                                  <div style={{fontSize:9,color:"#64748b"}}>PLAN</div>
                                </div>
                                <div style={{textAlign:"center"}}>
                                  <div style={{fontSize:28,fontWeight:900,color:"#10b981"}}>{actual}%</div>
                                  <div style={{fontSize:9,color:"#64748b"}}>ACTUAL</div>
                                </div>
                                <div style={{textAlign:"center"}}>
                                  <div style={{fontSize:28,fontWeight:900,color:variance>=0?"#10b981":"#ef4444"}}>{variance>=0?"+":""}{variance}%</div>
                                  <div style={{fontSize:9,color:"#64748b"}}>VARIANCE</div>
                                </div>
                              </div>
                              <ProgressBar value={plan} color="#3b82f666" h={6}/>
                              <div style={{height:4}}/>
                              <ProgressBar value={actual} color="#10b981" h={8}/>
                              <div style={{fontSize:10,color:"#475569",marginTop:8}}>*Dihitung otomatis dari milestone</div>
                            </>;
                          })()}
                        </div>
                      </div>
                    )}

                    {/* MILESTONES */}
                    {projTab==="milestones" && (
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                          <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3}}>▸ MILESTONE & AKTIVITAS</div>
                          {canEdit&&<button onClick={()=>setShowMilestoneForm(true)} style={{background:"linear-gradient(135deg,#1e40af,#0ea5e9)",border:"none",color:"#fff",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>+ MILESTONE</button>}
                        </div>

                        {/* Add milestone form */}
                        {showMilestoneForm && canEdit && (
                          <div style={{...card,marginBottom:14,border:"1px solid #38bdf840"}}>
                            <div style={{fontSize:10,color:"#38bdf8",letterSpacing:2,marginBottom:10}}>▸ MILESTONE BARU</div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                              <div>
                                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>NAMA MILESTONE</div>
                                <input style={inp} value={milestoneForm.name} onChange={e=>setMilestoneForm({...milestoneForm,name:e.target.value})} placeholder="e.g. Desain, Fabrikasi, Testing..."/>
                              </div>
                              <div>
                                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TARGET DATE</div>
                                <input type="date" style={inp} value={milestoneForm.date} onChange={e=>setMilestoneForm({...milestoneForm,date:e.target.value})}/>
                              </div>
                              <div>
                                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PLAN PROGRESS (%)</div>
                                <input type="number" min="0" max="100" style={inp} value={milestoneForm.planProgress} onChange={e=>setMilestoneForm({...milestoneForm,planProgress:+e.target.value})}/>
                              </div>
                              <div>
                                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ACTUAL PROGRESS (%)</div>
                                <input type="number" min="0" max="100" style={inp} value={milestoneForm.actualProgress} onChange={e=>setMilestoneForm({...milestoneForm,actualProgress:+e.target.value})}/>
                              </div>
                              <div>
                                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ENGINEER (multi)</div>
                                <select multiple style={{...inp,height:72}} onChange={e=>{const v=Array.from(e.target.selectedOptions,o=>o.value);setMilestoneForm({...milestoneForm,engineers:v});}}>
                                  {engineers.map(e=><option key={e.id} value={e.name}>{e.name} ({e.dept})</option>)}
                                </select>
                              </div>
                              <div>
                                <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>DESKRIPSI</div>
                                <textarea style={{...inp,height:72,resize:"vertical"}} value={milestoneForm.description} onChange={e=>setMilestoneForm({...milestoneForm,description:e.target.value})} placeholder="Detail pekerjaan..."/>
                              </div>
                            </div>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={saveMilestone} style={{background:"#10b981",border:"none",color:"#fff",borderRadius:8,padding:"7px 18px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>SIMPAN</button>
                              <button onClick={()=>setShowMilestoneForm(false)} style={{background:"transparent",border:"1px solid #1e3a5f",color:"#64748b",borderRadius:8,padding:"7px 14px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>BATAL</button>
                            </div>
                          </div>
                        )}

                        {/* Milestone list */}
                        {(selProj.milestones||[]).length===0&&<div style={{...card,textAlign:"center",color:"#334155",fontSize:12,padding:40}}>Belum ada milestone. Tambahkan milestone untuk mulai tracking.</div>}
                        {[...(selProj.milestones||[])].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(ms=>{
                          const variance=(ms.actualProgress||0)-(ms.planProgress||0);
                          const msExpanded=editMilestone===ms.id;
                          return (
                            <div key={ms.id} style={{...card,marginBottom:12,borderLeft:`3px solid ${variance>=0?"#10b981":"#ef4444"}`}}>
                              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{ms.name}</div>
                                  <div style={{fontSize:10,color:"#475569",marginTop:2}}>📅 {fmtDate(ms.date)} · 👥 {(ms.engineers||[]).join(", ")||"—"}</div>
                                  {ms.description&&<div style={{fontSize:10,color:"#64748b",marginTop:3}}>{ms.description}</div>}
                                </div>
                                <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                                  <span style={{fontSize:9,padding:"2px 8px",borderRadius:99,background:variance>=0?"#10b98122":"#ef444422",color:variance>=0?"#10b981":"#ef4444",fontWeight:700}}>{variance>=0?"+":""}{variance}% VAR</span>
                                  {canEdit&&<>
                                    <button onClick={()=>setEditMilestone(msExpanded?null:ms.id)} style={{background:"#38bdf822",border:"1px solid #38bdf8",color:"#38bdf8",borderRadius:6,padding:"3px 8px",fontSize:9,fontFamily:"inherit",cursor:"pointer"}}>✏</button>
                                    <button onClick={()=>deleteMilestone(selProj.id,ms.id)} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:12}}>✕</button>
                                  </>}
                                </div>
                              </div>

                              {/* Progress bars */}
                              <div style={{marginBottom:10}}>
                                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#64748b",marginBottom:3}}>
                                  <span>Plan: {ms.planProgress||0}%</span>
                                  <span>Actual: {ms.actualProgress||0}%</span>
                                </div>
                                <ProgressBar value={ms.planProgress||0} color="#3b82f666" h={4}/>
                                <div style={{height:3}}/>
                                <ProgressBar value={ms.actualProgress||0} color={variance>=0?"#10b981":"#f59e0b"} h={7}/>
                              </div>

                              {/* Edit milestone inline */}
                              {msExpanded && canEdit && (
                                <div style={{background:"#0f2744",borderRadius:10,padding:12,marginBottom:12}}>
                                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                                    <div>
                                      <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>PLAN %</div>
                                      <input type="number" min="0" max="100" style={inp} defaultValue={ms.planProgress||0}
                                        onBlur={e=>updateMilestone(selProj.id,ms.id,"planProgress",+e.target.value)}/>
                                    </div>
                                    <div>
                                      <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ACTUAL %</div>
                                      <input type="number" min="0" max="100" style={inp} defaultValue={ms.actualProgress||0}
                                        onBlur={e=>updateMilestone(selProj.id,ms.id,"actualProgress",+e.target.value)}/>
                                    </div>
                                    <div>
                                      <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>TARGET DATE</div>
                                      <input type="date" style={inp} defaultValue={ms.date}
                                        onBlur={e=>updateMilestone(selProj.id,ms.id,"date",e.target.value)}/>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Activities */}
                              <div>
                                <div style={{fontSize:9,color:"#38bdf8",letterSpacing:2,marginBottom:8}}>AKTIVITAS DETAIL</div>
                                {(ms.activities||[]).length===0&&<div style={{fontSize:10,color:"#334155",marginBottom:8}}>└ Belum ada aktivitas</div>}
                                <div style={{overflowX:"auto"}}>
                                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,minWidth:500}}>
                                    {(ms.activities||[]).length>0&&<thead>
                                      <tr>
                                        {["AKTIVITAS","ASSIGNEE","TARGET","ACTUAL","PLAN%","ACTUAL%","STATUS",""].map(h=>(
                                          <th key={h} style={{textAlign:"left",padding:"4px 8px",color:"#475569",fontSize:8,letterSpacing:1,borderBottom:"1px solid #1e3a5f"}}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>}
                                    <tbody>
                                      {(ms.activities||[]).map((act,ai)=>{
                                        const actVariance=(act.actualPct||0)-(act.planPct||0);
                                        const statusColors={pending:"#64748b",inprogress:"#3b82f6",done:"#10b981",delayed:"#ef4444"};
                                        return (
                                          <tr key={act.id} style={{background:ai%2===0?"transparent":"#ffffff03"}}>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06",color:"#e2e8f0"}}>{act.name}</td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06",color:"#94a3b8"}}>{act.assignee||"—"}</td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06",color:"#64748b",whiteSpace:"nowrap"}}>{fmtDate(act.targetDate)}</td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06",color:"#64748b",whiteSpace:"nowrap"}}>{fmtDate(act.actualDate)||"—"}</td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06",color:"#3b82f6"}}>{act.planPct||0}%</td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06"}}>
                                              {canEdit?<input type="number" min="0" max="100" defaultValue={act.actualPct||0}
                                                onBlur={e=>updateActivity(selProj.id,ms.id,act.id,"actualPct",+e.target.value)}
                                                style={{...inp,padding:"2px 6px",fontSize:10,width:50}}/>
                                                :<span style={{color:actVariance>=0?"#10b981":"#f59e0b"}}>{act.actualPct||0}%</span>}
                                            </td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06"}}>
                                              {canEdit?<select defaultValue={act.status} onChange={e=>updateActivity(selProj.id,ms.id,act.id,"status",e.target.value)}
                                                style={{...inp,padding:"2px 6px",fontSize:9,width:80}}>
                                                {["pending","inprogress","done","delayed"].map(s=><option key={s} value={s}>{s}</option>)}
                                              </select>:<Badge label={act.status} color={statusColors[act.status]||"#64748b"}/>}
                                            </td>
                                            <td style={{padding:"5px 8px",borderBottom:"1px solid #1e3a5f06"}}>
                                              {canEdit&&<button onClick={()=>{
                                                setProjects(projects.map(p=>p.id===selProj.id?{...p,milestones:(p.milestones||[]).map(m=>m.id===ms.id?{...m,activities:(m.activities||[]).filter(a=>a.id!==act.id)}:m)}:p));
                                              }} style={{background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:11}}>✕</button>}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                                {/* Add activity */}
                                {canEdit&&(
                                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr auto",gap:6,marginTop:8}}>
                                    <input style={{...inp,fontSize:10}} value={activityForm.name} onChange={e=>setActivityForm({...activityForm,name:e.target.value})} placeholder="Nama aktivitas..."/>
                                    <select style={{...inp,fontSize:10}} value={activityForm.assignee} onChange={e=>setActivityForm({...activityForm,assignee:e.target.value})}>
                                      <option value="">Assignee</option>
                                      {engineers.map(e=><option key={e.id} value={e.name}>{e.name}</option>)}
                                    </select>
                                    <input type="date" style={{...inp,fontSize:10}} value={activityForm.targetDate} onChange={e=>setActivityForm({...activityForm,targetDate:e.target.value})}/>
                                    <input type="number" min="0" max="100" style={{...inp,fontSize:10}} value={activityForm.planPct} onChange={e=>setActivityForm({...activityForm,planPct:+e.target.value})} placeholder="Plan%"/>
                                    <input type="number" min="0" max="100" style={{...inp,fontSize:10}} value={activityForm.actualPct} onChange={e=>setActivityForm({...activityForm,actualPct:+e.target.value})} placeholder="Actual%"/>
                                    <select style={{...inp,fontSize:10}} value={activityForm.status} onChange={e=>setActivityForm({...activityForm,status:e.target.value})}>
                                      {["pending","inprogress","done","delayed"].map(s=><option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <button onClick={()=>addActivity(selProj.id,ms.id)} style={{background:"#3b82f622",border:"1px solid #3b82f6",color:"#3b82f6",borderRadius:6,padding:"5px 10px",fontSize:10,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>+ ADD</button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* S-CURVE */}
                    {projTab==="scurve" && (
                      <div>
                        <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ S-CURVE — PLANNING vs ACTUAL</div>
                        <div style={{...card,marginBottom:14}}>
                          {(() => {
                            const {plan,actual}=calcProjectProgress(selProj);
                            const variance=actual-plan;
                            return (
                              <div style={{display:"flex",gap:20,marginBottom:16}}>
                                <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:900,color:"#3b82f6"}}>{plan}%</div><div style={{fontSize:9,color:"#64748b"}}>CUMULATIVE PLAN</div></div>
                                <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:900,color:"#10b981"}}>{actual}%</div><div style={{fontSize:9,color:"#64748b"}}>CUMULATIVE ACTUAL</div></div>
                                <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:900,color:variance>=0?"#10b981":"#ef4444"}}>{variance>=0?"+":""}{variance}%</div><div style={{fontSize:9,color:"#64748b"}}>VARIANCE</div></div>
                              </div>
                            );
                          })()}
                          <SCurve milestones={selProj.milestones||[]}/>
                        </div>
                        {/* Per-milestone progress table */}
                        <div style={card}>
                          <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:12}}>▸ PROGRESS PER MILESTONE</div>
                          <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                              <thead>
                                <tr>
                                  {["MILESTONE","DATE","PLAN%","ACTUAL%","VARIANCE","STATUS"].map(h=>(
                                    <th key={h} style={{textAlign:"left",padding:"7px 10px",color:"#38bdf8",fontSize:9,letterSpacing:2,borderBottom:"1px solid #1e3a5f"}}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {[...(selProj.milestones||[])].sort((a,b)=>new Date(a.date)-new Date(b.date)).map((ms,i)=>{
                                  const v=(ms.actualProgress||0)-(ms.planProgress||0);
                                  return (
                                    <tr key={ms.id} style={{background:i%2===0?"transparent":"#ffffff03"}}>
                                      <td style={{padding:"8px 10px",borderBottom:"1px solid #1e3a5f06",color:"#e2e8f0",fontWeight:700}}>{ms.name}</td>
                                      <td style={{padding:"8px 10px",borderBottom:"1px solid #1e3a5f06",color:"#64748b"}}>{fmtDate(ms.date)}</td>
                                      <td style={{padding:"8px 10px",borderBottom:"1px solid #1e3a5f06",color:"#3b82f6",fontWeight:700}}>{ms.planProgress||0}%</td>
                                      <td style={{padding:"8px 10px",borderBottom:"1px solid #1e3a5f06",color:"#10b981",fontWeight:700}}>{ms.actualProgress||0}%</td>
                                      <td style={{padding:"8px 10px",borderBottom:"1px solid #1e3a5f06",color:v>=0?"#10b981":"#ef4444",fontWeight:700}}>{v>=0?"+":""}{v}%</td>
                                      <td style={{padding:"8px 10px",borderBottom:"1px solid #1e3a5f06"}}><Badge label={v>=0?"ON TRACK":"BEHIND"} color={v>=0?"#10b981":"#ef4444"}/></td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NOTES */}
                    {projTab==="notes" && (
                      <div style={card}>
                        <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ CATATAN & LOG</div>
                        {(selProj.notes_log||[]).map((n,i)=>(
                          <div key={i} style={{background:"#0f2744",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                            <div style={{fontSize:12,color:"#e2e8f0"}}>{n.text}</div>
                            <div style={{fontSize:9,color:"#475569",marginTop:4}}>{n.author} · {n.time}</div>
                          </div>
                        ))}
                        {canEdit&&(() => {
                          const [noteText,setNoteText] = [selProj._noteInput||"", (v)=>setProjects(projects.map(p=>p.id===selProj.id?{...p,_noteInput:v}:p))];
                          return (
                            <div style={{display:"flex",gap:8,marginTop:8}}>
                              <input style={{...inp,flex:1}} placeholder="Tulis catatan..." value={noteText}
                                onChange={e=>setNoteText(e.target.value)}
                                onKeyDown={e=>{if(e.key==="Enter"&&noteText.trim()){
                                  setProjects(projects.map(p=>p.id===selProj.id?{...p,notes_log:[...(p.notes_log||[]),{text:noteText,time:new Date().toLocaleString("id-ID"),author:currentUser.name}],_noteInput:""}:p));
                                  showToast("✓ Catatan ditambahkan");
                                }}}/>
                              <button onClick={()=>{if(!noteText.trim())return;setProjects(projects.map(p=>p.id===selProj.id?{...p,notes_log:[...(p.notes_log||[]),{text:noteText,time:new Date().toLocaleString("id-ID"),author:currentUser.name}],_noteInput:""}:p));showToast("✓ Catatan ditambahkan");}}
                                style={{background:"#38bdf822",border:"1px solid #38bdf8",color:"#38bdf8",borderRadius:8,padding:"8px 14px",fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>+</button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MANPOWER
        ══════════════════════════════════════════════════════ */}
        {tab==="manpower" && (
          <div>
            <div style={{fontSize:11,color:"#38bdf8",letterSpacing:4,marginBottom:16}}>▸ MANPOWER — {engineers.length} ENGINEERS</div>
            {/* Summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}>
              {[
                {label:"Total",value:engineers.length,color:"#38bdf8"},
                {label:"Programmer",value:engineers.filter(e=>e.dept==="Programmer").length,color:"#a78bfa"},
                {label:"Electrical",value:engineers.filter(e=>e.dept==="Electrical").length,color:"#f59e0b"},
                {label:"Mechanical",value:engineers.filter(e=>e.dept==="Mechanical").length,color:"#10b981"},
                {label:"Production",value:engineers.filter(e=>e.dept==="Production").length,color:"#3b82f6"},
                {label:"HSE",value:engineers.filter(e=>e.dept==="HSE").length,color:"#ef4444"},
                {label:"Design",value:engineers.filter(e=>e.dept==="Design").length,color:"#38bdf8"},
              ].map((s,i)=>(
                <div key={i} style={{...card,textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:9,color:"#64748b",marginTop:3,letterSpacing:1}}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            {/* Filter */}
            <div style={{...card,marginBottom:14,display:"flex",gap:8,flexWrap:"wrap"}}>
              <input style={{...inp,flex:1,minWidth:160}} placeholder="🔍 Cari nama..." value={mpFilter.search} onChange={e=>setMpFilter({...mpFilter,search:e.target.value})}/>
              <select style={{...inp,width:"auto"}} value={mpFilter.dept} onChange={e=>setMpFilter({...mpFilter,dept:e.target.value})}>
                <option value="all">All Dept</option>
                {depts.map(d=><option key={d}>{d}</option>)}
              </select>
              <select style={{...inp,width:"auto"}} value={mpFilter.status} onChange={e=>setMpFilter({...mpFilter,status:e.target.value})}>
                <option value="all">All Status</option>
                <option value="active">Active</option><option value="leave">Leave</option><option value="sick">Sick</option>
              </select>
            </div>
            {/* Engineer cards */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filteredEngineers.map(e=>{
                const isOpen=selEngineer===e.id;
                const statusC={active:"#10b981",leave:"#f59e0b",sick:"#ef4444"}[e.status]||"#10b981";
                const assignedProjects=projects.filter(p=>p.team?.includes(e.id)||p.pic===e.name);
                return (
                  <div key={e.id} style={{...card,border:isOpen?"1px solid #38bdf8":"1px solid #1e3a5f"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",flexWrap:"wrap"}} onClick={()=>setSelEngineer(isOpen?null:e.id)}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:kpiColor(e.kpi)+"22",border:`2px solid ${kpiColor(e.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:kpiColor(e.kpi),flexShrink:0}}>
                        {e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                      </div>
                      <div style={{flex:1,minWidth:120}}>
                        <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{e.name}</div>
                        <div style={{fontSize:10,color:"#475569"}}>{e.role}</div>
                        <div style={{display:"flex",gap:6,marginTop:3}}>
                          <Badge label={e.dept} color="#38bdf8"/>
                          <Badge label={(e.status||"active").toUpperCase()} color={statusC}/>
                        </div>
                      </div>
                      <div style={{minWidth:100}}>
                        <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>AVAILABILITY</div>
                        <ProgressBar value={e.availability} color={e.availability>60?"#10b981":e.availability>30?"#f59e0b":"#ef4444"}/>
                        <div style={{fontSize:9,color:"#94a3b8",marginTop:2}}>{e.availability}%</div>
                      </div>
                      <div style={{minWidth:80}}>
                        <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>JAM KERJA</div>
                        <div style={{fontSize:14,fontWeight:900,color:"#a78bfa"}}>{e.hoursLogged||0}h</div>
                      </div>
                      <GaugeRing value={e.kpi} size={60}/>
                    </div>
                    {isOpen && (
                      <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #1e3a5f"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                          <div>
                            <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>STATUS</div>
                            {canEdit?<select style={inp} value={e.status||"active"} onChange={ev=>setEngineers(engineers.map(en=>en.id===e.id?{...en,status:ev.target.value}:en))}>
                              <option value="active">Active</option><option value="leave">On Leave</option><option value="sick">Sick</option>
                            </select>:<span style={{color:statusC}}>{e.status||"active"}</span>}
                          </div>
                          <div>
                            <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>AVAILABILITY (%)</div>
                            {canEdit?<input type="number" min="0" max="100" style={inp} value={e.availability} onChange={ev=>setEngineers(engineers.map(en=>en.id===e.id?{...en,availability:+ev.target.value}:en))}/>:<span>{e.availability}%</span>}
                          </div>
                          <div>
                            <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>HOURS LOGGED</div>
                            {canEdit?<input type="number" style={inp} value={e.hoursLogged||0} onChange={ev=>setEngineers(engineers.map(en=>en.id===e.id?{...en,hoursLogged:+ev.target.value}:en))}/>:<span>{e.hoursLogged||0}h</span>}
                          </div>
                        </div>
                        <div>
                          <div style={{fontSize:9,color:"#38bdf8",letterSpacing:2,marginBottom:6}}>PROYEK YANG DITANGANI</div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            {assignedProjects.length===0&&<span style={{fontSize:10,color:"#334155"}}>Belum ada proyek</span>}
                            {assignedProjects.map(p=>(
                              <div key={p.id} style={{background:"#0f2744",border:"1px solid #1e3a5f",borderRadius:8,padding:"5px 10px",cursor:"pointer"}} onClick={()=>{setSelProject(p.id);setProjTab("milestones");setTab("projects");}}>
                                <span style={{fontSize:10,color:"#e2e8f0"}}>{p.name}</span>
                                <Badge label={p.status} color={statusColor[p.status]}/>
                              </div>
                            ))}
                          </div>
                        </div>
                        {canEdit&&<button onClick={()=>{setEngineers(engineers.filter(en=>en.id!==e.id));setSelEngineer(null);showToast("Engineer dihapus","#ef4444");}}
                          style={{marginTop:12,background:"#ef444420",border:"1px solid #ef4444",color:"#ef4444",borderRadius:6,padding:"5px 12px",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>Hapus Engineer</button>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TIMELINE — GANTT
        ══════════════════════════════════════════════════════ */}
        {tab==="timeline" && (
          <div>
            <div style={{fontSize:11,color:"#38bdf8",letterSpacing:4,marginBottom:18}}>▸ TIMELINE — GANTT VIEW</div>
            <div style={{...card,overflowX:"auto"}}>
              {/* Generate week headers based on today ± 8 weeks */}
              {(() => {
                const weeks=16;
                const startWeek=new Date(); startWeek.setDate(startWeek.getDate()-startWeek.getDay()-14);
                const weekStarts=Array.from({length:weeks},(_,i)=>{const d=new Date(startWeek);d.setDate(d.getDate()+i*7);return d;});
                const projStart=startWeek;
                const totalDays=weeks*7;
                const datePct=(d)=>d?Math.max(0,Math.min(((new Date(d)-projStart)/86400000)/totalDays*100,100)):null;
                const durPct=(s,e)=>s&&e?Math.max(0,((new Date(e)-new Date(s))/86400000)/totalDays*100):null;
                const todayPct=((new Date()-projStart)/86400000)/totalDays*100;

                return (
                  <div style={{minWidth:900}}>
                    {/* Week header */}
                    <div style={{display:"flex",marginBottom:6}}>
                      <div style={{minWidth:240,fontSize:9,color:"#475569"}}>PROJECT / MILESTONE</div>
                      <div style={{flex:1,position:"relative",display:"flex"}}>
                        {weekStarts.map((d,i)=>(
                          <div key={i} style={{flex:1,fontSize:8,color:"#334155",borderLeft:"1px solid #1e3a5f22",paddingLeft:3}}>
                            {d.toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Today line marker area reference */}
                    {projects.map(p=>{
                      const ms=p.milestones||[];
                      const {plan,actual}=calcProjectProgress(p);
                      const d=daysLeft(p.deadline);
                      return (
                        <div key={p.id} style={{marginBottom:14}}>
                          {/* Project row */}
                          <div style={{display:"flex",alignItems:"center",marginBottom:4}}>
                            <div style={{minWidth:240,fontSize:11,color:"#38bdf8",fontWeight:700,cursor:"pointer",display:"flex",gap:6,alignItems:"center"}}
                              onClick={()=>{setSelProject(p.id);setProjTab("milestones");setTab("projects");}}>
                              <span>▸ {p.name.slice(0,26)}</span>
                              <Badge label={p.status} color={statusColor[p.status]}/>
                            </div>
                            <div style={{flex:1,position:"relative",height:18,background:"#0f2744",borderRadius:4}}>
                              {/* Today line */}
                              {todayPct>=0&&todayPct<=100&&<div style={{position:"absolute",left:`${todayPct}%`,top:0,bottom:0,width:1,background:"#f59e0b",zIndex:10}}/>}
                              {/* Plan bar */}
                              {p.startDate&&p.deadline&&<div style={{
                                position:"absolute",
                                left:`${datePct(p.startDate)}%`,
                                width:`${durPct(p.startDate,p.deadline)||10}%`,
                                height:"45%",top:"5%",
                                background:"#3b82f688",borderRadius:3
                              }} title={`Plan: ${p.startDate}→${p.deadline}`}/>}
                              {/* Progress overlay */}
                              {p.startDate&&p.deadline&&<div style={{
                                position:"absolute",
                                left:`${datePct(p.startDate)}%`,
                                width:`${(durPct(p.startDate,p.deadline)||10)*actual/100}%`,
                                height:"40%",top:"57%",
                                background:statusColor[p.status]+"99",borderRadius:3
                              }}/>}
                            </div>
                            <div style={{minWidth:40,textAlign:"right",fontSize:10,color:"#38bdf8",marginLeft:6}}>{actual}%</div>
                          </div>
                          {/* Milestone rows */}
                          {ms.map(m=>{
                            const mPct=datePct(m.date);
                            const mVar=(m.actualProgress||0)-(m.planProgress||0);
                            return (
                              <div key={m.id} style={{display:"flex",alignItems:"center",marginBottom:3}}>
                                <div style={{minWidth:240,fontSize:10,color:"#64748b",paddingLeft:16}}>└ {m.name}</div>
                                <div style={{flex:1,position:"relative",height:12,background:"#0f2744",borderRadius:3}}>
                                  {todayPct>=0&&todayPct<=100&&<div style={{position:"absolute",left:`${todayPct}%`,top:0,bottom:0,width:1,background:"#f59e0b55",zIndex:10}}/>}
                                  {/* Plan progress */}
                                  <div style={{position:"absolute",left:0,width:`${mPct||0}%`,height:"50%",top:"5%",background:"#3b82f655",borderRadius:3}}/>
                                  {/* Actual */}
                                  <div style={{position:"absolute",left:0,width:`${(mPct||0)*(m.actualProgress||0)/100}%`,height:"50%",top:"50%",background:mVar>=0?"#10b98166":"#ef444466",borderRadius:3}}/>
                                  {/* Milestone diamond */}
                                  {mPct!==null&&<div style={{position:"absolute",left:`${mPct}%`,top:"50%",transform:"translate(-50%,-50%)",width:8,height:8,background:mVar>=0?"#10b981":"#f59e0b",transform:"translate(-50%,-50%) rotate(45deg)"}}/>}
                                </div>
                                <div style={{minWidth:40,textAlign:"right",fontSize:9,color:mVar>=0?"#10b981":"#ef4444",marginLeft:6}}>{m.actualProgress||0}%</div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {/* Legend */}
                    <div style={{display:"flex",gap:16,paddingTop:12,borderTop:"1px solid #1e3a5f",flexWrap:"wrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:16,height:5,background:"#3b82f688",borderRadius:2}}/><span style={{fontSize:9,color:"#475569"}}>Plan</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:16,height:5,background:"#10b98166",borderRadius:2}}/><span style={{fontSize:9,color:"#475569"}}>Actual</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:1,height:14,background:"#f59e0b"}}/><span style={{fontSize:9,color:"#475569"}}>Today</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,background:"#10b981",transform:"rotate(45deg)"}}/><span style={{fontSize:9,color:"#475569"}}>Milestone</span></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            KPI
        ══════════════════════════════════════════════════════ */}
        {tab==="kpi" && (
          <div>
            <div style={{fontSize:11,color:"#38bdf8",letterSpacing:4,marginBottom:18}}>▸ KPI MONITORING</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
              {[
                {label:"Excellent ≥85%",value:engineers.filter(e=>e.kpi>=85).length,color:"#10b981"},
                {label:"Good 70–84%",value:engineers.filter(e=>e.kpi>=70&&e.kpi<85).length,color:"#f59e0b"},
                {label:"Below <70%",value:engineers.filter(e=>e.kpi<70).length,color:"#ef4444"},
                {label:"Team Avg",value:avgKpi+"%",color:kpiColor(avgKpi)},
              ].map((s,i)=>(
                <div key={i} style={{...card,textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:9,color:"#64748b",marginTop:3,letterSpacing:1}}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            {/* Top performers */}
            <div style={{...card,marginBottom:18}}>
              <div style={{fontSize:11,color:"#38bdf8",letterSpacing:3,marginBottom:14}}>▸ TOP PERFORMANCE RANKING</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[...engineers].sort((a,b)=>b.kpi-a.kpi).map((e,i)=>(
                  <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#0f2744",borderRadius:10,border:i===0?"1px solid #f59e0b44":i===1?"1px solid #94a3b844":i===2?"1px solid #cd7c2e44":"1px solid #1e3a5f"}}>
                    <div style={{fontSize:14,color:i<3?"#f59e0b":"#334155",fontWeight:900,minWidth:24}}>#{i+1}</div>
                    <div style={{width:36,height:36,borderRadius:"50%",background:kpiColor(e.kpi)+"22",border:`2px solid ${kpiColor(e.kpi)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:kpiColor(e.kpi),flexShrink:0}}>
                      {e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{e.name}</div>
                      <div style={{fontSize:10,color:"#475569"}}>{e.role} · {e.dept}</div>
                    </div>
                    <div style={{minWidth:120}}>
                      <ProgressBar value={e.kpi} color={kpiColor(e.kpi)} h={5}/>
                    </div>
                    <div style={{textAlign:"right",minWidth:50}}>
                      <div style={{fontSize:18,fontWeight:900,color:kpiColor(e.kpi)}}>{e.kpi}%</div>
                      <div style={{fontSize:9,color:"#a78bfa"}}>{e.hoursLogged||0}h</div>
                    </div>
                    {canEdit&&<input type="range" min="0" max="100" value={e.kpi}
                      onChange={ev=>setEngineers(engineers.map(en=>en.id===e.id?{...en,kpi:+ev.target.value}:en))}
                      style={{width:80,accentColor:kpiColor(e.kpi)}}/>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            USERS (Admin only)
        ══════════════════════════════════════════════════════ */}
        {tab==="users" && currentUser.role==="admin" && (
          <div>
            <div style={{fontSize:11,color:"#38bdf8",letterSpacing:4,marginBottom:18}}>▸ USER MANAGEMENT</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {users.map(u=>(
                <div key={u.id} style={{...card,display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#38bdf8,#1e40af)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>{u.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{u.name}</div>
                    <div style={{fontSize:10,color:"#64748b"}}>@{u.username} · {u.role}</div>
                  </div>
                  <Badge label={u.role.toUpperCase()} color={u.role==="admin"?"#ef4444":u.role==="pm"?"#3b82f6":"#64748b"}/>
                  <div style={{display:"flex",gap:6}}>
                    <select style={{...inp,width:"auto",fontSize:11}} value={u.role} onChange={e=>setUsers(users.map(us=>us.id===u.id?{...us,role:e.target.value}:us))}>
                      <option value="admin">Admin</option><option value="pm">PM</option><option value="viewer">Viewer</option>
                    </select>
                    {u.id!==currentUser.id&&<button onClick={()=>setUsers(users.filter(us=>us.id!==u.id))} style={{background:"#ef444420",border:"1px solid #ef4444",color:"#ef4444",borderRadius:6,padding:"5px 10px",fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>Hapus</button>}
                  </div>
                </div>
              ))}
              {/* Add user */}
              <div style={{...card,border:"1px solid #38bdf840"}}>
                <div style={{fontSize:11,color:"#38bdf8",letterSpacing:2,marginBottom:10}}>▸ TAMBAH USER</div>
                {(() => {
                  const [nu,setNu] = useState({username:"",password:"",name:"",role:"viewer",avatar:""});
                  return (
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        {[["NAMA","text","name"],["USERNAME","text","username"],["PASSWORD","password","password"]].map(([l,t,k])=>(
                          <div key={k}>
                            <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>{l}</div>
                            <input type={t} style={inp} value={nu[k]} onChange={e=>setNu({...nu,[k]:e.target.value})}/>
                          </div>
                        ))}
                        <div>
                          <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>ROLE</div>
                          <select style={inp} value={nu.role} onChange={e=>setNu({...nu,role:e.target.value})}>
                            <option value="admin">Admin</option><option value="pm">PM</option><option value="viewer">Viewer</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={()=>{
                        if(!nu.username||!nu.password||!nu.name)return;
                        const avatar=nu.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();
                        setUsers([...users,{...nu,id:uid(),avatar}]);
                        setNu({username:"",password:"",name:"",role:"viewer",avatar:""});
                        showToast("✓ User ditambahkan");
                      }} style={{background:"#10b981",border:"none",color:"#fff",borderRadius:8,padding:"7px 18px",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>SIMPAN USER</button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

      </div>

      <div style={{textAlign:"center",padding:10,fontSize:9,color:"#1e3a5f",borderTop:"1px solid #0d2137"}}>
        PROJECT COMMAND SYSTEM v4.0 · {projects.length} Projects · {engineers.length} Engineers · Data tersimpan di browser
      </div>
    </div>
  );
}
