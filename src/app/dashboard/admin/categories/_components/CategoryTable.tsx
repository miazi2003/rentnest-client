"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { CategoryFormModal, ICategory } from "./CategoryForm";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import {
  Tag,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  FolderTree,
} from "lucide-react";

interface CategoryTableProps {
  categories?: ICategory[] | {
    data?: ICategory[] | { data?: ICategory[]; result?: ICategory[]; categories?: ICategory[] };
  };
}


type SortField = "name" | "description" | "createdAt";
type SortOrder = "asc" | "desc";

export function CategoryTable({ categories }: CategoryTableProps) {
  const categoryList = useMemo(() => {
    if (categories === undefined) return [];
    if (Array.isArray(categories)) return categories;

    if (categories && typeof categories === "object") {
      if (Array.isArray(categories.data)) return categories.data;
      const d = categories.data;
      if (d && typeof d === "object") {
        if (Array.isArray(d.data)) return d.data;
        if (Array.isArray(d.result)) return d.result;
        if (Array.isArray(d.categories)) return d.categories;
      }
    }

    return [];
  }, [categories]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<ICategory | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] =
    useState<ICategory | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredCategories = useMemo(() => {
    return categoryList.filter((cat: ICategory) => {
      const nameStr = cat.name || "";
      const descStr = cat.description || "";

      return (
        nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descStr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [categoryList, searchTerm]);

  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a: ICategory, b: ICategory) => {
      let aValue: string | number = a[sortField] || "";
      let bValue: string | number = b[sortField] || "";

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCategories, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedCategories.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedCategories = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedCategories.slice(start, start + pageSize);
  }, [sortedCategories, validPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-slate-400 opacity-60 group-hover:opacity-100" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1.5 text-primary font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1.5 text-primary font-bold" />
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const handleOpenCreate = () => {
    setSelectedCategoryForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: ICategory) => {
    setSelectedCategoryForEdit(category);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category: ICategory) => {
    setSelectedCategoryForDelete(category);
    setIsDeleteOpen(true);
  };

  const startItemIndex = (validPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(validPage * pageSize, sortedCategories.length);

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Categories Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, and organize property categories.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <FolderTree className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total Categories: {categoryList.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>


      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-5">

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search category by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
            />
          </div>
        </div>


        <div className="hidden md:block rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800">
              <TableRow className="hover:bg-transparent">

                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Category Name
                    {getSortIcon("name")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("description")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Description
                    {getSortIcon("description")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Created
                    {getSortIcon("createdAt")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat) => (
                  <TableRow
                    key={cat.id || cat._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >

                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shrink-0">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {cat.name}
                        </span>
                      </div>
                    </TableCell>


                    <TableCell className="py-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {cat.description || "—"}
                    </TableCell>


                    <TableCell className="py-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(cat.createdAt)}
                    </TableCell>


                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>


                        <button
                          type="button"
                          onClick={() => handleOpenDelete(cat)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors cursor-pointer dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500 dark:text-slate-400"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>


        <div className="block md:hidden space-y-3">
          {paginatedCategories.length > 0 ? (
            paginatedCategories.map((cat) => (
              <div
                key={cat.id || cat._id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {cat.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(cat)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {cat.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Created: {formatDate(cat.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl">
              No categories found.
            </div>
          )}
        </div>


        {sortedCategories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-700">{startItemIndex}</span> to{" "}
              <span className="font-semibold text-slate-700">{endItemIndex}</span> of{" "}
              <span className="font-semibold text-slate-700">{sortedCategories.length}</span> categories
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>


      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedCategoryForEdit}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={selectedCategoryForDelete}
      />
    </div>
  );
}
