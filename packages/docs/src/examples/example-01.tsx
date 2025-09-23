"use client";

import { useState } from "react";

export default function Example01() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((prev) => prev + 1)}>{count}</button>;
}
