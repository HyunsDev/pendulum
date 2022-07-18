import { useCallback, useState } from "react"
import { useData } from "../../hook/useData"
import { useToast } from "../../hook/useToast"
import { useWorker } from "../../hook/useWorker"
import { Controller } from "../controller"
import { CheckBox, Inputs, NumberField } from "../input"


function ControlController(props: {}) {
    const toast = useToast()
    const worker = useWorker()
    const data = useData()

    const [ showOption, setShowOption ] = useState(false)

    return (
        <Controller right={230} top={20} minWidth={120}>
            <Inputs>
                <CheckBox label="설정" value={showOption} onClick={() => {setShowOption(!showOption)}} />

                {
                    showOption && <>
                        <NumberField 
                            label="중력가속도" 
                            value={data.data.gravity} 
                            onChange={(value) => worker.requestWorker('updateGravity', value)} 
                            min={1} 
                            max={100} 
                            step={0.1} 
                        />

                        <NumberField 
                            label="길이" 
                            value={data.data.length} 
                            onChange={(value) => worker.requestWorker('updateLength', value)} 
                            min={1} 
                            max={1000} 
                            step={1} 
                        />
                    </>
                }

            </Inputs>
        </Controller>
    )
}

export {
    ControlController
}