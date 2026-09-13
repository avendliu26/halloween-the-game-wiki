import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
export const generateMetadata = () => researchMetadata("challenges");
export default function Page() { return <ResearchArticle slug="challenges" />; }
