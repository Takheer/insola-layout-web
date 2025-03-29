<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import IDTextInput from "@/components/ui/IDTextInput.vue";
import {computed, ref, watch} from "vue";

export type TProps = {
  modelValue?: string;
  options: any[];
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  message?: string;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  successMessage?: string;
  itemValue?: string;
  itemLabel?: string;
  returnObject?: boolean;
  clearable?: boolean;
  filterable?: boolean;
};

export type TEmits = {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'click', value: MouseEvent): void;
  (e: 'search', value: string): void;
  (e: 'clear'): void
};

const props = withDefaults(defineProps<TProps>(), {
  id: '',
  label: '',
  placeholder: '',
  message: '',
  error: false,
  success: false,
  disabled: false,
  errorMessage: '',
  successMessage: '',
  itemValue: 'value',
  itemLabel: 'label',
  returnObject: false,
  clearable: false,
  filterable: true
});
const emits = defineEmits<TEmits>();

const query = ref('');
const isEnabled = ref(false);

const localModelValue = computed({
  get () {
    return normalizeItem(props.modelValue);
  },

  set (value) {
    const newValue = props.returnObject || !value ? value : value[props.itemValue];
    emits('update:modelValue', newValue);
    emits('change', newValue);
  }
});

const selectedLabel = computed(() => {
  return localModelValue.value ? localModelValue.value[props.itemLabel] : '';
});

const selected = computed(() => {
  return localModelValue.value ? [localModelValue.value[props.itemValue]] : [];
});

const filteredOptions = computed(() => {
  if (props.filterable) {
    return props.options.filter((item) => {
      const label = item[props.itemLabel]?.toLowerCase();
      return label.includes(query.value?.toLowerCase());
    });
  }
  return props.options;
});

watch(selectedLabel, (value) => {
  if (!value.length) return;
  query.value = value;
}, { immediate: true });

watch(query, (value) => {
  if (!value.length) return;
  emits('search', value);
}, { immediate: true });

function onClickItem (item: any) {
  if (props.disabled) return;
  isEnabled.value = false;
  if (item.onClick) {
    item.onClick();
    return;
  }
  query.value = selectedLabel.value;
  localModelValue.value = item;
}

function normalizeItem (value: any) {
  if (value === undefined) {
    return;
  }
  if (props.returnObject && value?.hasOwnProperty(props.itemValue)) {
    return value;
  }
  return props.options.find((i) => i[props.itemValue] === value);
}

function onClick (event: MouseEvent) {
  if (props.disabled) return;
  emits('click', event);
}

function onFocus () {
  if (!props.disabled) {
    isEnabled.value = true;
  }
}

function onClickOutside () {
  isEnabled.value = false;
  query.value = selectedLabel.value;
}

function getHighlight ({ label, active }: { label: string; active: boolean }) {
  if (!query.value) {
    return label;
  };
  const index = label.toLowerCase().indexOf(query.value.toLowerCase());
  if (index === -1) {
    return label;
  }
  const before = label.slice(0, index);
  const match = label.slice(index, index + query.value.length);
  const after = label.slice(index + query.value.length);
  return `${before}<span class="font-bold">${match}</span>${after}`;
}

function onClear () {
  localModelValue.value = {};
  emits('clear');
}
</script>

<template>
  <IDTextInput
    v-model="query"
    @clear="onClear"
    @click.prevent="onClick"
    @focus="onFocus"
    :label="label"
    v-on-click-outside="onClickOutside"
    :placeholder="placeholder"
  >
    <template #append:outer>
      <div
        v-if="isEnabled && filteredOptions.length"
        class="absolute z-10 top-full left-0 right-0 max-h-50 overflow-auto bg-white rounded-b-xl drop-shadow-lg"
      >
        <div
          v-for="option of filteredOptions"
          :key="option[itemValue]"
          class="transition-all cursor-pointer px-4 py-2 hover:bg-gray-200"
          @click.prevent="() => onClickItem(option)"
        >
          {{ option[itemLabel] }}
        </div>
      </div>
    </template>
  </IDTextInput>
</template>

<style lang="scss">

</style>
