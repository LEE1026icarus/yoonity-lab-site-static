import {
  CATEGORY_OPEN_GRAPH_SIZE,
  createCategoryOpenGraphImage,
} from "@/lib/category-open-graph";

export const alt = "Yoonity Lab 논문·도서·특허";
export const size = CATEGORY_OPEN_GRAPH_SIZE;
export const contentType = "image/png";

export default function PublicationsOpenGraphImage() {
  return createCategoryOpenGraphImage({
    label: "PUBLICATIONS",
    title: "Publications & IP",
    description: "논문, 도서와 특허로 축적한 연구성과",
    accent: "#d25827",
  });
}
