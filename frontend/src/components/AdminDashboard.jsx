// 3. Admin Dashboard Page (pages/AdminDashboard.jsx)
import ProductForm from './ProductForm';
import ProductList from './ProductList';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ProductForm fetchProducts={() => {}} />
      <ProductList />
    </div>
  );
}