<script setup lang="ts">
import {onMounted, ref} from "vue";
import UserLoginInputPanel from "@/components/user/UserLoginInputPanel.vue";
import UserCodeInputPanel from "@/components/user/UserCodeInputPanel.vue";
import UserLoginSuccessScreen from "@/components/user/UserLoginSuccessScreen.vue";
import UserLoginFailScreen from "@/components/user/UserLoginFailScreen.vue";
import {useAuth} from "@/composables/useAuth.ts";
import UserCreatePanel from "@/components/user/UserCreatePanel.vue";

enum steps {
  INPUT_CREDENTIAL,
  INPUT_CODE,
  DONE,
  FAIL,
  LOGGED_IN_ALREADY
}

enum modes {
  LOGIN,
  REGISTRATION
}

const auth = useAuth();

const credential = ref('')

const currentStep = ref(steps.INPUT_CREDENTIAL);
const loginMode = ref(modes.LOGIN);

function onSetCredential(e: string) {
  credential.value = e;
  currentStep.value = steps.INPUT_CODE;
}

function onAuthSuccess() {
  currentStep.value = steps.DONE;
}

function onAuthFail() {
  currentStep.value = steps.FAIL;
}

onMounted(() => {
  if (auth.isLoggedIn()) {
    currentStep.value = steps.LOGGED_IN_ALREADY;
  }
})
</script>

<template>
  <div class="h-[80vh] w-full flex flex-col items-center justify-center">
    <div class="w-[300px] md:w-[480px]">
      <template v-if="currentStep === steps.INPUT_CREDENTIAL">
        <UserLoginInputPanel
          v-if="loginMode === modes.LOGIN"
          @set-credential="onSetCredential"
          @update-mode="loginMode=modes.REGISTRATION"
        />
        <UserCreatePanel
          v-else
          @set-credential="onSetCredential"
          @update-mode="loginMode=modes.LOGIN"
        />
      </template>
      <UserCodeInputPanel
        v-if="currentStep === steps.INPUT_CODE"
        :credential="credential"
        @success="onAuthSuccess"
        @fail="onAuthFail"
        @previous="currentStep = steps.INPUT_CREDENTIAL"
      />
      <UserLoginSuccessScreen v-if="[steps.DONE, steps.LOGGED_IN_ALREADY].includes(currentStep)" />
      <UserLoginFailScreen v-if="currentStep === steps.FAIL" />
    </div>
  </div>
</template>

<style lang="scss">

</style>
