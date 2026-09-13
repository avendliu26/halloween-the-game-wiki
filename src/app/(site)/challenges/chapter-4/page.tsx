import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
export const generateMetadata = () => researchMetadata("challenges-chapter-4");
export default function Page() { return <ResearchArticle slug="challenges-chapter-4" />; }
