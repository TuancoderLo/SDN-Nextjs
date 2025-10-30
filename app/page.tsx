"use client";

import { getPerfumes, getBrandById, Perfume } from "../lib/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Header } from "../components/Header";

export default function Home() {
  const perfumes = getPerfumes();

  const getBrandName = (brandId: string) => {
    const brand = getBrandById(brandId);
    return brand ? brand.brandName : "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Premium Perfumes
            </h1>
            <p className="text-xl text-gray-600">
              Explore our collection of luxury fragrances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perfumes.map((perfume) => (
              <PerfumeCard
                key={perfume._id}
                perfume={perfume}
                getBrandName={getBrandName}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

interface PerfumeCardProps {
  perfume: Perfume;
  getBrandName: (brandId: string) => string;
}

function PerfumeCard({ perfume, getBrandName }: PerfumeCardProps) {
  return (
    <Link href={`/perfume/${perfume._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardHeader className="pb-4">
          <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={perfume.imageUrl}
              alt={perfume.perfumeName}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (
                  e.target as HTMLImageElement
                ).src = `https://picsum.photos/300/300?random=${Math.random()}`;
              }}
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-1">
                {perfume.perfumeName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {getBrandName(perfume.brand)}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-2">
              ${perfume.price}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 line-clamp-2">
              {perfume.description}
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {perfume.concentration}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {perfume.volume}ml
              </Badge>
              <Badge variant="outline" className="text-xs">
                {perfume.targetAudience}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{perfume.category}</span>
              <span>{perfume.comments.length} reviews</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
