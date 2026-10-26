"use client";

import React from "react";
import Image from "next/image";

interface ServiceFeature {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  alt: string;
}

const serviceFeatures: ServiceFeature[] = [
  {
    id: 1,
    icon: "/home/service1.png",
    title: "Free Shipping",
    subtitle: "Free Shipping World Wide",
    alt: "Free Shipping Icon",
  },
  {
    id: 2,
    icon: "/home/service2.png",
    title: "24 X 7 Service",
    subtitle: "Online Service For New Customer",
    alt: "24 X 7 Service Icon",
  },
  {
    id: 3,
    icon: "/home/service3.png",
    title: "Online Payment",
    subtitle: "New Online Special Festival Offer",
    alt: "Online Payment Icon",
  },
];

interface ServicesFeatureSectionProps {
  isWhiteTheme?: boolean;
}

export default function ServicesFeatureSection({
  isWhiteTheme = false,
}: ServicesFeatureSectionProps) {
  const [features, setFeatures] = React.useState<ServiceFeature[]>(serviceFeatures);

  React.useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const { etrolleyApi } = await import("@/lib/api");
        const homeRes = await etrolleyApi.getStoreHome();
        const sections = homeRes?.data?.sections || [];
        const serviceSec = sections.find((s: any) => s.key === "services");
        const items = serviceSec?.data || [];
        if (isMounted && items.length > 0) {
          const mapped: ServiceFeature[] = items.slice(0, 3).map((item: any, idx: number) => ({
            id: item.id || idx + 1,
            icon: item.image || serviceFeatures[idx % serviceFeatures.length].icon,
            title: item.title || serviceFeatures[idx % serviceFeatures.length].title,
            subtitle: item.description || item.sub_title || serviceFeatures[idx % serviceFeatures.length].subtitle,
            alt: item.title || "Service Icon",
          }));
          setFeatures(mapped);
        }
      } catch (err) {
        console.warn("Using fallback services:", err);
      }
    }
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className={`border-b transition-colors duration-300 ${
        isWhiteTheme
          ? "bg-[#f8f8f8] border-gray-200"
          : "bg-[#212121] border-[#2c2c2c]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-start sm:justify-center md:justify-start gap-5 group cursor-pointer transition-transform duration-300 hover:-translate-y-0.5"
            >
              {/* Service Icon with subtle hover animation */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={item.icon}
                  alt={item.alt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Service Text */}
              <div className="flex flex-col text-left">
                <h4
                  className={`text-[17px] sm:text-[18px] font-bold tracking-[0.03em] mb-1 transition-colors ${
                    isWhiteTheme ? "text-[#222222]" : "text-white"
                  }`}
                >
                  {item.title}
                </h4>
                <p
                  className={`text-[13px] sm:text-[14px] leading-snug font-normal ${
                    isWhiteTheme ? "text-[#777777]" : "text-[#888888]"
                  }`}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
