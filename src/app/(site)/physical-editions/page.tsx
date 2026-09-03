import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";

export const generateMetadata = () => researchMetadata("physical-editions");

export default function Page() {
  return <ResearchArticle slug="physical-editions" />;
}
