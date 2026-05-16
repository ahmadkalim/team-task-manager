import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { tasks: { include: { assignee: true } } },
  });

  if (!project) redirect("/dashboard");

  const users = await prisma.user.findMany();

  async function createTask(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assigneeId = formData.get("assigneeId") as string;

    await prisma.task.create({
      data: {
        title,
        description,
        projectId: params.id,
        assigneeId: assigneeId || null,
      },
    });

    revalidatePath(`/projects/${params.id}`);
  }

  async function updateTaskStatus(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const status = formData.get("status") as string;

    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath(`/projects/${params.id}`);
  }

  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <Link href="/dashboard" style={{ textDecoration: "none", color: "var(--accent-color)", display: "inline-block", marginBottom: "1rem" }}>
        &larr; Back to Dashboard
      </Link>
      <div className="glass-panel" style={{ marginBottom: "2rem" }}>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="glass-panel">
          <h2>Tasks</h2>
          {project.tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            project.tasks.map((task) => (
              <div key={task.id} className="glass-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Assignee: {task.assignee?.name || "Unassigned"}</p>
                <form action={updateTaskStatus} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="hidden" name="taskId" value={task.id} />
                  <select name="status" defaultValue={task.status} className="glass-input" style={{ width: "auto" }}>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button type="submit" className="glass-button" style={{ padding: "0.5rem 1rem" }}>Update</button>
                </form>
              </div>
            ))
          )}
        </div>

        {session.user.role === "ADMIN" && (
          <div className="glass-panel">
            <h2>Add Task</h2>
            <form action={createTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" name="title" placeholder="Task Title" className="glass-input" required />
              <textarea name="description" placeholder="Description" className="glass-input" rows={3} />
              <select name="assigneeId" className="glass-input">
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <button type="submit" className="glass-button">Create Task</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
