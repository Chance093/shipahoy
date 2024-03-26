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
      <div className="flex items-center justify-center rounded-lg bg-gradient-to-b from-warning">
        <div className="before-thing flex flex-col rounded-lg bg-[#1a1a1b]">
          <div className="subheading flex justify-between">
            <h2 className="ml-4 mt-4">{title}</h2>
            <button onClick={closeModal} className="mr-4 mt-4 border-none outline-none">
              ✕
            </button>
          </div>
          <div className="paragraph m-4">{children}</div>
        </div>
      </div>
    </dialog>
  ) : null;

  return modal;
}
