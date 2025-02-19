"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
// import "./svg-style.css"
import "../../../public/editor/svgedit.css"

const loadEditor = async () => {
  const amit = await import("../../../public/editor/Editor.js");
  return amit.default;
};

const SvgEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [EditorInstance, setEditorInstance] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures correct hydration
  }, []);

  useEffect(() => {
    if (isClient) {
      loadEditor().then((Editor) => setEditorInstance(() => Editor));
    }
  }, [isClient]);

  useEffect(() => {
    if (EditorInstance && containerRef.current) {
      const svgEditor = typeof EditorInstance === "function"
        ? new EditorInstance(containerRef.current)
        : new EditorInstance(containerRef.current);

      svgEditor.init();
      svgEditor.setConfig({
        allowInitialUserOverride: true,
        extensions: [],
        noDefaultExtensions: false,
        bkgd_url: "https://www.svgrepo.com/show/9415/contest-cup.svg", // Dynamically fetch from gemini api
        // imgPath: "../../../public/editor/images/zoom.svg",
        userExtensions: []
      });
      console.log("I am config object: ",svgEditor.configObj)
    }
  }, [EditorInstance]);

  if (!isClient) return null; // Prevents hydration mismatch

  return (
    <div className="w-full h-full">
      <h2>SVG Editor</h2>
      {EditorInstance && (
        <div
          ref={containerRef}
          // className="svg-editor-container"
          style={{ width: "100%", height: "100vh", border: "1px solid #ccc" }}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(SvgEditor), { ssr: false });
