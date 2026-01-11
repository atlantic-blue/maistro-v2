"use client";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@maistro/ui";
import type { Project } from "@maistro/types";

interface ProjectCardProps {
  project: Project;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  generating: "bg-yellow-100 text-yellow-800",
  ready: "bg-blue-100 text-blue-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-800",
};

export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="mt-1">
              Created {formattedDate}
            </CardDescription>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status] ?? statusColors.draft}`}
          >
            {project.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium">Audience:</span> {project.targetAudience}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {onView && (
          <Button variant="default" size="sm" onClick={onView}>
            View
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
