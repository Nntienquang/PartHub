import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      {description && (
        <p className="text-slate-600 text-lg">{description}</p>
      )}
    </div>
  );
}

