'use client';
import { useSearchParams, } from "next/navigation";
import { useRef, useEffect } from "react";

interface ModalProps {
    showModal: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ showModal, title, onClose, children }: ModalProps) {
    // const searchParams = useSearchParams();
    const modalRef = useRef<HTMLDialogElement | null>(null);
    if (showModal) modalRef.current?.showModal();
    // const showModal = searchParams.get('showModal');

    // useEffect(() => {
    //     if (showModal === 'true') modalRef.current?.showModal();
    //     else modalRef.current?.close();
    // }, [showModal])

    const closeModal = () => {
        modalRef.current?.close();
        onClose();
    }


    const modal: JSX.Element | null = true ? (
        <dialog ref={ modalRef } className="bg-transparent backdrop:bg-gray-800/50 border-none outline-none">
            <div className="flex justify-center items-center bg-gradient-to-b from-warning rounded-lg">
                <div className="flex flex-col bg-[#1a1a1b] rounded-lg before-thing">
                    <div className="subheading flex justify-between">
                        <h2 className="mt-4 ml-4">{ title }</h2>
                        <button onClick={ closeModal } className="mt-4 mr-4 border-none outline-none">✕</button>
                    </div>
                    <div className="paragraph m-4">
                        { children }
                    </div>
                </div>
            </div>
        </dialog>
    ) : null;

    return modal;
}
