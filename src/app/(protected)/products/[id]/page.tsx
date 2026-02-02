"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, deleteProduct } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 max-w-2xl">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-semibold">Product Not Found</p>
          <p className="text-sm mt-1">
            The product you&apos;re looking for doesn&apos;t exist or has been deleted. Please check the product ID and try again.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
          className="mt-4"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      {data.image && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Slug: {data.slug}
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-primary">
            Rp {data.price.toLocaleString("id-ID")}
          </p>
        </div>

        {data.description && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
        )}
      </div>

      {deleteMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="text-sm">Failed to delete product. Please try again.</p>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => router.push(`/products/${id}/edit`)}
        >
          Edit Product
        </Button>
        <Button
          variant="destructive"
          disabled={deleteMutation.isPending}
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to delete this product? This action cannot be undone.",
              )
            ) {
              deleteMutation.mutate();
            }
          }}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Product"}
        </Button>
      </div>
    </div>
  );
}
