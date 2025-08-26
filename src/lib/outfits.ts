
export type Outfit = {
  id: number;
  gender: 'male' | 'female';
  categories: ('work/office' | 'casual' | 'party/date' | 'sport/active' | 'tet' | 'game-anime' | 'basic' | 'streetwear' | 'elegant' | 'sporty' | 'beach')[];
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  color: 'black' | 'white' | 'pastel' | 'earth-tone' | 'vibrant';
  mainImage: string;
  imageSourceText?: string;
  imageSourceUrl?: string;
  title: string;
  description: string;
  aiHint: string;
  items: {
    name: string;
    type: string;
    imageUrl: string;
    shoppingLinks: { store: string; url: string }[];
  }[];
};

export const outfits: Outfit[] = [
  {
    id: 1,
    gender: 'male',
    categories: ['elegant', 'work/office'],
    season: 'autumn',
    color: 'earth-tone',
    mainImage: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
    imageSourceText: 'Unsplash',
    imageSourceUrl: 'https://unsplash.com/photos/man-wearing-black-suit-jacket-1503341455253-b2e723bb3dbb',
    title: 'Bộ suit nam thanh lịch cho môi trường công sở.',
    description:
      'Trang phục công sở nam với bộ suit màu earth-tone, áo sơ mi trắng, cà vạt tối màu và giày da. Phù hợp cho mùa thu và các buổi họp quan trọng.',
    aiHint: 'Suggest formal office outfits for men in autumn with earth-tone colors.',
    items: [
      {
        name: 'Áo vest earth-tone',
        type: 'top',
        imageUrl: 'https://images.unsplash.com/photo-1520975918318-3f6c8cbdc79e?auto=format&fit=crop&w=400&q=80',
        shoppingLinks: [
          { store: 'Zara', url: 'https://www.zara.com/' },
          { store: 'Uniqlo', url: 'https://www.uniqlo.com/' },
        ],
      },
      {
        name: 'Áo sơ mi trắng',
        type: 'top',
        imageUrl: 'https://images.unsplash.com/photo-1520975434759-16c0d3c0ee2c?auto=format&fit=crop&w=400&q=80',
        shoppingLinks: [{ store: 'H&M', url: 'https://www.hm.com/' }],
      },
      {
        name: 'Quần tây đồng bộ',
        type: 'bottom',
        imageUrl: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=400&q=80',
        shoppingLinks: [{ store: 'Topman', url: 'https://www.topman.com/' }],
      },
      {
        name: 'Giày da đen',
        type: 'shoes',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
        shoppingLinks: [{ store: 'Clarks', url: 'https://www.clarks.com/' }],
      },
    ],
  },
  {
    id: 2,
    gender: 'female',
    categories: ['streetwear', 'casual'],
    season: 'summer',
    color: 'pastel',
    mainImage: 'https://picsum.photos/seed/outfit-2-main/400/500',
    imageSourceText: 'Placeholder',
    imageSourceUrl: 'https://picsum.photos',
    title: 'Trang phục streetwear nữ pastel cho mùa hè.',
    description:
      'Bộ outfit gồm áo phông oversize pastel kết hợp với quần short jean năng động, giày sneaker trắng và phụ kiện trẻ trung. Phù hợp cho dạo phố hoặc đi chơi cùng bạn bè.',
    aiHint: 'Suggest pastel casual summer outfits with oversized tee and shorts.',
    items: [
      {
        name: 'Áo phông pastel',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-2-item-1/200/200',
        shoppingLinks: [
          { store: 'Zara', url: 'https://www.zara.com/' },
          { store: 'H&M', url: 'https://www.hm.com/' },
        ],
      },
      {
        name: 'Quần short jean',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-2-item-2/200/200',
        shoppingLinks: [{ store: 'Levis', url: 'https://www.levi.com/' }],
      },
      {
        name: 'Giày sneaker trắng',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-2-item-3/200/200',
        shoppingLinks: [
          { store: 'Nike', url: 'https://www.nike.com/' },
          { store: 'Adidas', url: 'https://www.adidas.com/' },
        ],
      },
      {
        name: 'Túi đeo chéo nhỏ',
        type: 'accessory',
        imageUrl: 'https://picsum.photos/seed/outfit-2-item-4/200/200',
        shoppingLinks: [{ store: 'Charles & Keith', url: 'https://www.charleskeith.com/' }],
      },
    ],
  },
  {
    id: 3,
    gender: 'male',
    categories: ['party/date'],
    season: 'summer',
    color: 'vibrant',
    mainImage: 'https://picsum.photos/seed/outfit-3-main/400/500',
    title: 'Outfit nam đơn giản nhưng nổi bật cho buổi hẹn hò.',
    description:
      'Áo sơ mi ngắn tay màu sắc tươi sáng kết hợp quần kaki sáng màu và giày lười. Thêm phụ kiện đồng hồ để tạo điểm nhấn lịch lãm.',
    aiHint: 'Suggest vibrant men outfits for summer date nights.',
    items: [
      {
        name: 'Áo sơ mi ngắn tay',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-3-item-1/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Quần kaki sáng màu',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-3-item-2/200/200',
        shoppingLinks: [{ store: 'Dockers', url: 'https://www.dockers.com/' }],
      },
      {
        name: 'Giày lười da nâu',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-3-item-3/200/200',
        shoppingLinks: [{ store: 'Aldo', url: 'https://www.aldoshoes.com/' }],
      },
    ],
  },
  {
    id: 4,
    gender: 'female',
    categories: ['party/date', 'elegant'],
    season: 'spring',
    color: 'pastel',
    mainImage: 'https://picsum.photos/seed/outfit-4-main/400/500',
    title: 'Váy pastel nữ tính cho buổi hẹn mùa xuân.',
    description:
      'Chiếc váy midi pastel nhẹ nhàng kết hợp giày cao gót nude và túi xách nhỏ xinh. Phù hợp với buổi hẹn hò hoặc tiệc thân mật.',
    aiHint: 'Suggest elegant pastel dresses for spring parties or dates.',
    items: [
      {
        name: 'Váy midi pastel',
        type: 'dress',
        imageUrl: 'https://picsum.photos/seed/outfit-4-item-1/200/200',
        shoppingLinks: [{ store: 'Mango', url: 'https://shop.mango.com/' }],
      },
      {
        name: 'Giày cao gót nude',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-4-item-2/200/200',
        shoppingLinks: [{ store: 'Nine West', url: 'https://www.ninewest.com/' }],
      },
      {
        name: 'Túi xách nhỏ',
        type: 'accessory',
        imageUrl: 'https://picsum.photos/seed/outfit-4-item-3/200/200',
        shoppingLinks: [{ store: 'Michael Kors', url: 'https://www.michaelkors.com/' }],
      },
    ],
  },
  {
    id: 5,
    gender: 'male',
    categories: ['sport/active', 'sporty'],
    season: 'summer',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-5-main/400/500',
    title: 'Đồ tập gym nam mạnh mẽ và năng động.',
    description:
      'Áo tank top đen, quần short thể thao và giày chạy bộ thoáng khí. Thích hợp cho luyện tập mùa hè.',
    aiHint: 'Suggest black sporty men outfits for gym in summer.',
    items: [
      {
        name: 'Áo tank top đen',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-5-item-1/200/200',
        shoppingLinks: [{ store: 'Nike', url: 'https://www.nike.com/' }],
      },
      {
        name: 'Quần short thể thao',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-5-item-2/200/200',
        shoppingLinks: [{ store: 'Adidas', url: 'https://www.adidas.com/' }],
      },
      {
        name: 'Giày chạy bộ',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-5-item-3/200/200',
        shoppingLinks: [{ store: 'Asics', url: 'https://www.asics.com/' }],
      },
    ],
  },
  {
    id: 6,
    gender: 'female',
    categories: ['work/office', 'basic'],
    season: 'winter',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-6-main/400/500',
    title: 'Trang phục công sở nữ mùa đông cơ bản.',
    description:
      'Áo len cổ lọ đen kết hợp quần tây, áo blazer xám và ankle boots. Giữ ấm và vẫn thanh lịch cho môi trường công sở.',
    aiHint: 'Suggest basic black office outfits for women in winter.',
    items: [
      {
        name: 'Áo len cổ lọ đen',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-6-item-1/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Quần tây đen',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-6-item-2/200/200',
        shoppingLinks: [{ store: 'Zara', url: 'https://www.zara.com/' }],
      },
      {
        name: 'Áo blazer xám',
        type: 'outerwear',
        imageUrl: 'https://picsum.photos/seed/outfit-6-item-3/200/200',
        shoppingLinks: [{ store: 'Mango', url: 'https://shop.mango.com/' }],
      },
      {
        name: 'Ankle boots',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-6-item-4/200/200',
        shoppingLinks: [{ store: 'Aldo', url: 'https://www.aldoshoes.com/' }],
      },
    ],
  },
  {
    id: 7,
    gender: 'male',
    categories: ['streetwear', 'casual'],
    season: 'spring',
    color: 'earth-tone',
    mainImage: 'https://picsum.photos/seed/outfit-7-main/400/500',
    title: 'Streetwear nam xuân đơn giản nhưng cá tính.',
    description:
      'Áo hoodie màu nâu nhạt, quần jogger và sneaker trắng. Thêm mũ lưỡi trai để tạo phong cách năng động.',
    aiHint: 'Suggest spring earth-tone casual streetwear outfits for men.',
    items: [
      {
        name: 'Áo hoodie nâu',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-7-item-1/200/200',
        shoppingLinks: [{ store: 'H&M', url: 'https://www.hm.com/' }],
      },
      {
        name: 'Quần jogger',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-7-item-2/200/200',
        shoppingLinks: [{ store: 'Nike', url: 'https://www.nike.com/' }],
      },
      {
        name: 'Sneaker trắng',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-7-item-3/200/200',
        shoppingLinks: [{ store: 'Adidas', url: 'https://www.adidas.com/' }],
      },
    ],
  },
  {
    id: 8,
    gender: 'female',
    categories: ['sporty', 'sport/active'],
    season: 'autumn',
    color: 'vibrant',
    mainImage: 'https://picsum.photos/seed/outfit-8-main/400/500',
    title: 'Đồ yoga nữ với màu sắc tươi sáng.',
    description:
      'Áo bra thể thao neon, quần legging co giãn và giày training. Thích hợp cho yoga hoặc tập fitness vào mùa thu.',
    aiHint: 'Suggest vibrant autumn sporty yoga outfits for women.',
    items: [
      {
        name: 'Áo bra neon',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-8-item-1/200/200',
        shoppingLinks: [{ store: 'Lululemon', url: 'https://shop.lululemon.com/' }],
      },
      {
        name: 'Quần legging',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-8-item-2/200/200',
        shoppingLinks: [{ store: 'Nike', url: 'https://www.nike.com/' }],
      },
      {
        name: 'Giày training',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-8-item-3/200/200',
        shoppingLinks: [{ store: 'Reebok', url: 'https://www.reebok.com/' }],
      },
    ],
  },
  {
    id: 9,
    gender: 'male',
    categories: ['work/office', 'basic'],
    season: 'summer',
    color: 'white',
    mainImage: 'https://picsum.photos/seed/outfit-9-main/400/500',
    title: 'Công sở mùa hè thoáng mát với áo sơ mi trắng.',
    description:
      'Áo sơ mi trắng linen, quần tây xám sáng và giày da lười. Giữ sự thoải mái và vẫn chuyên nghiệp.',
    aiHint: 'Suggest basic white office outfits for men in summer.',
    items: [
      {
        name: 'Áo sơ mi linen trắng',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-9-item-1/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Quần tây xám',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-9-item-2/200/200',
        shoppingLinks: [{ store: 'Topman', url: 'https://www.topman.com/' }],
      },
      {
        name: 'Giày lười nâu',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-9-item-3/200/200',
        shoppingLinks: [{ store: 'Clarks', url: 'https://www.clarks.com/' }],
      },
    ],
  },
  {
    id: 10,
    gender: 'female',
    categories: ['elegant', 'party/date'],
    season: 'winter',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-10-main/400/500',
    title: 'Đầm đen thanh lịch cho buổi tiệc mùa đông.',
    description:
      'Chiếc đầm đen bodycon kết hợp với áo khoác lông, giày cao gót đen và clutch. Phong cách sang trọng cho mùa đông.',
    aiHint: 'Suggest elegant black winter party dresses for women.',
    items: [
      {
        name: 'Đầm bodycon đen',
        type: 'dress',
        imageUrl: 'https://picsum.photos/seed/outfit-10-item-1/200/200',
        shoppingLinks: [{ store: 'Zara', url: 'https://www.zara.com/' }],
      },
      {
        name: 'Áo khoác lông',
        type: 'outerwear',
        imageUrl: 'https://picsum.photos/seed/outfit-10-item-2/200/200',
        shoppingLinks: [{ store: 'Mango', url: 'https://shop.mango.com/' }],
      },
      {
        name: 'Giày cao gót đen',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-10-item-3/200/200',
        shoppingLinks: [{ store: 'Aldo', url: 'https://www.aldoshoes.com/' }],
      },
      {
        name: 'Clutch đen',
        type: 'accessory',
        imageUrl: 'https://picsum.photos/seed/outfit-10-item-4/200/200',
        shoppingLinks: [{ store: 'Michael Kors', url: 'https://www.michaelkors.com/' }],
      },
    ],
  }, {
    id: 11,
    gender: 'male',
    categories: ['streetwear'],
    season: 'spring',
    color: 'vibrant',
    mainImage: 'https://picsum.photos/seed/outfit-11-main/400/500',
    imageSourceText: 'Placeholder',
    imageSourceUrl: 'https://picsum.photos',
    title: 'Outfit streetwear nam với áo hoodie sáng màu và quần jogger.',
    description:
      'Áo hoodie màu vibrant kết hợp với quần jogger thoải mái và sneaker chunky. Phù hợp cho phong cách đường phố năng động mùa xuân.',
    aiHint: 'Suggest vibrant spring streetwear outfits with hoodie and joggers.',
    items: [
      {
        name: 'Áo hoodie sáng màu',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-11-item-1/200/200',
        shoppingLinks: [{ store: 'Nike', url: 'https://www.nike.com/' }],
      },
      {
        name: 'Quần jogger đen',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-11-item-2/200/200',
        shoppingLinks: [{ store: 'Adidas', url: 'https://www.adidas.com/' }],
      },
      {
        name: 'Sneaker chunky',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-11-item-3/200/200',
        shoppingLinks: [{ store: 'Puma', url: 'https://www.puma.com/' }],
      },
    ],
  },
  {
    id: 12,
    gender: 'female',
    categories: ['elegant', 'party/date'],
    season: 'summer',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-12-main/400/500',
    imageSourceText: 'Placeholder',
    imageSourceUrl: 'https://picsum.photos',
    title: 'Đầm đen sang trọng cho buổi hẹn hò hoặc tiệc tối.',
    description:
      'Chiếc đầm đen ôm body với chất liệu satin kết hợp cùng giày cao gót và clutch. Mang lại vẻ đẹp quyến rũ, sang trọng trong buổi hẹn hò mùa hè.',
    aiHint: 'Suggest elegant black dresses for date night in summer.',
    items: [
      {
        name: 'Đầm đen satin',
        type: 'dress',
        imageUrl: 'https://picsum.photos/seed/outfit-12-item-1/200/200',
        shoppingLinks: [{ store: 'Zara', url: 'https://www.zara.com/' }],
      },
      {
        name: 'Giày cao gót',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-12-item-2/200/200',
        shoppingLinks: [{ store: 'Aldo', url: 'https://www.aldoshoes.com/' }],
      },
      {
        name: 'Clutch ánh kim',
        type: 'accessory',
        imageUrl: 'https://picsum.photos/seed/outfit-12-item-3/200/200',
        shoppingLinks: [{ store: 'Charles & Keith', url: 'https://www.charleskeith.com/' }],
      },
    ],
  },
  {
    id: 13,
    gender: 'male',
    categories: ['sporty'],
    season: 'summer',
    color: 'white',
    mainImage: 'https://picsum.photos/seed/outfit-13-main/400/500',
    title: 'Trang phục thể thao nam trắng đơn giản, thoải mái.',
    description:
      'Áo thun thể thao màu trắng thoáng khí kết hợp với quần short chạy bộ và giày chạy nhẹ. Phù hợp cho tập gym hoặc chạy bộ ngoài trời.',
    aiHint: 'Suggest sporty white outfits for men in summer.',
    items: [
      {
        name: 'Áo thun thể thao trắng',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-13-item-1/200/200',
        shoppingLinks: [{ store: 'Nike', url: 'https://www.nike.com/' }],
      },
      {
        name: 'Quần short chạy bộ',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-13-item-2/200/200',
        shoppingLinks: [{ store: 'Adidas', url: 'https://www.adidas.com/' }],
      },
      {
        name: 'Giày chạy',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-13-item-3/200/200',
        shoppingLinks: [{ store: 'Asics', url: 'https://www.asics.com/' }],
      },
    ],
  },
  {
    id: 14,
    gender: 'female',
    categories: ['work/office'],
    season: 'spring',
    color: 'pastel',
    mainImage: 'https://picsum.photos/seed/outfit-14-main/400/500',
    title: 'Áo sơ mi pastel kết hợp quần culottes công sở nữ.',
    description:
      'Trang phục công sở nữ với áo sơ mi pastel và quần culottes thoải mái, kết hợp giày loafer và túi tote. Mang lại cảm giác trẻ trung, thanh lịch.',
    aiHint: 'Suggest pastel office outfits for women in spring.',
    items: [
      {
        name: 'Áo sơ mi pastel',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-14-item-1/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Quần culottes',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-14-item-2/200/200',
        shoppingLinks: [{ store: 'Mango', url: 'https://shop.mango.com/' }],
      },
      {
        name: 'Giày loafer',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-14-item-3/200/200',
        shoppingLinks: [{ store: 'H&M', url: 'https://www.hm.com/' }],
      },
      {
        name: 'Túi tote',
        type: 'accessory',
        imageUrl: 'https://picsum.photos/seed/outfit-14-item-4/200/200',
        shoppingLinks: [{ store: 'Charles & Keith', url: 'https://www.charleskeith.com/' }],
      },
    ],
  },
  {
    id: 15,
    gender: 'male',
    categories: ['elegant', 'party/date'],
    season: 'winter',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-15-main/400/500',
    title: 'Áo khoác dạ đen lịch lãm cho buổi hẹn mùa đông.',
    description:
      'Áo khoác dạ đen dài, kết hợp áo cổ lọ và quần tây, cùng giày Chelsea boots. Tạo vẻ ngoài ấm áp nhưng vẫn phong cách cho buổi hẹn tối mùa đông.',
    aiHint: 'Suggest elegant winter date outfits for men in black tones.',
    items: [
      {
        name: 'Áo khoác dạ đen',
        type: 'outerwear',
        imageUrl: 'https://picsum.photos/seed/outfit-15-item-1/200/200',
        shoppingLinks: [{ store: 'Zara', url: 'https://www.zara.com/' }],
      },
      {
        name: 'Áo cổ lọ',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-15-item-2/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Quần tây',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-15-item-3/200/200',
        shoppingLinks: [{ store: 'Topman', url: 'https://www.topman.com/' }],
      },
      {
        name: 'Chelsea boots',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-15-item-4/200/200',
        shoppingLinks: [{ store: 'Clarks', url: 'https://www.clarks.com/' }],
      },
    ],
  },
  {
    id: 16,
    gender: 'female',
    categories: ['sporty'],
    season: 'autumn',
    color: 'earth-tone',
    mainImage: 'https://picsum.photos/seed/outfit-16-main/400/500',
    title: 'Set đồ yoga earth-tone cho nữ.',
    description:
      'Bộ đồ tập yoga gồm áo bra và quần legging earth-tone, kết hợp áo khoác nhẹ và giày sneaker. Phù hợp cho mùa thu khi tập luyện hoặc đi dạo.',
    aiHint: 'Suggest sporty earth-tone yoga outfits for women in autumn.',
    items: [
      {
        name: 'Áo bra thể thao',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-16-item-1/200/200',
        shoppingLinks: [{ store: 'Lululemon', url: 'https://shop.lululemon.com/' }],
      },
      {
        name: 'Quần legging earth-tone',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-16-item-2/200/200',
        shoppingLinks: [{ store: 'Nike', url: 'https://www.nike.com/' }],
      },
      {
        name: 'Áo khoác nhẹ',
        type: 'outerwear',
        imageUrl: 'https://picsum.photos/seed/outfit-16-item-3/200/200',
        shoppingLinks: [{ store: 'Adidas', url: 'https://www.adidas.com/' }],
      },
      {
        name: 'Sneaker',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-16-item-4/200/200',
        shoppingLinks: [{ store: 'Reebok', url: 'https://www.reebok.com/' }],
      },
    ],
  },
  {
    id: 17,
    gender: 'male',
    categories: ['beach'],
    season: 'summer',
    color: 'white',
    mainImage: 'https://picsum.photos/seed/outfit-17-main/400/500',
    title: 'Outfit đi biển nam mùa hè với áo thun trắng và quần short.',
    description:
      'Áo thun trắng đơn giản kết hợp quần short và dép lê. Phong cách thoải mái, mát mẻ cho ngày hè trên biển.',
    aiHint: 'Suggest simple beach summer outfits with white t-shirt and shorts.',
    items: [
      {
        name: 'Áo thun trắng',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-17-item-1/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Quần short',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-17-item-2/200/200',
        shoppingLinks: [{ store: 'H&M', url: 'https://www.hm.com/' }],
      },
      {
        name: 'Dép lê',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-17-item-3/200/200',
        shoppingLinks: [{ store: 'Havaianas', url: 'https://www.havaianas.com/' }],
      },
    ],
  },
  {
    id: 18,
    gender: 'female',
    categories: ['streetwear', 'party/date'],
    season: 'spring',
    color: 'vibrant',
    mainImage: 'https://picsum.photos/seed/outfit-18-main/400/500',
    title: 'Set streetwear nữ nổi bật với crop top và chân váy ngắn.',
    description:
      'Crop top rực rỡ kết hợp chân váy ngắn và giày sneaker platform. Mang lại sự năng động, cá tính cho các buổi tiệc ngoài trời mùa xuân.',
    aiHint: 'Suggest vibrant streetwear outfits for women in spring.',
    items: [
      {
        name: 'Crop top rực rỡ',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-18-item-1/200/200',
        shoppingLinks: [{ store: 'Bershka', url: 'https://www.bershka.com/' }],
      },
      {
        name: 'Chân váy ngắn',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-18-item-2/200/200',
        shoppingLinks: [{ store: 'Pull&Bear', url: 'https://www.pullandbear.com/' }],
      },
      {
        name: 'Sneaker platform',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-18-item-3/200/200',
        shoppingLinks: [{ store: 'Fila', url: 'https://www.fila.com/' }],
      },
    ],
  },
  {
    id: 19,
    gender: 'male',
    categories: ['work/office'],
    season: 'winter',
    color: 'earth-tone',
    mainImage: 'https://picsum.photos/seed/outfit-19-main/400/500',
    title: 'Áo len earth-tone kết hợp sơ mi công sở nam mùa đông.',
    description:
      'Áo len cổ tròn earth-tone mặc ngoài áo sơ mi trắng, đi kèm quần tây và giày oxford. Mang lại sự thanh lịch, chuyên nghiệp nhưng vẫn ấm áp.',
    aiHint: 'Suggest office outfits for men in earth-tone during winter.',
    items: [
      {
        name: 'Áo len earth-tone',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-19-item-1/200/200',
        shoppingLinks: [{ store: 'Uniqlo', url: 'https://www.uniqlo.com/' }],
      },
      {
        name: 'Áo sơ mi trắng',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-19-item-2/200/200',
        shoppingLinks: [{ store: 'H&M', url: 'https://www.hm.com/' }],
      },
      {
        name: 'Quần tây xám',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-19-item-3/200/200',
        shoppingLinks: [{ store: 'Topman', url: 'https://www.topman.com/' }],
      },
      {
        name: 'Giày oxford',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-19-item-4/200/200',
        shoppingLinks: [{ store: 'Clarks', url: 'https://www.clarks.com/' }],
      },
    ],
  },
  {
    id: 20,
    gender: 'female',
    categories: ['beach'],
    season: 'summer',
    color: 'pastel',
    mainImage: 'https://picsum.photos/seed/outfit-20-main/400/500',
    title: 'Đầm maxi pastel cho nữ đi biển mùa hè.',
    description:
      'Đầm maxi pastel thướt tha, nón rộng vành và dép sandal. Tạo phong cách nhẹ nhàng, bay bổng cho chuyến đi biển mùa hè.',
    aiHint: 'Suggest pastel beach outfits for women in summer.',
    items: [
      {
        name: 'Đầm maxi pastel',
        type: 'dress',
        imageUrl: 'https://picsum.photos/seed/outfit-20-item-1/200/200',
        shoppingLinks: [{ store: 'Zara', url: 'https://www.zara.com/' }],
      },
      {
        name: 'Nón rộng vành',
        type: 'accessory',
        imageUrl: 'https://picsum.photos/seed/outfit-20-item-2/200/200',
        shoppingLinks: [{ store: 'H&M', url: 'https://www.hm.com/' }],
      },
      {
        name: 'Dép sandal',
        type: 'shoes',
        imageUrl: 'https://picsum.photos/seed/outfit-20-item-4/200/200',
        shoppingLinks: [{ store: 'Aldo', url: 'https://www.aldoshoes.com/' }],
      },
    ],
  },
  {
    id: 21,
    gender: 'female',
    categories: ['tet', 'elegant'],
    season: 'spring',
    color: 'vibrant',
    mainImage: 'https://picsum.photos/seed/outfit-21-main/400/500',
    title: 'Áo dài đỏ cách tân cho ngày Tết',
    description: 'Áo dài cách tân màu đỏ rực rỡ, kết hợp với quần lụa trắng và guốc mộc, mang lại vẻ đẹp truyền thống và hiện đại.',
    aiHint: 'red ao dai for tet holiday',
    items: [
      {
        name: 'Áo dài cách tân đỏ',
        type: 'dress',
        imageUrl: 'https://picsum.photos/seed/outfit-21-item-1/200/200',
        shoppingLinks: [],
      },
      {
        name: 'Quần lụa trắng',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-21-item-2/200/200',
        shoppingLinks: [],
      },
    ],
  },
  {
    id: 22,
    gender: 'male',
    categories: ['tet'],
    season: 'spring',
    color: 'vibrant',
    mainImage: 'https://picsum.photos/seed/outfit-22-main/400/500',
    title: 'Áo sơ mi gấm và quần tây cho nam du xuân',
    description: 'Áo sơ mi họa tiết gấm màu đỏ hoặc vàng, kết hợp quần tây đen và giày da. Lịch lãm và mang đậm không khí Tết.',
    aiHint: 'male tet holiday outfit',
    items: [
      {
        name: 'Áo sơ mi gấm',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-22-item-1/200/200',
        shoppingLinks: [],
      },
      {
        name: 'Quần tây đen',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-22-item-2/200/200',
        shoppingLinks: [],
      },
    ],
  },
  {
    id: 23,
    gender: 'female',
    categories: ['game-anime'],
    season: 'autumn',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-23-main/400/500',
    title: 'Trang phục nữ sinh Nhật Bản',
    description: 'Lấy cảm hứng từ đồng phục học sinh trong anime, với áo sailor, chân váy xếp ly và tất cao cổ.',
    aiHint: 'japanese school girl uniform anime',
    items: [
      {
        name: 'Áo sailor',
        type: 'top',
        imageUrl: 'https://picsum.photos/seed/outfit-23-item-1/200/200',
        shoppingLinks: [],
      },
      {
        name: 'Chân váy xếp ly',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-23-item-2/200/200',
        shoppingLinks: [],
      },
    ],
  },
  {
    id: 24,
    gender: 'male',
    categories: ['game-anime', 'streetwear'],
    season: 'winter',
    color: 'black',
    mainImage: 'https://picsum.photos/seed/outfit-24-main/400/500',
    title: 'Phong cách Techwear từ game Cyberpunk',
    description: 'Áo khoác bomber nhiều túi, quần cargo jogger và giày boots cao cổ. Mang đậm phong cách tương lai, viễn tưởng.',
    aiHint: 'cyberpunk techwear male outfit',
    items: [
      {
        name: 'Áo khoác bomber',
        type: 'outerwear',
        imageUrl: 'https://picsum.photos/seed/outfit-24-item-1/200/200',
        shoppingLinks: [],
      },
      {
        name: 'Quần cargo jogger',
        type: 'bottom',
        imageUrl: 'https://picsum.photos/seed/outfit-24-item-2/200/200',
        shoppingLinks: [],
      },
    ],
  },
  {
    id: 25,
    gender: 'female',
    categories: ['tet', 'elegant'],
    season: 'spring',
    color: 'pastel',
    mainImage: 'https://picsum.photos/seed/outfit-25-main/400/500',
    title: 'Áo dài pastel thanh lịch du xuân',
    description: 'Một lựa chọn nhẹ nhàng hơn cho ngày Tết với áo dài màu pastel, kiểu dáng truyền thống, tôn lên vẻ đẹp dịu dàng.',
    aiHint: 'pastel ao dai for tet holiday',
    items: [
      {
        name: 'Áo dài pastel',
        type: 'dress',
        imageUrl: 'https://picsum.photos/seed/outfit-25-item-1/200/200',
        shoppingLinks: [],
      },
    ],
  },
  {
    id: 26,
    gender: 'male',
    categories: ['game-anime'],
    season: 'spring',
    color: 'white',
    mainImage: 'https://picsum.photos/seed/outfit-26-main/400/500',
    title: 'Trang phục kiếm khách lãng tử',
    description: 'Lấy cảm hứng từ các nhân vật trong game kiếm hiệp, với áo choàng trắng, sơ mi cổ trang và quần ống rộng.',
    aiHint: 'swordsman outfit anime',
    items: [
      {
        name: 'Áo choàng trắng',
        type: 'outerwear',
        imageUrl: 'https://picsum.photos/seed/outfit-26-item-1/200/200',
        shoppingLinks: [],
      },
    ],
  },
];
