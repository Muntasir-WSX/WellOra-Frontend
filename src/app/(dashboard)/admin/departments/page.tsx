"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Stethoscope,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

import {
  getDepartmentsApi,
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
  IDepartment,
} from "@/lib/department.api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const COMMON_DEPARTMENTS = [
  {
    name: "Cardiology",
    description: "Comprehensive heart, cardiovascular, and hypertension care.",
  },
  {
    name: "Neurology",
    description:
      "Diagnosis and treatment of brain, spinal cord, and nervous system disorders.",
  },
  {
    name: "Orthopaedics & Joint Replacement Surgery",
    description:
      "Bone, joint, spine, sports injury, and joint replacement care.",
  },
  {
    name: "Obstetrics and Gynaecology",
    description: "Women's reproductive health, pregnancy, and maternity care.",
  },
  {
    name: "Paediatrics",
    description: "Complete medical care for infants, children, and adolescents.",
  },
  {
    name: "Dermatology & Venereology",
    description:
      "Skin, hair, nail, allergy, and cosmetic dermatology treatments.",
  },
  {
    name: "Gastroenterology & Hepatology",
    description:
      "Digestive tract, stomach, liver, and pancreatic disorder management.",
  },
  {
    name: "ENT & Head Neck Surgery",
    description: "Ear, nose, throat, sinus, and head-neck surgical care.",
  },
  {
    name: "Ophthalmology",
    description: "Comprehensive eye care, vision testing, and cataract surgery.",
  },
  {
    name: "Endocrinology & Diabetology",
    description: "Diabetes, thyroid, hormone, and metabolic disorder care.",
  },
  {
    name: "Internal Medicine",
    description:
      "Adult primary care and complex multi-system disease management.",
  },
  {
    name: "General & Laparoscopic Surgery",
    description:
      "Minimally invasive laparoscopic and general surgical procedures.",
  },
  {
    name: "Nephrology",
    description: "Kidney disease, dialysis, and renal health management.",
  },
  {
    name: "Respiratory Medicine",
    description: "Asthma, COPD, lung infection, and pulmonary care.",
  },
  {
    name: "Psychiatry & Mental Health",
    description: "Mental wellness, anxiety, depression, and behavioral therapy.",
  },
];

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create / Edit Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<IDepartment | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formError, setFormError] = useState("");

  // Delete AlertDialog State
  const [deleteTarget, setDeleteTarget] = useState<IDepartment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDepartmentsApi();
      setDepartments(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load departments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setFormError("");
    setDialogOpen(true);
  };

  const openEditModal = (dept: IDepartment) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description || "");
    setImageUrl(dept.imageUrl || "");
    setFormError("");
    setDialogOpen(true);
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (name.trim().length < 2) {
      setFormError("Department name must be at least 2 characters.");
      return;
    }

    if (imageUrl.trim()) {
      try {
        new URL(imageUrl.trim());
      } catch {
        setFormError("Please enter a valid image URL (e.g., https://...).");
        return;
      }
    }

    try {
      setSubmitting(true);
      if (editingDept) {
        await updateDepartmentApi(editingDept.id, {
          name,
          description,
          imageUrl,
        });
        setSuccessMsg(`"${name.trim()}" updated successfully.`);
      } else {
        await createDepartmentApi({
          name,
          description,
          imageUrl,
        });
        setSuccessMsg(`"${name.trim()}" created successfully.`);
      }
      setDialogOpen(false);
      await fetchDepartments();
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save department."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setError("");
      setSuccessMsg("");
      await deleteDepartmentApi(deleteTarget.id);
      setSuccessMsg(`"${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      await fetchDepartments();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete department."
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // ১৫টি কমন ডিপার্টমেন্টের যেগুলো এখনো তৈরি হয়নি সেগুলো এক ক্লিকে তৈরি করা
  const handleQuickSetup15 = async () => {
    const existingNames = new Set(
      departments.map((d) => d.name.trim().toLowerCase())
    );
    const missing = COMMON_DEPARTMENTS.filter(
      (d) => !existingNames.has(d.name.toLowerCase())
    );

    if (missing.length === 0) {
      setSuccessMsg("All 15 core medical departments already exist!");
      return;
    }

    try {
      setBulkLoading(true);
      setError("");
      setSuccessMsg("");
      for (const dept of missing) {
        await createDepartmentApi(dept);
      }
      setSuccessMsg(
        `${missing.length} core medical departments added successfully!`
      );
      await fetchDepartments();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed while adding core departments."
      );
    } finally {
      setBulkLoading(false);
    }
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAssignedDoctors = departments.reduce(
    (sum, dept) => sum + (dept._count?.doctors || 0),
    0
  );

  const missingCoreCount = COMMON_DEPARTMENTS.filter(
    (c) =>
      !departments.some(
        (d) => d.name.trim().toLowerCase() === c.name.toLowerCase()
      )
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Medical Departments
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage hospital specialties. Departments created here appear in Doctor Applications and Public pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {missingCoreCount > 0 && (
            <Button
              variant="outline"
              onClick={handleQuickSetup15}
              disabled={bulkLoading || loading}
              className="rounded-xl border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {bulkLoading
                ? "Adding..."
                : `Quick Add ${missingCoreCount} Core Depts`}
            </Button>
          )}

          <Button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Total Departments
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {loading ? "—" : departments.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Assigned Doctors
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {loading ? "—" : totalAssignedDoctors}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Active Specialties
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {loading
                  ? "—"
                  : departments.filter((d) => (d._count?.doctors || 0) > 0)
                      .length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMsg && (
        <Alert className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Main Directory Table Card */}
      <Card className="rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-white">
          <div>
            <CardTitle className="text-base font-bold">
              Department Directory
            </CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredDepartments.length} of {departments.length}{" "}
              departments
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchDepartments}
              disabled={loading}
              className="rounded-xl shrink-0"
              title="Refresh list"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-1/3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="py-16 text-center px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                No departments found
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? `No department matches "${searchQuery}".`
                  : "Start by adding your first medical department or use Quick Add for all 15 standard specialties."}
              </p>
              {!searchQuery && (
                <div className="pt-2">
                  <Button
                    onClick={openCreateModal}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Department
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70">
                    <TableHead className="w-[300px] font-bold">
                      Department
                    </TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="w-[140px] font-bold">
                      Doctors
                    </TableHead>
                    <TableHead className="w-[130px] text-right font-bold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((dept) => {
                    const doctorCount = dept._count?.doctors ?? 0;

                    return (
                      <TableRow key={dept.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {dept.imageUrl ? (
                              <img
                                src={dept.imageUrl}
                                alt={dept.name}
                                className="w-10 h-10 rounded-xl object-cover border shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Stethoscope className="w-5 h-5" />
                              </div>
                            )}
                            <span className="font-bold text-slate-900">
                              {dept.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs sm:text-sm text-muted-foreground max-w-md">
                          <p className="line-clamp-2">
                            {dept.description || "No description provided."}
                          </p>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={doctorCount > 0 ? "default" : "secondary"}
                            className={
                              doctorCount > 0
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : ""
                            }
                          >
                            {doctorCount}{" "}
                            {doctorCount === 1 ? "Doctor" : "Doctors"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(dept)}
                              className="h-8 w-8 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Edit Department"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={doctorCount > 0}
                              onClick={() => setDeleteTarget(dept)}
                              className="h-8 w-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-40"
                              title={
                                doctorCount > 0
                                  ? "Cannot delete department with assigned doctors"
                                  : "Delete Department"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Department Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">
              {editingDept ? "Edit Department" : "Add New Department"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingDept
                ? "Update department name, description, or cover image URL."
                : "Create a new medical specialty for doctors and patients."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveDepartment} className="space-y-4 pt-2">
            {formError && (
              <Alert variant="destructive" className="rounded-xl py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {formError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="dept-name">
                Department Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="dept-name"
                placeholder="e.g., Cardiology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-desc">Description</Label>
              <Textarea
                id="dept-desc"
                placeholder="Brief overview of treatments and clinical care offered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
                className="rounded-xl resize-none"
              />
              <p className="text-[11px] text-muted-foreground text-right">
                {description.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-img">Image URL (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="dept-img"
                  type="url"
                  placeholder="https://example.com/cardiology.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              {imageUrl.trim() && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image preview</span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                {submitting
                  ? "Saving..."
                  : editingDept
                    ? "Save Changes"
                    : "Create Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}