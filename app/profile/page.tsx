"use client";

import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";

export default function ProfilePage() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalFormData, setPersonalFormData] = useState({
    yearOfBirth: user?.YOB?.toString() || "",
    gender: user?.gender || "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Wait for auth initialization
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

  if (!user) {
    router.push("/login");
    return null;
  }

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setPersonalFormData({
      ...personalFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePersonal = () => {
    // Mock save - in real app, this would call an API
    setMessage("Personal information updated successfully!");
    setIsEditingPersonal(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancelPersonal = () => {
    setPersonalFormData({
      yearOfBirth: user.YOB.toString(),
      gender: user.gender,
    });
    setIsEditingPersonal(false);
  };

  const handleChangePassword = () => {
    // Validate current password
    if (passwordFormData.currentPassword !== user.password) {
      setPasswordMessage("Current password is incorrect");
      return;
    }

    // Validate new password
    if (passwordFormData.newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters long");
      return;
    }

    // Validate password confirmation
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordMessage("New passwords do not match");
      return;
    }

    // Mock password change - in real app, this would call an API
    setPasswordMessage("Password changed successfully!");
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setPasswordMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Read-only fields */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md border">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Name cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md border">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Editable fields */}
                  <div className="space-y-2">
                    <Label htmlFor="yearOfBirth">Year of Birth</Label>
                    {isEditingPersonal ? (
                      <Input
                        id="yearOfBirth"
                        name="yearOfBirth"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={personalFormData.yearOfBirth}
                        onChange={handlePersonalChange}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md border">
                        {user.YOB}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditingPersonal ? (
                      <select
                        id="gender"
                        name="gender"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={personalFormData.gender}
                        onChange={handlePersonalChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md border">
                        {user.gender}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  {isEditingPersonal ? (
                    <>
                      <Button onClick={handleSavePersonal}>Save Changes</Button>
                      <Button variant="outline" onClick={handleCancelPersonal}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditingPersonal(true)}>
                      Edit Personal Info
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {passwordMessage && (
                  <Alert
                    variant={
                      passwordMessage.includes("successfully")
                        ? "default"
                        : "destructive"
                    }
                  >
                    <AlertDescription>{passwordMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={
                    !passwordFormData.currentPassword ||
                    !passwordFormData.newPassword ||
                    !passwordFormData.confirmPassword
                  }
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Status */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role</span>
                  <Badge variant={user.isAdmin ? "default" : "secondary"}>
                    {user.isAdmin ? "Administrator" : "Member"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={user.isBlocked ? "destructive" : "outline"}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </div>

                {user.isBlocked && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-red-600 mb-2">Account Blocked</p>
                    <p className="text-xs text-gray-600">
                      Reason: {user.blockReason}
                    </p>
                    <p className="text-xs text-gray-600">
                      Blocked on:{" "}
                      {user.blockedAt
                        ? new Date(user.blockedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Account Created</p>
                  <p className="text-xs text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
