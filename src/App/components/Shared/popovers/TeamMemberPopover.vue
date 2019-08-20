<template>
  
    <b-list-group>
        <b-list-group-item class="d-flex align-items-center">
            <avatar style="margin:5px" :name="getUser(member.userId)" size="tiny" :order="member.position" />
            <div class="user-name">{{member.userDetailsFirstName ? member.userDetailsFirstName : "No name"}}
              
            </div>
        </b-list-group-item>
        <b-list-group-item>{{member.userEmail}}</b-list-group-item>
        <b-list-group-item>{{member.role}}</b-list-group-item>
        <b-list-group-item 
            v-if="currentPermissions.changeteam && member.role !== 'owner'" 
            href="#" 
            @click="onClick($event, member)">            
           <font-awesome-icon icon="trash"/>
        </b-list-group-item>
    </b-list-group>      
    
        <!-- <avatar :name="member.userDetailsFirstName" size="small" slot="reference" />            -->
        <!-- <template slot="reference">
            <slot name="target"></slot>
        </template>         -->
        <!-- <slot name="target" slot="reference"></slot> -->        
   
</template>

<script>


import { mapState, mapActions, mapGetters } from 'vuex'
import notificationMixin from '@/Common/mixins/Notification'
import { Avatar } from '@/App/components/Shared'
 
export default {
    components: {
     avatar: Avatar, 
    }, 
    mixins: [
        notificationMixin, 
    ], 
    props: {
        member: {
            type: Object, 
            required: true, 
        }, 
    }, 
    computed: {
        ...mapState({
            currentPermissions: state => state.teamStore.currentPermissions, 
        }),
        ...mapGetters({
           getUser: "getTeamMemberName"
        })
    }, 
    methods: {
        ...mapActions({
            removeTeamMember: 'removeTeamMember', 
        }), 
        onClick(e, member) {
            e.preventDefault();
            console.log('On popover', member)
            const payload = {
                userEmail: member.userEmail, 
                teamId: member.teamId, 
                role: "member"
            }
            this.$swal({
                title: 'Are you sure?', 
                text: "You won't be able to revert this!", 
                type: 'warning', 
                showCancelButton: true, 
                showLoaderOnConfirm: true, 
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!', 
                preConfirm: () => this.removeTeamMember(payload)
            })
                .then((result) => {
                    if (result.value) {
                        console.log('$swal', result.value)
                        this.showToast('Member has been successfully removed')
                    }
                })
                .catch(err => {
                    console.log('$swal', err)
                    this.showToast(err.message, 'error')
                })                
        }

    }
}
</script>

<style lang="scss" scoped>
    .team__member-popovers {
        .list-group {
            border: 0;
            background-color: #FFFFFF;
            padding: 16px 28px;
            .list-group-item {
                display: flex;
                border: 0;
                padding-top: 0;
                [class^="avatar-"] {
                    margin: -3px 15px 0px 0px !important;
                }
            }
        }
    }
</style>
