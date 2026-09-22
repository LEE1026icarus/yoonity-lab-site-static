import {
  CATEGORY_OPEN_GRAPH_SIZE,
  createCategoryOpenGraphImage,
} from "@/lib/category-open-graph";

export const alt = "Yoonity Lab 연구과제";
export const size = CATEGORY_OPEN_GRAPH_SIZE;
export const contentType = "image/png";

export default function ProjectsOpenGraphImage() {
  return createCategoryOpenGraphImage({
    label: "PROJECTS",
    title: "Research Projects",
    description: "산업 문제를 연구로 전환하고 현장에서 검증합니다",
    accent: "#a238c5",
  });
}
