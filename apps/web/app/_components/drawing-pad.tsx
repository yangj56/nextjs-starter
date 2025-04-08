"use client";

import { Canvas, IText, PencilBrush } from "fabric";
import { Download, Eraser, Pencil, Type } from "lucide-react";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

interface DrawingPadProps {
    width?: number;
    height?: number;
    onSave?: (dataUrl: string) => void;
    hideSaveButton?: boolean;
}

// Available fonts for text
const AVAILABLE_FONTS = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Impact", value: "Impact, sans-serif" },
    { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
] as const;

// Define the interface for the ref object that will be exposed
export interface DrawingPadRef {
    saveCanvas: () => string | null;
    isEmpty: () => boolean;
    // Add any other methods you want to expose
}

// Use forwardRef with the defined interface
export const DrawingPad = forwardRef<DrawingPadRef, DrawingPadProps>(
    ({ width = 600, height = 400, onSave, hideSaveButton = false }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const fabricCanvasRef = useRef<Canvas | null>(null);
        const [activeMode, setActiveMode] = useState<
            "draw" | "text" | "eraser" | "select"
        >("select");
        const [brushSize, setBrushSize] = useState<number>(5);
        const [color, setColor] = useState<string>("#000000");
        const [textInput, setTextInput] = useState<string>("");
        const [showTextInput, setShowTextInput] = useState<boolean>(false);
        const [selectedFont, setSelectedFont] = useState<string>(
            AVAILABLE_FONTS[0].value,
        );

        // Use useImperativeHandle to expose methods that match the interface
        useImperativeHandle(ref, () => ({
            saveCanvas: () => {
                if (!fabricCanvasRef.current) return null;

                // Convert canvas to data URL (PNG format)
                const dataUrl = fabricCanvasRef.current.toDataURL({
                    format: "png",
                    quality: 1,
                    multiplier: 2,
                });

                // Call the onSave callback if provided
                if (onSave) {
                    onSave(dataUrl);
                }

                return dataUrl;
            },

            isEmpty: () => {
                if (!fabricCanvasRef.current) return true;
                // Check if the canvas is empty (has no objects or only has the background)
                return fabricCanvasRef.current.isEmpty();
            },
        }));

        // Initialize Fabric.js canvas
        useEffect(() => {
            if (canvasRef.current && !fabricCanvasRef.current) {
                const canvas = new Canvas(canvasRef.current, {
                    width,
                    height,
                    backgroundColor: "#ffffff",
                    isDrawingMode: false,
                });
                // Set up drawing brush
                canvas.freeDrawingBrush = new PencilBrush(canvas);
                canvas.freeDrawingBrush.width = brushSize;
                canvas.freeDrawingBrush.color = color;

                fabricCanvasRef.current = canvas;

                // Clean up on unmount
                return () => {
                    canvas.dispose();
                    fabricCanvasRef.current = null;
                };
            }
        }, [width, height]);

        // Update brush when settings change
        useEffect(() => {
            if (
                fabricCanvasRef.current &&
                fabricCanvasRef.current.freeDrawingBrush
            ) {
                fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
                fabricCanvasRef.current.freeDrawingBrush.color = color;
            }
        }, [brushSize, color]);

        // Handle mode changes
        useEffect(() => {
            if (
                !fabricCanvasRef.current ||
                !fabricCanvasRef.current.freeDrawingBrush
            )
                return;

            const canvas = fabricCanvasRef.current;

            // Set drawing mode based on active tool
            canvas.isDrawingMode =
                activeMode === "draw" || activeMode === "eraser";

            // Configure eraser
            if (activeMode === "eraser" && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.width = brushSize * 2;
                canvas.freeDrawingBrush.color = "#ffffff";
            } else if (activeMode === "draw" && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.width = brushSize;
                canvas.freeDrawingBrush.color = color;
            }

            // Set selection mode
            if (activeMode === "select") {
                canvas.selection = true;
                canvas.forEachObject((obj) => {
                    obj.selectable = true;
                });
            } else {
                canvas.selection = false;
                canvas.forEachObject((obj) => {
                    obj.selectable = false;
                });
            }
        }, [activeMode, brushSize, color]);

        // Handle tool selection
        const handleToolSelect = (mode: typeof activeMode) => {
            setActiveMode(mode);
            setShowTextInput(mode === "text");
        };

        // Add text to canvas
        const addText = () => {
            if (!fabricCanvasRef.current || !textInput.trim()) return;

            const text = new IText(textInput, {
                left: 50,
                top: 50,
                fontFamily: selectedFont.split(",")[0]?.trim() || "Arial", // Use first font in the font-family list
                fontSize: brushSize * 5,
                fill: color,
            });

            fabricCanvasRef.current.add(text);
            fabricCanvasRef.current.setActiveObject(text);
            setTextInput("");
            setActiveMode("select");
            setShowTextInput(false);
        };

        // Clear canvas
        const clearCanvas = () => {
            if (!fabricCanvasRef.current) return;

            if (confirm("Are you sure you want to clear the canvas?")) {
                fabricCanvasRef.current.clear();
                fabricCanvasRef.current.backgroundColor = "#ffffff";
            }
        };

        // Save canvas
        const saveCanvas = () => {
            if (!fabricCanvasRef.current) return;

            // Convert canvas to data URL (PNG format)
            const dataUrl = fabricCanvasRef.current.toDataURL({
                format: "png",
                quality: 1,
                multiplier: 2,
            });

            if (onSave) {
                onSave(dataUrl);
            } else {
                // If no onSave callback, download the image
                const link = document.createElement("a");
                link.download = "embossing-design.png";
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        return (
            <div className="flex flex-col space-y-6">
                {/* Welcome Header */}
                <div className="text-2xl font-bold text-center">Welcome!</div>

                {/* Tools and Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => handleToolSelect("select")}
                        className={`rounded-lg p-2 ${
                            activeMode === "select"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        title="Select"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                            <path d="m13 13 6 6" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handleToolSelect("draw")}
                        className={`rounded-lg p-2 ${
                            activeMode === "draw"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        title="Draw"
                    >
                        <Pencil size={24} />
                    </button>

                    <button
                        onClick={() => handleToolSelect("text")}
                        className={`rounded-lg p-2 ${
                            activeMode === "text"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        title="Add Text"
                    >
                        <Type size={24} />
                    </button>

                    <button
                        onClick={() => handleToolSelect("eraser")}
                        className={`rounded-lg p-2 ${
                            activeMode === "eraser"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        title="Eraser"
                    >
                        <Eraser size={24} />
                    </button>

                    <div className="ml-2 flex items-center space-x-2">
                        <label htmlFor="brushSize" className="text-sm">
                            Size:
                        </label>
                        <input
                            id="brushSize"
                            type="range"
                            min="1"
                            max="50"
                            value={brushSize}
                            onChange={(e) =>
                                setBrushSize(parseInt(e.target.value))
                            }
                            className="w-24"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <label htmlFor="colorPicker" className="text-sm">
                            Color:
                        </label>
                        <input
                            id="colorPicker"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-8 w-8 cursor-pointer"
                        />
                    </div>

                    <div className="ml-auto flex space-x-2">
                        <button
                            onClick={clearCanvas}
                            className="text-white hover:bg-red-600 rounded-lg bg-chart-5 px-3 py-2"
                            title="Clear Canvas"
                        >
                            Clear
                        </button>

                        {/* Only show Save button if not hidden */}
                        {!hideSaveButton && (
                            <button
                                onClick={saveCanvas}
                                className="bg-green-500 text-white hover:bg-green-600 rounded-lg px-3 py-2"
                                title="Save Design"
                            >
                                <Download size={24} className="mr-1 inline" />
                                Save
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div
                    className="border-gray-300 relative border rounded-lg overflow-hidden"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                >
                    <canvas ref={canvasRef} />
                </div>

                {/* Text Controls and Font Selection - Two Column Layout */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-2">
                        <label className="font-semibold text-lg">
                            Add Your Text
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Enter text..."
                                className="border-gray-300 flex-1 rounded-lg border p-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="font-semibold text-lg">
                            Font Selection
                        </label>
                        <div className="flex space-x-2">
                            <select
                                value={selectedFont}
                                onChange={(e) =>
                                    setSelectedFont(e.target.value)
                                }
                                className="border-gray-300 flex-1 rounded-lg border p-2"
                            >
                                {AVAILABLE_FONTS.map((font) => (
                                    <option
                                        key={font.value}
                                        value={font.value}
                                        style={{ fontFamily: font.value }}
                                    >
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={addText}
                                className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
                            >
                                Add Text
                            </button>
                        </div>
                    </div>
                </div>

                {/* Graphics Selection */}
                <div className="w-full">
                    <h2 className="font-semibold text-lg mb-4">
                        Add Your Graphics
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full border-2 border-gray-300">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        <div className="flex-1 grid grid-cols-3 gap-4">
                            {[0, 1, 2].map((index) => (
                                <div
                                    key={index}
                                    className="aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center"
                                >
                                    <span className="text-gray-400">Image</span>
                                </div>
                            ))}
                        </div>

                        <button className="p-2 rounded-full border-2 border-gray-300">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Keep the text preview if showTextInput is true */}
                {showTextInput && (
                    <div className="text-gray-500 text-sm">
                        Preview:{" "}
                        <span style={{ fontFamily: selectedFont }}>
                            {textInput || "Sample Text"}
                        </span>
                    </div>
                )}
            </div>
        );
    },
);

// Add display name for better debugging
DrawingPad.displayName = "DrawingPad";
