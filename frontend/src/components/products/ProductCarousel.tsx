// src/components/products/ProductCarousel.tsx
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Product } from '../../types/Product';
import ProductCard from './ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  slidesPerViewMobile?: number;
  slidesPerViewDesktop?: number;
  autoplayDelay?: number;
  transitionSpeed?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
  slidesPerViewMobile = 2,
  slidesPerViewDesktop = 5,
  autoplayDelay = 3000,
  transitionSpeed = 1000,
}) => {
  if (!products || products.length === 0) return null;

  // Filtra produtos únicos pelo _id para evitar repetição
  const uniqueProducts = products.filter((prod, i, arr) =>
    arr.findIndex(p => p._id === prod._id) === i
  );

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const swiperBreakpoints = {
    640:  { slidesPerView: 2.5, spaceBetween: 20 },
    768:  { slidesPerView: 3.5, spaceBetween: 25 },
    1024: { slidesPerView: 4.5, spaceBetween: 30 },
    1280: { slidesPerView: slidesPerViewDesktop,     spaceBetween: 30 },
    1536: { slidesPerView: slidesPerViewDesktop + 1, spaceBetween: 30 },
  };

  return (
    <section className="py-8 bg-white dark:bg-neutral-900">
      <div className="container-custom">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 text-center">
            {title}
          </h2>
        )}

        <div className="relative flex items-center">
          <button
            ref={prevRef}
            className="hidden md:flex shrink-0 items-center justify-center
                       h-10 w-10 mr-2 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80
                       text-neutral-800 dark:text-neutral-100 shadow-md hover:bg-primary-600 transition"
          >
            <FiChevronLeft size={22} />
          </button>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={slidesPerViewMobile}
            loop
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={transitionSpeed}
            breakpoints={swiperBreakpoints}
            onInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="product-carousel flex-1"
          >
            {uniqueProducts.map((product, index) => (
              <SwiperSlide key={product._id || `product-${index}`}>
                <ProductCard product={product} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={nextRef}
            className="hidden md:flex shrink-0 items-center justify-center
                       h-10 w-10 ml-2 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80
                       text-neutral-800 dark:text-neutral-100 shadow-md hover:bg-primary-600 transition"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
