"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@maistro/ui";
import { ProjectDashboard, SignupList, LandingPagePreview } from "@maistro/validate-frontend";
import type { Project, LandingPage, ProjectAnalytics, Signup } from "@maistro/types";

const mockProject: Project = {
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
};

const mockLandingPage: LandingPage = {
  projectId: "1",
  headline: "Write Better Content 10x Faster",
  subheadline: "AI-powered writing assistant that helps you create high-quality articles while maintaining your unique voice.",
  sections: [
    {
      type: "features",
      content: {
        items: [
          { title: "Smart Suggestions", description: "Get intelligent writing suggestions in real-time", icon: "sparkles" },
          { title: "Voice Matching", description: "AI learns and maintains your unique writing style", icon: "mic" },
          { title: "SEO Optimized", description: "Content automatically optimized for search engines", icon: "search" },
        ],
      },
    },
    {
      type: "faq",
      content: {
        items: [
          { question: "How does the AI learn my writing style?", answer: "Our AI analyzes your existing content to understand your tone, vocabulary, and structure preferences." },
          { question: "Is my content private?", answer: "Yes, all your content is encrypted and never shared with third parties." },
          { question: "Can I export my content?", answer: "Absolutely! Export to any format including Word, PDF, and Markdown." },
        ],
      },
    },
  ],
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  ctaText: "Start Writing Free",
  seoTitle: "AI Writing Assistant - Write Better Content Faster",
  seoDescription: "Transform your content creation with AI. Write high-quality articles 10x faster while maintaining your unique voice.",
  version: 1,
  createdAt: "2024-01-12T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

const mockAnalytics: ProjectAnalytics = {
  projectId: "1",
  totalPageViews: 1247,
  totalUniqueVisitors: 834,
  totalSignups: 42,
  overallConversionRate: 5.04,
  dailyStats: [
    { projectId: "1", date: "2024-01-13", pageViews: 312, uniqueVisitors: 198, signups: 8, conversionRate: 4.04, avgTimeOnPage: 45, bounceRate: 52, topReferrers: { "twitter.com": 89, "google.com": 67 }, deviceBreakdown: { desktop: 145, mobile: 48, tablet: 5 }, createdAt: "2024-01-13T00:00:00Z", updatedAt: "2024-01-13T23:59:59Z" },
    { projectId: "1", date: "2024-01-14", pageViews: 456, uniqueVisitors: 312, signups: 18, conversionRate: 5.77, avgTimeOnPage: 52, bounceRate: 48, topReferrers: { "twitter.com": 156, "google.com": 89, "linkedin.com": 34 }, deviceBreakdown: { desktop: 234, mobile: 67, tablet: 11 }, createdAt: "2024-01-14T00:00:00Z", updatedAt: "2024-01-14T23:59:59Z" },
    { projectId: "1", date: "2024-01-15", pageViews: 479, uniqueVisitors: 324, signups: 16, conversionRate: 4.94, avgTimeOnPage: 48, bounceRate: 51, topReferrers: { "twitter.com": 167, "google.com": 98, "producthunt.com": 45 }, deviceBreakdown: { desktop: 245, mobile: 71, tablet: 8 }, createdAt: "2024-01-15T00:00:00Z", updatedAt: "2024-01-15T23:59:59Z" },
  ],
  period: {
    start: "2024-01-13",
    end: "2024-01-15",
  },
};

const mockSignups: Signup[] = [
  { id: "s1", projectId: "1", email: "john@example.com", name: "John Doe", source: "twitter", createdAt: "2024-01-15T14:30:00Z" },
  { id: "s2", projectId: "1", email: "jane@example.com", createdAt: "2024-01-15T12:15:00Z" },
  { id: "s3", projectId: "1", email: "bob@company.com", name: "Bob Smith", source: "producthunt", createdAt: "2024-01-14T18:45:00Z" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold mt-2">{mockProject.name}</h1>
          <p className="text-muted-foreground">{mockProject.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          {mockProject.status === "published" && (
            <Button variant="outline" asChild>
              <a
                href={`https://${mockProject.slug}.maistro.live`}
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
            <span className="capitalize">{mockProject.status}</span>
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(mockProject.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Target Audience:</span>{" "}
            {mockProject.targetAudience}
          </div>
          <div>
            <span className="font-medium">Slug:</span> {mockProject.slug}
          </div>
        </CardContent>
      </Card>

      <ProjectDashboard analytics={mockAnalytics} />

      <SignupList
        signups={mockSignups}
        total={mockAnalytics.totalSignups}
        hasMore={false}
      />

      <LandingPagePreview
        landingPage={mockLandingPage}
        publishedUrl={mockProject.status === "published" ? `https://${mockProject.slug}.maistro.live` : undefined}
      />
    </div>
  );
}
