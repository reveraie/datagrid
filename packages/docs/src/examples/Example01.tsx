'use client';

import { Button } from "@/src/components/ui/button";
import { useState } from "react";

export default function Example01() {

  const [counter, setCounter] = useState(0);

  return <div>
    <p>Example 01</p>
    <Button onClick={() => setCounter((prev) => prev + 1)} >Button {counter}</Button>
  </div>;

}