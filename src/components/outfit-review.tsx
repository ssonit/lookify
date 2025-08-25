
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Star, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

const mockReviews = [
    {
        id: 1,
        user: { name: 'Mai Linh', avatar: 'https://placehold.co/40x40.png' },
        rating: 5,
        comment: 'Outfit này phối đỉnh thật sự, mặc lên auto sang chảnh. Chất vải của áo khoác rất xịn.',
        date: '2024-07-20',
    },
    {
        id: 2,
        user: { name: 'Trần An', avatar: '' },
        rating: 4,
        comment: 'Khá ổn, nhưng quần hơi dài so với mình (m7). Bù lại áo thun chất mát, thấm hút mồ hôi tốt. Sẽ ủng hộ tiếp.',
        date: '2024-07-18',
    },
];


export function OutfitReview() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const averageRating = (mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length).toFixed(1);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <Star className="w-5 h-5" />
                    Đánh giá & nhận xét
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{averageRating}</span>
                        <span className="text-muted-foreground">/ 5</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        'w-5 h-5',
                                        Number(averageRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{mockReviews.length} đánh giá</p>
                    </div>
                </div>

                {/* Review Form */}
                <div className="border rounded-lg p-4 mb-6">
                    <div className="mb-2">
                        <p className="text-sm font-medium mb-2">Chọn số sao</p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                                    <Star className={cn('w-6 h-6 transition-colors', (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-2">
                        <p className="text-sm font-medium mb-2">Nhận xét của bạn</p>
                        <Textarea
                            placeholder="Chia sẻ trải nghiệm phối đồ, chất liệu, phom dáng..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={280}
                        />
                         <p className="text-xs text-muted-foreground text-right mt-1">{comment.length}/280</p>
                    </div>
                    <Button className="w-full" disabled={rating === 0 || comment.length < 10}>
                        <Send className="mr-2" />
                        Gửi đánh giá
                    </Button>
                </div>


                {/* Reviews List */}
                <div className="space-y-6">
                    {mockReviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                            <Avatar>
                                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                     <p className="font-semibold">{review.user.name}</p>
                                     <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="flex items-center mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={cn('w-4 h-4', review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50')} />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

    