import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, updatePassword } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Key, 
  Package, 
  Search, 
  X, 
  Check, 
  AlertTriangle, 
  Crown, 
  Sparkles, 
  Database,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  BarChart3,
  User,
  Phone,
  MapPin,
  FileText,
  Upload,
  UploadCloud,
  Loader2,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';

import { CATEGORIES, PRODUCTS } from '../data/products';
import logoImg from '../assets/logo.jpg';

const CLOUDINARY_CLOUD_NAME = 'xatfslhg';
const CLOUDINARY_UPLOAD_PRESET = 'mf_alfaiataria_produtos';
const CLOUDINARY_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('produtos'); // 'produtos' | 'pedidos' | 'dashboard' | 'senha'
  
  // Firestore State
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('todos'); // 'todos' | 'pendente' | 'confirmado' | 'cancelado'
  const [chartPeriod, setChartPeriod] = useState('semana'); // 'semana' | '3meses' | '6meses'

  // Product Form Modal State  // Form State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'ternos',
    price: '',
    costPrice: '',
    oldPrice: '',
    fabric: '',
    fit: '',
    occasion: '',
    description: '',
    sizesStr: '',
    images: [],
    badge: ''
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Cloudinary Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [pendingImage, setPendingImage] = useState(null); // { file, previewUrl, name, sizeFormatted, width, height, format }
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = React.useRef(null);

  // Delete Confirmation Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Seeding State
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  // 1. Fetch Firestore Products in Real-time
  useEffect(() => {
    const colRef = collection(db, 'produtos');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setProductsList(docs);
      setLoadingProducts(false);
    }, (error) => {
      console.error("Erro ao carregar produtos:", error);
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Firestore Orders in Real-time
  useEffect(() => {
    const colRef = collection(db, 'pedidos');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      // Sort by createdAt desc
      docs.sort((a, b) => {
        const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return tB - tA;
      });
      setOrdersList(docs);
      setLoadingOrders(false);
    }, (error) => {
      console.error("Erro ao carregar pedidos:", error);
      setLoadingOrders(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin-login');
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  // Open Modal for Add Product
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'ternos',
      price: '',
      costPrice: '',
      oldPrice: '',
      fabric: '',
      fit: '',
      occasion: '',
      description: '',
      sizesStr: '48 (P), 50 (M), 52 (G), 54 (GG)',
      images: [],
      badge: ''
    });
    setFormError('');
    setUploadError('');
    setUploadSuccessMsg('');
    setPendingImage(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditModal = (product) => {
    setEditingId(product.id);
    const existingImages = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.imageUrl ? [product.imageUrl] : []);

    setFormData({
      name: product.name || '',
      category: product.category || 'ternos',
      price: product.price ? String(product.price) : '',
      costPrice: product.costPrice ? String(product.costPrice) : '',
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      fabric: product.fabric || '',
      fit: product.fit || '',
      occasion: product.occasion || '',
      description: product.description || '',
      sizesStr: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      images: existingImages,
      badge: product.badge || ''
    });
    setFormError('');
    setUploadError('');
    setUploadSuccessMsg('');
    setPendingImage(null);
    setIsModalOpen(true);
  };

  // Step 1: Handle File Selection & Inspect Dimensions/Info before Upload
  const handleSelectFileForReview = (file) => {
    if (!file) return;
    setUploadError('');
    setUploadSuccessMsg('');

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError(`O arquivo "${file.name}" excede o tamanho máximo permitido de 5MB.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      const sizeMb = file.size / (1024 * 1024);
      const sizeKb = Math.round(file.size / 1024);
      const sizeFormatted = sizeMb >= 1 ? `${sizeMb.toFixed(2)} MB` : `${sizeKb} KB`;
      const format = file.type.split('/')[1]?.toUpperCase() || 'IMAGEM';

      setPendingImage({
        file,
        previewUrl,
        name: file.name,
        sizeFormatted,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format
      });
    };
  };

  // Step 2: Confirm and Upload to Cloudinary (Unsigned Upload)
  const handleConfirmUpload = async () => {
    if (!pendingImage || !pendingImage.file) return;

    setUploadError('');
    setUploadingImage(true);

    try {
      const data = new FormData();
      data.append('file', pendingImage.file);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_ENDPOINT, {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Falha no upload do arquivo ${pendingImage.name}`);
      }

      const result = await response.json();
      if (result.secure_url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.secure_url]
        }));

        setUploadSuccessMsg('✓ Foto enviada e salva com sucesso!');
        setTimeout(() => setUploadSuccessMsg(''), 4000);
        handleCancelPendingImage();
      }
    } catch (err) {
      console.error("Erro no Cloudinary upload:", err);
      setUploadError(`Erro ao enviar foto: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancelPendingImage = () => {
    if (pendingImage?.previewUrl) {
      URL.revokeObjectURL(pendingImage.previewUrl);
    }
    setPendingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetAsPrimary = (indexToPrimary) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [primary] = newImages.splice(indexToPrimary, 1);
      newImages.unshift(primary);
      return { ...prev, images: newImages };
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, manualUrlInput.trim()]
    }));
    setManualUrlInput('');
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.price) {
      setFormError('Preencha os campos obrigatórios: Nome e Preço de Venda.');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      setFormError('Adicione pelo menos 1 foto para o produto (via upload ou URL).');
      return;
    }

    const priceNum = parseFloat(formData.price.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Por favor, informe um preço de venda válido maior que zero.');
      return;
    }

    const costPriceNum = formData.costPrice ? parseFloat(formData.costPrice.replace(',', '.')) : (priceNum * 0.45);
    const oldPriceNum = formData.oldPrice ? parseFloat(formData.oldPrice.replace(',', '.')) : null;
    const sizesArray = formData.sizesStr.split(',').map(s => s.trim()).filter(Boolean);

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: priceNum,
        costPrice: costPriceNum,
        oldPrice: (oldPriceNum && !isNaN(oldPriceNum)) ? oldPriceNum : null,
        fabric: formData.fabric.trim() || 'Tecido nobre de alta alfaiataria',
        fit: formData.fit.trim() || 'Caimento Sartorial Sob Medida',
        occasion: formData.occasion.trim() || 'Eventos Formais & Ocasiões Especiais',
        description: formData.description.trim() || 'Peça confeccionada com elevado padrão de alfaiataria.',
        sizes: sizesArray.length > 0 ? sizesArray : ['Tamanho Único'],
        images: formData.images,
        imageUrl: formData.images[0], // fallback for legacy components
        badge: formData.badge.trim() || null,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        const docRef = doc(db, 'produtos', editingId);
        await updateDoc(docRef, payload);
      } else {
        payload.rating = 5.0;
        payload.reviewsCount = 1;
        payload.isFeatured = true;
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'produtos'), payload);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setFormError('Erro ao salvar no Firestore: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Confirm Delete Product
  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'produtos', deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert('Erro ao excluir produto: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Update Order Status (Confirm or Cancel)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'pedidos', orderId);
      const updateData = {
        status: newStatus,
        updatedAt: serverTimestamp()
      };
      if (newStatus === 'confirmado') {
        updateData.confirmedAt = serverTimestamp();
      }
      await updateDoc(orderRef, updateData);
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
      alert("Erro ao atualizar status do pedido: " + err.message);
    }
  };

  // Password Update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'A confirmação de senha não confere.' });
      return;
    }

    setUpdatingPassword(true);

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      let errorText = 'Erro ao alterar a senha. Tente refazer o login e tentar novamente.';
      if (err.code === 'auth/requires-recent-login') {
        errorText = 'Por segurança, faça logout e login novamente para alterar sua senha.';
      }
      setPasswordMsg({ type: 'error', text: errorText });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Seed Initial Catalog to Firestore
  const handleSeedDatabase = async () => {
    if (!window.confirm('Deseja cadastrar os produtos padrão iniciais no Firestore?')) return;
    setSeeding(true);
    setSeedMsg('');
    try {
      const colRef = collection(db, 'produtos');
      for (const prod of PRODUCTS) {
        const { id, ...prodData } = prod;
        await addDoc(colRef, {
          ...prodData,
          costPrice: prodData.costPrice || (prodData.price * 0.45),
          createdAt: serverTimestamp()
        });
      }
      setSeedMsg('Sucesso! Produtos padrão adicionados ao Firestore com Preço de Custo estimado.');
    } catch (err) {
      console.error("Erro no seed:", err);
      setSeedMsg('Erro ao alimentar banco: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Filtered Products by Search
  const filteredProducts = productsList.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  });

  // Filtered Orders by Status
  const filteredOrders = ordersList.filter(o => {
    if (orderStatusFilter === 'todos') return true;
    return o.status === orderStatusFilter;
  });

  const pendingOrdersCount = ordersList.filter(o => o.status === 'pendente').length;

  // ─────────────────────────────────────────────────────────────
  // FINANCIAL CALCULATIONS (ONLY CONFIRMED ORDERS)
  // ─────────────────────────────────────────────────────────────
  const confirmedOrders = useMemo(() => {
    return ordersList.filter(o => o.status === 'confirmado');
  }, [ordersList]);

  const financialMetrics = useMemo(() => {
    let totalSales = 0;
    let totalInvested = 0;
    const productSalesMap = {}; // productName -> { qty, revenue, cost }

    confirmedOrders.forEach(order => {
      const items = order.items || [];
      items.forEach(item => {
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const cost = item.costPrice || (price * 0.45);

        const itemRevenue = price * qty;
        const itemCost = cost * qty;

        totalSales += itemRevenue;
        totalInvested += itemCost;

        const prodName = item.name || 'Produto Não Identificado';
        if (!productSalesMap[prodName]) {
          productSalesMap[prodName] = { name: prodName, quantidade: 0, receita: 0 };
        }
        productSalesMap[prodName].quantidade += qty;
        productSalesMap[prodName].receita += itemRevenue;
      });
    });

    const netProfit = totalSales - totalInvested;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;

    // Top Products Data Array for Recharts
    const topProductsChartData = Object.values(productSalesMap)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 6);

    return {
      totalSales,
      totalInvested,
      netProfit,
      profitMargin,
      topProductsChartData
    };
  }, [confirmedOrders]);

  // Chart Data: Sales Over Time (Week, 3 Months, 6 Months)
  const salesOverTimeData = useMemo(() => {
    const now = new Date();
    const result = [];

    if (chartPeriod === 'semana') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        
        // Sum confirmed sales on this day
        const dayTotal = confirmedOrders.reduce((acc, order) => {
          const orderDate = order.confirmedAt?.toDate ? order.confirmedAt.toDate() : (order.createdAt?.toDate ? order.createdAt.toDate() : null);
          if (orderDate && orderDate.toDateString() === d.toDateString()) {
            return acc + (order.totalAmount || 0);
          }
          return acc;
        }, 0);

        result.push({ period: dayLabel, Vendas: dayTotal });
      }
    } else {
      // 3 or 6 Months
      const monthsCount = chartPeriod === '3meses' ? 3 : 6;
      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

        const monthTotal = confirmedOrders.reduce((acc, order) => {
          const orderDate = order.confirmedAt?.toDate ? order.confirmedAt.toDate() : (order.createdAt?.toDate ? order.createdAt.toDate() : null);
          if (orderDate && orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === d.getFullYear()) {
            return acc + (order.totalAmount || 0);
          }
          return acc;
        }, 0);

        result.push({ period: monthLabel, Vendas: monthTotal });
      }
    }

    return result;
  }, [confirmedOrders, chartPeriod]);

  const getCategoryLabel = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    return cat ? cat.label : catId;
  };

  const formatCurrency = (val) => {
    if (!val) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recente';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
    } catch {
      return 'Recente';
    }
  };

  return (
    <div className="min-h-screen bg-aurum-bg text-gray-100 flex flex-col font-sans selection:bg-aurum-gold/30 selection:text-aurum-gold-light">
      
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-30 bg-aurum-card/95 border-b border-aurum-gold/20 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-aurum-gold/50 shadow-gold-sm">
              <img src={logoImg} alt="MF Alfaiataria" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-aurum-gold text-[10px] font-bold uppercase tracking-wider">
                <Crown className="w-3 h-3" />
                <span>MF Alfaiataria</span>
              </div>
              <h1 className="text-base font-bold text-white font-serif">Painel Administrativo</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('/', '_blank')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-aurum-border hover:border-aurum-gold text-xs text-gray-300 hover:text-aurum-gold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-red-300 hover:text-red-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-aurum-border/60 pb-4 mb-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveTab('produtos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'produtos'
                  ? 'bg-aurum-gold text-black shadow-gold-sm'
                  : 'bg-aurum-surface text-gray-400 border border-aurum-border hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos ({productsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pedidos')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pedidos'
                  ? 'bg-aurum-gold text-black shadow-gold-sm'
                  : 'bg-aurum-surface text-gray-400 border border-aurum-border hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedidos</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-aurum-gold text-black shadow-gold-sm'
                  : 'bg-aurum-surface text-gray-400 border border-aurum-border hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard Financeiro</span>
            </button>

            <button
              onClick={() => setActiveTab('senha')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'senha'
                  ? 'bg-aurum-gold text-black shadow-gold-sm'
                  : 'bg-aurum-surface text-gray-400 border border-aurum-border hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Senha</span>
            </button>
          </div>

          {activeTab === 'produtos' && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs shadow-gold-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </button>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: GERENCIAR PRODUTOS (CRUD)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'produtos' && (
          <div className="space-y-6">
            
            {/* Search & Utility Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-aurum-card p-4 rounded-2xl border border-aurum-border">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aurum-gold/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produto por nome, tecido..."
                  className="w-full bg-aurum-surface border border-aurum-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                />
              </div>

              {productsList.length === 0 && !loadingProducts && (
                <button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-aurum-surface border border-aurum-gold/40 text-aurum-gold hover:bg-aurum-gold/10 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{seeding ? 'Carregando...' : 'Carregar Catálogo Inicial no Firestore'}</span>
                </button>
              )}
            </div>

            {seedMsg && (
              <div className="p-3 rounded-xl bg-aurum-surface border border-aurum-gold/40 text-aurum-gold text-xs">
                {seedMsg}
              </div>
            )}

            {/* Products Table */}
            {loadingProducts ? (
              <div className="py-16 text-center text-aurum-gold flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-aurum-gold/20 border-t-aurum-gold animate-spin"></div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-aurum-card rounded-2xl border border-aurum-border p-8">
                <Package className="w-12 h-12 text-aurum-gold/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1 font-serif">Nenhum produto cadastrado</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  Sua loja no Firestore ainda não possui produtos ou a busca não retornou resultados.
                </p>
              </div>
            ) : (
              <div className="bg-aurum-card rounded-2xl border border-aurum-border overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-aurum-surface border-b border-aurum-border/80 text-[11px] font-bold uppercase tracking-wider text-aurum-gold">
                      <tr>
                        <th className="py-3.5 px-4">Produto</th>
                        <th className="py-3.5 px-4">Categoria</th>
                        <th className="py-3.5 px-4">Preço de Venda</th>
                        <th className="py-3.5 px-4">Custo</th>
                        <th className="py-3.5 px-4">Lucro Estimado</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-aurum-border/40">
                      {filteredProducts.map((p) => {
                        const imgUrl = Array.isArray(p.images) && p.images[0] ? p.images[0] : p.imageUrl;
                        const cost = p.costPrice || (p.price * 0.45);
                        const profit = p.price - cost;
                        const marginPercent = ((profit / p.price) * 100).toFixed(0);

                        return (
                          <tr key={p.id} className="hover:bg-aurum-surface/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 rounded-lg overflow-hidden bg-aurum-surface border border-aurum-border flex-shrink-0">
                                  {imgUrl ? (
                                    <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">Sem Foto</div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-white text-xs line-clamp-1">{p.name}</p>
                                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{p.fabric || 'Alta Alfaiataria'}</p>
                                  {p.badge && (
                                    <span className="inline-block mt-1 text-[9px] font-bold uppercase text-aurum-gold bg-aurum-gold/10 border border-aurum-gold/30 px-1.5 py-0.5 rounded">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-300">
                              {getCategoryLabel(p.category)}
                            </td>
                            <td className="py-3 px-4 font-bold text-aurum-gold-champagne">
                              {formatCurrency(p.price)}
                            </td>
                            <td className="py-3 px-4 text-gray-400 font-medium">
                              {formatCurrency(cost)}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-emerald-400 font-bold">{formatCurrency(profit)}</span>
                              <span className="block text-[10px] text-gray-500">{marginPercent}% margem</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-xs text-gray-300 hover:text-aurum-gold font-semibold transition-colors cursor-pointer"
                                  title="Editar Produto"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-aurum-gold" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(p.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-xs text-red-400 hover:text-red-200 font-semibold transition-colors cursor-pointer"
                                  title="Excluir Produto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Excluir</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: SISTEMA DE PEDIDOS
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6">
            
            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-aurum-card p-4 rounded-2xl border border-aurum-border">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-aurum-gold flex items-center gap-1 mr-2">
                  <Filter className="w-3.5 h-3.5" />
                  Filtrar Status:
                </span>
                {[
                  { id: 'todos', label: 'Todos os Pedidos' },
                  { id: 'pendente', label: `Pendentes (${pendingOrdersCount})`, badge: true },
                  { id: 'confirmado', label: 'Vendas Confirmadas' },
                  { id: 'cancelado', label: 'Cancelados' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      orderStatusFilter === tab.id
                        ? 'bg-aurum-gold text-black border-aurum-gold font-bold shadow-gold-sm'
                        : 'bg-aurum-surface text-gray-400 border-aurum-border hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-gray-400">
                Exibindo <strong className="text-aurum-gold">{filteredOrders.length}</strong> pedidos
              </span>
            </div>

            {/* Orders List */}
            {loadingOrders ? (
              <div className="py-16 text-center text-aurum-gold flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-aurum-gold/20 border-t-aurum-gold animate-spin"></div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Carregando pedidos...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center bg-aurum-card rounded-2xl border border-aurum-border p-8">
                <ShoppingBag className="w-12 h-12 text-aurum-gold/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1 font-serif">Nenhum pedido neste filtro</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Os pedidos realizados pelos clientes no checkout do site aparecerão nesta tela em tempo real.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isPending = order.status === 'pendente';
                  const isConfirmed = order.status === 'confirmado';
                  const isCancelled = order.status === 'cancelado';

                  return (
                    <div
                      key={order.id}
                      className={`bg-aurum-card rounded-2xl border transition-all p-5 shadow-xl ${
                        isPending
                          ? 'border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-gradient-to-r from-amber-950/20 via-aurum-card to-aurum-card'
                          : isConfirmed
                          ? 'border-emerald-800/60'
                          : 'border-red-900/40 opacity-70'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-aurum-border/60">
                        {/* Order Info Header */}
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                            isPending ? 'bg-amber-500/20 border-amber-500 text-amber-400' :
                            isConfirmed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                            'bg-red-500/20 border-red-500 text-red-400'
                          }`}>
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white font-serif">
                                Pedido #{order.id.slice(-6).toUpperCase()}
                              </span>
                              {/* Status Badge */}
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                                isConfirmed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                'bg-red-500/20 text-red-300 border border-red-500/40'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-aurum-gold" />
                              Data: {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Order Action Buttons */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'confirmado')}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirmar Venda</span>
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelado')}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950 border border-red-800 hover:bg-red-900 text-red-300 text-xs font-semibold transition-all cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancelar</span>
                              </button>
                            </>
                          )}

                          {isConfirmed && (
                            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
                              <CheckCircle2 className="w-4 h-4" />
                              Venda Confirmada
                            </span>
                          )}

                          {isCancelled && (
                            <span className="text-xs text-red-400 font-semibold flex items-center gap-1 bg-red-950/60 border border-red-900 px-3 py-1.5 rounded-xl">
                              <XCircle className="w-4 h-4" />
                              Pedido Cancelado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Order Details Body */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 text-xs">
                        
                        {/* Customer Info */}
                        <div className="space-y-2 bg-aurum-surface/50 p-3.5 rounded-xl border border-aurum-border/60">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-aurum-gold flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Dados do Cliente
                          </p>
                          <p className="font-semibold text-white text-sm">{order.customer?.name || 'Cliente Sem Nome'}</p>
                          <p className="text-gray-300 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-aurum-gold" />
                            {order.customer?.phone || 'N/I'}
                          </p>
                          <p className="text-gray-400 leading-relaxed flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-aurum-gold flex-shrink-0 mt-0.5" />
                            <span>
                              {order.customer?.street}, {order.customer?.number}
                              {order.customer?.neighborhood ? ` - ${order.customer.neighborhood}` : ''}
                              <br />
                              {order.customer?.city}/{order.customer?.state} - CEP: {order.customer?.cep || 'N/I'}
                            </span>
                          </p>
                          {order.paymentPreference && (
                            <p className="text-[11px] text-aurum-gold-light font-medium pt-1">
                              💳 Pagamento: {order.paymentPreference}
                            </p>
                          )}
                        </div>

                        {/* Items Purchased */}
                        <div className="lg:col-span-2 space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-aurum-gold flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Itens Comprados
                          </p>
                          <div className="divide-y divide-aurum-border/40 bg-aurum-surface/30 rounded-xl border border-aurum-border/40 overflow-hidden">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="p-3 flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-white text-xs">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Tamanho: <strong className="text-aurum-gold">{item.size}</strong> | Qtd: {item.quantity}x
                                  </p>
                                </div>
                                <div className="text-right font-bold text-aurum-gold-champagne">
                                  {formatCurrency((item.price || 0) * (item.quantity || 1))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 px-1 text-sm font-bold">
                            <span className="text-gray-300">Valor Total do Pedido:</span>
                            <span className="text-aurum-gold text-base">{formatCurrency(order.totalAmount)}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: DASHBOARD FINANCEIRO (RECHARTS)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-aurum-card via-aurum-surface to-aurum-card p-6 rounded-2xl border border-aurum-gold/30 shadow-gold-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-aurum-gold text-xs font-bold uppercase tracking-widest mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Métricas de Performance Real</span>
                </div>
                <h2 className="text-xl font-bold text-white font-serif">Dashboard Financeiro</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Calculado exclusivamente com base nos <strong className="text-emerald-400 font-semibold">{confirmedOrders.length} pedidos confirmados</strong>.
                </p>
              </div>

              {/* Period Selector */}
              <div className="flex items-center gap-1 bg-aurum-surface p-1 rounded-xl border border-aurum-border">
                {[
                  { id: 'semana', label: 'Última Semana' },
                  { id: '3meses', label: 'Últimos 3 Meses' },
                  { id: '6meses', label: 'Últimos 6 Meses' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setChartPeriod(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      chartPeriod === p.id
                        ? 'bg-aurum-gold text-black font-bold shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total em Vendas */}
              <div className="bg-aurum-card p-5 rounded-2xl border border-aurum-border shadow-lg">
                <div className="flex items-center justify-between text-aurum-gold mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total em Vendas</span>
                  <div className="p-2 rounded-xl bg-aurum-gold/10 border border-aurum-gold/30">
                    <DollarSign className="w-5 h-5 text-aurum-gold" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white font-serif">{formatCurrency(financialMetrics.totalSales)}</p>
                <p className="text-[11px] text-emerald-400 mt-1">✓ Faturamento bruto acumulado</p>
              </div>

              {/* Card 2: Total Investido (Custo) */}
              <div className="bg-aurum-card p-5 rounded-2xl border border-aurum-border shadow-lg">
                <div className="flex items-center justify-between text-aurum-gold mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Investido (Custo)</span>
                  <div className="p-2 rounded-xl bg-aurum-surface border border-aurum-border">
                    <ShoppingBag className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-300 font-serif">{formatCurrency(financialMetrics.totalInvested)}</p>
                <p className="text-[11px] text-gray-400 mt-1">Preço de custo dos tecidos e confecção</p>
              </div>

              {/* Card 3: Lucro Líquido */}
              <div className="bg-aurum-card p-5 rounded-2xl border border-aurum-gold/40 shadow-gold-sm bg-gradient-to-br from-aurum-card via-aurum-card to-emerald-950/20">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-aurum-gold">Lucro Líquido Real</span>
                  <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-400 font-serif">{formatCurrency(financialMetrics.netProfit)}</p>
                <p className="text-[11px] text-emerald-300 mt-1 font-semibold">Vendas líquidas menos custos</p>
              </div>

              {/* Card 4: Margem Média */}
              <div className="bg-aurum-card p-5 rounded-2xl border border-aurum-border shadow-lg">
                <div className="flex items-center justify-between text-aurum-gold mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Margem Média</span>
                  <div className="p-2 rounded-xl bg-aurum-gold/10 border border-aurum-gold/30">
                    <PieChart className="w-5 h-5 text-aurum-gold" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-aurum-gold-champagne font-serif">{financialMetrics.profitMargin}%</p>
                <p className="text-[11px] text-gray-400 mt-1">Margem média sobre vendas</p>
              </div>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Sales Over Time */}
              <div className="bg-aurum-card p-6 rounded-2xl border border-aurum-border shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-aurum-gold" />
                    <span>Evolução das Vendas por Período</span>
                  </h3>
                  <span className="text-[10px] text-aurum-gold uppercase tracking-wider font-semibold">
                    {chartPeriod === 'semana' ? 'Visão Diária (Semanal)' : 'Visão Mensal'}
                  </span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesOverTimeData}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A3042" />
                      <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `R$${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#12151E', borderColor: '#D4AF37', borderRadius: '12px', color: '#fff' }}
                        formatter={(val) => [formatCurrency(val), 'Vendas']}
                      />
                      <Area type="monotone" dataKey="Vendas" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#goldGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Top Products Sold */}
              <div className="bg-aurum-card p-6 rounded-2xl border border-aurum-border shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-aurum-gold" />
                    <span>Produtos Mais Vendidos (Qtd)</span>
                  </h3>
                  <span className="text-[10px] text-gray-400">Ranking Top Peças</span>
                </div>

                {financialMetrics.topProductsChartData.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                    <ShoppingBag className="w-8 h-8 text-gray-600 mb-2" />
                    <p>Nenhuma venda confirmada ainda para gerar o ranking.</p>
                  </div>
                ) : (
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialMetrics.topProductsChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3042" />
                        <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                        <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} width={120} tickFormatter={(val) => val.length > 15 ? val.slice(0, 15) + '...' : val} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#12151E', borderColor: '#D4AF37', borderRadius: '12px', color: '#fff' }}
                          formatter={(val, name) => [val, name === 'quantidade' ? 'Unidades Vendidas' : name]}
                        />
                        <Bar dataKey="quantidade" fill="#D4AF37" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: ALTERAR SENHA
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'senha' && (
          <div className="max-w-md bg-aurum-card p-6 rounded-2xl border border-aurum-border shadow-xl space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Alterar Senha do Administrador</h2>
              <p className="text-xs text-gray-400 mt-1">Atualize a senha de acesso à conta administrativa do Firebase.</p>
            </div>

            {passwordMsg.text && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' 
                  : 'bg-red-950/60 border-red-800 text-red-200'
              }`}>
                {passwordMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Nova Senha (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-aurum-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-aurum-gold"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-3 rounded-xl bg-aurum-gold text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 transition-all cursor-pointer shadow-gold-sm disabled:opacity-50"
              >
                {updatingPassword ? 'Atualizando...' : 'Salvar Nova Senha'}
              </button>
            </form>
          </div>
        )}

      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-aurum-card rounded-2xl border border-aurum-gold/40 shadow-gold-glow overflow-hidden animate-fadeIn my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-aurum-border bg-aurum-surface">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-aurum-gold" />
                <span>{editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-aurum-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Terno Completo Lombardia Navy Super 140s"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold cursor-pointer"
                  >
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id} className="bg-aurum-surface text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-aurum-gold mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 2890.00"
                    className="w-full bg-aurum-surface border border-aurum-gold/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Preço de Custo (R$) <span className="text-gray-500 font-normal">(para cálculo de lucro)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="Ex: 1300.00"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Preço Antigo (R$) <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="Ex: 3200.00"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Badge de Destaque <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Ex: Lã Super 140s, Mais Vendido"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                {/* Cloudinary Image Upload Section */}
                <div className="sm:col-span-2 space-y-3 bg-aurum-surface/60 p-4 rounded-2xl border border-aurum-border">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-aurum-gold flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-aurum-gold" />
                      <span>Fotos do Produto (Cloudinary) *</span>
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {formData.images.length} foto(s) salvas no produto
                    </span>
                  </div>

                  {/* Upload Error Alert */}
                  {uploadError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Upload Success Alert */}
                  {uploadSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold">{uploadSuccessMsg}</span>
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSelectFileForReview(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {/* STAGE 1: Pre-Upload Review Card (If file selected, before uploading to Cloudinary) */}
                  {pendingImage ? (
                    <div className="bg-aurum-card border-2 border-aurum-gold/60 rounded-2xl p-4 space-y-4 animate-fadeIn shadow-gold-sm">
                      <div className="flex items-center justify-between border-b border-aurum-border/60 pb-2">
                        <span className="text-xs font-bold text-aurum-gold uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-aurum-gold" />
                          <span>Revisar Foto Selecionada (Pré-Upload)</span>
                        </span>
                        <span className="text-[10px] text-aurum-gold bg-aurum-gold/10 px-2 py-0.5 rounded border border-aurum-gold/30">
                          Aguardando Confirmação
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        {/* Large Image Preview */}
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-aurum-gold/40 shadow-md">
                          <img 
                            src={pendingImage.previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        {/* File Details Info */}
                        <div className="sm:col-span-2 space-y-2.5 text-xs">
                          <div className="bg-aurum-surface/80 p-2.5 rounded-xl border border-aurum-border/60">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nome do Arquivo:</span>
                            <span className="font-semibold text-white truncate block mt-0.5">{pendingImage.name}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-aurum-surface/80 p-2 rounded-xl border border-aurum-border/60 text-center">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Dimensões</span>
                              <span className="font-bold text-aurum-gold text-xs">{pendingImage.width} × {pendingImage.height}</span>
                            </div>
                            <div className="bg-aurum-surface/80 p-2 rounded-xl border border-aurum-border/60 text-center">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Tamanho</span>
                              <span className="font-bold text-white text-xs">{pendingImage.sizeFormatted}</span>
                            </div>
                            <div className="bg-aurum-surface/80 p-2 rounded-xl border border-aurum-border/60 text-center">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Formato</span>
                              <span className="font-bold text-white text-xs">{pendingImage.format}</span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-aurum-gold/10 rounded-xl border border-aurum-gold/20 text-[11px] text-aurum-gold-champagne leading-relaxed">
                            💡 <strong>Processamento Cloudinary:</strong> Ao confirmar, a imagem será processada e salva no Cloudinary usando o preset de upload da loja.
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={handleConfirmUpload}
                              disabled={uploadingImage}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                                  <span>Enviando & Otimizando...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>Usar Esta Foto</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelPendingImage}
                              disabled={uploadingImage}
                              className="py-2.5 px-4 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold text-xs text-gray-300 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Escolher Outra
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* STAGE 0: Drag and Drop Selector Dropzone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleSelectFileForReview(e.dataTransfer.files[0]);
                        }
                      }}
                      className="border-2 border-dashed border-aurum-gold/40 hover:border-aurum-gold rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-aurum-card/60 hover:bg-aurum-card"
                    >
                      <div className="w-12 h-12 rounded-full bg-aurum-gold/10 border border-aurum-gold/30 flex items-center justify-center text-aurum-gold">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Clique ou arraste uma foto aqui para revisar antes de enviar</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Formatos aceitos: JPG, PNG, WEBP (Máximo 5MB por foto)</p>
                      </div>
                    </div>
                  )}

                  {/* Image Thumbnail Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        Pré-visualização das Fotos ({formData.images.length}):
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formData.images.map((url, idx) => (
                          <div
                            key={idx}
                            className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-aurum-bg shadow-md ${
                              idx === 0 ? 'border-aurum-gold ring-2 ring-aurum-gold/40' : 'border-aurum-border'
                            }`}
                          >
                            <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                            {/* Primary Cover Badge */}
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-aurum-gold text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                                ★ Capa
                              </span>
                            )}

                            {/* Thumbnail Controls Overlay */}
                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsPrimary(idx)}
                                  className="w-full py-1 px-2 rounded bg-aurum-gold/20 hover:bg-aurum-gold border border-aurum-gold text-aurum-gold hover:text-black text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Definir Capa
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="w-full py-1 px-2 rounded bg-red-950/80 hover:bg-red-800 border border-red-700 text-red-200 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Secondary Option: Manual URL Input Toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      className="text-[11px] text-aurum-gold hover:underline font-semibold cursor-pointer"
                    >
                      {showManualUrl ? '− Ocultar campo de link manual' : '+ Adicionar foto via URL externa manual'}
                    </button>

                    {showManualUrl && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="url"
                          value={manualUrlInput}
                          onChange={(e) => setManualUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 bg-aurum-surface border border-aurum-border rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold"
                        />
                        <button
                          type="button"
                          onClick={handleAddManualUrl}
                          className="px-4 py-2 rounded-xl bg-aurum-surface border border-aurum-gold/40 text-aurum-gold text-xs font-bold hover:bg-aurum-gold/10 cursor-pointer"
                        >
                          Adicionar Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Tecido / Material
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Ex: 100% Lã Fria Australiana Super 140s"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Corte / Fit
                  </label>
                  <input
                    type="text"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="Ex: Slim Sartorial"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Tamanhos Disponíveis (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formData.sizesStr}
                    onChange={(e) => setFormData({ ...formData, sizesStr: e.target.value })}
                    placeholder="Ex: 46 (PP), 48 (P), 50 (M), 52 (G), 54 (GG)"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Ocasião Recomendada
                  </label>
                  <input
                    type="text"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    placeholder="Ex: Casamentos Nobres, Reuniões de Conselho & Eventos Noturnos"
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o caimento, detalhes e exclusividade da peça..."
                    className="w-full bg-aurum-surface border border-aurum-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-aurum-gold resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-aurum-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-aurum-border hover:border-aurum-gold text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-aurum-gold text-black font-bold uppercase tracking-wider text-xs shadow-gold-sm hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : (editingId ? 'Atualizar Produto' : 'Cadastrar Produto')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-aurum-card rounded-2xl border border-red-800/80 p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-full bg-red-950 border border-red-800">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-serif">Confirmar Exclusão</h4>
                <p className="text-[11px] text-gray-400">Esta ação não poderá ser desfeita.</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Tem certeza que deseja remover este produto da loja? Ele deixará de ser exibido no site público imediatamente.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-aurum-border text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
