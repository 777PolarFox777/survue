<template>
  <div class="row question-panel">
    <template v-if="isAddQuestion">
      <div class="offset-6 col-1 margin-auto">
        <button @click="$emit('add-question')" class="add-question-button align-self-center">
          <i class="fa fa-3x fa-plus-circle" />
        </button>
      </div>
    </template>
    <template v-else>
      <div class="col-8 margin-bottom-12">
        <label>Question</label>
        <input v-model="question.question" class="form-control" />
      </div>
      <div class="col-4 margin-bottom-12">
        <label>Answer type</label>
        <select v-model="question.type" class="form-control">
          <option :value="questionTypes.textInput">Text Input</option>
          <option :value="questionTypes.textarea">Textarea</option>
          <option :value="questionTypes.select">Select</option>
          <option :value="questionTypes.checkbox">Checkbox</option>
          <option :value="questionTypes.radio">Radio</option>
        </select>
      </div>
      <div class="col-4 margin-bottom-12">
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="customSwitch1">
          <label class="custom-control-label" for="customSwitch1">Is optional?</label>
        </div>
      </div>
      <button class="order-button up" @click="$emit('move-question', question.id, 'up')">
        <i class="fa fa-chevron-up" />
      </button>
      <button class="order-button down" @click="$emit('move-question', question.id, 'down')">
        <i class="fa fa-chevron-down" />
      </button>
      <button @click="$emit('remove-question', question.id)" class="remove-question-button">
        <i class="fa fa-trash-alt" />
      </button>
    </template>
  </div>
</template>

<script>
import { questionTypes } from '@/constants';

export default {
  name: 'QuestionFormItem',
  props: {
    question: Object,
    isAddQuestion: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      questionTypes,
    };
  }
};
</script>

<style lang="scss">
  input {
    border: 1px solid #abb6ba;
    background-color: #ffffff;
    border-radius: 6px;

    &:focus {
      outline-color: rgb(77, 239, 254); // #4D90FE
      outline-offset: 0;
      -moz-outline-radius: 6px;
      outline-style: solid;
      outline-width: 1px;
    }
  }

  .question-panel {
    position: relative;
    padding: 32px 0;
    background-color: #e9e5df;
    border-radius: 6px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .add-question-button {
    color: #45b77c;
  }

  .remove-question-button {
    color: #676767;
    position: absolute;
    left: 10px;
    bottom: 5px;
  }
</style>
