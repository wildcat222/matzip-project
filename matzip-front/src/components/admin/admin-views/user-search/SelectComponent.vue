<script setup>
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  }
});
const emit = defineEmits();
const selectedValue = ref(props.modelValue);

// Watch for changes in selectedValue and emit updates to parent
watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <div class="col-3: isGrid mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <select class="form-select" :id="id" v-model="selectedValue">
      <option v-if="placeholder" value='' selected disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>