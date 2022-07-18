import React, { useCallback, useEffect, useState } from 'react';
import { Controller, Button, Labels, Label, NumberField } from '../components';
import { useToast } from '../hook/useToast';
import { useWorker } from '../hook/useWorker';
import { ReactComponent as GithubSvg } from '../assets/github.svg'
import {
  Play,
  Pause,
  Cursor as CursorIcon,
  CaretRight,
  CaretLeft,
  ArrowsOutCardinal,
  PlusCircle,
  Plus,
  Minus,
  ArrowsOut,
  ArrowsIn,
  ArrowClockwise,
  Trash
} from "phosphor-react";
import { useData } from '../hook/useData';
import styled from 'styled-components';
import { MainCanvas } from '../components/canvas/MainCanvas';
import { LabelController } from '../components/components/labels';
import { ControlController } from '../components/components/control';

const GithubIcon = styled(GithubSvg)`
    position: fixed;
    width: 24px;
    height: 24px;
    top: 36px;
    left: 36px;   
    user-select: none;
    fill: #ffffff;
`

function App() {
  const toast = useToast()
  const worker = useWorker()
  const data = useData()

  const [ layQuota, setLayQuota ] = useState(16)

  useEffect(() => {
    const resize = () => {
      worker.requestWorker('screenSize', { width: window.innerWidth, height: window.innerHeight })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [worker])

  const reset = useCallback(() => {
    worker.requestWorker('reset')
  }, [data, worker])

  return (
    <div className="App">
      <MainCanvas />

      <LabelController />

      <a href="https://github.com/HyunsDev/pendulum" target={"_blank"} rel="noreferrer">
        <GithubIcon /> 
      </a>

      <ControlController />

      <Controller left={20} bottom={20}>
        <Button content={<Trash />} tooltip='초기화 [ r ]' onClick={() => reset()} />
        <Button content={<ArrowClockwise />} tooltip='새로고침 [ ctrl r ]' onClick={() => window.location.reload()} />
      </Controller>
    </div>
  );
}

export default App;
