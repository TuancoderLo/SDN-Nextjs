// Mock data types and structures for the perfume website

export interface Perfume {
  _id: string;
  perfumeName: string;
  uri: string;
  price: number;
  concentration: string;
  description: string;
  ingredients: string[];
  volume: number;
  targetAudience: string;
  comments: Comment[];
  brand: string; // brand _id
  __v: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  category: string;
}

export interface Comment {
  _id: string;
  user: string; // user _id
  content: string;
  rating: number;
  createdAt: string;
}

export interface Brand {
  _id: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  YOB: number;
  gender: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isBlocked: boolean;
  blockReason?: string;
  blockedAt?: string;
  blockedBy?: string;
}

// Mock data
export const mockBrands: Brand[] = [
  {
    _id: "brand1",
    brandName: "Dior",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    __v: 0,
  },
  {
    _id: "brand2",
    brandName: "Chanel",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    __v: 0,
  },
  {
    _id: "brand3",
    brandName: "Tom Ford",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    __v: 0,
  },
  {
    _id: "brand4",
    brandName: "Creed",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    __v: 0,
  },
];

export const mockUsers: User[] = [
  {
    _id: "user1",
    email: "admin@myteam.com",
    password: "admin123", // Mock password
    name: "Admin User",
    YOB: 1990,
    gender: "Male",
    isAdmin: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    __v: 0,
    isBlocked: false,
  },
  {
    _id: "user2",
    email: "member1@test.com",
    password: "member123", // Mock password
    name: "Member One",
    YOB: 1995,
    gender: "Female",
    isAdmin: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    __v: 0,
    isBlocked: true,
    blockReason: "Violation of terms",
    blockedAt: "2024-01-15T00:00:00.000Z",
    blockedBy: "user1",
  },
];

export const mockPerfumes: Perfume[] = [
  {
    _id: "perfume1",
    perfumeName: "Sauvage",
    uri: "sauvage",
    price: 120,
    concentration: "Eau de Toilette",
    description:
      "A fresh and masculine fragrance with notes of pepper, lavender, and amber.",
    ingredients: ["Pepper", "Lavender", "Amber", "Cedar", "Vetiver"],
    volume: 100,
    targetAudience: "Men",
    comments: [
      {
        _id: "comment1",
        user: "user2",
        content: "Great scent, lasts all day!",
        rating: 5,
        createdAt: "2024-01-10T00:00:00.000Z",
      },
    ],
    brand: "brand1", // Dior
    __v: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    imageUrl: "https://picsum.photos/400/400?random=1",
    category: "Woody",
  },
  {
    _id: "perfume2",
    perfumeName: "J'adore",
    uri: "jadore",
    price: 150,
    concentration: "Eau de Parfum",
    description:
      "A luxurious floral fragrance with notes of jasmine, rose, and ylang-ylang.",
    ingredients: [
      "Jasmine",
      "Rose",
      "Ylang-Ylang",
      "Orange Blossom",
      "Patchouli",
    ],
    volume: 50,
    targetAudience: "Women",
    comments: [],
    brand: "brand1", // Dior
    __v: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    imageUrl: "https://picsum.photos/400/400?random=2",
    category: "Floral",
  },
];

// Mock API functions
export const getPerfumes = (): Perfume[] => mockPerfumes;
export const getBrands = (): Brand[] => mockBrands;
export const getUsers = (): User[] => mockUsers;
export const getPerfumeById = (id: string): Perfume | undefined =>
  mockPerfumes.find((p) => p._id === id);
export const getBrandById = (id: string): Brand | undefined =>
  mockBrands.find((b) => b._id === id);
export const getUserByEmail = (email: string): User | undefined =>
  mockUsers.find((u) => u.email === email);
