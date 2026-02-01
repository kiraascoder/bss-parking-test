"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { productSchema, ProductForm } from "@/types/product-form";
import { createProduct } from "@/services/product.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      router.push("/product");
    },
  });

  function onSubmit(data: ProductForm) {
    mutation.mutate(data);
  }

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Create Product</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Name" {...form.register("name")} />
        <Input placeholder="Slug" {...form.register("slug")} />
        <Input
          type="number"
          placeholder="Price"
          {...form.register("price", {
            valueAsNumber: true,
          })}
        />
        <Input placeholder="Image URL" {...form.register("image")} />
        <Input placeholder="Description" {...form.register("description")} />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
