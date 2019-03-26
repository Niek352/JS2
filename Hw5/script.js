d = document;
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
var cart = {};
var allListOfCart = {};


const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: ''
    },
    methods: {
        filterGoods(value) {
            const regexp = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
            /*this.addSettings();*/
        },

        makeGETRequest(url, callback) {
            const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

            var xhr;

            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) { 
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(JSON.parse(xhr.responseText));
                }
            }

            xhr.open('GET', url, true);
            xhr.send();    
        },
    },
        mounted() {
            this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
                this.goods = goods;
                this.filteredGoods = goods;         
            });
        },
});