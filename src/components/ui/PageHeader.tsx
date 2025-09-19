import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6 ${className}`}>
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-[#776B5D] text-xl sm:text-2xl lg:text-3xl">{title}</h1>
        {description && (
          <p className="text-[#776B5D]/70 mt-1 text-sm sm:text-base">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
