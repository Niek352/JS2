var list = {};

Vue.component('search',{
    data(){
        return{
            searchLine: ''
        }
    },
    template:`
        <div class="search">
            <form @submit.prevent="$emit('search', searchLine)">
                <button class="search-button" type="submit"> Искать</button>
                <input type="text" class="goods-search" v-model="searchLine"/>
            </form>
        </div> 
         `    
})

Vue.component('cart',{
    props:['cart'],
    template:`
            <div class="cart">
                <div class="goodInCart" v-for="good in cart">
                    <h3>{{ good.product_name }}</h3>
                    <button class="deleteFromCart" @click="$emit('minus', good.product_name)"> delete </button>
                    <p class="countInCart">{{ good.count }}</p>
                    <button class="addOneMoreToCart" @click="$emit('plus', good.product_name)"> add </button>
                    <h3 class="priceInCart">{{ good.price * good.count }}</h3>                  
                </div>
            </div> 
            `    
})

Vue.component('good-list',{
    props:['goods','func'],
    template:`
    <div class="good-list">
        <goods-item v-for="good in goods" :key="good.id_product" :good="good" @add="func">        
        </goods-item>
    </div>
    `
})

Vue.component('goods-item',{
    props:['good'],
    template:`
        <div class="goods-item">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
            <button @click="$emit('add', good.product_name)" class="AddGoodsButton" type="button">Добавить</button>
        </div>
        `
})


const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        isVisibleCart: false,
        cart: {}
    },
    methods: {
        filterGoods(value) {
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
        },

        showCart(){
            this.isVisibleCart = !this.isVisibleCart;
        },

        deleteAllFromCart(){
            for (let key in this.cart) {               
                this.cart[key] = Object.assign({}, this.cart[key], {
                    count: this.cart[key].count + 1,
                });
                delete this.cart[key];
            }
            this.makePOSTRequest('/addToCart', JSON.stringify(this.cart), (answer) => {});
        },

        makePOSTRequest(url, data, callback) {
            let xhr;
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
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send(data);
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

        plusToCart(name) {    
            this.cart[name] = Object.assign({}, this.cart[name], {
                count: this.cart[name].count + 1,
            });
            this.makePOSTRequest('/addToCart', JSON.stringify(this.cart), (answer) => {});
        },


        minusToCart(name){
            this.cart[name] = Object.assign({}, this.cart[name], {
                count: this.cart[name].count - 1,
            });
            if (this.cart[name].count < 1) {
                delete this.cart[name]; 
            }
            this.makePOSTRequest('/addToCart', JSON.stringify(this.cart), (answer) => {});
        },

        enumerationForAllCart(){
            this.filteredGoods.forEach((item) => {
                var product_name = item.product_name;
                list[product_name] = item;
                list[product_name].count = 1;    
            });
        },

        addToCart(name){
            if (this.cart[name] == undefined) {
                Vue.set(this.cart, name, list[name]);
            }   else    {
                this.cart[name] = Object.assign({}, this.cart[name], {
                    count: this.cart[name].count + 1,
                });      
            }
            this.makePOSTRequest('/addToCart', JSON.stringify(this.cart), (answer) => {});
            
        }

    },
        mounted() {
            this.makeGETRequest(`catalogData`, (goods) => {

                this.goods = goods;
                this.filteredGoods = goods;
                this.enumerationForAllCart();
                    
                if (localStorage.getItem('cart') != null) {
                    this.isVisibleCart = true;
                    this.cart = JSON.parse(localStorage.getItem('cart'));   
                }       
            }); 
        },
});
