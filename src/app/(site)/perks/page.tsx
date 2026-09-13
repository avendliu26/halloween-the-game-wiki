import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
export const generateMetadata = () => researchMetadata("perks");
export default function Page() { return <ResearchArticle slug="perks" />; }
