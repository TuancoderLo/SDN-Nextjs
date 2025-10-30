"use client";

import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import {
  getUsers,
  getPerfumes,
  getBrands,
  User,
  Perfume,
  Brand,
} from "../../lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "../../components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const { user, isInitialized } = useAuth();

  // Show loading state while determining auth status
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users, perfumes, and brands</p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="perfumes">Perfumes</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <UsersManagement />
            </TabsContent>

            <TabsContent value="perfumes" className="mt-6">
              <PerfumesManagement />
            </TabsContent>

            <TabsContent value="brands" className="mt-6">
              <BrandsManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function UsersManagement() {
  const [users, setUsers] = useState<User[]>(getUsers());

  const toggleBlockUser = (userId: string) => {
    setUsers(
      users.map((u) =>
        u._id === userId
          ? {
              ...u,
              isBlocked: !u.isBlocked,
              blockReason: !u.isBlocked ? "Administrative action" : undefined,
              blockedAt: !u.isBlocked ? new Date().toISOString() : undefined,
              blockedBy: !u.isBlocked ? "admin" : undefined,
            }
          : u
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.isAdmin ? "default" : "secondary"}>
                    {user.isAdmin ? "Admin" : "Member"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isBlocked ? "destructive" : "outline"}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.isBlocked ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => toggleBlockUser(user._id)}
                    disabled={user.isAdmin} // Can't block admins
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PerfumesManagement() {
  const [perfumes, setPerfumes] = useState<Perfume[]>(getPerfumes());
  const [brands] = useState<Brand[]>(getBrands());
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Perfume>>({});

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b._id === brandId);
    return brand ? brand.brandName : "Unknown";
  };

  const handleEdit = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setEditForm({ ...perfume });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      perfumeName: "",
      price: 0,
      concentration: "",
      description: "",
      ingredients: [],
      volume: 0,
      targetAudience: "",
      brand: brands[0]?._id || "",
      category: "",
      imageUrl: "",
      comments: [],
      _id: "",
      uri: "",
      __v: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = (perfumeId: string) => {
    if (confirm("Are you sure you want to delete this perfume?")) {
      setPerfumes(perfumes.filter((p) => p._id !== perfumeId));
    }
  };

  const handleSave = () => {
    if (isAdding) {
      const newPerfume: Perfume = {
        ...editForm,
        _id: `perfume_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Perfume;
      setPerfumes([...perfumes, newPerfume]);
      setIsAdding(false);
    } else if (editingPerfume) {
      setPerfumes(
        perfumes.map((p) =>
          p._id === editingPerfume._id
            ? { ...p, ...editForm, updatedAt: new Date().toISOString() }
            : p
        )
      );
      setEditingPerfume(null);
    }
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingPerfume(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Perfume Management</CardTitle>
            <CardDescription>View and manage perfume inventory</CardDescription>
          </div>
          <Button onClick={handleAdd}>Add New Perfume</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perfumes.map((perfume) => (
                <TableRow key={perfume._id}>
                  <TableCell>{perfume.perfumeName}</TableCell>
                  <TableCell>{getBrandName(perfume.brand)}</TableCell>
                  <TableCell>${perfume.price}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{perfume.category}</Badge>
                  </TableCell>
                  <TableCell>{perfume.comments.length}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(perfume)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(perfume._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Modal */}
      {(editingPerfume || isAdding) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isAdding ? "Add New Perfume" : "Edit Perfume"}
              </h2>
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
                  <Label htmlFor="brand">Brand</Label>
                  <select
                    id="brand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.brand || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, brand: e.target.value })
                    }
                  >
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
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
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Input
                    id="ingredients"
                    value={
                      Array.isArray(editForm.ingredients)
                        ? editForm.ingredients.join(", ")
                        : editForm.ingredients || ""
                    }
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        ingredients: e.target.value
                          .split(",")
                          .map((i) => i.trim()),
                      })
                    }
                    placeholder="Enter ingredients separated by commas"
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
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <select
                    id="targetAudience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.targetAudience || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        targetAudience: e.target.value,
                      })
                    }
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
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
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={editForm.imageUrl || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BrandsManagement() {
  const [brands, setBrands] = useState<Brand[]>(getBrands());
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Brand>>({});

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setEditForm({ ...brand });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      brandName: "",
      _id: "",
      __v: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = (brandId: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter((b) => b._id !== brandId));
    }
  };

  const handleSave = () => {
    if (isAdding) {
      const newBrand: Brand = {
        ...editForm,
        _id: `brand_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Brand;
      setBrands([...brands, newBrand]);
      setIsAdding(false);
    } else if (editingBrand) {
      setBrands(
        brands.map((b) =>
          b._id === editingBrand._id
            ? { ...b, ...editForm, updatedAt: new Date().toISOString() }
            : b
        )
      );
      setEditingBrand(null);
    }
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingBrand(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Brand Management</CardTitle>
            <CardDescription>View and manage perfume brands</CardDescription>
          </div>
          <Button onClick={handleAdd}>Add New Brand</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>{brand.brandName}</TableCell>
                  <TableCell>
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(brand.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(brand._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Modal */}
      {(editingBrand || isAdding) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {isAdding ? "Add New Brand" : "Edit Brand"}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={editForm.brandName || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, brandName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
