import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProducts, createProduct, createVariant, deleteProduct } from '../../lib/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import './ProductManagement.css'

const ProductManagement = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '/images/Nike1.jpg'
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    // Available sizes as checkboxes
    const allSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
    const [selectedSizes, setSelectedSizes] = useState([])

    const availableImages = [
        '/images/Nike1.jpg',
        '/images/Nike2.jpg',
        '/images/Nike3.jpg',
        '/images/Nike4.jpg',
        '/images/Nike5.jpg',
        '/images/Nike6.jpg',
        '/images/Nike7.jpg',
        '/images/nike8.jpg',
        '/images/Nike9.jpg',
        '/images/Nike10.jpg',
        '/images/Nike11.jpg'
    ]

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin')
            return
        }
        loadProducts()
    }, [isAuthenticated])

    const loadProducts = async () => {
        try {
            const data = await getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Fshij produktin?')) return
        try {
            await deleteProduct(productId)
            await loadProducts()
        } catch (error) {
            alert('Gabim gjatë fshirjes')
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Zgjedh një foto')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Foto shumë e madhe (max 5MB)')
            return
        }

        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setPreviewUrl(reader.result)
        reader.readAsDataURL(file)
    }

    const toggleSize = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size))
        } else {
            setSelectedSizes([...selectedSizes, size])
        }
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault()

        if (!newProduct.name || !newProduct.price) {
            alert('Plotëso emrin dhe çmimin')
            return
        }

        if (selectedSizes.length === 0) {
            alert('Zgjedh të paktën një madhësi')
            return
        }

        try {
            let imageUrl = newProduct.image_url

            if (selectedFile && previewUrl) {
                imageUrl = previewUrl
            }

            const product = await createProduct({
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                image_url: imageUrl
            })

            // Create variants for selected sizes only
            for (const size of selectedSizes) {
                await createVariant({
                    product_id: product.id,
                    size: size
                })
            }

            // Reset form
            setNewProduct({ name: '', description: '', price: '', image_url: '/images/Nike1.jpg' })
            setSelectedSizes([])
            setSelectedFile(null)
            setPreviewUrl(null)
            setShowAddModal(false)
            await loadProducts()
            alert('Produkti u shtua!')
        } catch (error) {
            alert('Gabim: ' + error.message)
        }
    }

    if (loading) {
        return <div className="loading-container"><LoadingSpinner /></div>
    }

    return (
        <div className="product-management">
            <div className="container">
                <div className="page-header">
                    <h1>Produktet</h1>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            + Shto Produkt
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                            ← Kthehu
                        </button>
                    </div>
                </div>

                <div className="products-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-admin-card glass-card">
                            <div className="product-admin-header">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = '/images/Nike1.jpg'
                                    }}
                                />
                                <div className="product-admin-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p className="product-price">€{product.price}</p>
                                </div>
                                <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>
                                    Fshij
                                </button>
                            </div>

                            <div className="variants-section">
                                <h4>Madhësitë në dispozicion:</h4>
                                {product.variants && product.variants.length > 0 ? (
                                    <div className="size-badges">
                                        {product.variants.map(variant => (
                                            <span key={variant.id} className="size-badge">
                                                {variant.size}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Nuk ka madhësi</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="no-products-admin">
                        <p>Nuk ka produkte</p>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            + Shto Produkt
                        </button>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Shto Produkt</h2>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleCreateProduct} className="product-form">
                            <div className="form-group">
                                <label>Emri *</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Nike Air Max 90"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Përshkrimi</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Përshkrimi..."
                                    rows="2"
                                />
                            </div>

                            <div className="form-group">
                                <label>Çmimi (€) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    placeholder="120.00"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Foto</label>

                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="photo-upload"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="file-input"
                                    />
                                    <label htmlFor="photo-upload" className="file-input-label">
                                        {selectedFile ? '✓ ' + selectedFile.name : '📁 Ngarko Foto'}
                                    </label>
                                </div>

                                {previewUrl && (
                                    <div className="photo-preview">
                                        <img src={previewUrl} alt="Preview" />
                                        <button
                                            type="button"
                                            className="btn-remove-photo"
                                            onClick={() => {
                                                setSelectedFile(null)
                                                setPreviewUrl(null)
                                                document.getElementById('photo-upload').value = ''
                                            }}
                                        >
                                            ✕ Hiq
                                        </button>
                                    </div>
                                )}

                                <div className="image-selector">
                                    {availableImages.slice(0, 6).map(img => (
                                        <div
                                            key={img}
                                            className={`image-option ${newProduct.image_url === img ? 'selected' : ''}`}
                                            onClick={() => {
                                                setNewProduct({ ...newProduct, image_url: img })
                                                setSelectedFile(null)
                                                setPreviewUrl(null)
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={img}
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = '/images/Nike1.jpg'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Madhësitë në dispozicion *</label>
                                <div className="size-checkboxes">
                                    {allSizes.map(size => (
                                        <label key={size} className="size-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedSizes.includes(size)}
                                                onChange={() => toggleSize(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                    Anulo
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Ruaj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductManagement
