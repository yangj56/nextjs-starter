"use client";

import { Button } from "./shadcn/button";
import { Card } from "./shadcn/card";

const INSTRUCTIONS = [
    {
        step: 1,
        title: "Welcome to the Embossing Kiosk",
        description:
            "Create your personalized embossed design in just a few simple steps.",
        content:
            "Start by entering your name and contact information. This helps us keep track of your design and contact you when it's ready.",
    },
    {
        step: 2,
        title: "Design Your Tag",
        description: "Use our drawing tools to create your unique design.",
        content:
            "You can draw freehand, add text, or choose from preset shapes. Make sure your design stays within the marked boundaries for best results.",
    },
    {
        step: 3,
        title: "Review and Submit",
        description: "Check your design before final submission.",
        content:
            "Take a moment to review your design. Once you're happy with it, click submit and we'll start the embossing process.",
    },
];

export function Welcome() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 gap-8">
            {/* Main instruction box */}
            <Card className="w-full p-6 text-center">
                <h1 className="text-2xl font-bold mb-2">Instructions</h1>
                <p className="text-muted-foreground mb-4">
                    Please follow these steps to create your embossed design
                </p>
            </Card>

            {/* Image placeholder */}
            <Card className="w-full aspect-video flex items-center justify-center">
                <p className="text-muted-foreground">Instruction Image</p>
            </Card>

            {/* Steps displayed in a row */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                {INSTRUCTIONS.map((instruction) => (
                    <Card
                        key={instruction.step}
                        className="p-6 flex flex-col aspect-square"
                    >
                        <div className="text-2xl font-bold text-primary mb-4">
                            Step {instruction.step}
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                            {instruction.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                            {instruction.description}
                        </p>
                        <p className="text-xs flex-grow">
                            {instruction.content}
                        </p>
                    </Card>
                ))}
            </div>

            {/* Start button */}
            <Button
                size="lg"
                className="mt-4"
                onClick={() => {
                    window.location.href = "/embossing";
                }}
            >
                Start Designing
            </Button>
        </div>
    );
}
