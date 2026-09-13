import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
export const generateMetadata = () => researchMetadata("challenges-chapter-1");
export default function Page() { return <ResearchArticle slug="challenges-chapter-1" />; }
