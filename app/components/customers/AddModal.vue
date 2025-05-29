<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { ref, reactive } from 'vue'

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  isdeleted: z.boolean(),
  event_info: z.array(
    z.object({
      name: z.string().min(2, 'Name too short'),
      time: z.string().min(1, 'Time is required'),
      description: z.string().min(5, 'Description too short'),
      isSpecial: z.boolean(),
      thumbnail: z.string().url('Invalid URL'),
      admin_id: z.string().min(1, 'Admin ID is required'),
      isdeleted: z.boolean()
    })
  )
})

const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  date: '',
  isdeleted: false,
  event_info: [
    {
      name: '',
      time: '',
      description: '',
      isSpecial: false,
      thumbnail: '',
      admin_id: '',
      isdeleted: false
    }
  ]
})

const toast = useToast()

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  const url = URL.createObjectURL(file)
  state.event_info[0].thumbnail = url
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Submitted form data:', event.data)
  toast.add({ title: 'Success', description: `New Events added`, color: 'success' })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="New Event" description="Add a new event to the database">
    <!-- Button to open modal -->
    <UButton label="New Event" icon="i-lucide-plus" @click="open = true" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Date" placeholder="YYYY-MM-DD" name="date">
          <UInput v-model="state.date" class="w-full" type="date" />
        </UFormField>

        <UFormField label="Name" placeholder="Event Name" name="event_info.0.name">
          <UInput v-model="state.event_info[0].name" class="w-full" />
        </UFormField>

        <UFormField label="Time" placeholder="HH:mm" name="event_info.0.time">
          <UInput v-model="state.event_info[0].time" class="w-full" type="time" />
        </UFormField>

        <UFormField label="Description" placeholder="Describe the event" name="event_info.0.description">
          <UInput v-model="state.event_info[0].description" class="w-full" />
        </UFormField>

        <UFormField label="Is Special" name="event_info.0.isSpecial">
          <UCheckbox v-model="state.event_info[0].isSpecial" />
        </UFormField>

        <UFormField label="Thumbnail" name="event_info.0.thumbnail">
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
          />
          <div v-if="state.event_info[0].thumbnail" class="mt-2">
            <img
              :src="state.event_info[0].thumbnail"
              alt="Thumbnail preview"
              class="max-w-xs max-h-40 object-contain"
            />
          </div>
        </UFormField>

        <UFormField label="Admin ID" placeholder="Admin Identifier" name="event_info.0.admin_id">
          <UInput v-model="state.event_info[0].admin_id" class="w-full" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
