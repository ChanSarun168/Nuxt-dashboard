<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const toast = useToast();

const open = ref(false);
const show = ref(false);

const links = [
  [
    {
      label: "Home",
      icon: "i-lucide-house",
      to: "/",
      onSelect: () => {
        open.value = false;
      },
    },
    // }, {
    //   label: 'Food',
    //   icon: 'i-lucide-calendar-days',
    //   to: '/inbox',
    //   badge: '4',
    //   onSelect: () => {
    //     open.value = false
    //   }
    // }, {
    {
      label: "Events",
      icon: "i-lucide-calendar-days",
      to: "/events",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Food",
      icon: "i-lucide-utensils",
      to: "/customers",
      onSelect: () => {
        open.value = false;
      },
    },
    // {
    //   label: 'Settings',
    //   to: '/settings',
    //   icon: 'i-lucide-settings',
    //   defaultOpen: true,
    //   type: 'trigger',
    //   children: [{
    //     label: 'General',
    //     to: '/settings',
    //     exact: true,
    //     onSelect: () => {
    //       open.value = false
    //     }
    //   }, {
    //     label: 'Members',
    //     to: '/settings/members',
    //     onSelect: () => {
    //       open.value = false
    //     }
    //   }, {
    //     label: 'Notifications',
    //     to: '/settings/notifications',
    //     onSelect: () => {
    //       open.value = false
    //     }
    //   }, {
    //     label: 'Security',
    //     to: '/settings/security',
    //     onSelect: () => {
    //       open.value = false
    //     }
    //   }]
    // }], [{
    //   label: 'Feedback',
    //   icon: 'i-lucide-message-circle',
    //   to: 'https://github.com/nuxt-ui-pro/dashboard',
    //   target: '_blank'
    // }, {
    //   label: 'Help & Support',
    //   icon: 'i-lucide-info',
    //   to: 'https://github.com/nuxt/ui-pro',
    //   target: '_blank'
    // }
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.flat(),
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${
          route.path === "/" ? "/index" : route.path
        }.vue`,
        target: "_blank",
      },
    ],
  },
]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token && window.location.pathname !== "/login") {
    window.location.href = "/login";
  } else {
    show.value = true;
  }

  const cookie = useCookie("cookie-consent");
  if (cookie.value === "accepted") {
    return;
  }

  toast.add({
    title:
      "We use first-party cookies to enhance your experience on our website.",
    duration: 0,
    close: false,
    actions: [
      {
        label: "Accept",
        color: "neutral",
        variant: "outline",
        onClick: () => {
          cookie.value = "accepted";
        },
      },
      {
        label: "Opt out",
        color: "neutral",
        variant: "ghost",
      },
    ],
  });
});
</script>

<template>
  <UDashboardGroup unit="rem" v-if="show">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <!-- <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" /> 
      </template> -->
      <template #header="{ collapsed }">
        <div
          class="flex items-center justify-center h-16 px-4 text-xl font-bold"
        >
          <span class="text-center w-full">{{
            collapsed ? "A" : "AHTUMN"
          }}</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-default"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
