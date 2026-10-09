import React from 'react';
import { Truck, Lock, RotateCcw, Clock } from 'lucide-react';

const FEATURES = [
  { icon: Truck,     title: 'Free Shipping',  sub: 'On orders over $100'        },
  { icon: Lock,      title: 'Secure Payment', sub: '100% protected payments'    },
  { icon: RotateCcw, title: 'Easy Returns',   sub: '30-day return policy'       },
  { icon: Clock,     title: '24/7 Support',   sub: 'Dedicated customer service' },
];

const Features = () => (
  <section className="px-4 sm:px-6 py-3 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-4 px-7 md:px-8 lg:px-10 py-5 md:py-7">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm md:text-base font-semibold text-gray-900">{title}</p>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Features;
