import React, { createContext, useCallback, useState } from "react";
import type { Setting } from '../types/setting'

// 설정 파일 불러오기
const initSetting: Setting = {
    
}

export const SettingContext = createContext({
    setting: initSetting,
    setSetting: (setting: Setting) => {},
    updateSetting: <T extends keyof Setting>(key: T, value: Setting[T]) => {}
})

const SettingProvider = ({children}: {children: React.ReactNode}) => {
    const [ setting, setSetting ] = useState<Setting>(initSetting)

    const updateSetting = useCallback(<T extends keyof Setting>(key: T, value: Setting[T]) => {
        const newSetting = {
            ...setting,
            [key]: value
        }
        setSetting(newSetting)
    }, [setting])

    return (
        <SettingContext.Provider
            value={{
                setting,
                setSetting,
                updateSetting
            }}
        >
            {children}
        </SettingContext.Provider>
    )
}

export default SettingProvider;
