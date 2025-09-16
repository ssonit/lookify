'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Eye } from 'lucide-react';
import { useOutfit } from '@/hooks/use-outfits';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

export default function OutfitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const outfitId = params.id as string;
  
  const { outfit, isLoading, error, mutate } = useOutfit(outfitId);



  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Chi tiết Outfit">
          <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </PageTitle>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="flex flex-col gap-5">
        <PageTitle title="Chi tiết Outfit">
          <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </PageTitle>
        
        <div className="text-center py-12">
          <p className="text-red-500">
            {error ? `Lỗi tải dữ liệu: ${error.message}` : 'Không tìm thấy outfit'}
          </p>
          <Button onClick={() => mutate()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={outfit.title}>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/outfits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/dashboard/outfits/${outfitId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        
        </div>
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card>
            <CardContent className="p-0">
              {outfit.image_url ? (
                <AspectRatio ratio={9/10}>
                  <Image
                    src={outfit.image_url}
                    alt={outfit.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </AspectRatio>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <Eye className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {outfit.description && (
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{outfit.description}</p>
              </CardContent>
            </Card>
          )}

          {/* AI Hint */}
          {outfit.ai_hint && (
            <Card>
              <CardHeader>
                <CardTitle>Gợi ý AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{outfit.ai_hint}</p>
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items trong outfit ({outfit.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outfit.items.map((item: any, index: any) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      {item.image_url && (
                        <div className="w-16 h-20 flex-shrink-0">
                          <AspectRatio ratio={4 / 5}>
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="rounded-md object-cover"
                            />
                          </AspectRatio>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.type}</p>
                        
                        {item.affiliate_links.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Shopping links:</p>
                            {item.affiliate_links.map((link: any, linkIndex: any) => (
                              <div key={linkIndex} className="text-sm">
                                <span className="font-medium">{link.store}:</span>{' '}
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {link.url}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Giới tính</p>
                <p>{outfit.gender === 'male' ? 'Nam' : 'Nữ'}</p>
              </div>
              
              {outfit.season && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mùa</p>
                  <p>{outfit.season.label}</p>
                </div>
              )}
              
              {outfit.color && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Màu sắc</p>
                  <p>{outfit.color.label}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <Badge variant={outfit.is_public ? "default" : "secondary"}>
                  {outfit.is_public ? 'Công khai' : 'Riêng tư'}
                </Badge>
              </div>
              
              {outfit.is_ai_generated && (
                <div>
                  <Badge variant="outline">AI Generated</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          {outfit.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Danh mục</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {outfit.categories.map((category: any) => (
                    <Badge key={category.id} variant="outline">
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số lượt lưu</p>
                <p className="text-2xl font-bold">{outfit.saved_count}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p className="text-sm">
                  {new Date(outfit.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p className="text-sm">
                  {new Date(outfit.updated_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
