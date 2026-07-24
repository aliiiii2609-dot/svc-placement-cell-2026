import type { FaqMap } from '@/types';

/**
 * FAQ content for four audiences. Sourced from PLACEMENT_CELL_WEBSITE_CONTENT.docx
 * supplied by the cell, supplemented by the cell's published recruitment policy.
 */
export const faq: FaqMap = {
  recruiters: [
    {
      question: 'When can selected students join the company?',
      answer:
        'Selected students are available to join organisations in the months of June and July, depending upon the schedule of their college and competitive examinations. The same can be clarified with the Placement Coordinator assigned to your drive.',
    },
    {
      question: 'When can companies come for recruitment?',
      answer:
        'At Sri Venkateswara College, recruitment drives are conducted all-round the year except under special circumstances.',
    },
    {
      question: 'Till when can we expect a response from the Placement Cell?',
      answer:
        'Once we receive a company\'s confirmation, a Placement Coordinator will get in touch within a week to assist throughout the recruitment process.',
    },
    {
      question: 'Can we run a partly on-campus and partly off-campus drive?',
      answer:
        'Yes. An organisation can conduct the Pre-Placement Talk and preliminary rounds at the college campus and choose to hold the remaining process at their office.',
    },
    {
      question: 'How are CVs shared and shortlisted?',
      answer:
        'Students apply through a prescribed Google Form. The Placement Cell verifies eligibility, compiles and forwards CVs to the recruiter. Shortlisting is conducted solely by the recruiter based on their internal criteria.',
    },
    {
      question: 'What infrastructure is available for on-campus drives?',
      answer:
        'Fully air-conditioned seminar halls with projectors and audio-visual facilities for Pre-Placement Talks. Classrooms with projectors and Wi-Fi for interviews and assessments. Air-conditioned Placement Cell rooms with comfortable seating for HR waiting and discussions. Lunch and basic hospitality are arranged for visiting recruiters.',
    },
  ],

  students: [
    {
      question: 'Do academic or course-specific criteria apply to all opportunities?',
      answer:
        'Academic, course-specific, or year-wise eligibility criteria are entirely determined by the recruiting organisation and the profile offered. The Placement Cell does not set these criteria. Review the eligibility requirements mentioned for each opportunity before applying.',
    },
    {
      question: 'How and where are application forms shared?',
      answer:
        'Internship opportunities are shared through the official Placement Cell WhatsApp community groups. Placement opportunities are communicated directly via email to students registered with the Placement Cell. Check these channels regularly to stay updated.',
    },
    {
      question: 'Is it mandatory to use the Placement Cell CV format?',
      answer:
        'Yes. Use the Placement Cell CV format. Minor modifications are permitted but the overall structure must remain largely unchanged. CVs that differ significantly from the prescribed format may not be accepted.',
    },
    {
      question: 'Is it compulsory to attend all selection rounds once shortlisted?',
      answer:
        'Yes. Once shortlisted, attending all selection rounds is mandatory. Missing a round without prior intimation may lead to disqualification or blacklisting from future opportunities.',
    },
    {
      question: 'Whom should students contact for queries or clarifications?',
      answer:
        'Reach out to the Placement Cell coordinators, council members, or core team members through the official communication channels. Contact details are on the team page.',
    },
    {
      question: 'What is the tier policy after accepting an offer?',
      answer:
        'Once a student accepts an offer, they may be restricted from applying to further opportunities in accordance with the Cell\'s tier policy. Inform the Cell of acceptance or rejection decisions within the stipulated deadlines.',
    },
  ],

  policy: [
    {
      question: 'Who is eligible to register with the Placement Cell?',
      answer:
        'Registration is open to students who meet the current cycle\'s registration requirements. Eligibility for any individual drive, including course, year, and academic cut-offs, is set by the recruiting organisation and not by the Cell. You must register through the official form before you can apply to any opportunity.',
    },
    {
      question: 'What is the one-offer rule?',
      answer:
        'Once you accept an offer through the Cell, you are ordinarily withdrawn from further placement drives for that cycle, subject to the tier policy below. This keeps opportunities moving to as many students as possible. Placements and internships may be treated separately, so confirm the specifics with your coordinator.',
    },
    {
      question: 'How does the tier policy work?',
      answer:
        'Offers are grouped into tiers by profile and compensation. After you accept an offer in a given tier, you may only sit for drives in a higher tier, and only where the Cell permits. The exact tier bands are published in the Placement Policy each cycle.',
    },
    {
      question: 'What conduct is expected once a drive begins?',
      answer:
        'Once you are shortlisted, attending every round is mandatory. Withdrawing after selection, skipping a round without prior intimation, or misrepresenting information on your CV can lead to disqualification and blacklisting from future drives.',
    },
    {
      question: 'What does blacklisting mean, and when does it apply?',
      answer:
        'A blacklisted student may be barred from some or all future opportunities for the cycle. Blacklisting follows the norms set out in the Placement Policy and is communicated in writing, so you always know where you stand.',
    },
    {
      question: 'Where can I read the full placement policy?',
      answer:
        'The complete Placement Policy 2026-27, covering eligibility, the one-offer rule, application conduct, and blacklisting norms, is on the Resources page and linked in the footer. Read it in full before you register.',
    },
  ],

  vetting: [
    {
      question: 'What is the CV vetting process?',
      answer:
        'Every CV that reaches a recruiter is vetted by the Cell first. You submit in the prescribed format, the Documentation team reviews it against the guidelines, sends back comments if anything needs work, and clears it once it meets the standard.',
    },
    {
      question: 'Do I have to use the prescribed CV format?',
      answer:
        'Yes. The Cell\'s CV format is mandatory. Minor edits are fine, but the overall structure must stay intact. CVs that differ significantly from the format are returned before they ever reach a recruiter.',
    },
    {
      question: 'What do recruiters look at in the first 15 seconds?',
      answer:
        'Clear positioning at the top, quantified impact in your bullet points, the most relevant experience above the fold, and a clean, consistent layout. The vetting guidelines break down exactly what strengthens each section.',
    },
    {
      question: 'Why are CVs most often sent back?',
      answer:
        'Vague, unquantified bullets, inconsistent formatting or tense, spelling and grammar slips, running past one page, and claims that cannot be substantiated. Fixing these before you submit speeds up your turnaround considerably.',
    },
    {
      question: 'How long does vetting take, and how many revisions can I make?',
      answer:
        'The team aims to return a first review within a few working days of submission, and you can revise and resubmit until the CV clears. Submitting early in the cycle leaves room to iterate well before drives open.',
    },
    {
      question: 'Where can I read the full CV vetting guidelines?',
      answer:
        'The complete CV Vetting Guidelines 2026-27, covering the accepted format, what recruiters look for, common mistakes, and how to rewrite weak lines, are on the Resources page and linked in the footer.',
    },
  ],

  alumni: [
    {
      question: 'How do I register on the alumni directory?',
      answer:
        'Use the Alumni Registration form on this site. Submissions go to a verification queue managed by the Documentation department. Once verified, your profile becomes part of the directory, with whatever visibility you choose.',
    },
    {
      question: 'Can I edit or remove my profile later?',
      answer:
        'Yes. Email placement@svc.ac.in with your request. Edits and removals are processed within five working days. You can pause visibility without deleting the profile.',
    },
    {
      question: 'What does mentoring a current student involve?',
      answer:
        'A 30 to 45 minute video or in-person conversation about a domain, role, or career path. You can choose which sectors you are open to mentoring in and how many students per cycle. The Cell\'s Documentation team handles all scheduling.',
    },
    {
      question: 'Will my placement details from my SVC year be displayed?',
      answer:
        'No. The site never displays SVC-era placement records paired with named profiles. Your public professional information, your qualifications, and any voluntary biography you provide are all that appear.',
    },
    {
      question: 'Can I attend cell events as an alumnus?',
      answer:
        'Yes. Alumni are welcome at IFair, industry talks, and panel discussions. Look out for the alumni invitation email or check the events page.',
    },
  ]
};
