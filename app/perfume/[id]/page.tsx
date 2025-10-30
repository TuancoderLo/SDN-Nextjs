"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getPerfumeById, getBrandById, Comment } from "../../../lib/mockData";
import { useAuth } from "../../../lib/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";

export default function PerfumeDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const perfumeId = params.id as string;
  const perfume = getPerfumeById(perfumeId);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState<Comment[]>(perfume?.comments || []);

  if (!perfume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Perfume Not Found</CardTitle>
            <CardDescription>
              The perfume you&apos;re looking for doesn&apos;t exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brand = getBrandById(perfume.brand);

  const handleAddComment = () => {
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      _id: `comment_${Date.now()}`,
      user: user._id,
      content: newComment.trim(),
      rating,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
    setRating(5);
  };

  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline">← Back to Perfumes</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Perfume Image and Basic Info */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square relative mb-6 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={perfume.imageUrl}
                    alt={perfume.perfumeName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(
                        perfume.perfumeName
                      )}`;
                    }}
                  />
                </div>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {perfume.perfumeName}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {brand?.brandName}
                  </p>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      ${perfume.price}
                    </Badge>
                    <Badge variant="outline">
                      ★ {averageRating.toFixed(1)} ({comments.length} reviews)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Perfume Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Concentration
                    </Label>
                    <p className="text-sm text-gray-900">
                      {perfume.concentration}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Volume
                    </Label>
                    <p className="text-sm text-gray-900">{perfume.volume}ml</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Target Audience
                    </Label>
                    <p className="text-sm text-gray-900">
                      {perfume.targetAudience}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Category
                    </Label>
                    <p className="text-sm text-gray-900">{perfume.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{perfume.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {perfume.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="outline">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Comments</CardTitle>
            <CardDescription>
              Read what others are saying about this fragrance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            {user && !user.isBlocked ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                      <option value={3}>⭐⭐⭐ (3 stars)</option>
                      <option value={2}>⭐⭐ (2 stars)</option>
                      <option value={1}>⭐ (1 star)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts about this perfume..."
                      value={newComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewComment(e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            ) : user?.isBlocked ? (
              <div className="border rounded-lg p-4 bg-red-50">
                <p className="text-red-600">
                  Your account is blocked. You cannot add reviews.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-blue-50">
                <p className="text-blue-600">
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>{" "}
                  to write a review.
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Anonymous User</span>
                        <Badge variant="outline" className="text-xs">
                          {"⭐".repeat(comment.rating)}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
