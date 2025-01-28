"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Example01() {
    const [count, setCount] = useState(0);
    return <Button onClick={() => setCount((prev) => prev + 1)}>{count}</Button>;
}