import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string(),
})

export const updateNoteSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string(),
})

export const deleteNoteSchema = z.object({
  id: z.string().min(1, 'ID is required'),
})

export const toggleShareSchema = z.object({
  id: z.string().min(1, 'ID is required'),
})
