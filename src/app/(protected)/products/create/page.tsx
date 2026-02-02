"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { productSchema, ProductForm } from "@/types/product-form";
import { createProduct } from "@/services/product.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
  });

  function onSubmit(data: ProductForm) {
    mutation.mutate(data);
  }

  return (
    <div className="container max-w-2xl py-6 px-4 sm:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Product
          </h1>
          <p className="text-muted-foreground mt-2">
            Add a new product to your inventory
          </p>
        </div>

        {mutation.isError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">
              Failed to create product. Please try again.
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter product name"
              {...form.register("name")}
              className={cn(
                form.formState.errors.name &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {form.formState.errors.name && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-foreground">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="product-slug"
              {...form.register("slug")}
              className={cn(
                "font-mono text-sm",
                form.formState.errors.slug &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            <p className="text-xs text-muted-foreground">
              Example : white-coffe
            </p>
            {form.formState.errors.slug && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">
              Price (IDR) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              {...form.register("price", {
                valueAsNumber: true,
              })}
              className={cn(
                form.formState.errors.price &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {form.formState.errors.price && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-foreground">
              Image URL
            </Label>
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
              {...form.register("image")}
              className={cn(
                form.formState.errors.image &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            <p className="text-xs text-muted-foreground">
              Enter a valid image URL or leave blank
            </p>
            {form.formState.errors.image && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              rows={4}
              {...form.register("description")}
              className={cn(
                "resize-none",
                form.formState.errors.description &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {form.formState.errors.description && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
