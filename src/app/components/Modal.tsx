"use client";
import { useRef } from "react";

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
  };

  const modal: JSX.Element | null = true ? (
    <dialog ref={modalRef} className="border-none bg-transparent outline-none backdrop:bg-gray-800/50">
      <section className="min-w-[25vw] max-w-[50vw] overflow-hidden rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col gap-8 rounded-2xl bg-radial-gradient p-8">
          <div className="flex justify-between text-xl">
            <h2 className="text-white">{title}</h2>
            <button onClick={closeModal} className="border-none text-white outline-none">
              ✕
            </button>
          </div>
          <div>{children}</div>
        </div>
      </section>
    </dialog>
  ) : null;

  return modal;
}
