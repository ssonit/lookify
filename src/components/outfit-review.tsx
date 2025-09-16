
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useOutfitReviews, useCreateOutfitReview } from '@/hooks/use-outfit-reviews';
import { useToast } from '@/hooks/use-toast';

interface OutfitReviewProps {
  outfitId: string;
}

const MIN_COMMENT_LENGTH = 6;

export function OutfitReview({ outfitId }: OutfitReviewProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { reviews, averageRating, totalCount, isLoading, error, mutate } = useOutfitReviews(outfitId);
    const { createReview } = useCreateOutfitReview();
    const { toast } = useToast();

    const handleSubmitReview = async () => {
        if (rating === 0 || comment.length < MIN_COMMENT_LENGTH) return;
        
        setIsSubmitting(true);
        try {
            await createReview(outfitId, rating, comment);
            setRating(0);
            setComment('');
            mutate(); // Refresh reviews
            
            toast({
                title: "Thành công",
                description: "Đánh giá của bạn đã được gửi!",
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.';
            toast({
                title: "Lỗi",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                        <Star className="w-5 h-5" />
                        Đánh giá & nhận xét
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Đang tải đánh giá...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-headline">
                        <Star className="w-5 h-5" />
                        Đánh giá & nhận xét
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-red-500">Có lỗi xảy ra khi tải đánh giá.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

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
                        <p className="text-sm text-muted-foreground">{totalCount} đánh giá</p>
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
                    <Button 
                        className="w-full" 
                        disabled={rating === 0 || comment.length < MIN_COMMENT_LENGTH || isSubmitting}
                        onClick={handleSubmitReview}
                    >
                        <Send className="mr-2" />
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </Button>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={review.profiles.avatar_url || ''} alt={review.profiles.full_name} />
                                    <AvatarFallback>{review.profiles.full_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.profiles.full_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={cn('w-4 h-4', review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50')} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

    