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
  name: "Ava Romano",
  role: "Student \u00b7 Researcher \u00b7 Human",
  email: "ajromano@calpoly.edu",
  linkedin: "https://www.linkedin.com/in/ava-romano-593b66241/",
  github: "https://github.com/romanoaj"
};

const ENTRIES = {

  about: {
    // kicker: "01 \u2014 About",
    // kicker: "get to know me !",
    title: "About Me",
    folio: "\u2014 01 \u2014",
    body: [
      { type: "image", caption: "Portrait photo", src: "assets/images/about-portrait.jpg" },
      { type: "paragraph", text: "Hello!" },
      { type: "paragraph", text: "My name is Ava. I was born and raised in Seattle, Washington (the most beautiful place on Earth). I'm currently a student at Cal Poly - San Luis Obispo, where I'm double majoring in Computer Science and Geography." },
      { type: "paragraph", text: "I define myself by my curiosity. I love to ask questions, broaden my worldview, and make interdisciplinary connections." },
      { type: "paragraph", text: "I often get asked why I'm double majoring in two seemingly very different topics, and the answer is simple -- I really love both. I believe my understanding of topics in one discipline enhances my ability to make connections in another." }
      // { type: "quote", text: "A short personal motto or line you like goes here." }
    ]
  },

  research: {
    // kicker: "i could talk about this all day !",
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
    // kicker: "though learning is a lifelong pursuit !",
    title: "Education",
    folio: "\u2014 03 \u2014",
    body: [
      { type: "entry",
        heading: "Bachelor's of Science in Computer Science \u2014 Cal Poly SLO",
        meta: "2022 \u2013 2027",
        bullets: ["Areas of Interest: Computer Vision, Machine Learning"]
        
      },
      { type: "entry",
        heading: "Bachelor's of Science in Geography and Anthropology \u2014 Cal Poly SLO",
        meta: "2022 \u2013 2027",
        bullets: ["Areas of Interest: GIS, Remote Sensing, Environmental Conservation Research"]
      }
    ]
  },

  experience: {
    // kicker: "applying the skills !",
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
    // kicker: "05 \u2014 Skills",
    // kicker: "what i've learned !",
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
    // kicker: "06 \u2014 R\u00e9sum\u00e9",
    // kicker: "all in one place ! ",
    title: "R\u00e9sum\u00e9",
    folio: "\u2014 06 \u2014",
    body: [
      { type: "paragraph", text: "The full picture \u2014 education, experience, and skills in one document. Download the PDF below, or reach out for a copy." },
      { type: "button", label: "Download R\u00e9sum\u00e9 (PDF) \u2193", href: "assets/documents/resume.pdf" },
      { type: "image", caption: "R\u00e9sum\u00e9 preview thumbnail", src: "assets/images/resume-preview.jpg" }
    ]
  },

  interests: {
    // kicker: "07 \u2014 Interests",
    // kicker: "things i'm always excited to talk about !",
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
    // kicker: "08 \u2014 Hobbies",
    // kicker: "on a personal note !",
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
    // kicker: "09 \u2014 Contact",
    // kicker: "reach out to me !",
    title: "Contact",
    folio: "\u2014 09 \u2014",
    body: [
      { type: "list", items: [
        `Email \u2014 ${SITE_INFO.email}`,
        `LinkedIn \u2014 ${SITE_INFO.linkedin.replace("https://", "")}`,
        `GitHub \u2014 ${SITE_INFO.github.replace("https://", "")}`,
        `Location \u2014 ${SITE_INFO.location}`
      ]}
    ]
  }

};
