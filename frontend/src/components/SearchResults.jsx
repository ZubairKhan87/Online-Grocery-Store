import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search/search?q=${query}`, {
        withCredentials: true, // Include credentials in the request
        // headers: {
        //   "Content-Type": "application/json",
        //   "Accept": "application/json",
        // },
      });
  
      const text = await response.text(); // Read as text first
      console.log("Raw Response:", text); // Debugging: Log raw response
  
      // Try parsing JSON
      const data = JSON.parse(text);
      console.log("Search Results:", data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for "{query}"
      </h2>
      {results.length > 0 ? (
        <ul>
          {results.map((product) => (
            <li key={product.id} className="p-4 border rounded-lg shadow-sm mb-2">
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-500 font-semibold">${product.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
