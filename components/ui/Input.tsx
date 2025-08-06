import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
    inputSize?: 'xs' | 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            variant = 'bordered',
            inputSize = 'md',
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        
        const variantClasses = {
            bordered: 'input-bordered',
            ghost: 'input-ghost',
            primary: 'input-primary',
            secondary: 'input-secondary',
            accent: 'input-accent',
            info: 'input-info',
            success: 'input-success',
            warning: 'input-warning',
            error: 'input-error',
        };
        
        const sizeClasses = {
            xs: 'input-xs',
            sm: 'input-sm',
            md: 'input-md',
            lg: 'input-lg',
        };
        
        const inputClasses = `
            input
            ${variantClasses[error ? 'error' : variant]}
            ${sizeClasses[inputSize]}
            ${fullWidth ? 'w-full' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
        `.trim();
        
        return (
            <div className={`form-control ${fullWidth ? 'w-full' : ''}`}>
                {label && (
                    <label htmlFor={inputId} className="label">
                        <span className="label-text">{label}</span>
                    </label>
                )}
                
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    
                    <input
                        ref={ref}
                        id={inputId}
                        className={inputClasses}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                        {...props}
                    />
                    
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {rightIcon}
                        </div>
                    )}
                </div>
                
                {error && (
                    <label className="label" id={`${inputId}-error`}>
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
                
                {helperText && !error && (
                    <label className="label" id={`${inputId}-helper`}>
                        <span className="label-text-alt">{helperText}</span>
                    </label>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;