import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

export const generateMetadata = () => researchMetadata("editions");

export default function Page() {
  return <ResearchArticle slug="editions" />;
}
