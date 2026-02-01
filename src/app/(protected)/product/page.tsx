"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 5);
  const search = searchParams.get("search") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: () => getProducts({ page, limit, search }),
  });

  function updateParams(params: Record<string, string>) {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => newParams.set(key, value));
    router.push(`?${newParams.toString()}`);
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Terjadi kesalahan</p>;

  return (
    <div className="p-6 space-y-4">
      <Button onClick={() => router.push("/product/create")}>
        Add Product
      </Button>
      <div className="flex justify-between">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => updateParams({ search: e.target.value, page: "1" })}
          className="max-w-sm"
        />
      </div>

      {data?.data.length === 0 ? (
        <p>Produk belum ada</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Slug</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {product.name}
                </TableCell>
                <TableCell>
                  Rp {product.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{product.slug}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => updateParams({ page: String(page - 1) })}
        >
          Prev
        </Button>
        <span>Page {page}</span>
        <Button
          variant="outline"
          disabled={page * limit >= (data?.count ?? 0)}
          onClick={() => updateParams({ page: String(page + 1) })}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
