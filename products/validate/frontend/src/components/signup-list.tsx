"use client";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "@maistro/ui";
import type { Signup } from "@maistro/types";

interface SignupListProps {
  signups: Signup[];
  total: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function SignupList({
  signups,
  total,
  hasMore,
  onLoadMore,
  isLoading,
}: SignupListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signups</CardTitle>
        <CardDescription>{total} total signups captured</CardDescription>
      </CardHeader>
      <CardContent>
        {signups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No signups yet. Share your landing page to start collecting email addresses.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Source</th>
                    <th className="text-left py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((signup) => (
                    <tr key={signup.id} className="border-b">
                      <td className="py-2 px-4 font-medium">{signup.email}</td>
                      <td className="py-2 px-4">{signup.name ?? "-"}</td>
                      <td className="py-2 px-4">{signup.source ?? "Direct"}</td>
                      <td className="py-2 px-4">
                        {new Date(signup.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMore && onLoadMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
