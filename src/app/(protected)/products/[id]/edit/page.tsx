"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { productSchema, ProductForm } from "@/types/product-form";
import { getProductById, updateProduct } from "@/services/product.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    values: data
      ? {
          name: data.name,
          slug: data.slug,
          price: data.price,
          image: data.image ?? "",
          description: data.description ?? "",
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (payload: ProductForm) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push(`/products/${id}`);
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Edit Product</h1>

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="text-sm">Failed to update product. Please try again.</p>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="text-sm text-red-600">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (IDR)</Label>
          <Input
            id="price"
            type="number"
            {...form.register("price", { valueAsNumber: true })}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-600">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" {...form.register("image")} />
          {form.formState.errors.image && (
            <p className="text-sm text-red-600">
              {form.formState.errors.image.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-sm text-red-600">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
