import { ResearchArticle, researchMetadata } from "@/components/wiki/research-article";
export const generateMetadata = () => researchMetadata("challenges-prologue");
export default function Page() { return <ResearchArticle slug="challenges-prologue" />; }
