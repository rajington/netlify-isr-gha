# Example Simulating On-Demand ISR on Netlify with GitHub Actions

Currently On-Demand ISR is not supported on the Next.js Runtime. We can emulate this capability with external CI and the Netlify CLI by simply redoing the deploy with the changed files, plus all the previous deploys' files. The Netlify CLI hashes all these files, and the Netlify API will reply that only the changed files need to be uploaded.

If there are a lot of these files, we ask our CI to restore and then Netlify CLI to hash files that we know we have no intention of uploading.

Instead, the CI could just cache only the previous deploys' file digest JSON (or re-request it using the undocumented API /api/v1/deploys/{deploy_id}/files), and [enable the CLI deploy command to merge the digest of just the new files, with the previous digest (CLI PR)](https://github.com/netlify/cli/pull/5589).

This is a WIP and more of a PoC of a strategy that could enable performant incremental uploads with an external build system, which is likely not the direction Netlify hopes to pursue.

## Usage

By default, on every push (code change) the site builds the following pages:
- https://netlify-isr-gha-site.netlify.app/page0
- https://netlify-isr-gha-site.netlify.app/page1
- https://netlify-isr-gha-site.netlify.app/page2
- https://netlify-isr-gha-site.netlify.app/page1
- https://netlify-isr-gha-site.netlify.app/page4

Each page shows the commit hash, build time, and page-specific slug.

Manually running the workflow simulates an external webhook that includes which pages to "On-Demand" Regenerate (or generate if it doesn't exist).

When manually running the workflow, for example, with `page1,page3` we can see that [the workflow run](https://github.com/rajington/netlify-isr-gha/actions/runs/4502043419/jobs/7923309282) only builds these two pages, and only deploys those two pages, yet the previous pages are still available:
- https://netlify-isr-gha-site.netlify.app/page0 (previous)
- https://netlify-isr-gha-site.netlify.app/page1 (updated)
- https://netlify-isr-gha-site.netlify.app/page2 (previous)
- https://netlify-isr-gha-site.netlify.app/page1 (updated)
- https://netlify-isr-gha-site.netlify.app/page4 (previous)

## Demo


https://user-images.githubusercontent.com/53535/227255461-a83d08ea-7ee9-443c-8069-919f20246a8c.mov



