"use client";


import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@maistro/ui";
import type { ProjectAnalytics } from "@maistro/types";

interface ProjectDashboardProps {
  analytics: ProjectAnalytics;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ProjectDashboard({ analytics }: ProjectDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Page Views"
          value={analytics.totalPageViews.toLocaleString()}
          description="All time views"
        />
        <StatCard
          title="Unique Visitors"
          value={analytics.totalUniqueVisitors.toLocaleString()}
          description="Individual visitors"
        />
        <StatCard
          title="Total Signups"
          value={analytics.totalSignups.toLocaleString()}
          description="Email captures"
        />
        <StatCard
          title="Conversion Rate"
          value={`${analytics.overallConversionRate}%`}
          description="Visitors to signups"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.dailyStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No data available yet. Publish your landing page to start collecting metrics.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-right py-2 px-4">Views</th>
                      <th className="text-right py-2 px-4">Visitors</th>
                      <th className="text-right py-2 px-4">Signups</th>
                      <th className="text-right py-2 px-4">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.dailyStats.map((day) => (
                      <tr key={day.date} className="border-b">
                        <td className="py-2 px-4">{day.date}</td>
                        <td className="text-right py-2 px-4">{day.pageViews}</td>
                        <td className="text-right py-2 px-4">{day.uniqueVisitors}</td>
                        <td className="text-right py-2 px-4">{day.signups}</td>
                        <td className="text-right py-2 px-4">{day.conversionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
