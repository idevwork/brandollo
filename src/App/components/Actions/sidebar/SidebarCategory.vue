<template>
    <div :class="`sidebar__category-wrap${collapse ? ' sidebar__category-wrap--open' : ''}`">
        <li v-b-toggle="title.toLowerCase()" class="sidebar__link sidebar__category" @click="toggle">          
          <p class="sidebar__link-title">{{title}}</p>
          <span class="sidebar__category-icon icon-arrow-down" />
        </li>
        <b-collapse :id="title.toLowerCase()" class="sidebar__submenu-wrap" :visible="!collapse">
          <b-container class="sidebar__submenu"> 
            <slot></slot>                       
          </b-container>
        </b-collapse>
    </div>
</template>

<script>
export default {    
    props: {
        title: {
            type: String, 
            required: true, 
        }
    }, 
    data() {
        return {
            collapse: false, 
        }        
    }, 
    methods: {
        toggle() {
            this.collapse = !this.collapse
        }
    },     
}
</script>

<style lang="scss" scoped>
    .sidebar__category-wrap {
        &.sidebar__category-wrap--open {
            
            .sidebar__category-icon {                
                transform: rotate(180deg);                
            }
        }
    }

    .sidebar__link {
        height: 36px;        
        transition: all 0.3s;
        position: relative;
        cursor: pointer;
        display: flex;
        padding: 11px 0;
        overflow: hidden;
        color: #000000;

        p {
            position: absolute;            
            width: 160px;
            transition: left 0.3s;
        }

        &:hover {
            text-decoration: none;
            background-color: darken(#A5AABC, 2%);
        }
    }

    .sidebar__link-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600; 
        line-height: 16px;
        position: relative;
        display: flex;
    }

    .sidebar__category-icon {
        position: absolute;
        right: 15px;
        font-size: 10px;
        line-height: 14px;
        opacity: 1;
        transition: opacity 0.5s 0.2s, transform 0.3s;
        color: #787985;
    }
    
</style>
