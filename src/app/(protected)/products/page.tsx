"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCurrentUserId } from "@/services/product.service";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert-message";
import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Plus, Eye, Pencil, Package, Search } from "lucide-react";

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const searchFromUrl = searchParams.get("search") ?? "";


  const [searchInput, setSearchInput] = useState(searchFromUrl);


  const debouncedSearch = useDebounce(searchInput, 500);


  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);


  useEffect(() => {
    if (debouncedSearch !== searchFromUrl) {
      // eslint-disable-next-line react-hooks/immutability
      updateParams({ search: debouncedSearch, page: "1" });
    }
  }, [debouncedSearch]);
  
  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);

  const { data, isLoading, isError } = useQuery({    
    queryKey: ["products", userId, page, limit, debouncedSearch],
    queryFn: () =>
      getProducts({
        page,
        limit,
        search: debouncedSearch,
        userId: userId ?? undefined,
      }),
    enabled: userId !== null, 
  });

  function updateParams(params: Record<string, string>) {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`?${newParams.toString()}`);
  }
  
  if (userId === null || isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-10 w-full sm:max-w-sm" />
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>
          <div className="rounded-lg border">
            <div className="p-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <AlertMessage
          variant="destructive"
          title="Error Loading Products"
          description="Failed to load products. Please check your connection and try again."
        />
      </PageContainer>
    );
  }

  const hasProducts = data && data.data.length > 0;
  const showEmptyState = !hasProducts && !debouncedSearch;
  const showNoResults = !hasProducts && debouncedSearch;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Products"
          description="Manage your product inventory"
          action={
            <Button onClick={() => router.push("/products/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          }
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
            {searchInput !== debouncedSearch && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </div>
            )}
          </div>
          <Select
            value={limit.toString()}
            onValueChange={(value) => updateParams({ limit: value, page: "1" })}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showEmptyState && (
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Get started by creating your first product. Click the button below to add a new product to your inventory."
            action={{
              label: "Create Product",
              onClick: () => router.push("/products/create"),
              icon: Plus,
            }}
          />
        )}

        {showNoResults && (
          <EmptyState
            icon={Search}
            title="No products found"
            description={`We couldn't find any products matching "${debouncedSearch}". Try adjusting your search terms.`}
          />
        )}

        {hasProducts && (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right w-40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs md:hidden">
                            {product.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs text-muted-foreground font-mono">
                          {product.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {product.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/products/${product.id}`)
                            }
                          >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/products/${product.id}/edit`)
                            }
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {data.data.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {data.count}
                </span>{" "}
                products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => updateParams({ page: String(page - 1) })}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Page</span>
                  <span className="font-medium text-foreground">{page}</span>
                  <span className="text-muted-foreground">of</span>
                  <span className="font-medium text-foreground">
                    {Math.max(1, Math.ceil((data.count ?? 0) / limit))}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * limit >= (data.count ?? 0)}
                  onClick={() => updateParams({ page: String(page + 1) })}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
