import marked from 'marked';
import truncate from 'html-truncate';

export default {
  methods: {
    marked: function (input, maxCharacters = null) {

      return input ? maxCharacters ? truncate(marked(input), maxCharacters, null) : marked(input) : null;
    },

  }
};
