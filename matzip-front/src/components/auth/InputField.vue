<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  id: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <div class="input-field">
    <label :for="id">{{ label }}</label>
    <input
        :type="type"
        :id="id"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-control"
    />
  </div>
</template>

<style scoped>
 input::placeholder {
  color: #ccc; /* 원하는 색상으로 변경 */
}

 .left-aligned-label  {
   text-align: left;
 }
</style>