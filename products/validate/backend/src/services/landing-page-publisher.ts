import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import type { LandingPage, Project } from "@maistro/types";

const s3Client = new S3Client({});
const cloudFrontClient = new CloudFrontClient({});

const BUCKET_NAME = process.env.LANDING_PAGES_BUCKET_NAME || "";
const CDN_DISTRIBUTION_ID = process.env.LANDING_PAGES_CDN_DISTRIBUTION_ID || "";
const LANDING_DOMAIN = process.env.LANDING_DOMAIN || "maistro.live";

export interface PublishResult {
  url: string;
  publishedAt: string;
}

export async function publishLandingPage(
  project: Project,
  landingPage: LandingPage
): Promise<PublishResult> {
  const html = generateLandingPageHtml(project, landingPage);
  const slug = project.slug;

  // Upload index.html to S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${slug}/index.html`,
      Body: html,
      ContentType: "text/html",
      CacheControl: "public, max-age=3600",
    })
  );

  // Upload tracking script
  const trackingScript = generateTrackingScript(project.id);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${slug}/tracking.js`,
      Body: trackingScript,
      ContentType: "application/javascript",
      CacheControl: "public, max-age=3600",
    })
  );

  // Invalidate CloudFront cache
  if (CDN_DISTRIBUTION_ID) {
    await cloudFrontClient.send(
      new CreateInvalidationCommand({
        DistributionId: CDN_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `${slug}-${Date.now()}`,
          Paths: {
            Quantity: 2,
            Items: [`/${slug}/*`, `/${slug}/index.html`],
          },
        },
      })
    );
  }

  const publishedAt = new Date().toISOString();
  const url = `https://${slug}.${LANDING_DOMAIN}`;

  return { url, publishedAt };
}

export async function unpublishLandingPage(project: Project): Promise<void> {
  const slug = project.slug;

  // Delete files from S3
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${slug}/index.html`,
    })
  );

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${slug}/tracking.js`,
    })
  );

  // Invalidate CloudFront cache
  if (CDN_DISTRIBUTION_ID) {
    await cloudFrontClient.send(
      new CreateInvalidationCommand({
        DistributionId: CDN_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `${slug}-unpublish-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: [`/${slug}/*`],
          },
        },
      })
    );
  }
}

function generateLandingPageHtml(project: Project, landingPage: LandingPage): string {
  const { headline, subheadline, sections, theme, ctaText, seoTitle, seoDescription } = landingPage;

  const featuresSection = sections.find((s) => s.type === "features");
  const faqSection = sections.find((s) => s.type === "faq");

  const featuresHtml = featuresSection?.content?.items
    ? featuresSection.content.items
        .map(
          (item: { title: string; description: string }) => `
          <div class="feature">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        `
        )
        .join("")
    : "";

  const faqHtml = faqSection?.content?.items
    ? faqSection.content.items
        .map(
          (item: { question: string; answer: string }) => `
          <div class="faq-item">
            <h3>${escapeHtml(item.question)}</h3>
            <p>${escapeHtml(item.answer)}</p>
          </div>
        `
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seoTitle || project.name)}</title>
  <meta name="description" content="${escapeHtml(seoDescription || project.description)}">
  <style>
    :root {
      --primary: ${theme.primaryColor};
      --secondary: ${theme.secondaryColor};
      --background: ${theme.backgroundColor};
      --text: ${theme.textColor};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${theme.fontFamily};
      background: var(--background);
      color: var(--text);
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero {
      padding: 80px 0;
      text-align: center;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
    }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto 2rem; }
    .cta-button {
      display: inline-block;
      padding: 16px 32px;
      background: white;
      color: var(--primary);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    .cta-button:hover { transform: translateY(-2px); }
    .features {
      padding: 80px 0;
      background: #f8f9fa;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }
    .feature {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .feature h3 { color: var(--primary); margin-bottom: 1rem; }
    .faq { padding: 80px 0; }
    .faq h2 { text-align: center; margin-bottom: 40px; }
    .faq-item {
      max-width: 800px;
      margin: 0 auto 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .faq-item h3 { color: var(--primary); margin-bottom: 0.5rem; }
    .signup-form {
      padding: 80px 0;
      background: var(--primary);
      color: white;
      text-align: center;
    }
    .signup-form h2 { margin-bottom: 2rem; }
    .signup-form form {
      display: flex;
      gap: 10px;
      max-width: 500px;
      margin: 0 auto;
      flex-wrap: wrap;
      justify-content: center;
    }
    .signup-form input {
      flex: 1;
      min-width: 200px;
      padding: 16px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
    }
    .signup-form button {
      padding: 16px 32px;
      background: var(--secondary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    footer {
      padding: 40px 0;
      text-align: center;
      color: #666;
    }
  </style>
  <script src="tracking.js" defer></script>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>${escapeHtml(headline)}</h1>
      <p>${escapeHtml(subheadline)}</p>
      <a href="#signup" class="cta-button">${escapeHtml(ctaText)}</a>
    </div>
  </section>

  ${
    featuresHtml
      ? `
  <section class="features">
    <div class="container">
      <div class="features-grid">
        ${featuresHtml}
      </div>
    </div>
  </section>
  `
      : ""
  }

  ${
    faqHtml
      ? `
  <section class="faq">
    <div class="container">
      <h2>Frequently Asked Questions</h2>
      ${faqHtml}
    </div>
  </section>
  `
      : ""
  }

  <section class="signup-form" id="signup">
    <div class="container">
      <h2>Get Early Access</h2>
      <form id="signupForm">
        <input type="email" name="email" placeholder="Enter your email" required>
        <button type="submit">${escapeHtml(ctaText)}</button>
      </form>
      <p id="signupMessage" style="margin-top: 1rem; display: none;"></p>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(project.name)}. All rights reserved.</p>
    </div>
  </footer>

  <script>
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
      const messageEl = document.getElementById('signupMessage');

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, projectId: '${project.id}' })
        });

        if (response.ok) {
          messageEl.textContent = 'Thanks for signing up! We\\'ll be in touch.';
          messageEl.style.display = 'block';
          form.reset();
        } else {
          messageEl.textContent = 'Something went wrong. Please try again.';
          messageEl.style.display = 'block';
        }
      } catch (error) {
        messageEl.textContent = 'Something went wrong. Please try again.';
        messageEl.style.display = 'block';
      }
    });
  </script>
</body>
</html>`;
}

function generateTrackingScript(projectId: string): string {
  return `
(function() {
  const PROJECT_ID = '${projectId}';
  const API_URL = '${process.env.API_URL || ""}';

  function trackEvent(type, data = {}) {
    fetch(API_URL + '/public/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: PROJECT_ID,
        type: type,
        data: data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      })
    }).catch(() => {});
  }

  // Track page view
  trackEvent('page_view');

  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    trackEvent('page_exit', { timeOnPage: Date.now() - startTime });
  });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
    }
  });

  // Track CTA clicks
  document.querySelectorAll('.cta-button, button[type="submit"]').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('cta_click', { text: el.textContent });
    });
  });
})();
`;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
