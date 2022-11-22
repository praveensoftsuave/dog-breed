import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { imageData } from '../interface/data.interface'


export interface ImageState {
  Image: imageData[],
  breed: any
}

const initialState: ImageState = {
  Image: [],
  breed: undefined
}

export const ImageSlice = createSlice({
  name: 'ImageSave',
  initialState,
  reducers: {
    setBreed: (state, action: PayloadAction<any>) => {
      state.breed = action.payload
    },
    addImage: (state, action: PayloadAction<imageData[]>) => {
      state.Image = action.payload
    },
  },
})

export const { setBreed, addImage } = ImageSlice.actions

export default ImageSlice.reducer