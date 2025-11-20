import type { Metadata } from 'next';
import { ResearchListing } from '@/sections/research-listing';

export const metadata: Metadata = {
  title: 'Research | Meng Qianke',
  description: 'A dedicated space for papers, experiments, and notes on multimodal intelligence.'
};

export default function ResearchPageEn() {
  return <ResearchListing locale="en" />;
}
