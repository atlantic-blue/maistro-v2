"use client";

import Link from "next/link";
import { Button } from "@maistro/ui";
import { ProjectCard } from "@maistro/validate-frontend";
import type { Project } from "@maistro/types";

const mockProjects: Project[] = [
  {
    id: "1",
    userId: "user-1",
    name: "AI Writing Assistant",
    slug: "ai-writing-assistant-abc123",
    description: "An AI-powered writing tool that helps content creators produce high-quality articles faster.",
    targetAudience: "Content creators and marketers",
    problem: "Writing high-quality content is time-consuming and requires expertise",
    solution: "AI-assisted writing that maintains your voice while speeding up production",
    status: "published",
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    name: "Fitness Meal Planner",
    slug: "fitness-meal-planner-xyz789",
    description: "Personalized meal plans for fitness enthusiasts based on their goals and preferences.",
    targetAudience: "Health-conscious individuals and athletes",
    problem: "Creating balanced meal plans that align with fitness goals is complicated",
    solution: "AI-generated meal plans based on your fitness goals and dietary preferences",
    status: "ready",
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "3",
    userId: "user-1",
    name: "Remote Team Sync",
    slug: "remote-team-sync-def456",
    description: "A tool to help remote teams stay connected and aligned across time zones.",
    targetAudience: "Remote and distributed teams",
    problem: "Remote teams struggle to maintain alignment and connection",
    solution: "Async-first communication tools with smart scheduling",
    status: "draft",
    createdAt: "2024-01-14T16:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
  },
];

export default function DashboardPage() {
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

      {mockProjects.length === 0 ? (
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
          {mockProjects.map((project) => (
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
