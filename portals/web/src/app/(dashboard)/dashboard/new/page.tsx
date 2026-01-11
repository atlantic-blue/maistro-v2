"use client";

import { useRouter } from "next/navigation";
import { IdeaForm } from "@maistro/validate-frontend";
import type { CreateProjectInput } from "@maistro/types";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateProjectInput) => {
    console.log("Creating project:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="text-muted-foreground mt-1">
          Describe your idea to get started with validation
        </p>
      </div>
      <IdeaForm onSubmit={handleSubmit} />
    </div>
  );
}
