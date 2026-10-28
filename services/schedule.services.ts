/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { ApiResponse } from "@/app/types/api.types"
import { ISchedule } from "@/app/types/schedule.types"
import { serverApiClient } from "@/lib/axios/serverApiClient"

export const getSchedules = async () : Promise<ApiResponse<ISchedule[]>> => {
  try {
    return await serverApiClient.get<ISchedule[]>('/schedules')
  } catch (error: any) {
    return{
      success: false,
      message: error.message
    }
  }
}