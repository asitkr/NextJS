import React from "react";

const ProductDetailsByPage = ({
  params,
}: {
  params: { productId: string };
}) => {
  return <div>Product Details By Page Id {params.productId}</div>;
};

export default ProductDetailsByPage;
