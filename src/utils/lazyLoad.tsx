import React, { Suspense } from "react";
import { Spin } from "antd";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spin size="large" tip="Loading..." />
  </div>
);

export const lazyLoad = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);
