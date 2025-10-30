import { BlogSection } from '@/sections/blog-section';
import { ContactSection } from '@/sections/contact-section';
import { ExperienceSection } from '@/sections/experience-section';
import { HeroSection } from '@/sections/hero-section';
import { ProjectsSection } from '@/sections/projects-section';

export default function HomePage() {
  return (
    <>
      <HeroSection locale="zh" />
      <ProjectsSection locale="zh" />
      <ExperienceSection locale="zh" />
      <BlogSection locale="zh" />
      <ContactSection locale="zh" />
    </>
  );
}
