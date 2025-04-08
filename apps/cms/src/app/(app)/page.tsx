import type { NextPage } from "next";

import React from "react";

const Page: NextPage = () => {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold">Welcome to honest cms</h1>
      <a href="/admin">Click here to redirect to admin portal</a>
    </div>
  );
};

export default Page;
