"use client";

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";
import { logEvent } from '@/app/utils/clientLogger';

const ErrorState = ({ error }) => {
  useEffect(() => {
    logEvent({ message: "Fatal error occured", level: 'error', error: error });
  }, [error]);

  return <EmptyState title="Woofoo" subtitle="Something went wrong!" />;
};

export default ErrorState;
