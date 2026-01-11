"use client";

import Link from "next/link";
import { Button, Spinner } from "@maistro/ui";
import { ProjectCard } from "@maistro/validate-frontend";
import { useProjects } from "@/lib/queries";

export default function DashboardPage() {
  const { data, isLoading, error } = useProjects();

  const projects = data?.items ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your idea validation projects
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>New Project</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            Failed to load projects: {error.message}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any projects yet.
          </p>
          <Link href="/dashboard/new">
            <Button>Create Your First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => {
                window.location.href = `/dashboard/projects/${project.id}`;
              }}
              onEdit={() => {
                window.location.href = `/dashboard/projects/${project.id}/edit`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
