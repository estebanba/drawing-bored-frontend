import { useEffect, useState } from "react";
import { useProductsStore } from "@/store/products";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ProductsCard component handles CRUD for products
export function ProductsCard() {
  const { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, description: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState({ name: "", price: 0, description: "" });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle add product
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addProduct(newProduct);
    setNewProduct({ name: "", price: 0, description: "" });
  };

  // Handle edit product
  const handleEdit = (product: typeof newProduct & { id: number }) => {
    setEditId(product.id);
    setEditProduct({ name: product.name, price: product.price, description: product.description });
  };

  // Handle update product
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId === null) return;
    await updateProduct({ id: editId, ...editProduct });
    setEditId(null);
    setEditProduct({ name: "", price: 0, description: "" });
  };

  // Handle delete product
  const handleDelete = async (id: number) => {
    await deleteProduct(id);
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle>Products (from MySQL)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add product form */}
        <form className="flex flex-col gap-2 mb-4" onSubmit={handleAdd}>
          <Input
            placeholder="Name"
            value={newProduct.name}
            onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={newProduct.price}
            onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))}
            required
            min={0}
          />
          <Input
            placeholder="Description"
            value={newProduct.description}
            onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">Add Product</Button>
        </form>
        {/* Edit product form */}
        {editId !== null && (
          <form className="flex flex-col gap-2 mb-4" onSubmit={handleUpdate}>
            <Input
              placeholder="Name"
              value={editProduct.name}
              onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Price"
              type="number"
              value={editProduct.price}
              onChange={e => setEditProduct(p => ({ ...p, price: Number(e.target.value) }))}
              required
              min={0}
            />
            <Input
              placeholder="Description"
              value={editProduct.description}
              onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
              required
            />
            <Button type="submit" disabled={loading} className="w-full">Update Product</Button>
            <Button type="button" variant="outline" onClick={() => setEditId(null)} className="w-full">Cancel</Button>
          </form>
        )}
        {/* Products list */}
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} className="border rounded p-2 flex flex-col gap-1">
              <div><strong>{p.name}</strong> - ${p.price}</div>
              <div className="text-muted-foreground">{p.description}</div>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </li>
          ))}
          {products.length === 0 && <li className="text-muted-foreground">No products found.</li>}
        </ul>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
} 