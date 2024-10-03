// This is your config file, place any global data here.
// You can import this data from anywhere in your site by using the `import` keyword.

type Config = {
  title: string;
  description: string;
  lang: string;
  profile: {
    author: string;
    description?: string;
  }
}

type SocialLink = {
  icon: string;
  friendlyName: string; // for accessibility
  link: string;
}

export const siteConfig: Config = {
  title: "Astro Theme Cody",
  description: "",
  lang: "ko",
  profile: {
    author: "Amy Dang",
    description: "your bio description"
  }
}

/** 
  These are you social media links. 
  It uses https://github.com/natemoo-re/astro-icon#readme
  You can find icons @ https://icones.js.org/
*/
export const socialLinks: Array<SocialLink> = [
  {
    icon: "mdi:github",
    friendlyName: "Github",
    link: "https://github.com/lshtar13/",
  },
  {
    icon: "mdi:email",
    friendlyName: "email",
    link: "mailto:edwin109802@gmail.com",
  },
  {
    icon: "mdi:rss",
    friendlyName: "rss",
    link: "/rss.xml"
  }
];

export const NAV_LINKS: Array<{ title: string, path: string }> = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  { title: "Blog",
    path: "/blog",
  },
  { title: "Tags",
    path: "/tags",
  },
  { title: "Series",
    path: "/series",
  },
  // {
  //   title: "Projects",
  //   path: '/projects'
  // },
  // {
  //   title: "Archive",
  //   path: '/archive'
  // }
];
