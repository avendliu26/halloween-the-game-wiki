import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

export const generateMetadata = () => researchMetadata("crossplay");

export default function CrossplayPage() {
  return <ResearchArticle slug="crossplay" />;
}
