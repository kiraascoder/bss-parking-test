import { supabaseClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import { ProductForm } from "@/types/product-form";

interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
}

export async function getProducts({
  page,
  limit,
  search,
}: GetProductsParams): Promise<{ data: Product[]; count: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseClient
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data ?? [],
    count: count ?? 0,
  };
}

export async function createProduct(payload: ProductForm) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabaseClient.from("products").insert({
    ...payload,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, payload: ProductForm) {
  const { error } = await supabaseClient
    .from("products")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
}


export async function deleteProduct(id: string) {
  const { error } = await supabaseClient.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
  