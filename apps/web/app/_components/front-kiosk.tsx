"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import React, { useRef, useState } from "react";

import { DrawingPad, type DrawingPadRef } from "./drawing-pad";
import { Button } from "./shadcn/button";
import { Input } from "./shadcn/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./shadcn/select";

type Props = {
    apiUrl: string;
};

type Model = "engraving" | "embroidery";

type FormInputs = {
    name: string;
    contactNumber: string;
    model: Model;
};

export function FrontKiosk({ apiUrl }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        setValue,
    } = useForm<FormInputs>({
        defaultValues: {
            name: "",
            contactNumber: "",
            model: "engraving",
        },
        mode: "onBlur",
        reValidateMode: "onBlur",
    });
    const selectedModel = watch("model");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    // Create a ref to access the DrawingPad component
    const drawingPadRef = useRef<DrawingPadRef>(null);

    // Handle form submission
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        // First, save the design from the drawing pad
        if (!drawingPadRef.current) {
            alert("Drawing pad not initialized");
            return;
        }

        // Get the canvas data URL from the drawing pad
        const dataUrl = drawingPadRef.current.saveCanvas();

        if (!dataUrl) {
            setSubmitResult({
                success: false,
                message: "Please create a design before submitting",
            });
            return;
        }

        // Check if the canvas is empty (mostly white pixels)
        const isCanvasEmpty = drawingPadRef.current?.isEmpty();

        if (isCanvasEmpty) {
            setSubmitResult({
                success: false,
                message: "Please create a design before submitting",
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            // Prepare data for API submission
            const submissionData = {
                name: data.name,
                contactNumber: data.contactNumber,
                image: dataUrl,
                model: data.model,
                timestamp: new Date().toISOString(),
            };

            // Send data to API
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitResult({
                    success: true,
                    message: `Successfully sent to ${data.model} device!`,
                });
                // Reset form after successful submission
                reset();
            } else {
                throw new Error(
                    result.message || `Failed to send to ${data.model} device`,
                );
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitResult({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 border border-gray-200 bg-white p-6 shadow-md">
            <div className="w-full">
                <h2 className="mb-6 text-2xl font-semibold">
                    Enter your details
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Drawing Pad */}
                    <div className="flex w-full flex-col items-center justify-center">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Create Your Design
                        </label>
                        <p className="mb-4 text-sm text-gray-500">
                            Use the drawing tools below to create your{" "}
                            {selectedModel} design
                        </p>
                        <DrawingPad ref={drawingPadRef} hideSaveButton={true} />
                        {/* Result Message */}
                        {submitResult && (
                            <div
                                className={`mt-6 rounded-lg p-4 ${
                                    submitResult.success
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {submitResult.message}
                            </div>
                        )}
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Input
                                id="name"
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 1,
                                        message:
                                            "Name must be at least 1 characters",
                                    },
                                })}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Input
                                id="contactNumber"
                                {...register("contactNumber", {
                                    required: "Contact number is required",
                                    pattern: {
                                        value: /^\+?[0-9\s\-()]{7,15}$/,
                                        message:
                                            "Please enter a valid contact number",
                                    },
                                })}
                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter your contact number"
                            />
                            {errors.contactNumber && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.contactNumber.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Select
                                defaultValue={selectedModel}
                                onValueChange={(value: Model) => {
                                    setValue("model", value, {
                                        shouldValidate: true,
                                    });
                                }}
                            >
                                <SelectTrigger className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="engraving">
                                        Engraving
                                    </SelectItem>
                                    <SelectItem value="embroidery">
                                        Embroidery
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="mt-1 text-xs text-gray-500">
                                {selectedModel === "engraving"
                                    ? "Engraving creates designs on hard surfaces"
                                    : "Embroidery creates designs on fabric"}
                            </p>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="mb-8 mt-4 flex items-center justify-between">
                        <Button
                            variant={"default"}
                            type="submit"
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? "Sending..." : `Submit Design`}
                        </Button>

                        <p className="text-sm text-gray-600">
                            to save and send your design to the {selectedModel}{" "}
                            machine
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
