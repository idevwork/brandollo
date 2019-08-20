<template>
  <div class="comment-add col-flex">
    <!-- Main box -->
    <div class="row-flex">
      <avatar style="margin:5px; margin-right: 15px" :name="getUser(user.profile.sub)" size="tiny"/>

      <!-- Editable box -->
      <div
        @keyup="commentKeyPress"
        @keypress="commentBlockKeys"
        class="comment-box background-drop"
        contenteditable
        ref="comment"
      ></div>

      <!-- Suggestions for tagging a team member -->
      <div
        class="col-flex tag-suggestions"
        :style="{left: suggestionLeft + 'px', top: suggestionTop + 'px'}"
      >
        <div
          v-for="(member, index) in filterTagSuggestions"
          v-if="showTagSuggestions"
          :key="index"
          :class="{'active': index === suggestionIndex}"
          @click="tagUser(member)"
        >{{ member.userDetailsFirstName }}</div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="row-flex actions">
      <!-- List of files attached -->
      <div class="files-attached row-flex flex-wrap">
        <div v-for="(file, fi) in files" :key="fi" class="row-flex file">
          <span>{{ file.name }}</span>
          <font-awesome-icon @click="removeFile(fi)" class="ml-2 pointer" icon="times"/>
        </div>
      </div>

      <!-- Controls -->
      <div class="d-flex align-items-start">
        <div class="d-flex align-items-center">
          <font-awesome-icon
            title="Attach File"
            class="attach-file-icon"
            @click="$refs.file.click()"
            icon="paperclip"
          />

          <!-- Add comment button -->
          <div class="round-btn" @click="addComment">Comment</div>
        </div>
      </div>

      <!-- Attach file input -->
      <input
        @change="attachFile"
        class="display-none"
        type="file" ref="file"
        multiple="multiple"
      >
    </div>

    <!-- Progress bar for comment submission -->
    <b-progress v-if="requestProgressVisible" height="1.3rem" :max="100" class="mt-3" :animated="true">
      <b-progress-bar :value="requestProgress" class="progress-bar-custom">
        {{ requestProgress + '%' }}
      </b-progress-bar>
    </b-progress>

  </div>
</template>

<script>
import Avatar from "@/App/components/Shared/Avatar";
import { mapGetters, mapState, mapActions } from "vuex";
import commentService from "@/Common/services/CommentService";
import notificationMixin from "@/Common/mixins/Notification";

export default {

          <!-- Add comment button -->
          <div class="round-btn" @click="addComment">Comm

          <!-- Add comment button -->
          <div class="round-btn" @click="addComment">Comm
  name: "CommentBox",
  mixins: [notificationMixin],
  props: ["members", "action"],
  components: {
    avatar: Avatar,
  },
  data() {
    return {
      showTagSuggestions: false,
      suggestionIndex: -1,
      taggedUsers: [],
      files: [],
      previousKey: '',
      commentFilter: '',
      suggestionLeft: 0,
      suggestionTop: 0,
      dragAndDropCapable: false,
      requestProgress: 0,
      requestProgressVisible: false,
    }
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();

    // Handle dropped attachments
    if (this.dragAndDropCapable) {
      
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
        this.$refs.comment.addEventListener(evt, function(e){
          e.preventDefault();
          e.stopPropagation();
        }.bind(this), false);
      }.bind(this));

      this.$refs.comment.addEventListener('drop', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.dataTransfer.files.length; i++){
          this.files.push(e.dataTransfer.files[i]);
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      getUser: "getTeamMemberName",
      team: "currentTeamId"
    }),
    ...mapState({
      user: state => state.userStore.user
    }),
  
    // Filter suggestions by name
    filterTagSuggestions() {
      if(!this.members) return [];
      return this.members
        .filter(member => member.userDetailsFirstName.toLowerCase().indexOf(this.commentFilter) !== -1);
    }
  },
  methods: {
      ...mapActions({
      updateTotalComments: "updateTotalComments",
    }),

    // Blocking specified keys
    commentBlockKeys(evt) {
      if (evt.key === "Enter" || evt.key === "ArrowUp" || evt.key === "ArrowDown") {
        evt.preventDefault();
      }
    },

    // Keyup event handler
    commentKeyPress(evt) {
      let commentBox = this.$refs.comment;

      // Traverse suggestions
      if (evt.key === "ArrowDown") {
        if(this.suggestionIndex !== this.members.length - 1) {
          this.suggestionIndex++;
        }

        return;

      } else if (evt.key === "ArrowUp") {
        if(this.suggestionIndex !== 0) {
          this.suggestionIndex--;
        }
        return;

      } else if (evt.key === "Enter" && this.suggestionIndex !== -1) {
        commentBox.innerHTML = commentBox.innerText;
        this.tagUser(this.filterTagSuggestions[this.suggestionIndex]);
        this.suggestionIndex = -1;
        return;
      }

      // Reset the index
      this.suggestionIndex = -1;

      // Handle adding chars to comment box
      if (evt.key === "Enter" && !this.showTagSuggestions) {
        // Add a comment
        this.addComment();

      }  else if(this.lastCharacter() === "@") {
        // Set suggestion input mode
        this.commentFilter = '';
        this.showTagSuggestions = true;

      } else if (commentBox.innerText.match(/\s*@[a-zA-Z0-9]*\s*$/)) {
        if (evt.key !== "Backspace" && evt.key !== " ") {
          this.commentFilter += evt.key.toLowerCase();
        } else if (evt.key === " ") {
          this.commentFilter += " ";
          this.checkTaggedUser(commentBox);
        } else {
          this.commentFilter = this.commentFilter.replace(/[a-zA-Z0-9]$/, '');
        }

      } else {
        this.commentFilter = '';
        this.showTagSuggestions = false;
      }

      this.previousKey = evt.key;
    },

    // Check if typed user named matches any real user
    checkTaggedUser(commentBox) {
      let matches = commentBox.innerText.match(/@[a-zA-Z0-9]*/g);
      let lastTag = matches[matches.length - 1];
      let user = lastTag.split('@')[1];
      let text = '';
      
      let member = this.members.find(member => {
          return member.userDetailsFirstName.toLowerCase().indexOf(user.toLowerCase()) !== -1
        }
      );
      
      let name = member ? member.userDetailsFirstName : user;

      this.commentFilter = '';
      this.showTagSuggestions = false;
      commentBox.innerText = text = commentBox.innerText.replace(lastTag, "@" + name);
      commentBox.innerHTML = text.replace(/(@[a-zA-Z]*)\s/g, "<span style='color:rgb(40, 117, 218)'>$1</span>&nbsp");
      this.focusAndPlaceCaretAtEnd(commentBox);
    },

    // Get caret position and set suggestions box position
    getCaretPosition() {
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      range.insertNode(span);
      this.suggestionLeft = span.offsetLeft - 15;
      this.suggestionTop = span.offsetTop + 15;
      span.remove();
      //this.focusAndPlaceCaretAtEnd(this.$refs.comment);
    },

    // Get last typed character
    lastCharacter() {
      const text = this.$refs.comment.innerText;
      if(text[text.length - 1] === '\n') {
        return text[text.length - 2];
      }

      return text[text.length - 1];
    },

    // Place caret at the end of comment box
    focusAndPlaceCaretAtEnd(el) {
      el.focus();
      if (typeof window.getSelection != "undefined"  && typeof document.createRange != "undefined") {
          const range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          
      } else if (typeof document.body.createTextRange != "undefined") {
          const textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.collapse(false);
          textRange.select();
      }
    },

    // Tag user
    tagUser(user) {
      const commentRef = this.$refs.comment;
      let text = commentRef.innerHTML;
      commentRef.innerHTML = text.replace(/@[a-zA-Z0-9]*(\s)*(<br>)*$/, `@${user.userDetailsFirstName}&nbsp;`);
      this.taggedUsers.push(user.userId);
      this.showTagSuggestions = false;
      
      text = commentRef.innerText;
      commentRef.innerHTML = text.replace(/(@[a-zA-Z]*)\s/g, "<span style='color:rgb(40, 117, 218)'>$1</span>&nbsp");
      this.focusAndPlaceCaretAtEnd(commentRef);
    },

    // Add comment handler
    addComment() {
      let commentBox = this.$refs.comment;
      let comment = commentBox.innerText;

      if (!comment.match("[a-zA-Z0-9]+") && this.files.length == 0) {
        return;
      }

      commentBox.innerText = '';
      commentBox.classList.add('background-drop');

      const axiosRequestConfig = {
        onUploadProgress: progressEvent => {
          this.requestProgress = Math.round(progressEvent.loaded * 100 / progressEvent.total);
        }
      };

      // Compose FormData
      const formData = new FormData();
      formData.append("action", "ADD");
      formData.append("ResourceId", this.action.id);
      formData.append("CommentText", comment);
      formData.append("UserId", this.user.profile.sub);
      formData.append("TeamId", this.team);
      this.taggedUsers.forEach(t => {
        formData.append("taggedUser", t);
      });
      this.files.forEach(f => {
        formData.append("files", f);
      });

      // Show progress bar
      this.requestProgressVisible = true;

      // Send the request
      commentService
        .createComment(formData, axiosRequestConfig)
        .then(res => {
          this.$emit('add-comment', res);
          this.showToast("Comment posted!");
          this.updateTotalComments(this.action.id);
        })
        .catch(e => {
          console.log(e);
          this.showToast("Comment post failed!", "error");
        })
        .finally(() => {
          this.files = [];
          this.taggedUsers = [];
          this.requestProgressVisible = false;
        });
    },

    // Add files
    attachFile(evt) {
      const fileList = evt.target.files;
      for (let file of fileList) {
        this.files.push(file);
      }
    },

    // Remove file
    removeFile(fileIndex) {
      this.files.splice(fileIndex, 1);
    },

    // Check if the client has drag and drop support
    determineDragAndDropCapable(){
      const div = document.createElement('div');

      return ('draggable' in div || ( 'ondragstart' in div && 'ondrop' in div ))
        && 'FormData' in window
        && 'FileReader' in window;
    },
  },

  watch: {
    showTagSuggestions(val) {
      if(val === true)
        this.getCaretPosition();
    }
  }

}
</script>

<style scoped>
  .progress-bar-custom {
    text-align: center;
    font-size: 12px;
  }
  .pointer {
    cursor: pointer;
  }
  .attach-file-icon {
    font-size: 22px;
    cursor: pointer;
    margin-right: 15px;
  }
  .display-none {
    display: none;
  }
  .comment-add {
    margin-top: 20px;
    padding: 10px 18px 10px 10px;
    background-color: rgb(233, 233, 233);
  }
  .comment-add > div {
    position: relative;
  }
  .comment-add textarea {
    border: 0px;
    flex-grow: 1;
    padding-left: 5px;
    border: 0px;
  }
  .comment-box {
    height: 70px; 
    padding: 10px 10px 0px 10px; 
    width: 100%;
    background-color: white;
    overflow: auto;
    overflow-x: hidden;
    word-wrap: break-word;
  }
  .comment-box * {
    display: inline-block;
  }
  .tag-suggestions {
    position: absolute;
    margin-top: 1px;
    background-color: white;
    padding: 8px 0px;
    border-radius: 5px;
    z-index: 1;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }
  .tag-suggestions > div {
    padding: 5px 30px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .tag-suggestions > div:hover, .tag-suggestions > div.active {
    background-color: rgb(230, 242, 255);
  }
  .actions {
    padding-top: 10px;
  }
  .comment-add .round-btn {
    background-color: #40a5e4;
    padding-top: 4px !important;
  }

  .files-attached {
    flex-grow: 1;
    margin-right: 15px;
    margin-top: -10px;
  }
  .file {
    align-items: center;
    margin-right: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 15px;
    border: 1px solid #40a5e4;
    color: #40a5e4;
    margin-top: 10px;
  }
  .file i {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
