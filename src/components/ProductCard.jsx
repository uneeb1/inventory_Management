// src/components/ProductCard.jsx
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-1">Category: {product.categories?.name || 'N/A'}</p>
      <p className="text-lg font-bold text-blue-600 mb-2">${product.price}</p>
    </div>
    <p className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {product.stock_quantity > 0 ? `${product.stock_quantity} in Stock` : 'Out of Stock'}
    </p>
  </div>
);

export default ProductCard;