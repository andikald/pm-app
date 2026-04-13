import { useState } from "react";

export default function App() {
  const [projects, setProjects] = useState([]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>PM App 🚀</h1>

      <button
        onClick={() => setProjects([...projects, "Project Baru"])}
        style={{ marginTop: "20px" }}
      >
        Add Project
      </button>

      <ul>
        {projects.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}