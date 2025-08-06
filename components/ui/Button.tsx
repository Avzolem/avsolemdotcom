import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline' | 'error' | 'success' | 'warning' | 'info';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    href?: string;
    external?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            disabled = false,
            fullWidth = false,
            href,
            external = false,
            leftIcon,
            rightIcon,
            children,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseClasses = 'btn transition-all duration-200';
        
        const variantClasses = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            accent: 'btn-accent',
            ghost: 'btn-ghost',
            link: 'btn-link',
            outline: 'btn-outline',
            error: 'btn-error',
            success: 'btn-success',
            warning: 'btn-warning',
            info: 'btn-info',
        };
        
        const sizeClasses = {
            xs: 'btn-xs',
            sm: 'btn-sm',
            md: 'btn-md',
            lg: 'btn-lg',
            xl: 'btn-xl',
        };
        
        const classes = `
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${fullWidth ? 'w-full' : ''}
            ${loading ? 'loading' : ''}
            ${className}
        `.trim();
        
        const content = (
            <>
                {loading && <span className="loading loading-spinner"></span>}
                {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="ml-2">{rightIcon}</span>}
            </>
        );
        
        if (href) {
            if (external) {
                return (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes}
                        aria-disabled={disabled || loading}
                    >
                        {content}
                    </a>
                );
            }
            
            return (
                <Link
                    href={href}
                    className={classes}
                    aria-disabled={disabled || loading}
                >
                    {content}
                </Link>
            );
        }
        
        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;