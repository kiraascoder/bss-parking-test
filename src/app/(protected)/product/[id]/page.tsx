"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, deleteProduct } from "@/services/product.service";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/product");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Product not found</p>;

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">{data.name}</h1>
      <p>{data.description}</p>
      <p className="font-bold">Rp {data.price}</p>

      <Button
        variant="destructive"
        disabled={deleteMutation.isPending}
        onClick={() => {
          if (confirm("Yakin hapus produk ini?")) {
            deleteMutation.mutate();
          }
        }}
      >
        {deleteMutation.isPending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
