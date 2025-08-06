import React from 'react';
import Image from 'next/image';

export interface CardProps {
    title?: string;
    description?: string;
    image?: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
    };
    actions?: React.ReactNode;
    badge?: string;
    variant?: 'default' | 'bordered' | 'shadow' | 'compact' | 'side';
    glass?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    title,
    description,
    image,
    actions,
    badge,
    variant = 'default',
    glass = false,
    children,
    className = '',
}) => {
    const variantClasses = {
        default: '',
        bordered: 'card-bordered',
        shadow: 'shadow-xl',
        compact: 'card-compact',
        side: 'card-side',
    };
    
    const cardClasses = `
        card
        ${glass ? 'glass' : 'bg-base-100'}
        ${variantClasses[variant]}
        ${className}
    `.trim();
    
    return (
        <div className={cardClasses}>
            {image && (
                <figure className={variant === 'side' ? 'w-1/3' : ''}>
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width || 400}
                        height={image.height || 300}
                        className="object-cover w-full h-full"
                    />
                </figure>
            )}
            
            <div className="card-body">
                {badge && (
                    <div className="badge badge-secondary absolute top-4 right-4">
                        {badge}
                    </div>
                )}
                
                {title && (
                    <h2 className="card-title">
                        {title}
                    </h2>
                )}
                
                {description && (
                    <p className="text-base-content/70">
                        {description}
                    </p>
                )}
                
                {children}
                
                {actions && (
                    <div className="card-actions justify-end">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;