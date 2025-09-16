'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Sparkles, 
  Eye, 
  Trash2, 
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAISuggestions, useDeleteAISuggestion } from '@/hooks/use-ai-suggestions';
import type { AISuggestion } from '@/types/database';

interface AISuggestionsListProps {
  className?: string;
}

export function AISuggestionsList({ className }: AISuggestionsListProps) {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'failed' | 'processing' | 'all'>('all');
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();
  const { deleteAISuggestion } = useDeleteAISuggestion();

  const { suggestions, totalCount, isLoading, error, mutate } = useAISuggestions({
    gender: selectedGender === 'all' ? undefined : selectedGender,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    season: selectedSeason === 'all' ? undefined : selectedSeason as any,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    limit: 20
  });

  const handleViewSuggestion = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsDetailOpen(true);
  };

  const handleDeleteSuggestion = async (id: number) => {
    try {
      await deleteAISuggestion(id);
      await mutate();
      toast({
        title: "Thành công",
        description: "Đã xóa gợi ý",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa gợi ý",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: AISuggestion['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: AISuggestion['status']) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'failed':
        return 'Thất bại';
      case 'processing':
        return 'Đang xử lý';
      default:
        return status;
    }
  };

  const getStatusColor = (status: AISuggestion['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderLabel = (gender: AISuggestion['gender']) => {
    return gender === 'male' ? 'Nam' : 'Nữ';
  };

  const getSeasonLabel = (season: AISuggestion['season']) => {
    const labels = {
      spring: 'Xuân',
      summer: 'Hè',
      autumn: 'Thu',
      winter: 'Đông'
    };
    return labels[season];
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-destructive">Lỗi tải dữ liệu: {error.message}</p>
            <Button onClick={() => mutate()} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Gợi ý AI của bạn
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button variant="outline" size="sm" onClick={() => mutate()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalCount} gợi ý AI đã tạo
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Select value={selectedGender} onValueChange={(value: 'male' | 'female' | 'all') => setSelectedGender(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Party">Party</SelectItem>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Date">Date</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Workout">Workout</SelectItem>
                <SelectItem value="Streetwear">Streetwear</SelectItem>
                <SelectItem value="Vintage">Vintage</SelectItem>
                <SelectItem value="Bohemian">Bohemian</SelectItem>
                <SelectItem value="Minimalist">Minimalist</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Mùa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="spring">Xuân</SelectItem>
                <SelectItem value="summer">Hè</SelectItem>
                <SelectItem value="autumn">Thu</SelectItem>
                <SelectItem value="winter">Đông</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={(value: 'completed' | 'failed' | 'processing' | 'all') => setSelectedStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có gợi ý nào</h3>
                <p className="text-muted-foreground">
                  Tạo gợi ý AI đầu tiên của bạn để bắt đầu
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(suggestion.status)}>
                              {getStatusIcon(suggestion.status)}
                              <span className="ml-1">{getStatusLabel(suggestion.status)}</span>
                            </Badge>
                            <Badge variant="outline">
                              {getGenderLabel(suggestion.gender)}
                            </Badge>
                            <Badge variant="outline">
                              {suggestion.category}
                            </Badge>
                            <Badge variant="outline">
                              {getSeasonLabel(suggestion.season)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            {suggestion.color_preference && (
                              <p><span className="font-medium">Màu sắc:</span> {suggestion.color_preference}</p>
                            )}
                            {suggestion.mood && (
                              <p><span className="font-medium">Tâm trạng:</span> {suggestion.mood}</p>
                            )}
                            {suggestion.image_prompt && (
                              <p className="line-clamp-1"><span className="font-medium">Prompt:</span> {suggestion.image_prompt}</p>
                            )}
                          </div>

                          {/* AI Generated Image Preview */}
                          {suggestion.image_url && (
                            <div className="mt-3">
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                <Image
                                  src={suggestion.image_url}
                                  alt="AI Generated Outfit"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(suggestion.created_at).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSuggestion(suggestion)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSuggestion(suggestion.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Suggestion Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Chi tiết gợi ý AI
            </DialogTitle>
          </DialogHeader>
          {selectedSuggestion && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Giới tính:</span>
                      <span className="ml-2">{getGenderLabel(selectedSuggestion.gender)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Danh mục:</span>
                      <span className="ml-2">{selectedSuggestion.category}</span>
                    </div>
                    <div>
                      <span className="font-medium">Mùa:</span>
                      <span className="ml-2">{getSeasonLabel(selectedSuggestion.season)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedSuggestion.status)}`}>
                        {getStatusIcon(selectedSuggestion.status)}
                        <span className="ml-1">{getStatusLabel(selectedSuggestion.status)}</span>
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Ngày tạo:</span>
                      <span className="ml-2">{new Date(selectedSuggestion.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                {(selectedSuggestion.color_preference || selectedSuggestion.mood) && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Sở thích</h3>
                    <div className="space-y-1 text-sm">
                      {selectedSuggestion.color_preference && (
                        <p><span className="font-medium">Màu sắc yêu thích:</span> {selectedSuggestion.color_preference}</p>
                      )}
                      {selectedSuggestion.mood && (
                        <p><span className="font-medium">Tâm trạng:</span> {selectedSuggestion.mood}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Output */}
                {(selectedSuggestion.image_url || selectedSuggestion.image_prompt) && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Kết quả AI</h3>
                    {selectedSuggestion.image_url && (
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Hình ảnh được tạo:</p>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                          <Image
                            src={selectedSuggestion.image_url}
                            alt="AI Generated Image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {selectedSuggestion.image_prompt && (
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Prompt đã sử dụng:</p>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{selectedSuggestion.image_prompt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
