import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'
import * as zod from 'zod'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput
} from './styles'
import { useEffect, useState } from 'react'
import { number } from 'zod'

// 2 Tipos de formularios : controlled / uncontrolled 
// biblioteca de validacao : zod [ npm i zod ]
// para integrar com o react-hook-form = npm i @hookform/resolvers

/**
 * o register retorna elemento do html
 * funcion register(name:string) {
 *  retrun(
 *    onChange: () => void;
 *    onBlur: () => void;
 * )
 * }
*/

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });

  const activdeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const totalSeconds = activdeCycle ? activdeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activdeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          activdeCycle.startDate
        )
        if( secondsDifference >= totalSeconds){
          setCycles(
            state => state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            })
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        }else {
          setAmountSecondsPassed(secondsDifference)
        }
      },)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activdeCycle, activeCycleId]
  )

  function handleCreateNewCyCle(data: NewCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    reset();
  }

  function handleInterruptCycle() {
    setCycles(
      state => state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedData: new Date() }
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }

 
  const currentSeconds = activdeCycle ? totalSeconds - amountSecondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activdeCycle) {
      document.title = `${minutes}: ${seconds}`
    }
  }, [minutes, seconds, activdeCycle])

  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCyCle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list='task-suggestions'
            placeholder='D?? um nome para seu projeto'
            disabled={!!activdeCycle}
            {...register('task')}
          />

          <datalist id='task-suggestions'>
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder='00'
            step={5}
            min={1}
            max={60}
            disabled={!!activdeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activdeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Come??ar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
