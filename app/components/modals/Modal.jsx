"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  canCloseDisabled = false,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled && !canCloseDisabled) {
      return;
    }

    setShowModal(false);
    // for the closing animation purposes
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleEscape = useCallback(
    (event) => {
      if (event.key === "Escape" && !disabled) {
        handleClose();
      }
    },
    [disabled, handleClose]
  );
  const handleClickOutside = useCallback(
    (event) => {
      const modalElement = document.querySelector(".modal-container");
      if (!modalElement?.contains(event.target) && !disabled) {
        handleClose();
      }
    },
    [disabled, handleClose]
  );

  useEffect(() => {
    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, handleEscape, handleClickOutside]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 mx-auto my-10 max-h-[90vh] overflow-y-auto">
          {/* CONTENT */}
          {/* here is duration 300 for the animation */}
          <div
            className={`modal-container translate duration-300 ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}
             bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto flex flex-col hide-scrollbar`}
          >
            <div className="translate border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-full">
              {/* HEADER */}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute right-9"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/* BODY */}
              <div className="relative p-6 flex-auto overflow-y-auto">
                {body}
              </div>
              {/* FOOTER */}
              <div className="p-6 bg-white sticky bottom-0">
                <div className="flex flex-row items-center gap-4 w-full z-50">
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      outline
                      disabled={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                    />
                  )}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
