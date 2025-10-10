import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.title} />
            <h2>{product.title}</h2>
            <p>${product.price}</p>
            <a href={product.amazonLink} target="_blank" rel="noopener noreferrer">
                Buy on Amazon
            </a>
        </div>
    );
};

export default ProductCard;