
export type User = {
    id: number;
    name: string;
    email: string;
    gender: 'male' | 'female';
    user_role: 'admin' | 'user';
    avatar: string;
    createdAt: string;
    lastActivity: string;
    status: 'active' | 'locked';
}

export const users: User[] = [
    { id: 1, name: 'An Trần', email: 'an.tran@example.com', gender: 'male', user_role: 'admin', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-01-15T10:00:00Z', lastActivity: '2024-07-21T14:30:00Z', status: 'active' },
    { id: 2, name: 'Bảo Ngọc', email: 'bao.ngoc@example.com', gender: 'female', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-02-20T11:30:00Z', lastActivity: '2024-07-20T09:00:00Z', status: 'active' },
    { id: 3, name: 'Chí Dũng', email: 'chi.dung@example.com', gender: 'male', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-03-10T08:45:00Z', lastActivity: '2024-06-15T18:00:00Z', status: 'locked' },
    { id: 4, name: 'Diệu Huyền', email: 'dieu.huyen@example.com', gender: 'female', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-04-05T16:20:00Z', lastActivity: '2024-07-22T08:15:00Z', status: 'active' },
    { id: 5, name: 'Minh Long', email: 'minh.long@example.com', gender: 'male', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-05-12T13:00:00Z', lastActivity: '2024-07-19T22:00:00Z', status: 'active' },
    { id: 6, name: 'Khánh An', email: 'khanh.an@example.com', gender: 'female', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-06-18T09:10:00Z', lastActivity: '2024-07-18T11:45:00Z', status: 'active' },
    { id: 7, name: 'Gia Huy', email: 'gia.huy@example.com', gender: 'male', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-07-25T18:00:00Z', lastActivity: '2024-07-01T12:00:00Z', status: 'locked' },
    { id: 8, name: 'Hà My', email: 'ha.my@example.com', gender: 'female', user_role: 'admin', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-08-30T22:00:00Z', lastActivity: '2024-07-21T16:00:00Z', status: 'active' },
    { id: 9, name: 'Quang Khải', email: 'quang.khai@example.com', gender: 'male', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-09-11T14:50:00Z', lastActivity: '2024-07-22T10:30:00Z', status: 'active' },
    { id: 10, name: 'Linh Chi', email: 'linh.chi@example.com', gender: 'female', user_role: 'user', avatar: 'https://placehold.co/40x40.png', createdAt: '2023-10-02T07:00:00Z', lastActivity: '2024-07-20T15:20:00Z', status: 'active' },
];
