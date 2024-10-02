import React from "react";

const ReviewDetail = ({
  params,
}: {
  params: { productId: string; reviewId: string };
}) => {
  return (
    <div>
      Review of {params.productId} for product Detail is {params.reviewId}
    </div>
  );
};

export default ReviewDetail;
