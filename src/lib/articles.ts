
export type Article = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    level: string;
    cta: string;
    link: string;
    // SEO fields
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
};

export const articles: Article[] = [
    {
        id: 1,
        title: "Cách chọn trang phục theo dáng người",
        description: "Phân loại cơ bản (V, A, H) và công thức chọn áo/quần tôn dáng.",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
        tags: ["Video", "12:30"],
        level: "Starter",
        cta: "Xem trên Youtube",
        link: "https://www.youtube.com/",
        seoTitle: "Bí quyết chọn đồ theo dáng người",
        seoDescription: "Hướng dẫn chi tiết cách chọn trang phục phù hợp với từng dáng người để tôn lên vẻ đẹp tự nhiên của bạn.",
        seoKeywords: "chọn đồ, dáng người, phối đồ, thời trang"
    },
    {
        id: 2,
        title: "Phối màu cơ bản & nâng cao",
        description: "Bánh xe màu, 60-30-10, tương phản/đồng sắc, tông da.",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
        tags: ["Hướng dẫn video", "Bài viết"],
        level: "~45 phút",
        cta: "Xem trên Youtube",
        link: "https://www.youtube.com/",
        seoTitle: "Học cách phối màu quần áo",
        seoDescription: "Tìm hiểu về bánh xe màu, quy tắc phối màu 60-30-10 và cách kết hợp màu sắc trang phục một cách hài hòa.",
        seoKeywords: "phối màu, quần áo, thời trang, màu sắc"
    },
    {
        id: 3,
        title: "Chăm sóc da & tóc",
        description: "Routine tối giản theo loại da, mẹo chọn sản phẩm giá hợp lý.",
        imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
        tags: ["Bài viết", "Routine 7 bước"],
        level: "Everyday",
        cta: "Xem trên Tiktok",
        link: "https://www.tiktok.com/",
        seoTitle: "Chăm sóc da và tóc đúng cách",
        seoDescription: "Routine chăm sóc da và tóc tối giản nhưng hiệu quả, phù hợp cho mọi loại da.",
        seoKeywords: "chăm sóc da, chăm sóc tóc, skincare, routine"
    },
    {
        id: 4,
        title: "Kỹ năng giao tiếp & tự tin",
        description: "Ngôn ngữ cơ thể, giọng nói, mô hình trả lời & luyện tập.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        tags: ["Hướng dẫn video"],
        level: "Beginner-Intermediate",
        cta: "Xem trên Tiktok",
        link: "https://www.tiktok.com/",
        seoTitle: "Cải thiện kỹ năng giao tiếp và sự tự tin",
        seoDescription: "Học các kỹ năng về ngôn ngữ cơ thể, giọng nói để trở nên tự tin hơn trong giao tiếp hàng ngày.",
        seoKeywords: "giao tiếp, tự tin, kỹ năng mềm"
    }
];
