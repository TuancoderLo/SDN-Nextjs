"use client";

import { useState } from "react";
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
import { useAuth } from "../lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const perfumes = getPerfumes();
  const { user } = useAuth();
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [editForm, setEditForm] = useState<Partial<Perfume>>({});

  const getBrandName = (brandId: string) => {
    const brand = getBrandById(brandId);
    return brand ? brand.brandName : "Unknown";
  };

  const handleEditClick = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setEditForm({ ...perfume });
  };

  const handleSaveEdit = () => {
    if (!editingPerfume) return;
    // In a real app, this would call an API to update the perfume
    // For now, we'll just show a success message
    alert(`Perfume "${editForm.perfumeName}" updated successfully!`);
    setEditingPerfume(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingPerfume(null);
    setEditForm({});
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
                isAdmin={user?.isAdmin || false}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingPerfume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Perfume</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="perfumeName">Perfume Name</Label>
                  <Input
                    id="perfumeName"
                    value={editForm.perfumeName || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, perfumeName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="concentration">Concentration</Label>
                  <Input
                    id="concentration"
                    value={editForm.concentration || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        concentration: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Volume (ml)</Label>
                  <Input
                    id="volume"
                    type="number"
                    value={editForm.volume || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        volume: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editForm.category || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={editForm.targetAudience || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        targetAudience: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PerfumeCardProps {
  perfume: Perfume;
  getBrandName: (brandId: string) => string;
  isAdmin: boolean;
  onEdit: (perfume: Perfume) => void;
}

function PerfumeCard({
  perfume,
  getBrandName,
  isAdmin,
  onEdit,
}: PerfumeCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // If admin clicks on edit button, don't navigate
    if ((e.target as HTMLElement).closest(".edit-button")) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="relative">
      <Link href={`/perfume/${perfume._id}`} onClick={handleCardClick}>
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
      {isAdmin && (
        <div className="absolute top-2 right-2">
          <Button
            variant="outline"
            size="sm"
            className="edit-button bg-white hover:bg-gray-50 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(perfume);
            }}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
