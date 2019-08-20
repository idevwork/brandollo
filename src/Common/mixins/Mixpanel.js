import settings from "@/settings"

export default {
    methods: {
        mixIdentify(u) {
         
            if (u == null) {             
                return;
            }
        
            if (typeof mixpanel !== 'undefined') {

                let that = this;
                let theName = null;
                let name = u.profile.name;
                if (name.constructor === Array) {
                    theName = name[name.length - 1];
                }

                mixpanel.identify(u.profile.sub);

                mixpanel.people.set({
                    "$email": u.profile.email,    // only special properties need the $                
                    "$plan": u.profile.active_plan,
                    "$last_login": new Date()    // properties can be dates...     
                });
            }
        },

        mixTrackEvent(eventName, eventProperties) {
            if (typeof mixpanel !== 'undefined') {
                mixpanel.track(eventName, eventProperties);
            }
        }
    }
};
