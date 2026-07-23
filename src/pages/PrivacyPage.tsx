export function PrivacyPage() {
  return (
    <article className="section-spacing">
      <div className="container-svc max-w-3xl prose-content text-ink-2 leading-relaxed">
        <span className="eyebrow">Privacy</span>
        <h1 className="font-display text-4xl md:text-5xl mt-3 mb-8 display-italic">Privacy notice.</h1>

        <h2 className="font-display text-2xl mt-8 mb-3 text-ink">What we collect</h2>
        <p className="mb-4">
          The cell collects only what is needed to run drives. For students: name, course, year, CGPA, CV, email,
          phone. For recruiters: name, organization, work email, hiring brief. For alumni: name, course, graduating
          year, current role and organization, optional city. For event RSVPs: email.
        </p>

        <h2 className="font-display text-2xl mt-8 mb-3 text-ink">How we use it</h2>
        <p className="mb-4">
          Student data is shared with recruiters strictly as part of an applied drive. Recruiter briefs are routed
          to the assigned coordinator. Alumni profiles are verified and published only after explicit consent.
          Event registrations are used only for that event.
        </p>

        <h2 className="font-display text-2xl mt-8 mb-3 text-ink">What we do not display</h2>
        <p className="mb-4">
          No student name is paired with a recruiting company on this site. No CTC value is paired with a named
          recruiter. No SVC-era placement record is paired with a named alumnus. These rules are enforced in the
          site&apos;s data type system, not just policy.
        </p>

        <h2 className="font-display text-2xl mt-8 mb-3 text-ink">Edit or remove</h2>
        <p className="mb-4">
          Write to placement@svc.ac.in with your request. Edits and removals are processed within five working days.
          You may pause public listing without deletion.
        </p>

        <h2 className="font-display text-2xl mt-8 mb-3 text-ink">Cookies</h2>
        <p className="mb-4">
          This site uses localStorage to persist your audio preference, reduced-motion preference, and form drafts. No
          third-party analytics are loaded by the production build of this site.
        </p>
      </div>
    </article>
  );
}
