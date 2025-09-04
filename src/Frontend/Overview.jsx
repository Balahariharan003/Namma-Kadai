import React from 'react';
import AddProduct from './AddProduct';
import './css/Overview.css';

const Overview = ({
  products,
  editingProductId,
  setEditingProductId,
  handleUpdateProduct,
  handleDeleteProduct,
}) => {
  return (
    <div className="overview-container">
      <h2>Your Products</h2>

      {products.length === 0 ? (
        <p className="no-products">No products added yet.</p>
      ) : (
        <div className="products-grid-overview">
          {products.map((product) => (
            <div key={product._id} className="product-card-overview">
              
              {/* Edit Modal Overlay */}
              {editingProductId === product._id && (
                <div className="add-product-container edit-mode">
                  <div className="add-product-form-container">
                    <AddProduct
                      productToEdit={product}
                      isEditMode={true}
                      onAddProduct={handleUpdateProduct}
                      onCancel={() => setEditingProductId(null)}
                    />
                  </div>
                </div>
              )}

              {/* Normal Product Card */}
              {editingProductId !== product._id && (
                <>
                  {product.imageUrl && (
                    <div className="product-image-overview">
                      <img
                        src={`http://localhost:8000${product.imageUrl}`}
                        alt={product.name}
                      />
                    </div>
                  )}
                  <div className="product-details-overview">
                    <h3>{product.name}</h3>
                    <p>Price: ₹{product.price} / Per Kg</p>
                    <p>In Stock: {product.inStock} kg</p>
                    <div className="product-actions">
                      <button
                        className="edit-btn-overview"
                        onClick={() => setEditingProductId(product._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn-overview"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;
