"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const ConfirmationTimer = ({ onCancel, onConfirm }) => {
  const [countdown, setCountdown] = useState(3);
  const [confirmed, setConfirmed] = useState(false); // Prevent multiple calls

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setConfirmed(true); // Mark as confirmed to prevent infinite calls
      onConfirm();
    }
  }, [confirmed, countdown, onConfirm]);

  return (
    <div className="flex flex-col items-center justify-center h-48 gap-4 mb-12">
      <AnimatePresence mode="popLayout">
        {countdown > 0 && (
          <motion.span
            key={countdown}
            className="text-5xl font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.4, 0] }} // Scale up then fade out
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {countdown}
          </motion.span>
        )}
      </AnimatePresence>

      {countdown > 0 && <Button outline label="Cancel" onClick={onCancel} />}
    </div>
  );
};

export default ConfirmationTimer;
