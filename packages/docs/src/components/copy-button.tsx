import { useState } from "react";

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 text-white"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
