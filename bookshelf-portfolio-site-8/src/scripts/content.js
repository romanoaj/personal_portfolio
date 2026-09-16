(function () {
  "use strict";

  window.PORTFOLIO_CONTENT = Object.freeze({
    about: {
      title: "About Me",
      subtitle: "A little more than fits in a résumé.",
      leftHtml: `
        <p class="eyebrow">Hello, I&rsquo;m Ava</p>
        <h3>Curious by nature, thoughtful by design.</h3>
        <p class="drop-cap">
          I&rsquo;m a [role or field] who enjoys turning complicated questions into
          clear, useful experiences. My work lives at the intersection of
          [discipline], [discipline], and a healthy amount of curiosity.
        </p>
        <p>
          I care about the small details that make a project feel considered:
          language that welcomes people in, systems that are easy to understand,
          and ideas that hold up outside the first draft.
        </p>
        <figure class="image-placeholder" role="img" aria-label="Portrait placeholder">
          <span>Portrait or favorite workspace photo</span>
        </figure>
      `,
      rightHtml: `
        <p class="eyebrow">What guides my work</p>
        <ul class="ornament-list">
          <li><strong>Stay curious.</strong> Ask the extra question and follow the unexpected thread.</li>
          <li><strong>Make it useful.</strong> Good ideas should become something people can actually use.</li>
          <li><strong>Care for the craft.</strong> Details, clarity, and consistency are part of the work.</li>
          <li><strong>Build with others.</strong> The best outcomes usually come from generous collaboration.</li>
        </ul>
        <blockquote class="paper-quote">
          &ldquo;I like projects that begin with a messy question and end with
          something clear, human, and a little delightful.&rdquo;
        </blockquote>
        <dl class="detail-list">
          <div><dt>Based in</dt><dd>[City, State]</dd></div>
          <div><dt>Currently</dt><dd>[Role, degree, or focus]</dd></div>
          <div><dt>Seeking</dt><dd>[Opportunities you are interested in]</dd></div>
        </dl>
      `
    },

    experience: {
      title: "Experience",
      subtitle: "The teams, problems, and lessons that shaped my work.",
      leftHtml: `
        <p class="eyebrow">Recent chapter</p>
        <article class="timeline-entry">
          <p class="entry-date">[Month Year] &ndash; Present</p>
          <h3>[Job Title]</h3>
          <p class="entry-meta">[Organization] &middot; [Location or Remote]</p>
          <ul>
            <li>Led or supported [initiative], helping [audience] achieve [measurable result].</li>
            <li>Collaborated with [teams] to turn [challenge] into [solution].</li>
            <li>Created [deliverable or process] that improved [quality, speed, or access].</li>
          </ul>
        </article>
        <article class="timeline-entry">
          <p class="entry-date">[Month Year] &ndash; [Month Year]</p>
          <h3>[Previous Job Title]</h3>
          <p class="entry-meta">[Organization] &middot; [Location]</p>
          <ul>
            <li>Owned [responsibility] from early discovery through delivery.</li>
            <li>Used [method or tool] to uncover insights and recommend next steps.</li>
          </ul>
        </article>
      `,
      rightHtml: `
        <p class="eyebrow">Earlier pages</p>
        <article class="timeline-entry">
          <p class="entry-date">[Month Year] &ndash; [Month Year]</p>
          <h3>[Internship, Fellowship, or Campus Role]</h3>
          <p class="entry-meta">[Organization] &middot; [Location]</p>
          <ul>
            <li>Contributed to [project or program] serving [audience or purpose].</li>
            <li>Presented findings, documentation, or recommendations to [stakeholders].</li>
          </ul>
        </article>
        <aside class="paper-note">
          <h3>What I bring to a team</h3>
          <p>
            Clear communication, careful follow-through, comfort with ambiguity,
            and a habit of leaving systems better documented than I found them.
          </p>
        </aside>
        <p class="page-footnote">
          Replace these entries with the roles most relevant to the work you want
          to do next; impact matters more than listing every responsibility.
        </p>
      `
    },

    projects: {
      title: "Projects",
      subtitle: "Selected things I have imagined, built, tested, and refined.",
      leftHtml: `
        <article class="project-entry">
          <p class="eyebrow">Featured project &middot; [Year]</p>
          <h3>[Project Name]</h3>
          <p>
            Briefly explain what you made, who it was for, and why the problem
            mattered. Give readers enough context to understand the work before
            introducing the solution.
          </p>
          <figure class="image-placeholder image-placeholder--wide" role="img" aria-label="Featured project image placeholder">
            <span>Project screenshot or hero image</span>
          </figure>
          <dl class="detail-list">
            <div><dt>My role</dt><dd>[Your role and responsibilities]</dd></div>
            <div><dt>Timeline</dt><dd>[Duration or dates]</dd></div>
            <div><dt>Tools</dt><dd>[Tools, languages, or methods]</dd></div>
          </dl>
        </article>
      `,
      rightHtml: `
        <article class="project-entry">
          <p class="eyebrow">The story</p>
          <h3>From problem to outcome</h3>
          <ol class="chapter-list">
            <li><strong>Question</strong><span>What challenge or opportunity started the project?</span></li>
            <li><strong>Approach</strong><span>What did you research, design, build, or test?</span></li>
            <li><strong>Result</strong><span>What changed, shipped, improved, or surprised you?</span></li>
            <li><strong>Reflection</strong><span>What would you carry into the next version?</span></li>
          </ol>
          <div class="tag-list" aria-label="Project skills">
            <span>[Skill]</span><span>[Skill]</span><span>[Skill]</span>
          </div>
          <p class="link-row">
            <a href="https://github.com/your-handle" target="_blank" rel="noopener noreferrer">View repository <span aria-hidden="true">&#8599;</span></a>
          </p>
        </article>
        <aside class="paper-note">
          <h3>Also on my workbench</h3>
          <p><strong>[Smaller Project]</strong> &mdash; One sentence about its purpose and outcome.</p>
          <p><strong>[Smaller Project]</strong> &mdash; One sentence about what you explored or learned.</p>
        </aside>
      `
    },

    research: {
      title: "Research",
      subtitle: "Questions explored carefully, evidence gathered patiently.",
      leftHtml: `
        <p class="eyebrow">Selected inquiry</p>
        <h3>[Research Project or Paper Title]</h3>
        <p class="entry-meta">[Lab, course, institution, or independent study] &middot; [Year]</p>
        <p>
          This study examined <strong>[research question]</strong> to better
          understand [context, population, or problem]. I contributed to [your
          responsibilities], from shaping the question through sharing the findings.
        </p>
        <dl class="detail-list">
          <div><dt>Methods</dt><dd>[Interviews, experiments, archival work, surveys, or analysis]</dd></div>
          <div><dt>Sample</dt><dd>[Participants, dataset, texts, or materials]</dd></div>
          <div><dt>Output</dt><dd>[Paper, poster, presentation, report, or prototype]</dd></div>
        </dl>
        <figure class="image-placeholder" role="img" aria-label="Research figure placeholder">
          <span>Poster, figure, or fieldwork image</span>
        </figure>
      `,
      rightHtml: `
        <p class="eyebrow">Findings &amp; reflection</p>
        <h3>What the evidence suggested</h3>
        <p>
          Summarize the most useful finding in plain language. Explain why it
          matters, what decision it could inform, and where uncertainty remains.
        </p>
        <ul class="ornament-list">
          <li><strong>Finding one:</strong> [A specific pattern, relationship, or observation.]</li>
          <li><strong>Finding two:</strong> [A supporting or contrasting insight.]</li>
          <li><strong>Next question:</strong> [What you would investigate with more time or data.]</li>
        </ul>
        <aside class="paper-note">
          <h3>Research values</h3>
          <p>
            I value transparent methods, respectful participation, careful
            interpretation, and communicating results beyond specialist audiences.
          </p>
        </aside>
      `
    },

    skills: {
      title: "Skills",
      subtitle: "A working collection of tools, methods, and ways of thinking.",
      leftHtml: `
        <section class="skill-group">
          <p class="eyebrow">Craft &amp; creation</p>
          <h3>What I make with</h3>
          <div class="tag-list">
            <span>[Primary Skill]</span><span>[Primary Skill]</span>
            <span>[Primary Skill]</span><span>[Primary Skill]</span>
            <span>[Primary Skill]</span>
          </div>
        </section>
        <section class="skill-group">
          <p class="eyebrow">Tools &amp; technology</p>
          <ul class="skill-list">
            <li><strong>[Tool or language]</strong><span>Advanced</span></li>
            <li><strong>[Tool or language]</strong><span>Advanced</span></li>
            <li><strong>[Tool or language]</strong><span>Proficient</span></li>
            <li><strong>[Tool or language]</strong><span>Working knowledge</span></li>
          </ul>
        </section>
        <p class="page-footnote">
          Keep this page selective: highlight skills you can discuss confidently
          and connect to real work.
        </p>
      `,
      rightHtml: `
        <section class="skill-group">
          <p class="eyebrow">How I work</p>
          <h3>Methods &amp; strengths</h3>
          <ul class="ornament-list">
            <li><strong>Problem framing</strong> &mdash; turning broad questions into clear next steps.</li>
            <li><strong>Research synthesis</strong> &mdash; finding patterns without losing important nuance.</li>
            <li><strong>Communication</strong> &mdash; adapting detail and format to the audience.</li>
            <li><strong>Project ownership</strong> &mdash; organizing work from idea through handoff.</li>
          </ul>
        </section>
        <section class="skill-group">
          <p class="eyebrow">Currently learning</p>
          <h3>On the reading desk</h3>
          <p>
            [A developing skill, course, certification, or topic you are actively
            exploring.] I am practicing it through [small project or routine].
          </p>
        </section>
        <aside class="paper-note">
          <h3>Languages</h3>
          <p>[Language] &mdash; [proficiency]</p>
          <p>[Language] &mdash; [proficiency]</p>
        </aside>
      `
    },

    education: {
      title: "Education",
      subtitle: "Formal study, favorite questions, and learning beyond the syllabus.",
      leftHtml: `
        <p class="eyebrow">[Graduation Year or Expected Year]</p>
        <h3>[Degree and Field of Study]</h3>
        <p class="entry-meta">[University or College] &middot; [City, State]</p>
        <p>
          Focused on [concentration, themes, or academic interests], with
          particular attention to [topic] and [topic].
        </p>
        <dl class="detail-list">
          <div><dt>Honors</dt><dd>[Honor, scholarship, distinction, or GPA if desired]</dd></div>
          <div><dt>Activities</dt><dd>[Club, publication, team, service, or leadership role]</dd></div>
          <div><dt>Thesis</dt><dd>[Title or subject, if applicable]</dd></div>
        </dl>
        <figure class="image-placeholder" role="img" aria-label="Academic image placeholder">
          <span>Campus, thesis, or presentation photo</span>
        </figure>
      `,
      rightHtml: `
        <p class="eyebrow">Favorite coursework</p>
        <ul class="ornament-list">
          <li><strong>[Course Title]</strong><br>A note about the question, project, or skill that stayed with you.</li>
          <li><strong>[Course Title]</strong><br>A note connecting this course to your current interests.</li>
          <li><strong>[Course Title]</strong><br>A note about a memorable assignment or collaboration.</li>
        </ul>
        <aside class="paper-note">
          <h3>Beyond the classroom</h3>
          <p>
            Add relevant certificates, workshops, independent study, community
            programs, or subjects you continue to learn on your own.
          </p>
        </aside>
        <blockquote class="paper-quote">
          &ldquo;The most useful part of my education was learning how to ask
          better questions&mdash;and how to keep revising the answer.&rdquo;
        </blockquote>
      `
    },

    resume: {
      title: "Resume",
      subtitle: "The concise edition of my professional story.",
      leftHtml: `
        <p class="eyebrow">At a glance</p>
        <h3>Ava Romano</h3>
        <p class="entry-meta">[Professional Headline]</p>
        <p>
          [Two-sentence professional summary describing your focus, strongest
          capabilities, and the kind of impact you hope to make.]
        </p>
        <dl class="detail-list">
          <div><dt>Experience</dt><dd>[X]+ years across [relevant areas]</dd></div>
          <div><dt>Specialties</dt><dd>[Specialty], [Specialty], [Specialty]</dd></div>
          <div><dt>Location</dt><dd>[City, State] &middot; [Remote preference]</dd></div>
        </dl>
        <p class="button-row">
          <span class="book-button book-button--placeholder" aria-disabled="true">Add your resume PDF</span>
        </p>
        <p class="page-footnote">Add <code>resume.pdf</code> in <code>assets/documents</code>, then replace the placeholder above with a download link.</p>
      `,
      rightHtml: `
        <p class="eyebrow">Selected highlights</p>
        <ul class="ornament-list">
          <li>Delivered [project or initiative] resulting in [specific impact].</li>
          <li>Worked across [functions or communities] to solve [challenge].</li>
          <li>Built expertise in [skill area] through [experience or body of work].</li>
          <li>Recognized with [award, publication, presentation, or milestone].</li>
        </ul>
        <aside class="paper-note">
          <h3>Looking for</h3>
          <p>
            I&rsquo;m interested in [role types] where I can contribute [strengths],
            keep learning, and help a thoughtful team build work that matters.
          </p>
        </aside>
        <p class="link-row">
          <a href="https://www.linkedin.com/in/your-handle/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">&#8599;</span></a>
          <a href="mailto:hello@example.com">Email me <span aria-hidden="true">&#8594;</span></a>
        </p>
      `
    },

    hobbies: {
      title: "Hobbies",
      subtitle: "The things that keep me curious when the laptop closes.",
      leftHtml: `
        <p class="eyebrow">After hours</p>
        <h3>A few favorite side quests</h3>
        <ul class="ornament-list">
          <li><strong>[Creative hobby]</strong> &mdash; what you make, collect, practice, or enjoy about it.</li>
          <li><strong>[Outdoor or movement hobby]</strong> &mdash; a favorite route, ritual, or milestone.</li>
          <li><strong>[Community hobby]</strong> &mdash; how you share time or interests with others.</li>
          <li><strong>[Delightfully specific interest]</strong> &mdash; the detail that makes this page unmistakably yours.</li>
        </ul>
        <figure class="image-placeholder" role="img" aria-label="Hobby photo placeholder">
          <span>Photo of a hobby, collection, or recent adventure</span>
        </figure>
      `,
      rightHtml: `
        <p class="eyebrow">Currently enjoying</p>
        <dl class="detail-list">
          <div><dt>Reading</dt><dd>[Book, genre, or subject on your nightstand]</dd></div>
          <div><dt>Listening</dt><dd>[Album, podcast, or oddly specific playlist]</dd></div>
          <div><dt>Making</dt><dd>[Recipe, craft, garden, game, or tiny experiment]</dd></div>
          <div><dt>Learning</dt><dd>[A skill pursued simply because it is interesting]</dd></div>
        </dl>
        <aside class="paper-note">
          <h3>A small joy</h3>
          <p>
            [Share a warm, memorable detail: finding the perfect used book,
            keeping an ambitious houseplant alive, or making tea on a rainy day.]
          </p>
        </aside>
        <blockquote class="paper-quote">
          &ldquo;Good work needs room for play, wonder, and interests that do not
          have to become productive.&rdquo;
        </blockquote>
      `
    },

    contact: {
      title: "Contact",
      subtitle: "Leave a note between the pages.",
      leftHtml: `
        <p class="eyebrow">Let&rsquo;s connect</p>
        <h3>I&rsquo;d be glad to hear from you.</h3>
        <p>
          Reach out about [roles, collaborations, research, freelance projects,
          or shared interests]. A short note with a little context is always welcome.
        </p>
        <address class="contact-list">
          <a href="mailto:hello@example.com"><span>Email</span><strong>hello@example.com</strong></a>
          <a href="https://www.linkedin.com/in/your-handle/" target="_blank" rel="noopener noreferrer">
            <span>LinkedIn</span><strong>linkedin.com/in/your-handle</strong>
          </a>
          <a href="https://github.com/your-handle" target="_blank" rel="noopener noreferrer">
            <span>GitHub</span><strong>github.com/your-handle</strong>
          </a>
        </address>
      `,
      rightHtml: `
        <p class="eyebrow">A good first note</p>
        <h3>No formal introduction required.</h3>
        <p>
          Tell me who you are, what prompted you to reach out, and what you would
          like to talk about. I usually respond within [your typical response window].
        </p>
        <aside class="paper-note">
          <h3>Open to</h3>
          <ul>
            <li>[Full-time roles or internships]</li>
            <li>[Freelance or collaborative projects]</li>
            <li>[Research and speaking opportunities]</li>
            <li>[Friendly conversations with curious people]</li>
          </ul>
        </aside>
        <p class="button-row">
          <a class="book-button" href="mailto:hello@example.com?subject=Hello%20from%20your%20portfolio">Write me a note</a>
        </p>
        <p class="page-footnote">Thank you for wandering through my bookshelf.</p>
      `
    }
  });
}());
