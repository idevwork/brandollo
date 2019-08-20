
import settings from '@/settings'
import api from '../services/RestService'
import axios from 'axios'

export default {
    mounted() {
        return; //uncomment to disable 
        if(settings.env === 'production'){
            return;
        }
        console.log('Setting up MiniProfiler');
        const resourceUrl = `${settings.api}meta/profiling`;
        api.get(resourceUrl)
            .then(d => {
                let MiniProfilerScript = d;


                const serverHost = settings.api.replace('/api/','');
                const attributes = [
                    'src', 'data-version', 'data-path', 'data-current-id', 'data-ids', 'data-position', 'data-authorized',
                    'data-max-traces', 'data-toggle-shortcut', 'data-trivial-milliseconds', 'data-ignored-duplicate-execute-types'
                ];

                var GetAttr = function (input, attributeName) {
                    const myRegexp = attributeName + '="(.*?)"';
                    const re = new RegExp(myRegexp, "g");
                    const match = re.exec(input);
                    return match[1];
                }
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.id = "mini-profiler";
                s.async = true;

                for (var i = 0; i < attributes.length; i++) {
                    var element = attributes[i];
                    let attr = GetAttr(MiniProfilerScript, element);
                    if (element == 'src' || element == 'data-path') {
                        attr = serverHost + attr;
                    }
                    s.setAttribute(element, attr);
                }
                document.body.appendChild(s);


                axios.interceptors.response.use(function (r) {
                   
                    // @ts-ignore
                    if (typeof MiniProfiler !== 'undefined' && r && r.headers) {     
                        var profileHeader = r.headers['x-miniprofiler-ids'];                
                        if(!profileHeader){
                            return r;
                        }

                         var miniProfilerHeaders = JSON.parse(profileHeader);
                                         
                        if (!miniProfilerHeaders) {
                            return r;
                        }
                        MiniProfiler.fetchResults(miniProfilerHeaders);                  
                    }
                    return r;
                  }, function (error) {
                    // Do something with response error
                    return Promise.reject(error);
                  });
            })
    }
};
