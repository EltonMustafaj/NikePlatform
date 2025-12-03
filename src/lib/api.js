import { supabase } from './supabase'

// ============= PRODUCTS =============

export const getProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      variants:product_variants(*)
    `)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      variants:product_variants(*)
    `)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export const createProduct = async (productData) => {
    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()

    if (error) throw error
    return data
}

export const updateProduct = async (id, productData) => {
    const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export const deleteProduct = async (id) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// ============= PRODUCT VARIANTS =============

export const createVariant = async (variantData) => {
    const { data, error } = await supabase
        .from('product_variants')
        .insert([variantData])
        .select()
        .single()

    if (error) throw error
    return data
}

export const updateVariant = async (id, variantData) => {
    const { data, error } = await supabase
        .from('product_variants')
        .update(variantData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export const updateStock = async (variantId, newStock) => {
    const { data, error } = await supabase
        .from('product_variants')
        .update({ stock: newStock })
        .eq('id', variantId)
        .select()
        .single()

    if (error) throw error
    return data
}

export const decrementStock = async (variantId, quantity = 1) => {
    // Get current stock
    const { data: variant, error: fetchError } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('id', variantId)
        .single()

    if (fetchError) throw fetchError

    const newStock = Math.max(0, variant.stock - quantity)

    const { data, error } = await supabase
        .from('product_variants')
        .update({ stock: newStock })
        .eq('id', variantId)
        .select()
        .single()

    if (error) throw error
    return data
}

// ============= CUSTOMERS =============

export const createCustomer = async (customerData) => {
    const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single()

    if (error) throw error
    return data
}

export const getCustomerByEmail = async (email) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

export const updateCustomer = async (id, customerData) => {
    const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// ============= ORDERS =============

export const createOrder = async (orderData) => {
    const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

    if (error) throw error
    return data
}

export const createOrderItems = async (orderItems) => {
    const { data, error } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select()

    if (error) throw error
    return data
}

export const getOrders = async (status = null) => {
    let query = supabase
        .from('orders')
        .select(`
      *,
      customer:customers(*),
      items:order_items(
        *,
        variant:product_variants(
          *,
          product:products(*)
        )
      )
    `)
        .order('created_at', { ascending: false })

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
}

export const getOrderById = async (id) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      customer:customers(*),
      items:order_items(
        *,
        variant:product_variants(
          *,
          product:products(*)
        )
      )
    `)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export const updateOrderStatus = async (id, status) => {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export const deleteOrder = async (id) => {
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// ============= REAL-TIME SUBSCRIPTIONS =============

export const subscribeToOrders = (callback) => {
    const subscription = supabase
        .channel('orders-channel')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'orders'
            },
            callback
        )
        .subscribe()

    return subscription
}

export const subscribeToStock = (callback) => {
    const subscription = supabase
        .channel('stock-channel')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'product_variants'
            },
            callback
        )
        .subscribe()

    return subscription
}

// ============= POSTAL WORKERS =============

export const loginPostalWorker = async (username, password) => {
    const { data, error } = await supabase
        .from('postal_workers')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

export const getPostalWorkers = async () => {
    const { data, error } = await supabase
        .from('postal_workers')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) throw error
    return data
}

export const createPostalWorker = async (workerData) => {
    const { data, error } = await supabase
        .from('postal_workers')
        .insert([workerData])
        .select()
        .single()

    if (error) throw error
    return data
}

export const deletePostalWorker = async (id) => {
    const { error } = await supabase
        .from('postal_workers')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Get pending postal workers (waiting for approval)
export const getPendingPostalWorkers = async () => {
    const { data, error } = await supabase
        .from('postal_workers')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}

// Get active postal workers
export const getActivePostalWorkers = async () => {
    const { data, error } = await supabase
        .from('postal_workers')
        .select('*')
        .eq('status', 'active')
        .order('full_name', { ascending: true })

    if (error) throw error
    return data
}

// Approve postal worker
export const approvePostalWorker = async (workerId, adminId) => {
    const { data, error } = await supabase
        .from('postal_workers')
        .update({
            status: 'active',
            approved_by: adminId,
            approved_at: new Date().toISOString()
        })
        .eq('id', workerId)
        .select()
        .single()

    if (error) throw error
    return data
}

// Reject/Deactivate postal worker
export const updatePostalWorkerStatus = async (workerId, status) => {
    const { data, error } = await supabase
        .from('postal_workers')
        .update({ status })
        .eq('id', workerId)
        .select()
        .single()

    if (error) throw error
    return data
}

// Auto-assign order to postal worker with least orders
export const autoAssignOrder = async (orderId) => {
    // Get all active postal workers with their order counts
    const { data: workers, error: workersError } = await supabase
        .from('postal_workers')
        .select('id, full_name')
        .eq('status', 'active')

    if (workersError) throw workersError
    if (!workers || workers.length === 0) {
        throw new Error('Nuk ka postarë aktivë')
    }

    // Get order counts for each worker
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('assigned_to')
        .in('status', ['E Papërpunuar', 'Në Dërgesë'])

    if (ordersError) throw ordersError

    // Count orders per worker
    const orderCounts = {}
    workers.forEach(w => orderCounts[w.id] = 0)
    orders?.forEach(o => {
        if (o.assigned_to && orderCounts[o.assigned_to] !== undefined) {
            orderCounts[o.assigned_to]++
        }
    })

    // Find worker with least orders
    const workerWithLeastOrders = workers.reduce((min, worker) =>
        orderCounts[worker.id] < orderCounts[min.id] ? worker : min
    )

    // Assign order to that worker
    return await assignOrderToPostalWorker(orderId, workerWithLeastOrders.id)
}


export const getOrdersByPostalWorker = async (postalWorkerId) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      customer:customers(*),
      items:order_items(
        *,
        variant:product_variants(
          *,
          product:products(*)
        )
      )
    `)
        .eq('assigned_to', postalWorkerId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export const assignOrderToPostalWorker = async (orderId, postalWorkerId) => {
    const { data, error } = await supabase
        .from('orders')
        .update({ assigned_to: postalWorkerId })
        .eq('id', orderId)
        .select()
        .single()

    if (error) throw error
    return data
}

export const updateOrderWithNotes = async (orderId, status, notes) => {
    const updateData = { status }
    if (notes) {
        updateData.delivery_notes = notes
    }

    const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single()

    if (error) throw error
    return data
}

