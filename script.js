const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
        cart: {}
    },
    methods: {
        filterGoods(value) {
            const regexp = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
        },

        makeGETRequest(url, callback) {
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

        renderCart(){

        },

        minus(id){
            this.cart[id].count--;
            if (this.cart[id].count < 1) {
                delete this.cart[id] 
            }
            console.log(this.cart[id])
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        
        addToCart(id, name, price){
            if (this.cart[id] == undefined) {
                let x = {
                    id_product: id,
                    product_name: name,
                    price: price,
                    count: 1
                }
                this.cart[id] = x;
            }   else    {
                this.cart[id].count = 1 + this.cart[id].count;   
            }                 
            localStorage.setItem('cart', JSON.stringify(this.cart));
            console.log(this.cart)
            
        }

    },
        mounted() {
            this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
                this.goods = goods;
                this.filteredGoods = goods;
                if (localStorage.getItem('cart') != null) {
                    this.cart = JSON.parse(localStorage.getItem('cart'));
                }        
            });
        },
});