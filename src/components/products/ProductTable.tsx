
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink, Copy } from 'lucide-react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
}

const ProductTable = ({
  products,
  loading,
  error,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalProducts,
  onPageChange,
}: ProductTableProps) => {
  const { toast } = useToast();
  
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);
  
  const copyCheckoutLink = (productSlug: string) => {
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${productSlug}`;
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Checkout link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Error copying link:', err);
        toast({
          title: "Error",
          description: "Could not copy link",
          variant: "destructive",
        });
      });
  };

  const openCheckoutPage = (productSlug: string) => {
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${productSlug}`;
    window.open(checkoutUrl, '_blank');
  };
  
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">No products found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                <TableCell>R$ {Number(product.price).toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>
                  {product.image_url ? (
                    <div className="h-10 w-10 overflow-hidden rounded-md">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${product.is_digital ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {product.is_digital ? 'Digital' : 'Physical'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCheckoutLink(product.slug)}
                      title="Copy checkout link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCheckoutPage(product.slug)}
                      title="Open checkout page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
