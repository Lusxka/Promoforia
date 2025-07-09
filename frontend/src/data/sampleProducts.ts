import { Product } from '../types/Product';

const sampleProducts: Product[] = [
  {
    _id: "1",
    name: "Smartphone Premium XS",
    description: "Um smartphone de última geração com câmera de alta resolução, processador rápido e tela AMOLED de 6.5 polegadas. Ideal para fotografia, jogos e multimídia.",
    price: 2999.99,
    originalPrice: 3499.99,
    discount: 14,
    images: [
      "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Eletrônicos",
    subcategory: "Smartphones",
    tags: ["smartphone", "premium", "câmera", "5G"],
    rating: 4.8,
    reviewCount: 127,
    stockQuantity: 15,
    seller: {
      name: "TechStore",
      id: "seller1"
    },
    affiliateLink: "https://exemplo.com/aff/smartphone-xs",
    affiliateCommission: 7.5,
    featured: true,
    bestseller: true
  },
  {
    _id: "2",
    name: "Notebook Ultrafino Pro",
    description: "Notebook leve e potente com processador Intel Core i7, 16GB de RAM e SSD de 512GB. Perfeito para trabalho e estudos.",
    price: 5299.90,
    originalPrice: 5999.90,
    discount: 12,
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Eletrônicos",
    subcategory: "Notebooks",
    tags: ["notebook", "ultrafino", "trabalho", "estudante"],
    rating: 4.7,
    reviewCount: 89,
    stockQuantity: 8,
    seller: {
      name: "TechStore",
      id: "seller1"
    },
    affiliateLink: "https://exemplo.com/aff/notebook-pro",
    affiliateCommission: 6.5,
    featured: true
  },
  {
    _id: "3",
    name: "Fones de Ouvido Bluetooth Premium",
    description: "Fones de ouvido sem fio com cancelamento de ruído ativo, bateria de longa duração e qualidade de áudio excepcional.",
    price: 799.90,
    originalPrice: 999.90,
    discount: 20,
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Eletrônicos",
    subcategory: "Áudio",
    tags: ["fones", "bluetooth", "premium", "cancelamento de ruído"],
    rating: 4.9,
    reviewCount: 215,
    stockQuantity: 25,
    seller: {
      name: "AudioMax",
      id: "seller2"
    },
    affiliateLink: "https://exemplo.com/aff/fones-premium",
    affiliateCommission: 10,
    bestseller: true
  },
  {
    _id: "4",
    name: "Tênis Esportivo Ultra Comfort",
    description: "Tênis leve e confortável, ideal para corridas e atividades físicas. Tecnologia de amortecimento e design moderno.",
    price: 449.90,
    originalPrice: 499.90,
    discount: 10,
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Esportes",
    subcategory: "Calçados",
    tags: ["tênis", "corrida", "esporte", "conforto"],
    rating: 4.5,
    reviewCount: 182,
    stockQuantity: 30,
    seller: {
      name: "EsporteFit",
      id: "seller3"
    },
    affiliateLink: "https://exemplo.com/aff/tenis-ultra",
    affiliateCommission: 8,
    new: true
  },
  {
    _id: "5",
    name: "Smart TV 4K 55 polegadas",
    description: "TV com resolução 4K, tela LED, sistema operacional inteligente e múltiplas conexões. Imagem de alta qualidade para sua casa.",
    price: 3199.99,
    originalPrice: 3599.99,
    discount: 11,
    images: [
      "https://images.pexels.com/photos/6976103/pexels-photo-6976103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/5490348/pexels-photo-5490348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Eletrônicos",
    subcategory: "TVs",
    tags: ["tv", "4k", "smart tv", "entretenimento"],
    rating: 4.6,
    reviewCount: 94,
    stockQuantity: 12,
    seller: {
      name: "TechStore",
      id: "seller1"
    },
    affiliateLink: "https://exemplo.com/aff/smarttv-4k",
    affiliateCommission: 5.5,
    featured: true
  },
  {
    _id: "6",
    name: "Relógio Inteligente SportWatch",
    description: "Smartwatch com monitoramento de atividades físicas, batimentos cardíacos, sono e notificações. Resistente à água e design elegante.",
    price: 899.90,
    originalPrice: 1099.90,
    discount: 18,
    images: [
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Eletrônicos",
    subcategory: "Smartwatches",
    tags: ["relógio", "smartwatch", "fitness", "saúde"],
    rating: 4.7,
    reviewCount: 156,
    stockQuantity: 20,
    seller: {
      name: "TechFit",
      id: "seller4"
    },
    affiliateLink: "https://exemplo.com/aff/sportwatch",
    affiliateCommission: 9,
    bestseller: true
  },
  {
    _id: "7",
    name: "Câmera DSLR Profissional",
    description: "Câmera digital com sensor full frame, alta resolução e gravação de vídeo em 4K. Ideal para fotógrafos profissionais.",
    price: 6499.99,
    originalPrice: 6999.99,
    discount: 7,
    images: [
      "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Eletrônicos",
    subcategory: "Câmeras",
    tags: ["câmera", "dslr", "fotografia", "profissional"],
    rating: 4.9,
    reviewCount: 68,
    stockQuantity: 5,
    seller: {
      name: "FotoShop",
      id: "seller5"
    },
    affiliateLink: "https://exemplo.com/aff/camera-pro",
    affiliateCommission: 5,
    featured: true
  },
  {
    _id: "8",
    name: "Mochila para Notebook Premium",
    description: "Mochila resistente à água com compartimentos acolchoados para notebooks de até 17 polegadas. Design ergonômico e vários bolsos.",
    price: 249.90,
    originalPrice: 299.90,
    discount: 17,
    images: [
      "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1545499/pexels-photo-1545499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Acessórios",
    subcategory: "Mochilas",
    tags: ["mochila", "notebook", "viagem", "impermeável"],
    rating: 4.6,
    reviewCount: 129,
    stockQuantity: 40,
    seller: {
      name: "BagStore",
      id: "seller6"
    },
    affiliateLink: "https://exemplo.com/aff/mochila-premium",
    affiliateCommission: 12,
    new: true
  },
  {
    _id: "9",
    name: "Cadeira Gamer Ergonômica",
    description: "Cadeira gamer com design ergonômico, apoio lombar ajustável, braços 3D e reclinação de até 180 graus. Conforto para longas sessões.",
    price: 1299.90,
    originalPrice: 1499.90,
    discount: 13,
    images: [
      "https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Móveis",
    subcategory: "Cadeiras",
    tags: ["cadeira", "gamer", "ergonômica", "escritório"],
    rating: 4.7,
    reviewCount: 87,
    stockQuantity: 15,
    seller: {
      name: "GameStore",
      id: "seller7"
    },
    affiliateLink: "https://exemplo.com/aff/cadeira-gamer",
    affiliateCommission: 7,
    bestseller: true
  },
  {
    _id: "10",
    name: "Perfume Masculino Premium",
    description: "Perfume masculino com fragrância sofisticada e longa duração. Notas amadeiradas e cítricas para ocasiões especiais.",
    price: 399.90,
    originalPrice: 449.90,
    discount: 11,
    images: [
      "https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Beleza",
    subcategory: "Perfumes",
    tags: ["perfume", "masculino", "premium", "fragrância"],
    rating: 4.8,
    reviewCount: 143,
    stockQuantity: 25,
    seller: {
      name: "BeautyStore",
      id: "seller8"
    },
    affiliateLink: "https://exemplo.com/aff/perfume-premium",
    affiliateCommission: 15,
    featured: true
  },
  {
    _id: "11",
    name: "Kit Skincare Completo",
    description: "Kit com produtos para cuidados com a pele, incluindo limpador, tônico, hidratante e protetor solar. Fórmulas suaves para todos os tipos de pele.",
    price: 289.90,
    originalPrice: 349.90,
    discount: 17,
    images: [
      "https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Beleza",
    subcategory: "Skincare",
    tags: ["skincare", "beleza", "cuidados", "pele"],
    rating: 4.9,
    reviewCount: 217,
    stockQuantity: 30,
    seller: {
      name: "BeautyStore",
      id: "seller8"
    },
    affiliateLink: "https://exemplo.com/aff/kit-skincare",
    affiliateCommission: 18,
    bestseller: true
  },
  {
    _id: "12",
    name: "Jogo para Console Premium Edition",
    description: "Edição especial do jogo mais esperado do ano, com conteúdo exclusivo, artbook digital e soundtrack. Experiência imersiva em mundo aberto.",
    price: 299.90,
    originalPrice: 349.90,
    discount: 14,
    images: [
      "https://images.pexels.com/photos/3977908/pexels-photo-3977908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    category: "Games",
    subcategory: "Jogos",
    tags: ["game", "console", "premium", "edição especial"],
    rating: 4.8,
    reviewCount: 142,
    stockQuantity: 20,
    seller: {
      name: "GameStore",
      id: "seller7"
    },
    affiliateLink: "https://exemplo.com/aff/jogo-premium",
    affiliateCommission: 10,
    new: true
  }
];

export default sampleProducts;