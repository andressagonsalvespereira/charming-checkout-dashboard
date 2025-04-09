
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Product } from '@/types/product';

interface ProductSummaryProps {
  product: Product;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ product }) => {
  // Format price as currency
  const formattedPrice = typeof (product.price || product.preco) === 'number' 
    ? formatCurrency(product.price || product.preco || 0) 
    : 'Price unavailable';

  return (
    <div className="flex items-start space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
      {(product.image_url || product.urlImagem) && (
        <div className="flex-shrink-0">
          <img 
            src={product.image_url || product.urlImagem} 
            alt={product.name || product.nome || 'Product'} 
            className="w-16 h-16 object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="flex-1">
        <h3 className="font-medium text-lg">{product.name || product.nome}</h3>
        <p className="text-gray-600 text-sm mb-1">{product.description || product.descricao}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">{formattedPrice}</span>
          
          {(product.is_digital || product.digital) && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Digital Product
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
