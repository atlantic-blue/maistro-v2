export interface DailyStats {
  projectId: string;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  signups: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  topReferrers: Record<string, number>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAnalytics {
  projectId: string;
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalSignups: number;
  overallConversionRate: number;
  dailyStats: DailyStats[];
  period: {
    start: string;
    end: string;
  };
}

export interface StatsDynamoDB {
  PK: `PROJECT#${string}`;
  SK: `STATS#${string}`;
  projectId: string;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  signups: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  topReferrers: Record<string, number>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  createdAt: string;
  updatedAt: string;
  entityType: "STATS";
}
