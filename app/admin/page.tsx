"use client";

import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import { getUsers, getPerfumes, getBrands, User } from "../../lib/mockData";
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

export default function AdminDashboard() {
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
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
  const perfumes = getPerfumes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfume Management</CardTitle>
        <CardDescription>View and manage perfume inventory</CardDescription>
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
                <TableCell>{perfume.brand}</TableCell>
                <TableCell>${perfume.price}</TableCell>
                <TableCell>
                  <Badge variant="outline">{perfume.category}</Badge>
                </TableCell>
                <TableCell>{perfume.comments.length}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Edit
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

function BrandsManagement() {
  const brands = getBrands();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Management</CardTitle>
        <CardDescription>View and manage perfume brands</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Created</TableHead>
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
                  <Button variant="outline" size="sm">
                    Edit
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
