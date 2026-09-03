import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

export const generateMetadata = () => researchMetadata("platforms");

export default function Page() {
  return <ResearchArticle slug="platforms" />;
}
