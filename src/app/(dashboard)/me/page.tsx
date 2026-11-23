"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Camera,
  Droplets,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Stethoscope,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import {
  BLOOD_GROUPS,
  BloodGroup,
  Gender,
  getMyProfile,
  updateMyProfile,
  UpdateMyProfilePayload,
  uploadMyProfileImage,
} from "@/lib/me";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    qualifications: "",
    experienceYears: "",
    consultationFee: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await getMyProfile();
        const roleProfile = data.doctor || data.patient;

        setImageUrl(data.imageUrl || roleProfile?.profilePhoto || "");
        if (data.doctor?.department?.name) {
          setDepartmentName(data.doctor.department.name);
        }

        const formattedDob = data.patient?.dateOfBirth
          ? new Date(data.patient.dateOfBirth).toISOString().split("T")[0]
          : "";

        setFormData({
          name: data.name || roleProfile?.name || "",
          contactNumber: roleProfile?.contactNumber || "",
          address: roleProfile?.address || "",
          gender: roleProfile?.gender || "",
          dateOfBirth: formattedDob,
          bloodGroup: data.patient?.bloodGroup || "",
          qualifications: data.doctor?.qualifications || "",
          experienceYears:
            data.doctor?.experienceYears !== undefined &&
            data.doctor?.experienceYears !== null
              ? String(data.doctor.experienceYears)
              : "",
          consultationFee:
            data.doctor?.consultationFee !== undefined &&
            data.doctor?.consultationFee !== null
              ? String(data.doctor.consultationFee)
              : "",
          bio: data.doctor?.bio || "",
        });
      } catch {
        setFormData((prev) => ({ ...prev, name: user.name || "" }));
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const updatedUser = await uploadMyProfileImage(file);
      if (updatedUser.imageUrl) {
        setImageUrl(updatedUser.imageUrl);
      }
      toast.success("Profile photo updated!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: UpdateMyProfilePayload = {
        ...(formData.name.trim() && { name: formData.name.trim() }),
      };

      if (user?.role === "PATIENT" || user?.role === "DOCTOR") {
        if (formData.contactNumber.trim()) {
          payload.contactNumber = formData.contactNumber.trim();
        }
        if (formData.address.trim()) {
          payload.address = formData.address.trim();
        }
        if (formData.gender) {
          payload.gender = formData.gender as Gender;
        }
      }

      if (user?.role === "PATIENT") {
        if (formData.bloodGroup) {
          payload.bloodGroup = formData.bloodGroup as BloodGroup;
        }
        if (formData.dateOfBirth) {
          payload.dateOfBirth = formData.dateOfBirth;
        }
      }

      if (user?.role === "DOCTOR") {
        if (formData.qualifications.trim()) {
          payload.qualifications = formData.qualifications.trim();
        }
        if (formData.experienceYears !== "") {
          payload.experienceYears = Number(formData.experienceYears);
        }
        if (formData.consultationFee !== "") {
          payload.consultationFee = Number(formData.consultationFee);
        }
        if (formData.bio.trim()) {
          payload.bio = formData.bio.trim();
        }
      }

      await updateMyProfile(payload);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  const isDoctorOrPatient = user.role === "DOCTOR" || user.role === "PATIENT";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile photo and account information.
        </p>
      </div>

      {/* Avatar & Account Overview Card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-5 pt-6 sm:flex-row">
          <div className="relative">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={imageUrl} alt={formData.name || user.name} />
              <AvatarFallback className="text-lg">
                {(formData.name || user.name || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-semibold">
                {formData.name || user.name}
              </h2>
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {user.role}
              </Badge>
              {departmentName && (
                <Badge variant="outline">{departmentName}</Badge>
              )}
            </div>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              Click the camera icon to upload a new profile picture.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal & Role Information</CardTitle>
          <CardDescription>
            Update your details below and save changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading profile data...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-9"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Read-only)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      className="bg-muted/50 pl-9"
                      value={user.email}
                      disabled
                    />
                  </div>
                </div>

                {isDoctorOrPatient && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="contactNumber"
                          placeholder="01XXXXXXXXX"
                          className="pl-9"
                          value={formData.contactNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(val) =>
                          setFormData({ ...formData, gender: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {isDoctorOrPatient && (
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Your city or full address"
                      className="pl-9"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Patient Specific */}
              {user.role === "PATIENT" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-destructive" />
                      Blood Group
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(val) =>
                        setFormData({ ...formData, bloodGroup: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg.value} value={bg.value}>
                            {bg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Doctor Specific */}
              {user.role === "DOCTOR" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      Professional Details
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="qualifications">Qualifications</Label>
                        <Input
                          id="qualifications"
                          placeholder="MBBS, FCPS (Medicine)..."
                          value={formData.qualifications}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              qualifications: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experienceYears">
                          Experience (Years)
                        </Label>
                        <Input
                          id="experienceYears"
                          type="number"
                          min={0}
                          value={formData.experienceYears}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              experienceYears: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consultationFee">
                          Consultation Fee (BDT)
                        </Label>
                        <Input
                          id="consultationFee"
                          type="number"
                          min={1}
                          value={formData.consultationFee}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              consultationFee: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bio">Short Bio</Label>
                        <Textarea
                          id="bio"
                          rows={3}
                          placeholder="Write a brief introduction for patients..."
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}