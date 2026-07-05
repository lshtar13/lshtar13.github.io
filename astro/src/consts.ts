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
  friendlyName: string; // for accessibility
  link: string;
}

export const siteConfig: Config = {
  title: "Stunning Garbanzo",
  description: "백엔드, 운영체제, 알고리즘과 직접 만들며 배운 것들을 기록하는 개발 블로그입니다.",
  lang: "ko",
  profile: {
    author: "Haesung Lee",
    description: "Backend & Systems Engineer"
  }
}

/** Social links rendered as text in SocialMediaLinks. */
export const socialLinks: Array<SocialLink> = [
  {
    friendlyName: "GitHub",
    link: "https://github.com/lshtar13/",
  },
  {
    friendlyName: "LinkedIn",
    link: "https://www.linkedin.com/in/leehaesung",
  },
  {
    friendlyName: "Email",
    link: "mailto:edwin109802@gmail.com",
  },
  {
    friendlyName: "RSS",
    link: "/rss.xml"
  }
];

export const NAV_LINKS: Array<{ title: string, path: string }> = [
  {
    title: "Writing",
    path: "/blog",
  },
  {
    title: "About",
    path: "/about",
  },
];
