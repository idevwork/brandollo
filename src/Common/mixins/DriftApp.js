import settings from "@/settings"

export default {
    methods: {
        identify(u) {

            if (u == null) {
                return;
            }
            let that = this;

            let theName = null;
            let name = u.profile.name;
            if (name.constructor === Array) {
                theName = name[name.length - 1];
            }
            if (typeof drift !== 'undefined') {
                drift.on('ready', function () {
                    console.log('setting the good stuff')
                    drift.api.setUserAttributes({
                        email: u.profile.email,
                        nickname: theName,

                    })
                })
            }
        }
    }
};
