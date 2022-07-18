import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useData } from "../../hook/useData";
import { useToast } from "../../hook/useToast";
import { v4 as uuidv4 } from 'uuid'
import { useWorker } from "../../hook/useWorker";


const Canvas = styled.canvas`
    /* cursor: crosshair; */
    position: absolute;
    left: 0;
    top: 0;
    user-select: none;
`

type vector = [number, number]

interface CanvasProps {

}

interface resultData {
    data: {
        length: number
        gravity: number,
        angle: number,
        angularVelocity: number
        angularAcceleration: number
        origin: vector
        vector: vector
    },
    loopId: number
}

const getPos = ([x, y]:vector):vector => {
    return [
        x + window.innerWidth / 2,
        y + window.innerHeight / 4
    ]
}

export function MainCanvas(props: CanvasProps) {
    const toast = useToast()
    const data = useData()
    const worker = useWorker()

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const requestAnimationRef = useRef<any>(null)

    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width=window.innerWidth
                canvasRef.current.height=window.innerHeight
            }
        }

        resize()
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])

    const drawLine = useCallback((vector1: vector, vector2: vector, strokeColor: string = 'rgba(216, 216, 216, 0.3)') => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.strokeStyle = strokeColor;
        context.beginPath()
        context.moveTo(...getPos(vector1))
        context.lineTo(...getPos(vector2))
        context.stroke()
    }, [])

    const drawCircle = useCallback((vector: vector, radius: number, strokeColor: string = '#1C99F9', fillColor: string = '#051525') => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.beginPath()

        context.arc(...getPos(vector), radius, 0, 2*Math.PI) 
        context.fillStyle = '#082340'
        context.fill()
    
        context.strokeStyle = '#1C99F9'
        context.lineWidth = 1;
        context.stroke()
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        let listener = worker.addListener('result', (result: resultData) => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            data.setData(result.data)

            drawLine([0, 0], result.data.vector)
            drawCircle(result.data.vector, 10)
            drawCircle([0,0],20)
        })
        return () => {
            worker.removeListener(listener)
        }
    }, [data, drawCircle, drawLine, worker])


    return (
        <Canvas ref={canvasRef} />
    )
}