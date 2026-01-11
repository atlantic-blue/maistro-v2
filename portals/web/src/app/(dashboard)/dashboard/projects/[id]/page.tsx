"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from "@maistro/ui";
import { ProjectDashboard, SignupList, LandingPagePreview } from "@maistro/validate-frontend";
import { useProject, useProjectAnalytics, useSignups, useLandingPage } from "@/lib/queries";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const { data: analytics, isLoading: analyticsLoading } = useProjectAnalytics(projectId);
  const { data: signupsData, isLoading: signupsLoading } = useSignups(projectId);
  const { data: landingPage, isLoading: landingPageLoading } = useLandingPage(projectId);

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">
          Failed to load project: {projectError?.message || "Project not found"}
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold mt-2">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          {project.status === "published" && (
            <Button variant="outline" asChild>
              <a
                href={`https://${project.slug}.maistro.live`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live
              </a>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">{project.status}</span>
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Target Audience:</span>{" "}
            {project.targetAudience}
          </div>
          <div>
            <span className="font-medium">Slug:</span> {project.slug}
          </div>
        </CardContent>
      </Card>

      {analyticsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : analytics ? (
        <ProjectDashboard analytics={analytics} />
      ) : null}

      {signupsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : signupsData ? (
        <SignupList
          signups={signupsData.items}
          total={signupsData.items.length}
          hasMore={!!signupsData.nextCursor}
        />
      ) : null}

      {landingPageLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : landingPage ? (
        <LandingPagePreview
          landingPage={landingPage}
          publishedUrl={project.status === "published" ? `https://${project.slug}.maistro.live` : undefined}
        />
      ) : null}
    </div>
  );
}
