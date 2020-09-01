import shortid from 'shortid';
import { questionTypes } from '@/constants';

export const createQuestion = () => ({
  id: shortid.generate(),
  question: '',
  type: questionTypes.textInput,
})
