"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "500px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Create New Project</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Project Name"
            className="glass-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="glass-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="button" className="glass-button" style={{ flex: 1, background: "rgba(255,255,255,0.2)", color: "var(--text-primary)" }} onClick={() => router.push("/dashboard")}>
              Cancel
            </button>
            <button type="submit" className="glass-button" style={{ flex: 1 }}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
