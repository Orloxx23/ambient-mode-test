"use client";

import React, { useState } from "react";
import Player from "@/components/Player";

export default function Home() {
  return (
    <main>
      <div className="w-full h-screen flex items-center justify-center bg-black">
        
        <Player />
      </div>
    </main>
  );
}
