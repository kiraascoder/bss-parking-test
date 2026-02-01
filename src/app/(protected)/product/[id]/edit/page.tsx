"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { productSchema, ProductForm } from "@/types/product-form";
import { getProductById, updateProduct } from "@/services/product.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      image: "",
      description: "",
    },
  });

  // ✅ RESET form saat data datang
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        slug: data.slug,
        price: data.price,
        image: data.image ?? "",
        description: data.description ?? "",
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (payload: ProductForm) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push(`/product/${id}`);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
      className="p-6 space-y-4 max-w-xl"
    >
      <Input {...form.register("name")} />
      <Input {...form.register("slug")} />
      <Input
        type="number"
        {...form.register("price", { valueAsNumber: true })}
      />
      <Input {...form.register("image")} />
      <Input {...form.register("description")} />

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Updating..." : "Update"}
      </Button>
    </form>
  );
}
