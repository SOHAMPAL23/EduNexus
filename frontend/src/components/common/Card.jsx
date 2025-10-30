import React from 'react';

export default function Card({ title, subtitle, img, children, className = '', hover = true }) {
  return (
    <article className={`card-glass max-w-sm ${className}`}> 
      <div className="flex items-start gap-4">
        {img && <img className="w-16 h-16 rounded-lg object-cover" src={img} alt="thumb" />}
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </article>
  );
}