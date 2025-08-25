
'use client';
import { LayoutDashboard, Settings, ShoppingBag } from "lucide-react";

export const GENDER_OPTIONS = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
];

export const CATEGORY_OPTIONS = [
    { value: 'work/office', label: 'Công sở' },
    { value: 'casual', label: 'Thường ngày' },
    { value: 'party/date', label: 'Tiệc / Hẹn hò' },
    { value: 'sport/active', label: 'Thể thao' },
    { value: 'tet', label: 'Tết' },
    { value: 'game-anime', label: 'Game/Anime' },
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

// --- MAPS ---
export const CATEGORY_MAP = Object.fromEntries(CATEGORY_OPTIONS.map(o => [o.value, o.label])) as Record<string, string>;
export const SEASON_MAP = Object.fromEntries(SEASON_OPTIONS.map(o => [o.value, o.label])) as Record<string, string>;
export const COLOR_MAP = Object.fromEntries(COLOR_OPTIONS.map(o => [o.value, { name: o.label, hex: o.hex }])) as Record<string, { name: string; hex: string }>;


// --- GALLERY FILTERS ---
export const GALLERY_FILTERS = {
    category: [
        { value: 'casual', label: 'Đi học' },
        { value: 'party/date', label: 'Đi hẹn hò' },
        { value: 'casual', label: 'Đi biển' }, // Note: This needs season combo
        { value: 'work/office', label: 'Công sở' },
        { value: 'tet', label: 'Tết' },
        { value: 'game-anime', label: 'Game/Anime' },
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

// --- NAVIGATION ---
export const DASHBOARD_NAV_ITEMS = [
    {
        label: 'Tổng quan',
        href: '/dashboard',
        icon: <LayoutDashboard />,
    },
    {
        label: 'Outfits',
        href: '/dashboard/outfits',
        icon: <ShoppingBag />,
    },
    {
        label: 'Cài đặt',
        href: '/dashboard/settings',
        icon: <Settings />,
    },
];

export const OUTFIT_IMAGE_LABELS = ['Layer', 'Fabric', 'Fit', 'Footwear', 'Accessory', 'Bag'];

