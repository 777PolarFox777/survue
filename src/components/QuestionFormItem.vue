<template>
  <v-card>
    <v-container :class="{ 'mb-6': !isAddQuestion }">
      <template v-if="isAddQuestion">
        <v-row justify="center">
          <v-col cols="2" class="d-flex">
            <v-btn fab @click="$emit('add-question')" class="ma-auto">
              <i class="fa fa-3x fa-plus-circle add-question-icon" />
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <div>
          <v-text-field filled label="Question" v-model="question.question" />
        </div>
        <div>
          <v-select filled :items="items" v-model="question.type" label="Answer type" />
        </div>
        <div>
          <div class="custom-control custom-switch">
            <v-input label="Is optional?" type="checkbox" class="custom-control-input" id="customSwitch1" />
          </div>
        </div>
        <v-btn class="order-button up" @click="$emit('move-question', question.id, 'up')">
          <i class="fa fa-chevron-up" />
        </v-btn>
        <v-btn class="order-button down" @click="$emit('move-question', question.id, 'down')">
          <i class="fa fa-chevron-down" />
        </v-btn>
        <v-btn @click="$emit('remove-question', question.id)" class="remove-question-button">
          <i class="fa fa-trash-alt" />
        </v-btn>
      </template>
    </v-container>
  </v-card>
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
    const items = Object.keys(questionTypes);

    return {
      items,
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
    background-color: white;
    border-radius: 6px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .add-question-icon {
    color: #45b77c;
  }

  .remove-question-button {
    color: #676767;
    position: absolute;
    left: 10px;
    bottom: 5px;
  }
</style>
