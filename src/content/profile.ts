interface PublicLink {
  label: string;
  url: string;
}

interface Experience {
  organization: string;
  position: string;
  period: string;
  location?: string;
  summary: string;
  contributions?: string[];
  technologies?: string[];
  projectSlugs?: string[];
}

interface Education {
  institution: string;
  qualification: string;
  period?: string;
  details?: string;
}

interface Profile {
  name?: string;
  initials?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  location?: string;
  portrait?: { path: string; alt: string; width: number; height: number };
  expertise: { title: string; description: string; technologies: string[] }[];
  experience: Experience[];
  education: Education[];
  services: { title: string; description: string; deliverables?: string[] }[];
  socials: PublicLink[];
  email?: string;
  resume?: string;
  contactEndpoint?: string;
  seo: { title: string; description: string; image: string; indexable: boolean };
}

export const profile: Profile = {
  expertise: [],
  experience: [],
  education: [],
  services: [],
  socials: [],
  seo: {
    title: 'Embedded Systems & IoT Portfolio',
    description: 'An engineering portfolio about embedded devices, connected systems, and the journey from sensor data to a usable application.',
    image: 'circuit-board.webp',
    indexable: false
  }
};
