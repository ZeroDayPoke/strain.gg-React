// ./src/pages/TestimonialsPage.tsx

import React from 'react';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { Testimonial } from '../../../types';

const TestimonialsPage: React.FC = () => {
  const sampleTestimonials: Testimonial[] = [
    {
      author: 'John Doe',
      message: 'This is a fantastic service!',
    },
    {
      author: 'Jane Smith',
      message: 'Absolutely love this!',
    },
  ];

  return (
    <div>
      <h2>What our customers say</h2>
      <TestimonialCarousel testimonials={sampleTestimonials} />
    </div>
  );
};

export default TestimonialsPage;
