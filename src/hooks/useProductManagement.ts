
import { useEffect, useRef } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types/product';
import { useProductForm } from './useProductForm';
import { useProductDialogs } from './useProductDialogs';
import { useProductPagination } from './useProductPagination';
import { useProductOperations } from './useProductOperations';

export const useGerenciamentoProdutos = () => {
  // Ref to check if component has been mounted
  const isMountedRef = useRef(false);
  
  // Get products and state from context
  const { 
    products: produtos, 
    loading: carregando, 
    error: erro,
    isOffline: estaOffline
  } = useProducts();

  // Specialized hooks
  const { 
    formData: dadosFormulario, 
    setFormData: definirDadosFormulario, 
    resetForm: redefinirFormulario,
    handleInputChange: manipularMudancaInput,
    handleSwitchChange: manipularMudancaSwitch,
    handleUseCustomProcessingChange: manipularMudancaProcessamentoPersonalizado,
    handleManualCardStatusChange: manipularMudancaStatusCartaoManual
  } = useProductForm();

  const {
    dialogoAdicaoAberto,
    definirDialogoAdicaoAberto,
    dialogoEdicaoAberto,
    definirDialogoEdicaoAberto,
    dialogoRemocaoAberto,
    definirDialogoRemocaoAberto,
    produtoEmEdicao,
    definirProdutoEmEdicao,
    produtoParaRemover,
    definirProdutoParaRemover
  } = useProductDialogs();

  const {
    paginaAtual,
    tamanhoPagina,
    handleMudancaPagina
  } = useProductPagination(produtos.length);

  const {
    handleAdicionarProduto,
    handleAtualizarProduto,
    handleRemoverProduto,
    atualizarProdutos
  } = useProductOperations();

  // Debug log to monitor mounting/unmounting
  useEffect(() => {
    console.log('Hook useGerenciamentoProdutos mounted, isMounted:', isMountedRef.current);
    isMountedRef.current = true;
    
    return () => {
      console.log('Hook useGerenciamentoProdutos unmounted');
      isMountedRef.current = false;
    };
  }, []);

  // Handle edit button click
  const handleEditarClique = (produto: Product) => {
    definirProdutoEmEdicao(produto);
    definirDadosFormulario({
      nome: produto.nome || produto.name || '',
      descricao: produto.descricao || produto.description || '',
      preco: produto.preco || produto.price || 0,
      urlImagem: produto.urlImagem || produto.image_url || '',
      digital: produto.digital || Boolean(produto.is_digital) || false,
      usarProcessamentoPersonalizado: produto.usarProcessamentoPersonalizado || Boolean(produto.override_global_status) || false,
      statusCartaoManual: produto.statusCartaoManual || produto.custom_manual_status || 'ANALISE'
    });
    definirDialogoEdicaoAberto(true);
  };

  // Handle delete button click
  const handleRemoverClique = (produto: Product) => {
    definirProdutoParaRemover(produto);
    definirDialogoRemocaoAberto(true);
  };

  // Handlers for CRUD operations
  const handleAddProduct = async () => {
    const sucesso = await handleAdicionarProduto(dadosFormulario);
    if (sucesso) {
      redefinirFormulario();
      definirDialogoAdicaoAberto(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!produtoEmEdicao) return;
    
    const sucesso = await handleAtualizarProduto(String(produtoEmEdicao.id), dadosFormulario);
    if (sucesso) {
      definirDialogoEdicaoAberto(false);
      definirProdutoEmEdicao(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!produtoParaRemover) return;
    
    const sucesso = await handleRemoverProduto(String(produtoParaRemover.id));
    if (sucesso) {
      definirDialogoRemocaoAberto(false);
      definirProdutoParaRemover(null);
    }
  };

  return {
    // Product state
    products: produtos,
    loading: carregando,
    error: erro,
    isOffline: estaOffline,
    
    // Form state
    formData: dadosFormulario,
    handleInputChange: manipularMudancaInput,
    handleSwitchChange: manipularMudancaSwitch,
    handleUseCustomProcessingChange: manipularMudancaProcessamentoPersonalizado,
    handleManualCardStatusChange: manipularMudancaStatusCartaoManual,
    resetForm: redefinirFormulario,
    
    // Dialog state
    isAddDialogOpen: dialogoAdicaoAberto,
    setIsAddDialogOpen: definirDialogoAdicaoAberto,
    isEditDialogOpen: dialogoEdicaoAberto,
    setIsEditDialogOpen: definirDialogoEdicaoAberto,
    isDeleteDialogOpen: dialogoRemocaoAberto,
    setIsDeleteDialogOpen: definirDialogoRemocaoAberto,
    editingProduct: produtoEmEdicao,
    productToDelete: produtoParaRemover,
    
    // Action handlers
    handleAddProduct,
    handleEditClick: handleEditarClique,
    handleDeleteClick: handleRemoverClique,
    handleUpdateProduct,
    handleDeleteProduct,
    refreshProducts: atualizarProdutos,
    
    // Pagination
    currentPage: paginaAtual,
    pageSize: tamanhoPagina,
    handlePageChange: handleMudancaPagina
  };
};

// Export with the old name for compatibility
export const useProductManagement = useGerenciamentoProdutos;
