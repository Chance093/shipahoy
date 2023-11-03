'use client';
import { useSearchParams, } from "next/navigation";
import { useRef, useEffect } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    onOk: () => void;
    children: React.ReactNode;
}

export default function Modal({ title, onClose, onOk, children }: ModalProps) {
    const searchParams = useSearchParams();
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const showModal = searchParams.get('showModal');

    useEffect(() => {
        if (showModal === 'true') modalRef.current?.showModal();
        else modalRef.current?.close();
    }, [showModal])

    const closeModal = () => {
        modalRef.current?.close();
        onClose();
    }

    const handleOk = () => {
        onOk();
        onClose();
    }

    const modal: JSX.Element | null = showModal === 'true' ? (
        <dialog ref={ modalRef }>
            <div>
                
            </div>
        </dialog>
    ) : null;

    return modal;
}
