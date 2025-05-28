<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel, type Row } from '@tanstack/table-core'
import type { Event, EventGroup } from '~/types'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnVisibility = ref()
const rowSelection = ref({})

// Function to fetch events
async function fetchEvents() {
  const { data: apiResponse, pending, error , refresh } = await useFetch('http://localhost:8000/event', {
    onResponseError({ response }) {
      toast.add({
        title: 'Error',
        description: response._data?.message || 'Failed to fetch events',
        color: 'red'
      })
    }
  })

  return {
    apiResponse,
    pending,
    error,
    refresh
  }
}

// Call the fetch function
const { apiResponse, pending, error , refresh } = await fetchEvents()

// Flatten the event groups into individual events
const flattenedData = computed(() => {
  if (!apiResponse.value?.data) return []
  
  return apiResponse.value.data.flatMap(group => 
    group.event_info.map(event => ({
      ...event,
      groupId: group._id,
      groupDate: group.date,
      isGroupDeleted: group.isdeleted
    })))
})



// Rest of the code remains unchanged
function getRowItems(row: Row<Event>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy Event ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original._id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Event ID copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View event details',
      icon: 'i-lucide-list',
      onSelect() {
        navigateTo(`/events/${row.original._id}`)
      }
    },
    {
      label: 'Edit event',
      icon: 'i-lucide-pencil',
      onSelect() {
        navigateTo(`/events/${row.original._id}/edit`)
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete event',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Event deleted',
          description: 'The event has been deleted.'
        })
      }
    }
  ]
}

const columns: TableColumn<Event>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => 
      h('p', { class: 'font-medium text-highlighted' }, row.original.name)
  },
  {
    id: 'date',
    header: 'Date',
    cell: ({ row }) =>
      h('p', { class: 'font-medium text-highlighted' }, 
        row.original.groupDate ? new Date(row.original.groupDate).toLocaleDateString() : 'N/A'
      )
  },
  {
    id: 'time',
    header: 'Time',
    cell: ({ row }) =>
      h('p', { class: 'font-medium text-highlighted' }, row.original.time || 'N/A')
  },
  {
    id: 'special',
    header: 'Special',
    cell: ({ row }) => {
      const color = row.original.isSpecial ? 'success' : 'warning'
      return h(UBadge, { 
        class: 'capitalize', 
        variant: 'subtle', 
        color,
        ui: { rounded: 'rounded-full' }
      }, () =>
        row.original.isSpecial ? 'Special' : 'Regular'
      )
    }
  },
  {
    id: 'thumbnail',
    header: 'Thumbnail',
    cell: ({ row }) =>
      h(UAvatar, {
        src: row.original.thumbnail,
        alt: row.original.name,
        size: 'sm',
        ui: { rounded: 'rounded' }
      })
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h('div', { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'gray',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
  }
]

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const visibleColumns = ref([
  'select',
  'name',
  'date',
  'time',
  'special',
  'thumbnail',
  'actions'
])
</script>

<template>
  <UDashboardPanel id="events">
    <template #header>
      <UDashboardNavbar title="Events">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            icon="i-lucide-refresh-ccw"
            color="success"
            variant="ghost"
            :loading="pending"
            @click="refresh"
            class="mr-2"
          >
            Refresh
          </UButton>
          <CustomersAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
        Error loading events: {{ error.message }}
      </div>

      <UTable
        ref="table"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
        class="shrink-0"
        :data="flattenedData"
        :columns="columns.filter(col => visibleColumns.includes(col.id))"
        :loading="pending"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
        }"
      >
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-12 gap-3">
            <UIcon name="i-lucide-calendar" class="text-4xl text-gray-400" />
            <p class="text-gray-500">
              {{ pending ? 'Loading events...' : 'No events found' }}
            </p>
            <UButton
              v-if="!pending"
              icon="i-lucide-plus"
              label="Add New Event"
              color="primary"
              @click="navigateTo('/events/new')"
            />
          </div>
        </template>
      </UTable>

      <div
        v-if="flattenedData.length > 0"
        class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto"
      >
        <div class="flex items-center gap-4">
          <div class="text-sm text-muted">
            {{
              table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
            }}
            of
            {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
            selected.
          </div>
          
          <USelect
            v-model="pagination.pageSize"
            :options="[10, 20, 30, 50, 100]"
            class="w-20"
            @update:modelValue="table?.tableApi?.setPageSize($event)"
          />
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="
              (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
            "
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>