import React from 'react';
import { ToolbarButtonProps } from '../../types';

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}) => {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={[
        'rre-toolbar-btn',
        isActive ? 'rre-toolbar-btn--active' : '',
        disabled ? 'rre-toolbar-btn--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
