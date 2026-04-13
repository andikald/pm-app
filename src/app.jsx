import { useState, useEffect, useRef } from "react";

// ── DEFAULT DATA ──────────────────────────────────────────────
const DEFAULT_PROJECTS = [
  { id: 1, name: "Sistem ERP Pabrik", status: "On Track", progress: 72, deadline: "2026-06-30", priority: "High", pic: "Andi S.", notes: [] },
  { id: 2, name: "Upgrade Jaringan Fiber", status: "At Risk", progress: 45, deadline: "2026-05-15", priority: "Critical", pic: "Budi R.", notes: [] },
  { id: 3, name: "Automasi Gudang", status: "Delayed", progress: 28, deadline: "2026-07-01", priority: "Medium", pic: "Citra M.", notes: [] },
  { id: 4, name: "SCADA Monitoring", status: "On Track", progress: 90, deadline: "2026-04-30", priority: "High", pic: "Deni K.", notes: [] },
];
const DEFAULT_ENGINEERS = [
  { id: 1, name: "Andi Saputra", role: "Senior Engineer", project: "Sistem ERP Pabrik", kpi: 92, availability: 20, skills: { Electrical: 5, PLC: 4, Networking: 3, SCADA: 4, AutoCAD: 5 } },
  { id: 2, name: "Budi Riyanto", role: "Network Engineer", project: "Upgrade Jaringan Fiber", kpi: 78, availability: 60, skills: { Electrical: 2, PLC: 2, Networking: 5, SCADA: 3, AutoCAD: 2 } },
  { id: 3, name: "Citra Maharani", role: "Project Engineer", project: "Automasi Gudang", kpi: 65, availability: 100, skills: { Electrical: 4, PLC: 5, Networking: 2, SCADA: 3, AutoCAD: 4 } },
  { id: 4, name: "Deni Kurniawan", role: "SCADA Specialist", project: "SCADA Monitoring", kpi: 88, availability: 0, skills: { Electrical: 3, PLC: 4, Networking: 3, SCADA: 5, AutoCAD: 3 } },
  { id: 5, name: "Eko Prasetyo", role: "Junior Engineer", project: "Sistem ERP Pabrik", kpi: 74, availability: 40, skills: { Electrical: 3, PLC: 2, Networking: 2, SCADA: 2, AutoCAD: 3 } },
  { id: 6, name: "Fitri Handayani", role: "Electrical Engineer", project: "SCADA Monitoring", kpi: 85, availability: 30, skills: { Electrical: 5, PLC: 3, Networking: 2, SCADA: 4, AutoCAD: 5 } },
];
const MILESTONES = [
  { project: "Sistem ERP Pabrik", task: "Analisis Kebutuhan", start: 0, duration: 2, color: "#3b82f6" },
  { project: "Sistem ERP Pabrik", task: "Desain Sistem", start: 2, duration: 3, color: "#3b82f6" },
  { project: "Sistem ERP Pabrik", task: "Development", start: 5, duration: 4, color: "#3b82f6" },
  { project: "Sistem ERP Pabrik", task: "Testing & UAT", start: 9, duration: 2, color: "#3b82f6" },
  { project: "Upgrade Jaringan Fiber", task: "Survey Lapangan", start: 0, duration: 1, color: "#f59e0b" },
  { project: "Upgrade Jaringan Fiber", task: "Pengadaan Material", start: 1, duration: 3, color: "#f59e0b" },
  { project: "Upgrade Jaringan Fiber", task: "Instalasi", start: 4, duration: 5, color: "#f59e0b" },
  { project: "Automasi Gudang", task: "Studi Kelayakan", start: 0, duration: 2, color: "#ef4444" },
  { project: "Automasi Gudang", task: "Procurement", start: 2, duration: 4, color: "#ef4444" },
  { project: "SCADA Monitoring", task: "Konfigurasi Server", start: 0, duration: 2, color: "#10b981" },
  { project: "SCADA Monitoring", task: "Integrasi PLC", start: 2, duration: 3, color: "#10b981" },
  { project: "SCADA Monitoring", task: "Commissioning", start: 5, duration: 1, color: "#10b981" },
];
const SKILLS = ["Electrical", "PLC", "Networking", "SCADA", "AutoCAD"];
const statusColor = { "On Track": "#10b981", "At Risk": "#f59e0b", "Delayed": "#ef4444" };
const priorityColor = { "Critical": "#ef4444", "High": "#f59e0b", "Medium": "#3b82f6", "Low": "#6b7280" };
const kpiColor = (v) => v >= 85 ? "#10b981" : v >= 70 ? "#f59e0b" : "#ef4444";
const daysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

// ── HELPERS ───────────────────────────────────────────────────
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function SkillDot({ level }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i <= level ? "#38bdf8" : "#1e3a5f" }} />
      ))}
    </div>
  );
}
function GaugeRing({ value, size = 80 }) {
  const r = size / 2 - 8, circ = 2 * Math.PI * r;
  const color = kpiColor(value);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e3a5f" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={circ - (value/100)*circ} strokeLinecap="round" />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fill: color, fontSize: 15, fontWeight: 700, fontFamily: "inherit", transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {value}%
      </text>
    </svg>
  );
}
function ProgressBar({ value, color = "#38bdf8" }) {
  return (
    <div style={{ background: "#0f2744", borderRadius: 99, height: 8, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s" }} />
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [projects, setProjects] = useState(() => load("pm_projects", DEFAULT_PROJECTS));
  const [engineers, setEngineers] = useState(() => load("pm_engineers", DEFAULT_ENGINEERS));
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [engSearch, setEngSearch] = useState("");
  const [engFilterProject, setEngFilterProject] = useState("all");
  const [engFilterAvail, setEngFilterAvail] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddEngineer, setShowAddEngineer] = useState(false);
  const [newNote, setNewNote] = useState({});
  const [toast, setToast] = useState(null);
  const [newProject, setNewProject] = useState({ name: "", status: "On Track", progress: 0, deadline: "", priority: "Medium", pic: "", notes: [] });
  const [newEngineer, setNewEngineer] = useState({ name: "", role: "", project: "", kpi: 80, availability: 100, skills: { Electrical: 3, PLC: 3, Networking: 3, SCADA: 3, AutoCAD: 3 } });

  // Persist
  useEffect(() => save("pm_projects", projects), [projects]);
  useEffect(() => save("pm_engineers", engineers), [engineers]);

  // Notifications
  useEffect(() => {
    const notifs = [];
    projects.forEach(p => {
      const d = daysUntil(p.deadline);
      if (d <= 7 && d >= 0) notifs.push({ id: p.id, type: "warning", msg: `"${p.name}" deadline dalam ${d} hari!`, color: "#f59e0b" });
      else if (d < 0) notifs.push({ id: p.id, type: "danger", msg: `"${p.name}" SUDAH MELEWATI deadline ${Math.abs(d)} hari lalu!`, color: "#ef4444" });
      if (p.status === "Delayed") notifs.push({ id: p.id + 1000, type: "danger", msg: `"${p.name}" berstatus DELAYED`, color: "#ef4444" });
      if (p.status === "At Risk") notifs.push({ id: p.id + 2000, type: "warning", msg: `"${p.name}" berstatus AT RISK`, color: "#f59e0b" });
    });
    setNotifications(notifs);
  }, [projects]);

  const showToast = (msg, color = "#10b981") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // Export CSV
  const exportCSV = (type) => {
    let csv = "", filename = "";
    if (type === "projects") {
      csv = "Nama,Status,Progress,Deadline,Priority,PIC\n" +
        projects.map(p => `"${p.name}","${p.status}",${p.progress}%,"${p.deadline}","${p.priority}","${p.pic}"`).join("\n");
      filename = "laporan_proyek.csv";
    } else {
      csv = "Nama,Role,Proyek,KPI,Availability,Electrical,PLC,Networking,SCADA,AutoCAD\n" +
        engineers.map(e => `"${e.name}","${e.role}","${e.project}",${e.kpi}%,${e.availability}%,${e.skills.Electrical},${e.skills.PLC},${e.skills.Networking},${e.skills.SCADA},${e.skills.AutoCAD}`).join("\n");
      filename = "laporan_engineer.csv";
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    showToast(`✓ Export ${filename} berhasil!`);
  };

  // Export HTML Report
  const exportReport = () => {
    const avgKpi = Math.round(engineers.reduce((a,e) => a+e.kpi,0)/engineers.length);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>PM Report</title>
<style>body{font-family:Arial,sans-serif;background:#0a1628;color:#cbd5e1;padding:32px}
h1{color:#38bdf8;border-bottom:2px solid #1e3a5f;padding-bottom:12px}
h2{color:#38bdf8;margin-top:32px}
table{width:100%;border-collapse:collapse;margin-top:12px}
th{background:#1e3a5f;color:#38bdf8;padding:10px;text-align:left;font-size:11px;letter-spacing:2px}
td{padding:10px;border-bottom:1px solid #1e3a5f;font-size:13px}
tr:hover td{background:#ffffff08}
.badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700}
.stat{display:inline-block;background:#0f2744;border:1px solid #1e3a5f;border-radius:12px;padding:16px 24px;margin:8px;text-align:center}
.stat-val{font-size:28px;font-weight:900;color:#38bdf8}
.stat-lbl{font-size:11px;color:#64748b;margin-top:4px}
</style></head><body>
<h1>📊 PROJECT MANAGEMENT REPORT</h1>
<p style="color:#64748b">Generated: ${new Date().toLocaleString("id-ID")}</p>
<div>
<div class="stat"><div class="stat-val">${projects.length}</div><div class="stat-lbl">TOTAL PROYEK</div></div>
<div class="stat"><div class="stat-val" style="color:#10b981">${projects.filter(p=>p.status==="On Track").length}</div><div class="stat-lbl">ON TRACK</div></div>
<div class="stat"><div class="stat-val" style="color:#f59e0b">${projects.filter(p=>p.status==="At Risk").length}</div><div class="stat-lbl">AT RISK</div></div>
<div class="stat"><div class="stat-val" style="color:#ef4444">${projects.filter(p=>p.status==="Delayed").length}</div><div class="stat-lbl">DELAYED</div></div>
<div class="stat"><div class="stat-val">${engineers.length}</div><div class="stat-lbl">TOTAL ENGINEER</div></div>
<div class="stat"><div class="stat-val" style="color:${kpiColor(avgKpi)}">${avgKpi}%</div><div class="stat-lbl">AVG KPI</div></div>
</div>
<h2>DAFTAR PROYEK</h2>
<table><tr><th>NAMA</th><th>STATUS</th><th>PROGRESS</th><th>DEADLINE</th><th>PRIORITY</th><th>PIC</th></tr>
${projects.map(p=>`<tr><td>${p.name}</td><td><span class="badge" style="background:${statusColor[p.status]}33;color:${statusColor[p.status]}">${p.status}</span></td><td>${p.progress}%</td><td>${p.deadline}</td><td><span class="badge" style="background:${priorityColor[p.priority]}33;color:${priorityColor[p.priority]}">${p.priority}</span></td><td>${p.pic}</td></tr>`).join("")}
</table>
<h2>DAFTAR ENGINEER</h2>
<table><tr><th>NAMA</th><th>ROLE</th><th>PROYEK</th><th>KPI</th><th>AVAILABILITY</th></tr>
${engineers.map(e=>`<tr><td>${e.name}</td><td>${e.role}</td><td>${e.project}</td><td style="color:${kpiColor(e.kpi)};font-weight:700">${e.kpi}%</td><td>${e.availability}%</td></tr>`).join("")}
</table>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pm_report.html"; a.click();
    showToast("✓ Export laporan HTML berhasil!");
  };

  const addNote = (projectId) => {
    const text = (newNote[projectId] || "").trim();
    if (!text) return;
    setProjects(projects.map(p => p.id === projectId ? {
      ...p, notes: [...(p.notes||[]), { id: Date.now(), text, time: new Date().toLocaleString("id-ID"), author: "PM" }]
    } : p));
    setNewNote({ ...newNote, [projectId]: "" });
    showToast("✓ Catatan ditambahkan");
  };

  const filteredEngineers = engineers.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(engSearch.toLowerCase()) ||
      e.role.toLowerCase().includes(engSearch.toLowerCase());
    const matchProject = engFilterProject === "all" || e.project === engFilterProject;
    const matchAvail = engFilterAvail === "all" ||
      (engFilterAvail === "available" && e.availability === 100) ||
      (engFilterAvail === "partial" && e.availability > 0 && e.availability < 100) ||
      (engFilterAvail === "busy" && e.availability === 0);
    return matchSearch && matchProject && matchAvail;
  });

  const avgKpi = Math.round(engineers.reduce((a,e) => a+e.kpi,0)/engineers.length);
  const onTrack = projects.filter(p=>p.status==="On Track").length;
  const atRisk = projects.filter(p=>p.status==="At Risk").length;
  const delayed = projects.filter(p=>p.status==="Delayed").length;

  const inp = {
    background: "#0f2744", border: "1px solid #1e3a5f", borderRadius: 8,
    color: "#e2e8f0", padding: "8px 12px", fontSize: 13, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", width: "100%"
  };
  const card = {
    background: "linear-gradient(135deg, #0d2137 0%, #0a1a2e 100%)",
    border: "1px solid #1e3a5f", borderRadius: 16, padding: 20
  };
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "projects", label: "Projects", icon: "◈" },
    { id: "manpower", label: "Manpower", icon: "◉" },
    { id: "timeline", label: "Timeline", icon: "⊞" },
    { id: "kpi", label: "KPI", icon: "◎" },
    { id: "skills", label: "Skill Matrix", icon: "⊕" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060e1a", fontFamily: "'DM Mono','Courier New',monospace", color: "#cbd5e1", display: "flex", flexDirection: "column" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.color + "22", border: `1px solid ${toast.color}`, color: toast.color, borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, boxShadow: `0 0 20px ${toast.color}44` }}>
          {toast.msg}
        </div>
      )}

      {/* Notification Panel */}
      {showNotif && (
        <div style={{ position: "fixed", top: 60, right: 16, zIndex: 9000, width: 320, background: "#0d2137", border: "1px solid #1e3a5f", borderRadius: 14, padding: 16, boxShadow: "0 8px 32px #000a" }}>
          <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 2, marginBottom: 12 }}>▸ NOTIFIKASI DEADLINE</div>
          {notifications.length === 0 ? (
            <div style={{ color: "#10b981", fontSize: 12 }}>✓ Semua proyek dalam jadwal</div>
          ) : notifications.map(n => (
            <div key={n.id} style={{ background: n.color + "11", border: `1px solid ${n.color}44`, borderRadius: 8, padding: "8px 12px", marginBottom: 8, fontSize: 12, color: n.color }}>
              {n.type === "danger" ? "🚨" : "⚠️"} {n.msg}
            </div>
          ))}
          <button onClick={() => setShowNotif(false)} style={{ marginTop: 8, background: "transparent", border: "1px solid #1e3a5f", color: "#64748b", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontFamily: "inherit", cursor: "pointer" }}>Tutup</button>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg,#0a1628,#0d2137)", borderBottom: "1px solid #1e3a5f", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#38bdf8,#3b82f6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, boxShadow: "0 0 20px #38bdf840" }}>PM</div>
          <div>
            <div style={{ color: "#f0f9ff", fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>PROJECT COMMAND</div>
            <div style={{ color: "#38bdf8", fontSize: 10, letterSpacing: 3 }}>MANAGEMENT SYSTEM v2</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Notif bell */}
          <button onClick={() => setShowNotif(!showNotif)} style={{ position: "relative", background: notifications.length > 0 ? "#f59e0b11" : "transparent", border: `1px solid ${notifications.length > 0 ? "#f59e0b" : "#1e3a5f"}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: notifications.length > 0 ? "#f59e0b" : "#64748b", fontFamily: "inherit", fontSize: 16 }}>
            🔔
            {notifications.length > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{notifications.length}</span>
            )}
          </button>
          {/* Export menu */}
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => exportCSV("projects")} style={{ background: "#10b98122", border: "1px solid #10b981", color: "#10b981", borderRadius: 7, padding: "5px 10px", fontSize: 10, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1 }}>CSV Proyek</button>
            <button onClick={() => exportCSV("engineers")} style={{ background: "#38bdf822", border: "1px solid #38bdf8", color: "#38bdf8", borderRadius: 7, padding: "5px 10px", fontSize: 10, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1 }}>CSV Engineer</button>
            <button onClick={exportReport} style={{ background: "#a78bfa22", border: "1px solid #a78bfa", color: "#a78bfa", borderRadius: 7, padding: "5px 10px", fontSize: 10, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1 }}>📄 Laporan</button>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>LIVE · {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 4, padding: "12px 28px", background: "#08111f", borderBottom: "1px solid #1e3a5f", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? "linear-gradient(135deg,#1e40af,#0ea5e9)" : "transparent",
            border: tab === t.id ? "none" : "1px solid #1e3a5f",
            color: tab === t.id ? "#fff" : "#64748b",
            borderRadius: 8, padding: "6px 16px", fontSize: 12, fontFamily: "inherit",
            cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 1, fontWeight: tab === t.id ? 700 : 400,
            boxShadow: tab === t.id ? "0 0 16px #38bdf840" : "none", transition: "all 0.2s"
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, padding: "24px 28px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 4, marginBottom: 16 }}>▸ RINGKASAN EKSEKUTIF</div>
            {notifications.length > 0 && (
              <div style={{ ...card, marginBottom: 20, border: "1px solid #f59e0b44", background: "#f59e0b08" }}>
                <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 2, marginBottom: 10 }}>⚠️ PERINGATAN AKTIF</div>
                {notifications.slice(0,3).map(n => (
                  <div key={n.id} style={{ fontSize: 12, color: n.color, marginBottom: 4 }}>{n.type === "danger" ? "🚨" : "⚠️"} {n.msg}</div>
                ))}
                {notifications.length > 3 && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>+{notifications.length-3} peringatan lainnya...</div>}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Total Projects", value: projects.length, color: "#38bdf8" },
                { label: "On Track", value: onTrack, color: "#10b981" },
                { label: "At Risk", value: atRisk, color: "#f59e0b" },
                { label: "Delayed", value: delayed, color: "#ef4444" },
                { label: "Total Engineer", value: engineers.length, color: "#a78bfa" },
                { label: "Avg KPI", value: avgKpi + "%", color: kpiColor(avgKpi) },
              ].map((s, i) => (
                <div key={i} style={card}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ ...card, marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 14 }}>▸ STATUS PROYEK</div>
              {projects.map(p => {
                const d = daysUntil(p.deadline);
                return (
                  <div key={p.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ color: "#e2e8f0", fontSize: 13 }}>{p.name}</span>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: statusColor[p.status]+"22", color: statusColor[p.status] }}>{p.status}</span>
                        {d <= 7 && d >= 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#f59e0b22", color: "#f59e0b" }}>⚠️ {d}h lagi</span>}
                        {d < 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#ef444422", color: "#ef4444" }}>🚨 Terlambat</span>}
                      </div>
                      <span style={{ color: "#38bdf8", fontWeight: 700 }}>{p.progress}%</span>
                    </div>
                    <ProgressBar value={p.progress} color={statusColor[p.status]} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#475569" }}>
                      <span>PIC: {p.pic}</span><span>Deadline: {p.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={card}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 14 }}>▸ TOP ENGINEER KPI</div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[...engineers].sort((a,b) => b.kpi-a.kpi).slice(0,4).map(e => (
                  <div key={e.id} style={{ textAlign: "center" }}>
                    <GaugeRing value={e.kpi} />
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{e.name.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 4 }}>▸ MANAJEMEN PROYEK</div>
              <button onClick={() => setShowAddProject(!showAddProject)} style={{ background: "linear-gradient(135deg,#1e40af,#0ea5e9)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1 }}>+ TAMBAH</button>
            </div>
            {showAddProject && (
              <div style={{ ...card, marginBottom: 18, border: "1px solid #38bdf840" }}>
                <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 12 }}>▸ PROYEK BARU</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["NAMA PROYEK","text","name"],["PIC","text","pic"],["DEADLINE","date","deadline"]].map(([lbl,type,key]) => (
                    <div key={key}>
                      <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>{lbl}</div>
                      <input type={type} style={inp} value={newProject[key]} onChange={e => setNewProject({...newProject,[key]:e.target.value})} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>PROGRESS (%)</div>
                    <input type="number" min="0" max="100" style={inp} value={newProject.progress} onChange={e => setNewProject({...newProject,progress:+e.target.value})} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>STATUS</div>
                    <select style={inp} value={newProject.status} onChange={e => setNewProject({...newProject,status:e.target.value})}>
                      <option>On Track</option><option>At Risk</option><option>Delayed</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>PRIORITAS</div>
                    <select style={inp} value={newProject.priority} onChange={e => setNewProject({...newProject,priority:e.target.value})}>
                      <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => {
                  if (!newProject.name) return;
                  setProjects([...projects, { ...newProject, id: Date.now(), progress: +newProject.progress, notes: [] }]);
                  setNewProject({ name:"",status:"On Track",progress:0,deadline:"",priority:"Medium",pic:"",notes:[] });
                  setShowAddProject(false);
                  showToast("✓ Proyek berhasil ditambahkan");
                }} style={{ marginTop: 12, background: "#10b981", border: "none", color: "#fff", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>SIMPAN</button>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {projects.map(p => {
                const d = daysUntil(p.deadline);
                const isOpen = selectedProject === p.id;
                return (
                  <div key={p.id} style={{ ...card, border: isOpen ? "1px solid #38bdf8" : "1px solid #1e3a5f" }}>
                    <div style={{ cursor: "pointer" }} onClick={() => setSelectedProject(isOpen ? null : p.id)}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ color: "#f0f9ff", fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: statusColor[p.status]+"22", color: statusColor[p.status] }}>{p.status}</span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: priorityColor[p.priority]+"22", color: priorityColor[p.priority] }}>{p.priority}</span>
                          {d <= 7 && d >= 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#f59e0b22", color: "#f59e0b" }}>⚠️ {d}h lagi</span>}
                          {d < 0 && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#ef444422", color: "#ef4444" }}>🚨 Terlambat {Math.abs(d)}h</span>}
                        </div>
                        <span style={{ color: "#38bdf8", fontWeight: 900, fontSize: 18 }}>{p.progress}%</span>
                      </div>
                      <ProgressBar value={p.progress} color={statusColor[p.status]} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#475569" }}>
                        <span>PIC: {p.pic}</span>
                        <span>📅 {p.deadline}</span>
                        <span style={{ color: (p.notes||[]).length > 0 ? "#38bdf8" : "#475569" }}>💬 {(p.notes||[]).length} catatan</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e3a5f" }}>
                        {/* Update controls */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: "#38bdf8", letterSpacing: 2, marginBottom: 8 }}>UPDATE PROGRESS & STATUS</div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <input type="range" min="0" max="100" value={p.progress}
                              onChange={e => setProjects(projects.map(pr => pr.id===p.id ? {...pr,progress:+e.target.value} : pr))}
                              style={{ flex: 1, minWidth: 120, accentColor: "#38bdf8" }} />
                            <span style={{ color: "#38bdf8", minWidth: 36 }}>{p.progress}%</span>
                            <select style={{ ...inp, width: "auto" }} value={p.status}
                              onChange={e => { setProjects(projects.map(pr => pr.id===p.id ? {...pr,status:e.target.value} : pr)); showToast("✓ Status diperbarui"); }}>
                              <option>On Track</option><option>At Risk</option><option>Delayed</option>
                            </select>
                            <button onClick={() => { setProjects(projects.filter(pr => pr.id!==p.id)); setSelectedProject(null); showToast("Proyek dihapus","#ef4444"); }}
                              style={{ background: "#ef444420", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontFamily: "inherit", cursor: "pointer" }}>Hapus</button>
                          </div>
                        </div>

                        {/* Notes / Comments */}
                        <div>
                          <div style={{ fontSize: 10, color: "#38bdf8", letterSpacing: 2, marginBottom: 8 }}>📝 CATATAN & KOMENTAR</div>
                          {(p.notes||[]).length === 0 && <div style={{ fontSize: 11, color: "#334155", marginBottom: 8 }}>Belum ada catatan.</div>}
                          {(p.notes||[]).map(n => (
                            <div key={n.id} style={{ background: "#0f2744", border: "1px solid #1e3a5f", borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                              <div style={{ fontSize: 12, color: "#e2e8f0" }}>{n.text}</div>
                              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{n.author} · {n.time}
                                <button onClick={() => setProjects(projects.map(pr => pr.id===p.id ? {...pr,notes:(pr.notes||[]).filter(nn=>nn.id!==n.id)} : pr))}
                                  style={{ marginLeft: 10, background: "transparent", border: "none", color: "#475569", cursor: "pointer", fontSize: 10 }}>✕</button>
                              </div>
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <input style={{ ...inp, flex: 1 }} placeholder="Tulis catatan..." value={newNote[p.id]||""}
                              onChange={e => setNewNote({...newNote,[p.id]:e.target.value})}
                              onKeyDown={e => e.key==="Enter" && addNote(p.id)} />
                            <button onClick={() => addNote(p.id)} style={{ background: "#38bdf822", border: "1px solid #38bdf8", color: "#38bdf8", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>+</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MANPOWER ── */}
        {tab === "manpower" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 4 }}>▸ MANPOWER PLANNING</div>
              <button onClick={() => setShowAddEngineer(!showAddEngineer)} style={{ background: "linear-gradient(135deg,#1e40af,#0ea5e9)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1 }}>+ TAMBAH</button>
            </div>

            {/* Filter & Search */}
            <div style={{ ...card, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ fontSize: 10, color: "#38bdf8", letterSpacing: 2, whiteSpace: "nowrap" }}>🔍 FILTER:</div>
              <input style={{ ...inp, flex: 1, minWidth: 160 }} placeholder="Cari nama / role..." value={engSearch} onChange={e => setEngSearch(e.target.value)} />
              <select style={{ ...inp, width: "auto" }} value={engFilterProject} onChange={e => setEngFilterProject(e.target.value)}>
                <option value="all">Semua Proyek</option>
                {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <select style={{ ...inp, width: "auto" }} value={engFilterAvail} onChange={e => setEngFilterAvail(e.target.value)}>
                <option value="all">Semua Status</option>
                <option value="available">Available (100%)</option>
                <option value="partial">Partial</option>
                <option value="busy">Fully Busy</option>
              </select>
              {(engSearch || engFilterProject !== "all" || engFilterAvail !== "all") && (
                <button onClick={() => { setEngSearch(""); setEngFilterProject("all"); setEngFilterAvail("all"); }} style={{ background: "#ef444420", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontFamily: "inherit", cursor: "pointer" }}>Reset</button>
              )}
              <span style={{ fontSize: 11, color: "#475569" }}>{filteredEngineers.length} dari {engineers.length}</span>
            </div>

            {showAddEngineer && (
              <div style={{ ...card, marginBottom: 16, border: "1px solid #38bdf840" }}>
                <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 12 }}>▸ ENGINEER BARU</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["NAMA","text","name"],["JABATAN","text","role"]].map(([lbl,type,key]) => (
                    <div key={key}>
                      <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>{lbl}</div>
                      <input type={type} style={inp} value={newEngineer[key]} onChange={e => setNewEngineer({...newEngineer,[key]:e.target.value})} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>PROYEK</div>
                    <select style={inp} value={newEngineer.project} onChange={e => setNewEngineer({...newEngineer,project:e.target.value})}>
                      <option value="">-- Pilih --</option>
                      {projects.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 4 }}>AVAILABILITY (%)</div>
                    <input type="number" min="0" max="100" style={inp} value={newEngineer.availability} onChange={e => setNewEngineer({...newEngineer,availability:+e.target.value})} />
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 2, marginBottom: 8 }}>SKILL (1-5)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                    {SKILLS.map(sk => (
                      <div key={sk}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>{sk}</div>
                        <input type="number" min="1" max="5" style={inp} value={newEngineer.skills[sk]}
                          onChange={e => setNewEngineer({...newEngineer,skills:{...newEngineer.skills,[sk]:+e.target.value}})} />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => {
                  if (!newEngineer.name) return;
                  setEngineers([...engineers, {...newEngineer, id: Date.now(), kpi: 75}]);
                  setNewEngineer({name:"",role:"",project:"",kpi:80,availability:100,skills:{Electrical:3,PLC:3,Networking:3,SCADA:3,AutoCAD:3}});
                  setShowAddEngineer(false);
                  showToast("✓ Engineer berhasil ditambahkan");
                }} style={{ marginTop: 12, background: "#10b981", border: "none", color: "#fff", borderRadius: 8, padding: "8px 20px", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>SIMPAN</button>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total", value: engineers.length, color: "#38bdf8" },
                { label: "Fully Busy", value: engineers.filter(e=>e.availability===0).length, color: "#ef4444" },
                { label: "Partial", value: engineers.filter(e=>e.availability>0&&e.availability<100).length, color: "#f59e0b" },
                { label: "Available", value: engineers.filter(e=>e.availability===100).length, color: "#10b981" },
              ].map((s,i) => (
                <div key={i} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1, marginTop: 4 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {filteredEngineers.length === 0 && (
              <div style={{ ...card, textAlign: "center", color: "#475569", fontSize: 13 }}>Tidak ada engineer yang sesuai filter.</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredEngineers.map(e => (
                <div key={e.id} style={{ ...card, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: `${kpiColor(e.kpi)}22`, border: `2px solid ${kpiColor(e.kpi)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: kpiColor(e.kpi) }}>
                    {e.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ color: "#f0f9ff", fontWeight: 700, fontSize: 13 }}>{e.name}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>{e.role} · {e.project || "—"}</div>
                  </div>
                  <div style={{ minWidth: 130 }}>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>AVAILABILITY</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <ProgressBar value={e.availability} color={e.availability>50?"#10b981":e.availability>20?"#f59e0b":"#ef4444"} />
                      <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 32 }}>{e.availability}%</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>KPI</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: kpiColor(e.kpi) }}>{e.kpi}%</div>
                  </div>
                  <button onClick={() => { setEngineers(engineers.filter(en=>en.id!==e.id)); showToast("Engineer dihapus","#ef4444"); }}
                    style={{ background: "transparent", border: "1px solid #1e3a5f", color: "#475569", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "inherit", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {tab === "timeline" && (
          <div>
            <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 4, marginBottom: 18 }}>▸ TIMETABLE / GANTT CHART</div>
            <div style={{ ...card, overflowX: "auto" }}>
              <div style={{ display: "flex", marginBottom: 8 }}>
                <div style={{ minWidth: 200, fontSize: 10, color: "#64748b" }}>PROYEK / TASK</div>
                <div style={{ flex: 1, display: "flex" }}>
                  {Array.from({length:12},(_,i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#475569", borderLeft: "1px solid #1e3a5f", paddingLeft: 4 }}>W{i+1}</div>
                  ))}
                </div>
              </div>
              {projects.map(proj => {
                const tasks = MILESTONES.filter(m => m.project === proj.name);
                return (
                  <div key={proj.id} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, marginBottom: 6 }}>▸ {proj.name}</div>
                    {tasks.map((m,i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ minWidth: 200, fontSize: 11, color: "#94a3b8", paddingRight: 10 }}>└ {m.task}</div>
                        <div style={{ flex: 1, position: "relative", height: 20, background: "#0f2744", borderRadius: 4 }}>
                          <div style={{ position: "absolute", left: `${(m.start/12)*100}%`, width: `${(m.duration/12)*100}%`, height: "100%", background: `linear-gradient(90deg,${m.color}cc,${m.color}88)`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700, boxShadow: `0 0 8px ${m.color}44` }}>
                            {m.duration}W
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && <div style={{ fontSize: 11, color: "#334155", paddingLeft: 10 }}>└ Belum ada milestone</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── KPI ── */}
        {tab === "kpi" && (
          <div>
            <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 4, marginBottom: 18 }}>▸ KPI MONITORING</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Excellent ≥85%", value: engineers.filter(e=>e.kpi>=85).length, color: "#10b981" },
                { label: "Good 70–84%", value: engineers.filter(e=>e.kpi>=70&&e.kpi<85).length, color: "#f59e0b" },
                { label: "Below <70%", value: engineers.filter(e=>e.kpi<70).length, color: "#ef4444" },
                { label: "Team Average", value: avgKpi+"%", color: kpiColor(avgKpi) },
              ].map((s,i) => (
                <div key={i} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ ...card, marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 18 }}>▸ KPI INDIVIDUAL</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
                {[...engineers].sort((a,b)=>b.kpi-a.kpi).map(e => (
                  <div key={e.id} style={{ textAlign: "center", minWidth: 80 }}>
                    <GaugeRing value={e.kpi} size={80} />
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{e.name.split(" ")[0]}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{e.role.replace(" Engineer","")}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 14 }}>▸ UPDATE KPI</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {engineers.map(e => (
                  <div key={e.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#e2e8f0" }}>{e.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: kpiColor(e.kpi) }}>{e.kpi}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={e.kpi}
                      onChange={ev => setEngineers(engineers.map(en => en.id===e.id ? {...en,kpi:+ev.target.value} : en))}
                      style={{ width: "100%", accentColor: kpiColor(e.kpi), marginBottom: 4 }} />
                    <ProgressBar value={e.kpi} color={kpiColor(e.kpi)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SKILL MATRIX ── */}
        {tab === "skills" && (
          <div>
            <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 4, marginBottom: 18 }}>▸ SKILL MATRIX ENGINEER</div>
            <div style={{ ...card, overflowX: "auto", marginBottom: 18 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#38bdf8", fontSize: 10, letterSpacing: 2, borderBottom: "1px solid #1e3a5f" }}>ENGINEER</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#38bdf8", fontSize: 10, letterSpacing: 2, borderBottom: "1px solid #1e3a5f" }}>ROLE</th>
                    {SKILLS.map(sk => (
                      <th key={sk} style={{ textAlign: "center", padding: "8px 12px", color: "#38bdf8", fontSize: 10, letterSpacing: 2, borderBottom: "1px solid #1e3a5f" }}>{sk.toUpperCase()}</th>
                    ))}
                    <th style={{ textAlign: "center", padding: "8px 12px", color: "#38bdf8", fontSize: 10, letterSpacing: 2, borderBottom: "1px solid #1e3a5f" }}>AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {engineers.map((e,i) => {
                    const avg = (Object.values(e.skills).reduce((a,b)=>a+b,0)/SKILLS.length).toFixed(1);
                    return (
                      <tr key={e.id} style={{ background: i%2===0?"transparent":"#ffffff05" }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #1e3a5f08" }}>
                          <div style={{ fontWeight: 700, color: "#e2e8f0" }}>{e.name}</div>
                          <div style={{ fontSize: 10, color: "#475569" }}>{e.project}</div>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#64748b", fontSize: 11, borderBottom: "1px solid #1e3a5f08" }}>{e.role}</td>
                        {SKILLS.map(sk => (
                          <td key={sk} style={{ textAlign: "center", padding: "10px 12px", borderBottom: "1px solid #1e3a5f08" }}>
                            <SkillDot level={e.skills[sk]} />
                          </td>
                        ))}
                        <td style={{ textAlign: "center", padding: "10px 12px", borderBottom: "1px solid #1e3a5f08" }}>
                          <span style={{ color: avg>=4?"#10b981":avg>=3?"#f59e0b":"#ef4444", fontWeight: 700 }}>{avg}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={card}>
              <div style={{ fontSize: 11, color: "#38bdf8", letterSpacing: 3, marginBottom: 14 }}>▸ RATA-RATA SKILL TIM</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SKILLS.map(sk => {
                  const avg = engineers.reduce((a,e)=>a+e.skills[sk],0)/engineers.length;
                  return (
                    <div key={sk}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{sk}</span>
                        <span style={{ fontSize: 12, color: "#38bdf8", fontWeight: 700 }}>{avg.toFixed(1)} / 5</span>
                      </div>
                      <ProgressBar value={(avg/5)*100} color={avg>=4?"#10b981":avg>=3?"#38bdf8":"#f59e0b"} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: 12, fontSize: 10, color: "#1e3a5f", borderTop: "1px solid #0d2137" }}>
        PROJECT COMMAND SYSTEM v2.0 · Data tersimpan otomatis di browser
      </div>
    </div>
  );
}
