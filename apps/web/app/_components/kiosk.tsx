"use client";

import React from "react";

import { useApiUrl } from "../context/settings";
import { AdminManager } from "./admin-manager";
import { FrontKiosk } from "./front-kiosk";

export function Kiosk() {
    const apiUrl = useApiUrl();

    return (
        <div>
            <div className="mb-6 flex justify-end">
                <AdminManager />
            </div>
            <div className="mb-8 w-full">
                <FrontKiosk apiUrl={apiUrl} />
            </div>
        </div>
    );
}
