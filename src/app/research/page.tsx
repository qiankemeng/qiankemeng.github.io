import type { Metadata } from 'next';
import { ResearchListing } from '@/sections/research-listing';

export const metadata: Metadata = {
  title: '科研成果 | 孟乾轲',
  description: '整理论文、课题与实验记录，集中呈现多模态研究成果。'
};

export default function ResearchPageZh() {
  return <ResearchListing locale="zh" />;
}
