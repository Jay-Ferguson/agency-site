<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 16 App Router project (Sanity CMS-backed agency/portfolio site). Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Enables automatic session replay, autocapture, and exception tracking. Routes events through a `/ingest` reverse proxy.
- **`next.config.ts`** (updated) — Added EU-region reverse proxy rewrites (`/ingest/*` → `https://eu.i.posthog.com`) and `skipTrailingSlashRedirect: true` to support PostHog's trailing-slash API requests.
- **`src/lib/posthog-server.ts`** (new) — Server-side PostHog Node.js client factory used by API routes and Server Actions to capture server-side events.
- **`src/components/form.tsx`** (updated) — Captures `contact_form_submitted` on success and `contact_form_failed` on error after the contact form fetch call.
- **`src/action/newsletter-submission.ts`** (updated) — Captures `newsletter_subscribed` server-side via the PostHog Node SDK when an email is submitted.
- **`src/components/sanity-buttons.tsx`** (updated) — Captures `cta_button_clicked` with button text, href, variant, and new-tab properties on every CTA button click.
- **`src/app/blog/[slug]/page.tsx`** (updated) — Captures `blog_post_viewed` server-side with blog slug and title on each blog post page render.
- **`src/components/sections/faq-accordion.tsx`** (updated) — Added `"use client"` directive and captures `faq_item_expanded` with FAQ ID and title whenever an accordion item is opened.
- **`src/app/api/form/route.ts`** (updated) — Captures `contact_form_api_submitted` on email success and `contact_form_api_failed` on error, server-side.
- **`src/app/api/submit-form/route.ts`** (updated) — Captures `submit_form_api_submitted`, `submit_form_api_failed`, and `submit_form_recaptcha_failed` at the appropriate points in the Sanity-backed form handler.
- **`.env.local`** (updated) — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set securely.
- **`posthog-js`** and **`posthog-node`** installed as dependencies.

## Events

| Event Name | Description | File |
|---|---|---|
| `contact_form_submitted` | User successfully submitted the contact form (client-side) | `src/components/form.tsx` |
| `contact_form_failed` | Contact form submission returned a server error (client-side) | `src/components/form.tsx` |
| `newsletter_subscribed` | User submitted their email to subscribe to the newsletter | `src/action/newsletter-submission.ts` |
| `cta_button_clicked` | User clicked a CTA/navigation button (includes text, href, variant) | `src/components/sanity-buttons.tsx` |
| `blog_post_viewed` | A blog post page was rendered/viewed (server-side) | `src/app/blog/[slug]/page.tsx` |
| `faq_item_expanded` | User expanded a FAQ accordion item | `src/components/sections/faq-accordion.tsx` |
| `contact_form_api_submitted` | Server-side: contact form email sent successfully via `/api/form` | `src/app/api/form/route.ts` |
| `contact_form_api_failed` | Server-side: contact form email failed to send via `/api/form` | `src/app/api/form/route.ts` |
| `submit_form_api_submitted` | Server-side: Sanity-backed form submitted successfully via `/api/submit-form` | `src/app/api/submit-form/route.ts` |
| `submit_form_api_failed` | Server-side: Sanity-backed form submission failed via `/api/submit-form` | `src/app/api/submit-form/route.ts` |
| `submit_form_recaptcha_failed` | Server-side: reCAPTCHA verification failed during form submission | `src/app/api/submit-form/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/132382/dashboard/542412
- **CTA → Contact Form Conversion Funnel**: https://eu.posthog.com/project/132382/insights/lSqOWYB4
- **Contact Form Success vs Failure**: https://eu.posthog.com/project/132382/insights/JcbrrWUg
- **Newsletter Subscriptions Over Time**: https://eu.posthog.com/project/132382/insights/UyEoU0au
- **Blog Views & CTA Engagement**: https://eu.posthog.com/project/132382/insights/1T4cylG1
- **Top CTA Buttons by Click Count**: https://eu.posthog.com/project/132382/insights/nhg67m4g

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
