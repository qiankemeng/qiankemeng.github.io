import { BlogSection } from '@/sections/blog-section';
import { ContactSection } from '@/sections/contact-section';
import { ExperienceSection } from '@/sections/experience-section';
import { HeroSection } from '@/sections/hero-section';
import { ProjectsSection } from '@/sections/projects-section';
import { ResearchSection } from '@/sections/research-section';

export default function HomePageEn() {
  return (
    <>
      <HeroSection locale="en" />
      <ResearchSection locale="en" />
      <BlogSection locale="en" />
      <ProjectsSection locale="en" />
      <ExperienceSection locale="en" />
      <ContactSection locale="en" />
    </>
  );
}
