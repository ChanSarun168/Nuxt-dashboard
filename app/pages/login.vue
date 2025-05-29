<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

const login = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await $fetch("http://localhost:8000/auth/admin-login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("admin_id", res.admin_id || "");
      return navigateTo("/");
    }
  } catch (e: any) {
    error.value = e?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: "empty",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div
      class="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-gray-200"
    >
      <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">
        Admin Login
      </h2>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <button
          :disabled="loading"
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>
