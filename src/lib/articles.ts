
export type Article = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    level: string;
    cta: string;
    link: string;
};

export const articles: Article[] = [
    {
        id: 1,
        title: "Cách chọn trang phục theo dáng người",
        description: "Phân loại cơ bản (V, A, H) và công thức chọn áo/quần tôn dáng.",
        imageUrl: "https://images.unsplash.com/photo-1551028487-5c7a40c6ab63?w=800&q=80",
        tags: ["Video", "12:30"],
        level: "Starter",
        cta: "Xem trên Youtube",
        link: "https://www.youtube.com/"
    },
    {
        id: 2,
        title: "Phối màu cơ bản & nâng cao",
        description: "Bánh xe màu, 60-30-10, tương phản/đồng sắc, tông da.",
        imageUrl: "https://images.unsplash.com/photo-1593693397640-03208c02d740?w=800&q=80",
        tags: ["Hướng dẫn video", "Bài viết"],
        level: "~45 phút",
        cta: "Xem trên Youtube",
        link: "https://www.youtube.com/"
    },
    {
        id: 3,
        title: "Chăm sóc da & tóc",
        description: "Routine tối giản theo loại da, mẹo chọn sản phẩm giá hợp lý.",
        imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
        tags: ["Bài viết", "Routine 7 bước"],
        level: "Everyday",
        cta: "Xem trên Tiktok",
        link: "https://www.tiktok.com/"
    },
    {
        id: 4,
        title: "Kỹ năng giao tiếp & tự tin",
        description: "Ngôn ngữ cơ thể, giọng nói, mô hình trả lời & luyện tập.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        tags: ["Hướng dẫn video"],
        level: "Beginner-Intermediate",
        cta: "Xem trên Tiktok",
        link: "https://www.tiktok.com/"
    }
];
