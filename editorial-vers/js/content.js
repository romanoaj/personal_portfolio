/**
 * content.js
 * -----------------------------------------------------------------------
 * Every word on this site lives here, separate from layout (index.html)
 * and interaction (main.js). This is almost the only file you need to
 * edit to make the site yours.
 *
 * SITE_INFO — name, tagline, and contact links used in the header,
 * hero, and footer.
 *
 * ENTRIES — one object per popup, keyed by the id used in each
 * data-entry="..." attribute in index.html. Each entry has:
 *   kicker : string   — small label at the top, e.g. "01 — About"
 *   title  : string   — big italic heading
 *   folio  : string   — small page-number-style detail at the bottom
 *   body   : Block[]  — an ordered list of content blocks, rendered
 *                        top to bottom. Supported block types:
 *
 *   { type: "paragraph", text }
 *   { type: "image", caption }                 -> placeholder box
 *   { type: "quote", text }                     -> italic pull-quote
 *   { type: "tags", label, items: [...] }       -> a row of chip tags
 *   { type: "entry", heading, meta, bullets }   -> a job/degree/project
 *   { type: "list", items: [...] }              -> a plain bullet list
 *   { type: "button", label, href }             -> a pill link/button
 * -----------------------------------------------------------------------
 */

const SITE_INFO = {
  name: "Your Name",
  role: "Researcher \u00b7 Writer \u00b7 Designer",
  email: "hello@example.com",
  linkedin: "https://linkedin.com/in/yourname",
  github: "https://github.com/yourusername",
  location: "City, State \u2014 placeholder"
};

const ENTRIES = {

  about: {
    kicker: "01 \u2014 About",
    title: "About Me",
    folio: "\u2014 01 \u2014",
    body: [
      { type: "image", caption: "Portrait photo", src: "assets/images/about-portrait.jpg" },
      { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, a couple of sentences about who you are and what you care about." },
      { type: "paragraph", text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat \u2014 a little more on your path, your approach, or what led you here." },
      { type: "quote", text: "A short personal motto or line you like goes here." }
    ]
  },

  research: {
    kicker: "02 \u2014 Research",
    title: "Research",
    folio: "\u2014 02 \u2014",
    body: [
      { type: "paragraph", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit \u2014 a short introduction to your research interests and the questions you find yourself drawn to." },
      { type: "tags", label: "Areas of interest", items: ["Placeholder area", "Placeholder area", "Placeholder area", "Placeholder area"] },
      { type: "entry",
        heading: "Publication or Project Title",
        meta: "Journal / Conference placeholder \u2014 Year",
        bullets: ["Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."]
      },
      { type: "entry",
        heading: "Publication or Project Title",
        meta: "Journal / Conference placeholder \u2014 Year",
        bullets: ["Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."]
      }
    ]
  },

  education: {
    kicker: "03 \u2014 Education",
    title: "Education",
    folio: "\u2014 03 \u2014",
    body: [
      { type: "entry",
        heading: "Degree Name \u2014 Institution",
        meta: "Year \u2013 Year",
        bullets: ["Relevant coursework or focus area, placeholder.", "Honors, thesis title, or activities, placeholder."]
      },
      { type: "entry",
        heading: "Degree Name \u2014 Institution",
        meta: "Year \u2013 Year",
        bullets: ["Relevant coursework or focus area, placeholder."]
      }
    ]
  },

  experience: {
    kicker: "04 \u2014 Experience",
    title: "Experience",
    folio: "\u2014 04 \u2014",
    body: [
      { type: "entry",
        heading: "Job Title \u2014 Organization",
        meta: "Month Year \u2013 Present",
        bullets: [
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
        ]
      },
      { type: "entry",
        heading: "Job Title \u2014 Organization",
        meta: "Month Year \u2013 Month Year",
        bullets: [
          "Curabitur pretium tincidunt lacus, at velit vehicula bibendum eget nunc."
        ]
      }
    ]
  },

  skills: {
    kicker: "05 \u2014 Skills",
    title: "Skills",
    folio: "\u2014 05 \u2014",
    body: [
      { type: "paragraph", text: "A short line about how you like to work, or what you'd want a hiring manager to know at a glance." },
      { type: "tags", label: "Research & methods", items: ["Placeholder", "Placeholder", "Placeholder"] },
      { type: "tags", label: "Technical", items: ["Placeholder", "Placeholder", "Placeholder", "Placeholder"] },
      { type: "tags", label: "Languages", items: ["Placeholder", "Placeholder"] }
    ]
  },

  resume: {
    kicker: "06 \u2014 R\u00e9sum\u00e9",
    title: "R\u00e9sum\u00e9",
    folio: "\u2014 06 \u2014",
    body: [
      { type: "paragraph", text: "The full picture \u2014 education, experience, and skills in one document. Download the PDF below, or reach out for a copy." },
      { type: "button", label: "Download R\u00e9sum\u00e9 (PDF) \u2193", href: "assets/documents/resume.pdf" },
      { type: "image", caption: "R\u00e9sum\u00e9 preview thumbnail", src: "assets/images/resume-preview.jpg" }
    ]
  },

  interests: {
    kicker: "07 \u2014 Interests",
    title: "Interests",
    folio: "\u2014 07 \u2014",
    body: [
      { type: "paragraph", text: "A few things outside of work that keep showing up in how you think, make, or ask questions." },
      { type: "list", items: [
        "Placeholder interest one",
        "Placeholder interest two",
        "Placeholder interest three",
        "Placeholder interest four"
      ]}
    ]
  },

  hobbies: {
    kicker: "08 \u2014 Hobbies",
    title: "Hobbies",
    folio: "\u2014 08 \u2014",
    body: [
      { type: "image", caption: "A candid, non-professional photo", src: "assets/images/hobbies-photo.jpg" },
      { type: "list", items: [
        "Placeholder hobby one",
        "Placeholder hobby two",
        "Placeholder hobby three",
        "Placeholder hobby four"
      ]}
    ]
  },

  contact: {
    kicker: "09 \u2014 Contact",
    title: "Get in Touch",
    folio: "\u2014 09 \u2014",
    body: [
      { type: "paragraph", text: "Feel free to reach out \u2014 I'd love to hear from you." },
      { type: "list", items: [
        `Email \u2014 ${SITE_INFO.email}`,
        `LinkedIn \u2014 ${SITE_INFO.linkedin.replace("https://", "")}`,
        `GitHub \u2014 ${SITE_INFO.github.replace("https://", "")}`,
        `Location \u2014 ${SITE_INFO.location}`
      ]}
    ]
  }

};
