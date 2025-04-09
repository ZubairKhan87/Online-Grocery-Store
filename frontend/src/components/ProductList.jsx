// 2. Product List Component (components/ProductList.jsx)
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/api/products/get-products/');
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Products List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id} className="p-2 border rounded mb-2">
            <p>Name: {product.name}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}