import { BlogSection } from '@/sections/blog-section';
import { ContactSection } from '@/sections/contact-section';
import { ExperienceSection } from '@/sections/experience-section';
import { HeroSection } from '@/sections/hero-section';
import { ProjectsSection } from '@/sections/projects-section';

export default function HomePageEn() {
  return (
    <>
      <HeroSection locale="en" />
      <ProjectsSection locale="en" />
      <ExperienceSection locale="en" />
      <BlogSection locale="en" />
      <ContactSection locale="en" />
    </>
  );
}
