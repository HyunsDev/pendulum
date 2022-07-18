import React from "react";
import DataProvider from "./dataContext";
import SettingProvider from "./settingContext";
import ToastProvider from "./toastContext";
import WorkerProvider from "./workerContext";

export function ContextWrapper({children}: {children: React.ReactNode}) {

    return (
        <ToastProvider>
            <WorkerProvider>
                <SettingProvider>
                    <DataProvider>
                        {children}
                    </DataProvider>
                </SettingProvider>
            </WorkerProvider>
        </ToastProvider>
    )
}