import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('nike-cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('nike-cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product, variant, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item.product.id === product.id && item.variant.id === variant.id
            )

            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id && item.variant.id === variant.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }

            return [...prevCart, { product, variant, quantity }]
        })
    }

    const removeFromCart = (productId, variantId) => {
        setCart(prevCart =>
            prevCart.filter(
                item => !(item.product.id === productId && item.variant.id === variantId)
            )
        )
    }

    const updateQuantity = (productId, variantId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, variantId)
            return
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.product.id === productId && item.variant.id === variantId
                    ? { ...item, quantity }
                    : item
            )
        )
    }

    const clearCart = () => {
        setCart([])
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.product.price * item.quantity)
        }, 0)
    }

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
