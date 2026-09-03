import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

export const generateMetadata = () => researchMetadata("system-requirements");

export default function Page() {
  return <ResearchArticle slug="system-requirements" />;
}
