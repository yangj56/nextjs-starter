import React from "react";

export const CustomDashboard: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <a href="/admin/logout">logout</a>
      <a href="/admin">admin</a>
    </div>
  );
};
