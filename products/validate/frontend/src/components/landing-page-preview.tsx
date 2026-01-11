"use client";


import { Button, Card, CardContent, Input } from "@maistro/ui";
import type { LandingPage } from "@maistro/types";

interface LandingPagePreviewProps {
  landingPage: LandingPage;
  onPublish?: () => void;
  onRegenerate?: () => void;
  isPublishing?: boolean;
  isRegenerating?: boolean;
  publishedUrl?: string;
}

export function LandingPagePreview({
  landingPage,
  onPublish,
  onRegenerate,
  isPublishing,
  isRegenerating,
  publishedUrl,
}: LandingPagePreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Landing Page Preview</h2>
        <div className="flex gap-2">
          {onRegenerate && (
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          )}
          {onPublish && (
            <Button onClick={onPublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          )}
        </div>
      </div>

      {publishedUrl && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Published at:</span>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {publishedUrl}
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      <div
        className="border rounded-lg overflow-hidden"
        style={{
          backgroundColor: landingPage.theme.backgroundColor,
          color: landingPage.theme.textColor,
          fontFamily: landingPage.theme.fontFamily,
        }}
      >
        {/* Hero Section */}
        <section className="py-16 px-8 text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: landingPage.theme.primaryColor }}
          >
            {landingPage.headline}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-80">
            {landingPage.subheadline}
          </p>
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button
              style={{ backgroundColor: landingPage.theme.primaryColor }}
            >
              {landingPage.ctaText}
            </Button>
          </div>
        </section>

        {/* Sections */}
        {landingPage.sections.map((section, index) => (
          <section key={index} className="py-12 px-8">
            {section.type === "features" && (
              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-2xl font-bold mb-8 text-center"
                  style={{ color: landingPage.theme.primaryColor }}
                >
                  Features
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {(section.content as { items: Array<{ title: string; description: string; icon?: string }> }).items?.map(
                    (item, i) => (
                      <div key={i} className="text-center p-4">
                        <div className="text-3xl mb-2">{item.icon ?? "✨"}</div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm opacity-80">{item.description}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {section.type === "benefits" && (
              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-2xl font-bold mb-8 text-center"
                  style={{ color: landingPage.theme.primaryColor }}
                >
                  Benefits
                </h2>
                <div className="space-y-4">
                  {(section.content as { items: Array<{ title: string; description: string }> }).items?.map(
                    (item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: landingPage.theme.primaryColor }}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm opacity-80">{item.description}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {section.type === "faq" && (
              <div className="max-w-2xl mx-auto">
                <h2
                  className="text-2xl font-bold mb-8 text-center"
                  style={{ color: landingPage.theme.primaryColor }}
                >
                  FAQ
                </h2>
                <div className="space-y-4">
                  {(section.content as { items: Array<{ question: string; answer: string }> }).items?.map(
                    (item, i) => (
                      <div key={i} className="border-b pb-4">
                        <h3 className="font-semibold mb-2">{item.question}</h3>
                        <p className="text-sm opacity-80">{item.answer}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </section>
        ))}

        {/* Footer CTA */}
        <section
          className="py-16 px-8 text-center"
          style={{ backgroundColor: landingPage.theme.secondaryColor }}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Ready to get started?
          </h2>
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white"
            />
            <Button variant="secondary">{landingPage.ctaText}</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
