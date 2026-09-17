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
 * ENTRIES — one object per section in the "Contents" index, keyed by
 * the id used in each data-entry="..." attribute in index.html.
 *
 * Two shapes of section, depending on how it should behave when opened:
 *
 *   1) SIMPLE DROPDOWN (about, education, skills, resume, interests,
 *      hobbies, contact) — clicking the row opens it right there on the
 *      page. Shape:
 *        { title, folio, body: Block[] }
 *
 *   2) CARD-GRID SECTION (research, experience, projects) — clicking the
 *      row opens a grid of small cards, two per row; clicking a card
 *      opens a popup with that one entry's full detail. Shape:
 *        { title, folio, intro?: Block[], entries: Entry[] }
 *      where an Entry is:
 *        { heading, meta, bullets, teaser? }
 *      `teaser` is the one-line preview shown on the card; if you leave
 *      it out, the first bullet is used instead.
 *
 * Block types (used in `body` and `intro`):
 *   { type: "paragraph", text }
 *   { type: "image", caption, src }              -> real photo, or a
 *                                                    placeholder until
 *                                                    that file exists
 *   { type: "quote", text }                        -> italic pull-quote
 *   { type: "tags", label, items: [...] }           -> a row of chip tags
 *   { type: "entry", heading, meta, bullets }       -> an inline job/degree
 *                                                       (used by Education,
 *                                                       which stays a plain
 *                                                       dropdown, not cards)
 *   { type: "list", items: [...] }                  -> a plain bullet list
 *   { type: "button", label, href }                 -> a pill link/button
 * -----------------------------------------------------------------------
 */

const SITE_INFO = {
  name: "Ava Romano",
  role: "Student \u00b7 Researcher \u00b7 Human",
  email: "ajromano@calpoly.edu",
  linkedin: "https://www.linkedin.com/in/ava-romano-593b66241/",
  github: "https://github.com/romanoaj",
  header: "Welcome!",
  footer: "See you next time!"
};

const ENTRIES = {

  about: {
    // kicker: "01 \u2014 About",
    // kicker: "get to know me !",
    title: "About Me",
    folio: "\u2014 01 \u2014",
    body: [
      { type: "image", caption: "Portrait photo", src: "assets/images/about-portrait.jpg" },
      { type: "paragraph", text: "Hello! My name is Ava. Thanks for taking the time to visit my page!" },
      { type: "paragraph", text: "I was born and raised in Seattle, Washington (the most beautiful place on Earth). \
        I'm currently in my last year of college at Cal Poly - San Luis Obispo, where I'm double majoring in Computer Science and Geography. \
        People often remark that my two majors seem very different, and in some ways, they are. However, throughout my college experience, I'm \
        continually reminded of how my knowledge of one discipline deepens my understanding of another and gives me unique angles at which to view problems. \
        I am endlessly grateful I've been able to study two topics which I'm so interested in, and have had opportunities to apply my knowledge of both \
        to my research and personal projects." },
      { type: "paragraph", text: "I define myself by my curiosity. I believe in learning for the sake of learning. I aspire to be in roles which let me \
        utilize both my computer science and GIS background, continually push me to grow and ask questions, and involve interdisciplinary team collaboration."}
      // { type: "quote", text: "A short personal motto or line you like goes here." }
    ]
  },

  research: {
    // kicker: "i could talk about this all day !",
    title: "Research",
    folio: "\u2014 02 \u2014",
    intro: [
      { type: "paragraph", text: "At Cal Poly, I've had the opportunity to work on an undergraduate research team which tackles issues \
        that lie in the intersection of Deep Learning and GIS." },
      { type: "tags", label: "Research Interests", items: ["Remote Sensing", "Machine Learning", "Computer Vision", "Wildfire Monitoring", "Environmental Conservation"] }
    ],
    entries: [
      {
        heading: "Soil Burn Severity AI/ML Assessment Map",
        // meta: "Journal / Conference placeholder \u2014 Year",
        teaser: ["A remote-sensing powered machine learning model."],
        bullets: [ 
          "Using Google Earth Engine, we developed a machine learning model which uses optical remote sensing \
          indices, synthetic aperture radar, and environmental, weather, and terrain covariates to predict the soil burn severity of given geographic \
          areas in the wake of wildfire events.",
          "Soil burn severity is a major landslide risk factor, and with wildfires increasing in frequency and intensity each year, it has become increasingly \
          imperative to have accurate soil burn severity measurements so as to better predict which burned areas are most at-risk of landslides.",
          "In addition to landslide implications, modelling soil burn severity is important for monitoring environmental conditions, forest health, and climate change \
          weather patterns."]
      },
      {
        heading: "DamageMap, Web App",
        // meta: "Journal / Conference placeholder \u2014 Year",
        teaser: ["A post-wildfire damage assessment tool."],
        bullets: ["Aided in iterative software development, model refinement, and application deployment of a computer vision machine learning model \
          which employs satellite imagery to identify structures damaged in wildfire events."]
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
        bullets: ["Areas of Interest: Computer Vision, Machine Learning",
          "Relevant Coursework: Data Structures, Systems Programming, Operating Systems, \
          Design and Analysis of Algorithms, Database Management, Software Engineering, \
          Computer Vision."
        ]

      },
      { type: "entry",
        heading: "Bachelor's of Science in Geography and Anthropology \u2014 Cal Poly SLO",
        meta: "2022 \u2013 2027",
        bullets: ["Areas of Interest: GIS, Remote Sensing, Environmental Conservation Research",
          "Relevant Coursework: Intro and Advanced GIS, Biogeography and Biodiversity Methods, \
          Remote Sensing."
        ]
      }
    ]
  },

  experience: {
    // kicker: "applying the skills !",
    title: "Experience",
    folio: "\u2014 04 \u2014",
    entries: [
      {
        heading: "Undergraduate Researcher \u2014 Geoinformatics Lab, Cal Poly",
        meta: "January 2026 \u2013 Present",
        teaser: ["Research with an interdiscipinary team of students, professors, and industry specialists."],
        bullets: [
          "Projects include a soil burn severity AI/ML model, and a post-wildfire damage assessment tool",
          "See the 'Research' section for more details!"
        ]
      },
      {
        heading: "Tech Lead \u2014 Hack4Impact, Cal Poly Chapter",
        meta: "September 2026 \u2013 Present",
        teaser: ["Technical team leadership, project management, and communication support."],
        bullets: [ "Managed a team of 10 developers with my co-lead to drive development of a web-app for a nonprofit.",
          "Hack4Impact is a student organization which pairs nonprofit organizations with student teams who spend a year \
          developing a website for the organization. Each team is 8-10 developers, one product manager, a few UX/UI designers,\
          and two tech leads.",
          "As a tech lead, my output was the team's output. This meant it was my responsibility to keep the team \
          on schedule and in constant communication with one another.",
          "Logistically, this meant holding weekly progress check-in meetings, clarifying technical specs and requirements, \
          performing code review, and approving pull requests.",
          "The role of tech lead is equal parts technical and managerial. So, in addition to all technical tasks listed above, my \
          role was just as much about meeting each person on my team where they're at, understanding how to support them, and \
          learning how to manage a team of varying skill levels so that each developer learns and improves while still producing \
          viable end product.",
          "The part of this role I enjoyed most was working with people and making them feel heard, all while utilizing my \
          technical skills for advising, ensuring clean code, and working towards an end product that would have a real impact \
          on an actual nonprofit organization!"
        ]
      },
      {
        heading: "Remote Sensing Teaching Assistant \u2014 Cal Poly",
        meta: "August 2026 \u2013 Present",
        teaser: ["Assisting students in class with any and all remote sensing-related needs!"],
        bullets: [
          "Helping with satellite data acquisition and processing, answering questions, and advising in-class projects.",
          "Fun fact! Remote sensing is one of my favorite classes I've taken at Cal Poly, so the opportunity to be \
          a TA for it has been very rewarding.",
          "Beyond my interest in the subject itself, I love to be a part of others' learning processes, whatever that \
          may look like. Explaining tricky concepts, brainstorming project ideas, and generally helping others in any way\
          brings me a lot of joy!"
        ]
      },
      {
        heading: "Volunteer Barista \u2014 Front Porch, San Luis Obispo",
        meta: "January 2024 \u2013 July 2025",
        teaser: ["Coffee and chit-chat!"],
        bullets: [ "For the past few years, I've spent one hour each week making coffee, espresso beverages, and tea for \
          visitors of Front Porch, a nonprofit volunteer-based cafe near Cal Poly's campus.",
          "Front Porch has been one of the most valuable community spaces I've been a part of in my time at college. Their mission \
          and values prioritize fostering a safe and welcoming space for students from all backgrounds. I spend countless hours there \
          every week studying, drinking coffee, making coffee, seeing friends, playing music, and more. Its value as a third space and \
          community center is immeasurable to me."
        ]
      },
      {
        heading: "AWS Application Developer \u2014 California Cybersecurity Institute, Cal Poly",
        meta: "September 2025 \u2013 June 2026",
        bullets: [ ""
        ]
      },
      {
        heading: "GIS Intern \u2014 AppliedEarthworks",
        meta: "June 2025 \u2013 September 2025",
        bullets: [ ""
        ]
      },
      {
        heading: "Archaeological Field School \u2014 Edmonds Community College, Washington",
        meta: "June 2025 \u2013 July 2025",
        bullets: [ ""
        ]
      },
       {
        heading: "Usability and Integration eLearning Assistant \u2014 Office of Student Research, Cal Poly",
        meta: "January 2025 \u2013 June 2025",
        bullets: [ ""
        ]
      },
      {
        heading: "LiDar Drone Technician Assistant \u2014 Geospatial Systems Lab, Cal Poly",
        meta: "April 2025 \u2013 June 2025",
        bullets: [ ""
        ]
      },
      {
        heading: "College of Liberal Arts Student Advisory Council Member \u2014 Cal Poly",
        meta: "September 2024 \u2013 June 2025",
        bullets: [ ""
        ]
      },
      {
        heading: "Social Media Manager \u2014 Music Production Union, Cal Poly",
        meta: "September 2023 \u2013 January 2025",
        bullets: [ ""
        ]
      }
    ]
  },

  projects: {
    // kicker: "things i've built !",
    title: "Projects",
    folio: "\u2014 05 \u2014",
    intro: [
      { type: "paragraph", text: "A few things I've built, from class projects to things made just out of curiosity." }
    ],
    entries: [
      {
        heading: "DabaCast | Language Learning Podcast App",
        meta: "Tools used \u2014 2026",
        bullets: [
          "Description goes here.",
          "Description goes here."
        ]
      },
      {
        heading: "Northern Spotted Owl Habitat Assessment",
        meta: "Tools used \u2014 Spring 2026",
        bullets: [
          "Description goes here.",
          "Description goes here."
        ]
      },
      {
        heading: "East Asian-Australasian Flyway Conservation Plan",
        meta: "Tools used \u2014 Spring 2026",
        bullets: [
          "Description goes here."
        ]
      },
      {
        heading: "Soil Burn Severity Variable Importance Analysis",
        meta: "Tools used \u2014 Winter 2026",
        bullets: [
          "Description goes here."
        ]
      },
      {
        heading: "4TheRecord | Mood Tracker and Diary Web App",
        meta: "Tools used \u2014 Fall 2025",
        bullets: [
          "Description goes here."
        ]
      },
      {
        heading: "GeoTIFF Generator",
        meta: "Tools used \u2014 Spring 2025",
        bullets: [
          "Description goes here."
        ]
      },
      {
        heading: "Cal Poly Arboretum Map",
        meta: "Tools used \u2014 Spring 2025",
        bullets: [
          "Description goes here."
        ]
      },
      {
        heading: "Yoshida Family Farmstead Excavation | Archaeological Poster Presentation",
        meta: "Tools used \u2014 Winter 2025",
        bullets: [
          "Description goes here."
        ]
      }
    ]
  },

  skills: {
    // kicker: "05 \u2014 Skills",
    // kicker: "what i've learned !",
    title: "Skills",
    folio: "\u2014 06 \u2014",
    body: [
      // { type: "paragraph", text: "A short line about how you like to work, or what you'd want a hiring manager to know at a glance." },
      { type: "tags", label: "Research & methods", items: ["Placeholder", "Placeholder", "Placeholder"] },
      { type: "tags", label: "Technical", items: ["Placeholder", "Placeholder", "Placeholder", "Placeholder"] },
      { type: "tags", label: "Languages", items: ["Placeholder", "Placeholder"] }
    ]
  },

  resume: {
    // kicker: "06 \u2014 R\u00e9sum\u00e9",
    // kicker: "all in one place ! ",
    title: "Resume",
    folio: "\u2014 07 \u2014",
    body: [
      // { type: "paragraph", text: "The full picture \u2014 education, experience, and skills in one document. Download the PDF below, or reach out for a copy." },
      { type: "button", label: "Download Resume (PDF) \u2193", href: "assets/documents/resume.pdf" },
      { type: "image", caption: "Resume preview thumbnail", src: "assets/images/resume-preview.jpg" }
    ]
  },

  // interests: {
  //   // kicker: "07 \u2014 Interests",
  //   // kicker: "things i'm always excited to talk about !",
  //   title: "Interests",
  //   folio: "\u2014 08 \u2014",
  //   body: [
  //     { type: "paragraph", text: "A few things outside of work that keep showing up in how you think, make, or ask questions." },
  //     { type: "list", items: [
  //       "Placeholder interest one",
  //       "Placeholder interest two",
  //       "Placeholder interest three",
  //       "Placeholder interest four"
  //     ]}
  //   ]
  // },

  hobbies: {
    // kicker: "08 \u2014 Hobbies",
    // kicker: "on a personal note !",
    title: "Hobbies and Interests",
    folio: "\u2014 08 \u2014",
    body: [
      { type: "image", caption: "pic of the plums", src: "assets/images/hobbies-photo.jpg" },
      { type: "list", items: [
        "the plums"
      ]},
      { type: "image", caption: "pic of enamor", src: "assets/images/hobbies-photo.jpg" },
      { type: "list", items: [
        "enamor"
      ]},
      { type: "image", caption: "me outside", src: "assets/images/hobbies-photo.jpg" },
      { type: "list", items: [
        "hiking and stuff"
      ]},
      { type: "image", caption: "something relevant idk", src: "assets/images/hobbies-photo.jpg" },
      { type: "list", items: [
        "being crafty"
      ]}
    ]
  },

  contact: {
    // kicker: "09 \u2014 Contact",
    // kicker: "reach out to me !",
    title: "Contact",
    folio: "\u2014 10 \u2014",
    body: [
    { type: "links", items: [
      { prefix: "Email \u2014 ", text: SITE_INFO.email, href: `mailto:${SITE_INFO.email}` },
      { prefix: "LinkedIn \u2014 ", text: SITE_INFO.linkedin.replace("https://", ""), href: SITE_INFO.linkedin, external: true },
      { prefix: "GitHub \u2014 ", text: SITE_INFO.github.replace("https://", ""), href: SITE_INFO.github, external: true }
    ]}
  ]
  }

};
