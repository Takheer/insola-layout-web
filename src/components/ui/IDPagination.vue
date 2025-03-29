<script setup lang="ts">
import NuxtLink from "#app/components/nuxt-link";
import {PhCaretLeft, PhCaretRight} from "@phosphor-icons/vue";

type TProps = {
  modelValue?: number;
  total: number;
  totalVisible?: number;
  asLinks?: boolean;
  pageQueryParam?: string;
};

type TEmits = {
  (e: 'update:modelValue', value: number): void;
};

type TItemPage = {
  type: 'page';
  value: number;
};

type TItemEllipsis = {
  type: 'ellipsis';
};

type TItem = TItemPage | TItemEllipsis;

const props = withDefaults(defineProps<TProps>(), {
  modelValue: 1,
  total: 1,
  asLinks: false,
  pageQueryParam: 'page'
});
const emits = defineEmits<TEmits>();

const MAX_VISIBLE = 5;

const ITEM_CLASS = 'flex items-center justify-center rounded-full h-8 w-8';
const PAGE_CLASS = 'cursor-pointer hover:bg-gray-200';
const COMPONENT_CLASS = 'font-inter cursor-inherit text-black text-base border-none p-0 bg-transparent';

const router = useRouter();
const route = useRoute();

const itemComponent = computed(() => props.asLinks ? NuxtLink : 'button');

const items = computed(() => {
  const res: TItem[] = [];

  if (props.total <= MAX_VISIBLE) {
    for (let i = 1; i <= props.total; i++) {
      res.push({
        value: i,
        type: 'page'
      });
    }
  } else {
    res.push({
      value: 1,
      type: 'page'
    });

    const left = Math.min(Math.max(2, props.modelValue - 1), props.total - MAX_VISIBLE + 1);
    const right = Math.max(Math.min(props.total - 1, props.modelValue + 1), MAX_VISIBLE);

    left > 2 && res.push({ type: 'ellipsis' });

    for (let i = left; i <= right; i++) {
      res.push({
        value: i,
        type: 'page'
      });
    }

    right < props.total - 1 && res.push({ type: 'ellipsis' });

    res.push({
      value: props.total,
      type: 'page'
    });
  }

  return res;
});

const hasNext = computed(() => {
  return props.modelValue !== undefined && props.modelValue < props.total;
});

const hasPrev = computed(() => {
  return props.modelValue !== undefined && props.modelValue > 1;
});

function set (page: number) {
  emits('update:modelValue', page);
  if (!props.asLinks) {
    return;
  }
  const query = { ...route.query };
  if (query[props.pageQueryParam] === page.toString()) {
    return;
  }
  if (page === 1) {
    delete query[props.pageQueryParam];
  } else {
    query[props.pageQueryParam] = page.toString();
  }
  router.push({ query });
}

function next () {
  hasNext.value && set(props.modelValue + 1);
}

function prev () {
  hasPrev.value && set(props.modelValue - 1);
}

function getBinds (value: number) {
  if (props.asLinks ) {
    if (value === 1) return { ...{ to: {} } };
    return {
      ...{
        to: {
          query: {
            ...route.query,
            [props.pageQueryParam]: value
          }
        }
      }
    };
  }
  return { ...{} };
}

defineExpose({
  next,
  prev,
  set
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  }
});
</script>

<template>
  <nav>
    <ul class="flex items-center gap-1 md:gap-2">
      <li
        :class="{
          [ITEM_CLASS]: true,
          [PAGE_CLASS]: hasPrev,
        }"
        @click="prev"
      >
        <component
          :is="itemComponent"
          v-bind="getBinds(props.modelValue - (hasPrev ? 1 : 0))"
          :class="{
            [COMPONENT_CLASS]: true,
            ' text-gray pointer-events-none cursor-default': !hasPrev
          }"
          @click.native.capture.prevent.stop="prev"
        >
          <PhCaretLeft v-if="hasPrev" class="h-5 w-5" />
        </component>
      </li>

      <template v-for="(item, index) in items">
        <li
          v-if="item.type === 'page'"
          :key="`pg-page-${index}`"
          :class="{
            [ITEM_CLASS]: true,
            [PAGE_CLASS]: item.value !== props.modelValue,
            'bg-gray-300 shadow-sm !pointer-events-none !cursor-default': item.value === props.modelValue
          }"
          @click="set(item.value)"
        >
          <component
            :is="itemComponent"
            v-bind="getBinds(item.value)"
            :class="{
              [COMPONENT_CLASS]: true,
              '!pointer-events-none !cursor-default': item.value === props.modelValue
            }"
            @click.native.capture.prevent.stop="set(item.value)"
          >
            {{ item.value }}
          </component>
        </li>

        <li
          v-else-if="item.type === 'ellipsis'"
          :key="`pg-ellipsis-${index}`"
          class="cursor-default"
          :class="{
            [ITEM_CLASS]: true
          }"
        >
          ...
        </li>
      </template>

      <li
        :class="{
          [ITEM_CLASS]: true,
          [PAGE_CLASS]: hasNext,
        }"
        @click="next"
      >
        <component
          :is="itemComponent"
          v-bind="getBinds(props.modelValue + (hasNext ? 1 : 0))"
          :class="{
            [COMPONENT_CLASS]: true,
            ' text-gray pointer-events-none cursor-default': !hasNext
          }"
          @click.native.capture.prevent.stop="next"
        >
          <PhCaretRight v-if="hasNext" class="h-5 w-5" />
        </component>
      </li>
    </ul>
  </nav>
</template>
