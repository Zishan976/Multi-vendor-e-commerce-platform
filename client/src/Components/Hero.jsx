import { ArrowRight } from "lucide-react";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";

const Hero = () => {
  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10">
        <div className="relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group">
          <div className="p-5 sm:p-16">
            <button className="inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm">
              <span className="bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs">
                NEWS
              </span>
              Free Shipping on Orders Above $50!
              <ArrowRight className="group-hover:ml-2 transition-all" />
            </button>
            <h2 className="text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-linear-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs sm:max-w-md">
              Gadgets you'll love. Prices you'll trust.
            </h2>
            <div className="text-slate-800 text-sm font-medium mt-4 sm:mt-8">
              <p>Starts from</p>
              <p className="text-3xl">$4.90</p>
            </div>
            <button className="bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition">
              LEARN MORE
            </button>
          </div>
          <img
            alt="hero-one"
            loading="lazy"
            width="550"
            height="572"
            decoding="async"
            data-nimg="1"
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm"
            style={{ color: "transparent" }}
            src={hero1}
          />
        </div>
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600">
          <div className="flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group">
            <div>
              <p className="text-3xl font-medium bg-linear-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40">
                Best products
              </p>
              <button className="flex items-center gap-1 mt-4">
                View more
                <ArrowRight className="group-hover:ml-2 transition-all" />
              </button>
            </div>
            <img
              alt="hero-two"
              loading="lazy"
              width="210"
              height="210"
              decoding="async"
              data-nimg="1"
              className="w-35"
              style={{ color: "transparent" }}
              src={hero2}
            />
          </div>
          <div className="flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group">
            <div>
              <p className="text-3xl font-medium bg-linear-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40">
                20% discounts
              </p>
              <button className="flex items-center gap-1 mt-4">
                View more
                <ArrowRight className="group-hover:ml-2 transition-all" />
              </button>
            </div>
            <img
              alt="hero-three"
              loading="lazy"
              width="210"
              height="252"
              decoding="async"
              data-nimg="1"
              className="w-35"
              style={{ color: "transparent" }}
              src={hero3}
            />
          </div>
        </div>
      </div>
      <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
        <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4">
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Headphones
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Speakers
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Watch
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Earbuds
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Mouse
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Decoration
          </button>
          {/* Repeat buttons for marquee effect */}
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Headphones
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Speakers
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Watch
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Earbuds
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Mouse
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Decoration
          </button>
          {/* Add more repeats as needed */}
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Headphones
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Speakers
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Watch
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Earbuds
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Mouse
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Decoration
          </button>
          {/* repeat again */}
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Headphones
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Speakers
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Watch
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Earbuds
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Mouse
          </button>
          <button className="px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-slate-600 hover:text-white active:scale-95 transition-all duration-300">
            Decoration
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
