import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productsApi, ordersApi, offersApi, creditApi, communityApi } from '../services/api';

// ============ PRODUCTS HOOK ============
export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await productsApi?.getAll(filters)
      
      if (error) throw error
      setProducts(data || [])
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(filters)])

  const createProduct = async (productData) => {
    try {
      const { data, error } = await productsApi?.create(productData)
      
      if (error) throw error
      
      setProducts(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateProduct = async (id, updates) => {
    try {
      const { data, error } = await productsApi?.update(id, updates)
      
      if (error) throw error
      
      setProducts(prev => prev?.map(product => 
        product?.id === id ? data : product
      ))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const deleteProduct = async (id) => {
    try {
      const { error } = await productsApi?.delete(id)
      
      if (error) throw error
      
      setProducts(prev => prev?.filter(product => product?.id !== id))
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}

// ============ ORDERS HOOK ============
export const useOrders = (isAdmin = false) => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async (filters = {}) => {
    try {
      setLoading(true)
      
      let result
      if (isAdmin) {
        result = await ordersApi?.getAll(filters)
      } else if (user?.id) {
        result = await ordersApi?.getByUser(user?.id)
      } else {
        setOrders([])
        setLoading(false)
        return
      }
      
      const { data, error } = result
      if (error) throw error
      
      setOrders(data || [])
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id || isAdmin) {
      fetchOrders()
    }
  }, [user?.id, isAdmin])

  const createOrder = async (orderData) => {
    try {
      const { data, error } = await ordersApi?.create({
        ...orderData,
        user_id: user?.id
      })
      
      if (error) throw error
      
      setOrders(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateOrderStatus = async (orderId, status, adminNotes = '') => {
    try {
      const { data, error } = await ordersApi?.updateStatus(orderId, status, adminNotes)
      
      if (error) throw error
      
      setOrders(prev => prev?.map(order => 
        order?.id === orderId ? { ...order, status, admin_notes: adminNotes } : order
      ))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrderStatus
  }
}

// ============ OFFERS HOOK ============
export const useOffers = (activeOnly = true) => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOffers = async () => {
    try {
      setLoading(true)
      
      const { data, error } = activeOnly 
        ? await offersApi?.getActive()
        : await offersApi?.getAll()
      
      if (error) throw error
      setOffers(data || [])
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to fetch offers')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [activeOnly])

  const createOffer = async (offerData) => {
    try {
      const { data, error } = await offersApi?.create(offerData)
      
      if (error) throw error
      
      setOffers(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateOffer = async (id, updates) => {
    try {
      const { data, error } = await offersApi?.update(id, updates)
      
      if (error) throw error
      
      setOffers(prev => prev?.map(offer => 
        offer?.id === id ? data : offer
      ))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const deleteOffer = async (id) => {
    try {
      const { error } = await offersApi?.delete(id)
      
      if (error) throw error
      
      setOffers(prev => prev?.filter(offer => offer?.id !== id))
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers,
    createOffer,
    updateOffer,
    deleteOffer
  }
}

// ============ CREDIT APPLICATIONS HOOK ============
export const useCreditApplications = (isAdmin = false) => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchApplications = async (filters = {}) => {
    try {
      setLoading(true)
      
      let result
      if (isAdmin) {
        result = await creditApi?.getAll(filters)
      } else if (user?.id) {
        result = await creditApi?.getByUser(user?.id)
      } else {
        setApplications([])
        setLoading(false)
        return
      }
      
      const { data, error } = result
      if (error) throw error
      
      setApplications(data || [])
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to fetch credit applications')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id || isAdmin) {
      fetchApplications()
    }
  }, [user?.id, isAdmin])

  const submitApplication = async (applicationData) => {
    try {
      const { data, error } = await creditApi?.create({
        ...applicationData,
        user_id: user?.id
      })
      
      if (error) throw error
      
      setApplications(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateApplicationStatus = async (id, status, approvedLimit = null, adminNotes = '') => {
    try {
      const { data, error } = await creditApi?.updateStatus(id, status, approvedLimit, adminNotes)
      
      if (error) throw error
      
      setApplications(prev => prev?.map(app => 
        app?.id === id ? data : app
      ))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    submitApplication,
    updateApplicationStatus
  }
}

// ============ COMMUNITY FEED HOOK ============
export const useCommunityFeed = (filters = {}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await communityApi?.getAll(filters)
      
      if (error) throw error
      setPosts(data || [])
      setError(null)
    } catch (err) {
      setError(err?.message || 'Failed to fetch community posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [JSON.stringify(filters)])

  const createPost = async (postData) => {
    try {
      const { data, error } = await communityApi?.create(postData)
      
      if (error) throw error
      
      setPosts(prev => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updatePost = async (id, updates) => {
    try {
      const { data, error } = await communityApi?.update(id, updates)
      
      if (error) throw error
      
      setPosts(prev => prev?.map(post => 
        post?.id === id ? data : post
      ))
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const deletePost = async (id) => {
    try {
      const { error } = await communityApi?.delete(id)
      
      if (error) throw error
      
      setPosts(prev => prev?.filter(post => post?.id !== id))
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    createPost,
    updatePost,
    deletePost
  }
}

// ============ DASHBOARD STATS HOOK ============
export const useDashboardStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    activeOffers: 0,
    creditApplicationStatus: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return

      try {
        setLoading(true)

        // Fetch user's orders
        const { data: orders } = await ordersApi?.getByUser(user?.id)
        const userOrders = orders || []

        // Fetch active offers
        const { data: offers } = await offersApi?.getActive()
        const activeOffers = offers || []

        // Fetch user's credit applications
        const { data: creditApps } = await creditApi?.getByUser(user?.id)
        const latestCreditApp = creditApps?.[0] || null

        // Calculate stats
        const totalOrders = userOrders?.length
        const pendingOrders = userOrders?.filter(order => order?.status === 'Pending')?.length
        const completedOrders = userOrders?.filter(order => order?.status === 'Delivered')?.length
        const totalSpent = userOrders?.filter(order => order?.status === 'Delivered')?.reduce((sum, order) => sum + (parseFloat(order?.total_amount) || 0), 0)

        setStats({
          totalOrders,
          pendingOrders,
          completedOrders,
          totalSpent,
          activeOffers: activeOffers?.length,
          creditApplicationStatus: latestCreditApp?.status || null
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error?.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.id])

  return { stats, loading }
}