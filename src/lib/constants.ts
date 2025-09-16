
export const GENDER_OPTIONS = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
];

export const CATEGORY_OPTIONS = [
    { value: 'work/office', label: 'Công sở' },
    { value: 'casual', label: 'Thường ngày' },
    { value: 'party/date', label: 'Tiệc / Hẹn hò' },
    { value: 'sport/active', label: 'Thể thao' },
    { value: 'basic', label: 'Cơ bản' },
    { value: 'streetwear', label: 'Dạo phố' },
    { value: 'elegant', label: 'Thanh lịch' },
    { value: 'sporty', label: 'Năng động' },
];


export const SEASON_OPTIONS = [
    { value: 'spring', label: 'Xuân' },
    { value: 'summer', label: 'Hè' },
    { value: 'autumn', label: 'Thu' },
    { value: 'winter', label: 'Đông' },
];

export const COLOR_OPTIONS = [
    { value: 'black', label: 'Đen', hex: '#0f1117' },
    { value: 'white', label: 'Trắng', hex: '#e5e7eb' },
    { value: 'pastel', label: 'Pastel', hex: '#f3d6e4' },
    { value: 'earth-tone', label: 'Tone đất', hex: '#b9a18e' },
    { value: 'vibrant', label: 'Rực rỡ', hex: '#ff4d4d' },
];

export const BODY_SHAPE_OPTIONS = {
    female: [
        { value: 'hourglass', label: 'Đồng hồ cát' },
        { value: 'pear', label: 'Quả lê (tam giác)' },
        { value: 'apple', label: 'Quả táo (tròn)' },
        { value: 'rectangle', label: 'Chữ nhật' },
        { value: 'inverted-triangle', label: 'Tam giác ngược' },
    ],
    male: [
        { value: 'rectangle', label: 'Chữ nhật' },
        { value: 'oval', label: 'Tròn (bầu dục)' },
        { value: 'triangle', label: 'Tam giác' },
        { value: 'inverted-triangle', label: 'Tam giác ngược' },
        { value: 'trapezoid', label: 'Hình thang' },
    ]
};


// --- MAPS ---
export const SEASON_MAP: Record<string, string> = Object.fromEntries(SEASON_OPTIONS.map(o => [o.value, o.label]));
export const COLOR_MAP: Record<string, { name: string; hex: string }> = Object.fromEntries(COLOR_OPTIONS.map(o => [o.value, { name: o.label, hex: o.hex }]));


// --- GALLERY FILTERS ---
export const GALLERY_FILTERS = {
    category: [
        { value: 'casual', label: 'Đi học' },
        { value: 'party/date', label: 'Đi hẹn hò' },
        { value: 'beach', label: 'Đi biển' },
        { value: 'work/office', label: 'Công sở' },
        { value: 'tet', label: 'Tết' },
        { value: 'game/anime', label: 'Game/Anime' },
        { value: 'elegant', label: 'Thanh lịch' },
        { value: 'streetwear', label: 'Dạo phố' },
    ],
    season: [
        { value: 'spring', label: 'Xuân' },
        { value: 'summer', label: 'Hè' },
        { value: 'autumn', label: 'Thu' },
        { value: 'winter', label: 'Đông' },
    ]
};

export const OUTFIT_IMAGE_LABELS = ['Layer', 'Fabric', 'Fit', 'Footwear', 'Accessory', 'Bag'];
