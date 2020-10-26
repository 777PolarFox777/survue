<template>
  <v-app>
    <div class="">
      <NavTabs />
      <v-tabs-items :value="activeTab">
        <v-tab-item>
          <template v-for="question of questions">
            <QuestionFormItem @remove-question="removeNewQuestion" @move-question="moveQuestion" :key="question.id" :question="question"></QuestionFormItem>
          </template>
          <QuestionFormItem @add-question="addNewQuestion" :isAddQuestion="true"></QuestionFormItem>
        </v-tab-item>
        <v-tab-item>
          TODO
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-app>
</template>

<script>
import { computed, ref } from '@vue/composition-api';
import { createQuestion } from '@/helpers';
import QuestionFormItem from '@/components/QuestionFormItem/QuestionFormItem';
import NavTabs from "@/components/NavTabs/NavTabs";
import store from "@/store";

export default {
  name: 'App',
  components: {
    NavTabs,
    QuestionFormItem,
  },
  setup() {
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

    const activeTab = computed(() => store.navTabs.activeTab);

    return {
      activeTab,
      questions,
      addNewQuestion,
      removeNewQuestion,
      moveQuestion,
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

  body {
    background-color: #e5e5e0;
  }
</style>
