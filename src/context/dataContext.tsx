import React, { createContext, useCallback, useEffect, useState } from "react";

type vector = [number, number]
interface DataType {
    length: number
    gravity: number,
    angle: number,
    angularVelocity: number
    angularAcceleration: number
    origin: vector
    vector: vector
}

// 설정 파일 불러오기
const initData:DataType = {
    length: 0,
    gravity: 0,
    angle: 0,
    angularVelocity: 0,
    angularAcceleration: 0,
    origin: [0,0],
    vector: [0,0]
}

export const DataContext = createContext({
    data: initData,
    setData: (data: DataType) => {},
    updateData: <T extends keyof DataType>(key: T, value: DataType[T]) => {}
})

const DataProvider = ({children}: {children: React.ReactNode}) => {
    const [ data, setData ] = useState<DataType>(initData)

    const updateData = useCallback(<T extends keyof DataType>(key: T, value: DataType[T]) => {
        const newData= {
            ...data,
            [key]: value
        }
        setData(newData)
    }, [data])

    return (
        <DataContext.Provider
            value={{
                data,
                setData,
                updateData
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;
