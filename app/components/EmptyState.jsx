"use client";

import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Button from "./Button";

const EmptyState = ({
  title = "No matches",
  subtitle = "Plase change your search and try again!",
  showReset,
  resetButtonLabel = "Remove filters",
}) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label={resetButtonLabel}
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
