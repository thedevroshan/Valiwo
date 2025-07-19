'use client'
import { useRef } from "react"
import { IAPIReturn } from "../config/api.config"
import { useMutation } from "@tanstack/react-query"
import { isAxiosError } from "axios"


export const useDebounceAPI = (apiFunc:(...args:any)=>Promise<IAPIReturn>, delay:number) => {
    let timeOutRef = useRef<NodeJS.Timeout | null>(null)

    const mutation = useMutation({
        mutationFn: apiFunc,
        onSuccess: (data) => {
            if(!data?.ok){
                console.log(data)
            }
        },
        onError: (error) => {
            if(isAxiosError(error)){
                console.log(error.response?.data)
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
        debounceMutate
    }
}