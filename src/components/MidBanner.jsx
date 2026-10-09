import React from 'react';
import { useNavigate } from 'react-router-dom';

const TAGS = ['Free Shipping', 'No Minimum', 'Easy Returns'];

const MidBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-6 py-3 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1A1A2E] rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between
                          px-8 md:px-14 lg:px-20
                          py-10 md:py-14 lg:py-16
                          gap-8 md:gap-12">

            {/* Left */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 bg-indigo-900/40 border border-indigo-700/40
                              rounded-full px-3 py-1 mb-5">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                  ✦ Summer Sale — Today Only
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                Next-Gen Electronics{' '}
                <span className="text-indigo-400">at Your Fingertips</span>
              </h2>

              <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-6 max-w-sm md:max-w-md lg:max-w-lg">
                Discover the latest innovations with unbeatable prices — free shipping,
                no minimum required.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] md:text-xs font-semibold text-indigo-300
                               bg-indigo-900/40 border border-indigo-700/30
                               rounded-full px-3 md:px-4 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => navigate('/products')}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold
                           text-sm md:text-base
                           py-3 px-7 md:px-9
                           rounded-xl transition-colors duration-200 active:scale-95"
              >
                Shop the Sale
              </button>
            </div>

            {/* Right: big discount number */}
            <div className="text-right flex-shrink-0 select-none">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                Up to
              </p>
              <p className="text-7xl md:text-8xl lg:text-9xl font-bold text-indigo-400 leading-none tracking-tighter">
                40<span className="text-3xl md:text-4xl text-indigo-600">%</span>
              </p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                off
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MidBanner;
