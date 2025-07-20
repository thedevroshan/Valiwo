'use client'
import { useRef } from "react"
import { IAPIReturn } from "../config/api.config"
import { useMutation } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { useState } from "react"


export const useDebounceAPI = (apiFunc:(...args:any)=>Promise<IAPIReturn>, delay:number) => {
    let timeOutRef = useRef<NodeJS.Timeout | null>(null)
    const [mutationError, setMutationError] = useState<string>("")

    const mutation = useMutation({
        mutationFn: apiFunc,
        onSuccess: (data) => {
            if(!data?.ok){
                setMutationError(data.msg)
            }
        },
        onError: (error) => {
            if(isAxiosError(error)){
                setMutationError(error.response?.data.msg)
            }
        }
    })

    const debounceMutate = ({...args}) => {
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
        }

        timeOutRef.current = setTimeout(() => {
            mutation.mutate({...args})
        }, delay);             
    }

    return {
        ...mutation,
        debounceMutate,
        mutationError
    }
}