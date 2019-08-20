import settings from "@/settings"

export default {
    methods: {
        agileIdentify(u) {

            if(!u){
                return;
            }
            if(!u.profile){
                return;
            }

            if(!u.profile.email){
                return;
            }

            if (typeof _agile !== 'undefined') {
                _agile.set_email(u.profile.email);
            }
        }
    }
};
