<template>
  <div class="container width-75 padding-y-24">
    <ul class="nav nav-tabs margin-bottom-12">
      <li class="nav-item">
        <a class="nav-link" @click="changeTab(tabs.edit)" :class="{ active: tab === tabs.edit}">Edit</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click="changeTab(tabs.preview)" :class="{ active: tab === tabs.preview}">Preview</a>
      </li>
    </ul>
    <template v-if="tab === tabs.edit">
      <template v-for="question of questions">
        <QuestionFormItem @remove-question="removeNewQuestion" @move-question="moveQuestion" :key="question.id" :question="question"></QuestionFormItem>
      </template>
      <QuestionFormItem @add-question="addNewQuestion" :isAddQuestion="true"></QuestionFormItem>
    </template>
    <template v-if="tab === tabs.preview">
      TODO
    </template>
  </div>
</template>

<script>
import { ref }  from '@vue/composition-api';
import { createQuestion } from '@/helpers';
import QuestionFormItem from '@/components/QuestionFormItem';
import { tabs } from '@/constants';

export default {
  name: 'App',
  components: {
    QuestionFormItem,
  },
  setup() {
    const tab = ref(tabs.edit);
    const questions = ref([createQuestion()]);

    const addNewQuestion = () => {
      questions.value.push(createQuestion());
    }

    const removeNewQuestion = (id) => {
      questions.value = questions.value.filter((item) => item.id !== id);
    }

    const moveQuestion = (id, direction) => {
      const from = questions.value.findIndex((item) => item.id === id);
      const to = (() => {
        if (direction === 'up') {
          const newPosition = from - 1;

          return newPosition >= 0 ? newPosition : from;
        } else {
          const newPosition = from + 1;

          return newPosition <= questions.value.length ? newPosition : from;
        }
      })();

        questions.value.splice(to, 0, questions.value.splice(from, 1)[0]);
    };

    const changeTab = (newTab) => tab.value = newTab;

    return {
      tabs,
      tab,
      questions,
      addNewQuestion,
      removeNewQuestion,
      moveQuestion,
      changeTab,
    }
  },
};
</script>

<style lang="scss">
  @import "src/styles/helpers";
  button {
    border: none;
    background-color: transparent;
  }

  .order-button {
    border: none;
    background-color: transparent;
    position: absolute;
    right: 10px;
    color: #676767;

    &.up {
      top: 5px;
    }

    &.down {
      bottom: 5px;
    }
  }
</style>
