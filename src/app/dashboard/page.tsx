import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const projects = await prisma.project.findMany({
    include: { tasks: true, owner: true },
  });

  const myTasks = await prisma.task.findMany({
    where: { assigneeId: session.user.id },
    include: { project: true },
  });

  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Welcome, {user?.name}</h1>
        <div>
          <span style={{ marginRight: "1rem", fontWeight: "bold" }}>Role: {user?.role}</span>
          <Link href="/api/auth/signout">
            <button className="glass-button">Sign Out</button>
          </Link>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="glass-panel">
          <h2>My Assigned Tasks</h2>
          {myTasks.length === 0 ? (
            <p>No tasks assigned.</p>
          ) : (
            myTasks.map((task) => (
              <div key={task.id} className="glass-card">
                <h3>{task.title}</h3>
                <p>Status: <strong>{task.status}</strong></p>
                <p>Project: {task.project.name}</p>
                {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
              </div>
            ))
          )}
        </div>

        <div className="glass-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>All Projects</h2>
            {user?.role === "ADMIN" && (
              <Link href="/projects/new">
                <button className="glass-button">New Project</button>
              </Link>
            )}
          </div>
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="glass-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Tasks: {project.tasks.length}</p>
                <Link href={`/projects/${project.id}`}>
                  <button className="glass-button" style={{ marginTop: "1rem" }}>View Project</button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
