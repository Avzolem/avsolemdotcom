import React, { useEffect, useRef } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnBackdrop?: boolean;
    closeOnEsc?: boolean;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEsc = true,
    className = '',
}) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    
    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;
        
        if (isOpen) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [isOpen]);
    
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEsc && isOpen) {
                onClose();
            }
        };
        
        if (closeOnEsc) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [closeOnEsc, isOpen, onClose]);
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose();
        }
    };
    
    const sizeClasses = {
        xs: 'modal-box max-w-xs',
        sm: 'modal-box max-w-sm',
        md: 'modal-box max-w-md',
        lg: 'modal-box max-w-lg',
        xl: 'modal-box max-w-xl',
        full: 'modal-box max-w-full',
    };
    
    return (
        <dialog
            ref={modalRef}
            className={`modal ${className}`}
            onClick={handleBackdropClick}
        >
            <div className={sizeClasses[size]}>
                {title && (
                    <h3 className="font-bold text-lg mb-4">{title}</h3>
                )}
                
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ✕
                </button>
                
                <div className="py-4">
                    {children}
                </div>
                
                {actions && (
                    <div className="modal-action">
                        {actions}
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default Modal;