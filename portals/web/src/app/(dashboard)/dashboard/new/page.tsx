"use client";

import { useRouter } from "next/navigation";
import { IdeaForm } from "@maistro/validate-frontend";
import type { CreateProjectInput } from "@maistro/types";
import { useCreateProject } from "@/lib/queries";

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const handleSubmit = async (data: CreateProjectInput) => {
    try {
      const project = await createProject.mutateAsync(data);
      if (project) {
        router.push(`/dashboard/projects/${project.id}`);
      }
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="text-muted-foreground mt-1">
          Describe your idea to get started with validation
        </p>
      </div>
      {createProject.error && (
        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {createProject.error.message}
        </div>
      )}
      <IdeaForm onSubmit={handleSubmit} isLoading={createProject.isPending} />
    </div>
  );
}
