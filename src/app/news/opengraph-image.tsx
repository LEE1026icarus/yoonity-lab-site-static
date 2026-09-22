import {
  CATEGORY_OPEN_GRAPH_SIZE,
  createCategoryOpenGraphImage,
} from "@/lib/category-open-graph";

export const alt = "Yoonity Lab 연구실 소식";
export const size = CATEGORY_OPEN_GRAPH_SIZE;
export const contentType = "image/png";

export default function NewsOpenGraphImage() {
  return createCategoryOpenGraphImage({
    label: "NEWS",
    title: "Research & Lab News",
    description: "연구, 교육, 산학협력과 수상 소식",
    accent: "#1668e3",
  });
}
