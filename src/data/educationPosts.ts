export type EducationPost = {
  title: string;
  category: string;
  format: "Article" | "Video" | "Guide";
  summary: string;
};

export const educationPosts: EducationPost[] = [
  {
    title: "Why Discovery Comes Before Recommendations",
    category: "Preventive Care",
    format: "Article",
    summary:
      "A calm explanation of why MMS starts with context, screening and professional review.",
  },
  {
    title: "Understanding Personalised Longevity",
    category: "Longevity",
    format: "Guide",
    summary:
      "An educational introduction to personalised longevity without exaggerated claims.",
  },
  {
    title: "How HRM Coordination Supports Members",
    category: "Membership",
    format: "Video",
    summary:
      "A future Dr Ling explainer on member coordination, appointment support and follow-up.",
  },
  {
    title: "Questions To Ask Before Starting IV Wellness Support",
    category: "Wellness Support",
    format: "Article",
    summary:
      "A suitability-focused guide for members considering supportive wellness services.",
  },
];
